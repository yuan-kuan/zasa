import * as R from 'ramda';
import * as free from 'fp/free';

import { createTestHelper } from "test/utils";
import * as version_ops from './version_ops';

const testHelper = createTestHelper(false, true);
let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
});

const oldVersion = 2;
const currentVersion = 3;

test('A new user if no saved version.', async () => {
  const result = await interpret(version_ops.checkNewUser(currentVersion));
  expect(result).toBeTruthy();
});

test('Is a newer version if no saved version', async () => {
  const result = await interpret(version_ops.checkNewerVersion(currentVersion));
  expect(result).toBeTruthy();
});

test('Not a same version if no saved version', async () => {
  const result = await interpret(version_ops.checkSameVersion(currentVersion));
  expect(result).toBeFalsy();
});

test('Save a version become a same version', async () => {
  const result = await interpret(
    free.sequence([
      version_ops.save(currentVersion),
      version_ops.checkSameVersion(currentVersion)
    ])
      .map(R.last)
  );

  expect(result).toBeTruthy();
});

describe('Start with saved version', () => {
  beforeEach(async () => {
    await interpret(version_ops.save(oldVersion));
  });

  test('Not a new user', async () => {
    const result = await interpret(version_ops.checkNewUser(currentVersion));
    expect(result).toBeFalsy();
  });

  test('Not a same version', async () => {
    const result = await interpret(version_ops.checkSameVersion(currentVersion));
    expect(result).toBeFalsy();
  });

  test('Is a newer version', async () => {
    const result = await interpret(version_ops.checkNewerVersion(currentVersion));
    expect(result).toBeTruthy();
  });

  test('Save a new version become a same version', async () => {
    const result = await interpret(
      free.sequence([
        version_ops.save(currentVersion),
        version_ops.checkSameVersion(currentVersion)
      ])
        .map(R.last)
    );

    expect(result).toBeTruthy();
  });
});
