import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';

import * as item_ops from './item_ops';
import * as filter_ops from './filter_ops';
import * as tag_ops from "./tag_ops";


describe('Need memory KV', () => {
  const testHelper = createTestHelper(false, true);
  let interpret;
  beforeEach(() => {
    interpret = testHelper.setup();
  });

  test('Getting no saved filter? no problem', async () => {
    const result = await interpret(filter_ops.getSavedTagFilter());

    expect(result).toHaveLength(0);
  });

  test('Adding filter tags', async () => {
    const result = await interpret(
      free.sequence([
        filter_ops.addFilterTag('A'),
        filter_ops.addFilterTag('B'),
        filter_ops.addFilterTag('C'),
        filter_ops.getSavedTagFilter()
      ])
        .map(R.last)
    );

    expect(result).toHaveLength(3);
    expect(result).toEqual(['A', 'B', 'C']);
  });

  test('Removing filter tags', async () => {
    const result = await interpret(
      free.sequence([
        filter_ops.addFilterTag('A'),
        filter_ops.addFilterTag('B'),
        filter_ops.addFilterTag('C'),
        filter_ops.removeFilterTag('B'),
        filter_ops.getSavedTagFilter()
      ])
        .map(R.last)
    );

    expect(result).toHaveLength(2);
    expect(result).toEqual(['A', 'C']);
  });
});

describe('Need Filter Design Doc', () => {

  const testHelper = createTestHelper(true, true);
  let interpret;
  beforeEach(() => {
    interpret = testHelper.setup();
    return interpret(filter_ops.setupTagFilter());
  });

  test('Get all tags ever added to any existing items', async () => {
    const result = await interpret(
      free
        .sequence([
          item_ops.create('test item 1', null),
          item_ops.create('test item 2', null),
        ])
        .chain(([itemId1, itemId2]) =>
          free.sequence([
            tag_ops.add(itemId1, 'A'),
            tag_ops.add(itemId1, 'B'),
            tag_ops.add(itemId2, 'B'), // Overlap is fine
            tag_ops.add(itemId2, 'C'),
            filter_ops.getAllTags()
          ])
        )
        .map(R.last)
    );

    expect(result).toHaveLength(3);
    expect(result).toEqual(['A', 'B', 'C']);
  });

  test('Tag will be gone as soon as no item had it', async () => {
    const result = await interpret(
      free
        .sequence([
          item_ops.create('test item 1', null),
          item_ops.create('test item 2', null),
        ])
        .chain(([itemId1, itemId2]) =>
          free.sequence([
            tag_ops.add(itemId1, 'A'),
            tag_ops.add(itemId1, 'B'),
            tag_ops.add(itemId2, 'B'), // Overlap is fine
            tag_ops.add(itemId2, 'C'),
            tag_ops.remove(itemId1, 'B'),
            tag_ops.remove(itemId2, 'B'),
            filter_ops.getAllTags()
          ])
        )
        .map(R.last)
    );

    expect(result).toHaveLength(2);
    expect(result).toEqual(['A', 'C']);
  });

  test('Filter items with only the selected tag', async () => {
    const result = await interpret(
      free
        .sequence([
          item_ops.create('apple', null),
          item_ops.create('ferrari', null),
          item_ops.create('sky', null),
          item_ops.create('grass', null),
        ])
        .chain(([itemIdApple, itemIdFerrari, itemIdSky, itemIdGrass]) =>
          free.sequence([
            tag_ops.add(itemIdApple, 'fruit'),
            tag_ops.add(itemIdApple, 'red'),
            tag_ops.add(itemIdFerrari, 'red'), // Overlap is fine
            tag_ops.add(itemIdFerrari, 'car'),
            tag_ops.add(itemIdSky, 'blue'),
            tag_ops.add(itemIdSky, 'natural'),
            tag_ops.add(itemIdGrass, 'natural'),
            tag_ops.add(itemIdGrass, 'green'),
            filter_ops.getItemsWithTags(['red'])
          ])
        )
        .map(R.last)
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('name', 'apple');
    expect(result[1]).toHaveProperty('name', 'ferrari');
  });

  test('Filter items with all selected tags', async () => {
    const result = await interpret(
      free
        .sequence([
          item_ops.create('apple', null),
          item_ops.create('ferrari', null),
          item_ops.create('sky', null),
          item_ops.create('grass', null),
        ])
        .chain(([itemIdApple, itemIdFerrari, itemIdSky, itemIdGrass]) =>
          free.sequence([
            tag_ops.add(itemIdApple, 'fruit'),
            tag_ops.add(itemIdApple, 'red'),
            tag_ops.add(itemIdFerrari, 'red'),
            tag_ops.add(itemIdFerrari, 'car'),
            tag_ops.add(itemIdSky, 'blue'),
            tag_ops.add(itemIdSky, 'natural'),
            tag_ops.add(itemIdGrass, 'natural'),
            tag_ops.add(itemIdGrass, 'green'),
            filter_ops.getItemsWithTags(['fruit', 'natural'])
          ])
        )
        .map(R.last)
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty('name', 'apple');
    expect(result[1]).toHaveProperty('name', 'grass');
    expect(result[2]).toHaveProperty('name', 'sky');
  });
})