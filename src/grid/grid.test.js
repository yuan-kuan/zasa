import test from 'ava';

import { queryResultToTagSelection } from './grid_utils';

test('Convert tag selection query result to list of pair', async (t) => {
  const result = [
    { value: 1, key: 'fruit' },
    { value: 3, key: 'car' },
    { value: 2, key: 'people' },
  ];
  const selections = queryResultToTagSelection(result);

  t.deepEqual(selections, ['fruit', 'car', 'people']);
});
