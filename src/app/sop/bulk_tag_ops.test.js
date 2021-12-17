import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';

import * as item_ops from './item_ops';
import * as filter_ops from './filter_ops';
import * as tag_ops from "./tag_ops";
import * as bulk_tag_ops from './bulk_tag_ops';

const testHelper = createTestHelper(true, true);
let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
});

describe('Single Item', () => {
  let singleItemId;

  beforeEach(() => {
    return interpret(free.sequence([
      filter_ops.setup(),
      item_ops.create('apple', null).chain(
        (itemId) => {
          singleItemId = itemId;
          return free.sequence([
            tag_ops.add(itemId, 'tag A'),
            tag_ops.add(itemId, 'tag B'),
          ]);
        }
      )
    ]));
  });

  describe('Rename a tag. tag A to tag C', () => {
    beforeEach(() => {
      return interpret(bulk_tag_ops.renameTag('tag A', 'tag C'));
    });

    test('item tags updated', async () => {
      const result = await interpret(tag_ops.getItemTags(singleItemId));

      expect(result).toEqual(['tag B', 'tag C']);
    });

    test('all tags updated', async () => {
      const result = await interpret(filter_ops.getAllTags());

      expect(result).toEqual(['tag B', 'tag C']);
    });
  });

  describe('with tag filtered', () => {
    beforeEach(() => {
      return interpret(
        free.sequence([
          filter_ops.addFilterTag('tag A'),
          filter_ops.addFilterTag('tag B'),
        ])
      );
    });

    describe('Rename a tag. tag A to tag C', () => {
      beforeEach(() => {
        return interpret(bulk_tag_ops.renameTag('tag A', 'tag C'));
      });

      test('item tags updated', async () => {
        const result = await interpret(tag_ops.getItemTags(singleItemId));

        expect(result).toEqual(['tag B', 'tag C']);
      });

      test('all tags updated', async () => {
        const result = await interpret(filter_ops.getAllTags());

        expect(result).toEqual(['tag B', 'tag C']);
      });

      test('saved tags updated', async () => {
        const result = await interpret(filter_ops.getSavedTagFilter());

        expect(result).toEqual(['tag B', 'tag C']);
      });
    });

    describe('Rename both tag. A to C, B to D', () => {
      beforeEach(() => {
        return interpret(
          free.sequence([
            bulk_tag_ops.renameTag('tag A', 'tag C'),
            bulk_tag_ops.renameTag('tag B', 'tag D'),
          ]));
      });

      test('item tags updated', async () => {
        const result = await interpret(tag_ops.getItemTags(singleItemId));

        expect(result).toEqual(['tag C', 'tag D']);
      });

      test('all tags updated', async () => {
        const result = await interpret(filter_ops.getAllTags());

        expect(result).toEqual(['tag C', 'tag D']);
      });

      test('saved tags updated', async () => {
        const result = await interpret(filter_ops.getSavedTagFilter());

        expect(result).toEqual(['tag C', 'tag D']);
      });
    });


    describe('Remove tag A', () => {
      beforeEach(() => {
        return interpret(bulk_tag_ops.removeTag('tag A'));
      });

      test('item tags updated', async () => {
        const result = await interpret(tag_ops.getItemTags(singleItemId));

        expect(result).toEqual(['tag B']);
      });

      test('all tags updated', async () => {
        const result = await interpret(filter_ops.getAllTags());

        expect(result).toEqual(['tag B']);
      });

      test('saved tags updated', async () => {
        const result = await interpret(filter_ops.getSavedTagFilter());

        expect(result).toEqual(['tag B']);
      });
    });
  });
});

describe('Multiple items', () => {
  let AItemId;
  let BItemId;
  let CItemId;

  beforeEach(() => {
    return interpret(free.sequence([
      filter_ops.setup(),
      free.sequence([
        item_ops.create('apple', null),
        item_ops.create('bmw', null),
        item_ops.create('carrot', null),
      ]).chain(([id1, id2, id3]) => {
        AItemId = id1;
        BItemId = id2;
        CItemId = id3;

        return free.sequence([
          tag_ops.add(AItemId, 'fruit'),
          tag_ops.add(AItemId, 'red'),
          tag_ops.add(BItemId, 'red'),
          tag_ops.add(BItemId, 'car'),
          tag_ops.add(CItemId, 'fruit'),
        ]);
      }),
      filter_ops.addFilterTag('red'),
      filter_ops.addFilterTag('car'),
    ]));
  });

  describe('Rename a tag. red to pink', () => {
    beforeEach(() => {
      return interpret(bulk_tag_ops.renameTag('red', 'pink'));
    });

    test('item tags updated', async () => {
      const resultA = await interpret(tag_ops.getItemTags(AItemId));
      const resultB = await interpret(tag_ops.getItemTags(BItemId));
      const resultC = await interpret(tag_ops.getItemTags(CItemId));

      expect(resultA).toEqual(['fruit', 'pink']);
      expect(resultB).toEqual(['car', 'pink']);
      expect(resultC).toEqual(['fruit']);
    });

    test('all tags updated', async () => {
      const result = await interpret(filter_ops.getAllTags());

      expect(result).toEqual(['car', 'fruit', 'pink']);
    });

    test('saved tags updated', async () => {
      const result = await interpret(filter_ops.getSavedTagFilter());

      expect(result).toEqual(['car', 'pink']);
    });
  });

  describe('Rename two tag. red to pink, fruit to vege', () => {
    beforeEach(() => {
      return interpret(
        free.sequence([
          bulk_tag_ops.renameTag('red', 'pink'),
          bulk_tag_ops.renameTag('fruit', 'vege'),
        ]));
    });

    test('item tags updated', async () => {
      const resultA = await interpret(tag_ops.getItemTags(AItemId));
      const resultB = await interpret(tag_ops.getItemTags(BItemId));
      const resultC = await interpret(tag_ops.getItemTags(CItemId));

      expect(resultA).toEqual(['pink', 'vege']);
      expect(resultB).toEqual(['car', 'pink']);
      expect(resultC).toEqual(['vege']);
    });

    test('all tags updated', async () => {
      const result = await interpret(filter_ops.getAllTags());

      expect(result).toEqual(['car', 'pink', 'vege']);
    });

    test('saved tags updated', async () => {
      const result = await interpret(filter_ops.getSavedTagFilter());

      expect(result).toEqual(['car', 'pink']);
    });
  });

  describe('Remove tag red', () => {
    beforeEach(() => {
      return interpret(bulk_tag_ops.removeTag('red'));
    });

    test('item tags updated', async () => {
      const resultA = await interpret(tag_ops.getItemTags(AItemId));
      const resultB = await interpret(tag_ops.getItemTags(BItemId));
      const resultC = await interpret(tag_ops.getItemTags(CItemId));

      expect(resultA).toEqual(['fruit']);
      expect(resultB).toEqual(['car']);
      expect(resultC).toEqual(['fruit']);
    });

    test('all tags updated', async () => {
      const result = await interpret(filter_ops.getAllTags());

      expect(result).toEqual(['car', 'fruit']);
    });

    test('saved tags updated', async () => {
      const result = await interpret(filter_ops.getSavedTagFilter());

      expect(result).toEqual(['car']);
    });
  });
});
