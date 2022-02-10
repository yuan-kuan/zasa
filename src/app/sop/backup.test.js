import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';
import * as backup from 'app/sop/backup';
import { config } from 'dotenv';

test.skip('Local backup setup', async () => {
  config({ path: '.env.local' });

  const interpret = createTestHelper(true, false, [backup.setupBackupInterpretor()]).setup();
  const fm = backup.sync('a');

  const result = await interpret(fm);
  console.log('result :>> ', result);

  throw Error('incomplete test');
});

describe('Sync code', () => {
  const testHelper = createTestHelper(false, true);

  let interpret;
  beforeEach(() => {
    interpret = testHelper.setup();
  });

  test('Store sync code and last-synced time stamp', async () => {
    const testCode = '007'
    const now = new Date();
    const result = await interpret(
      free.sequence([
        backup.saveCode(testCode, now),
        backup.getSavedCode(),
        backup.getSavedTimestamp()
      ])
    );

    expect(result[1]).toBe(testCode);
    expect(result[2]).toEqual(now);
  });

  test('Left if no sync code is stored', async () => {
    const result = await interpret(
      free.bimap(
        () => 'No saved code',
        R.identity,
        backup.getSavedCode()
      )
    );

    expect(result).toBe('No saved code');
  });

  test('Store new sync code, replace the old one', async () => {
    const testCode1 = '007'
    const testCode2 = 'James'
    const now = new Date();
    let later = new Date();
    later.setDate(later.getDate() + 1);

    const result = await interpret(
      free.sequence([
        backup.saveCode(testCode1, now),
        backup.saveCode(testCode2, later),
        backup.getSavedCode(),
        backup.getSavedTimestamp()
      ])
    );

    expect(result[2]).toBe(testCode2);
    expect(result[3]).toEqual(later);
  });
});

