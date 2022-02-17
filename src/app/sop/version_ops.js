import * as R from 'ramda';
import * as kv from '../kv';
import * as free from 'fp/free';

import * as database from '../database';
import * as db_ops from '../db_ops';
import * as batch_ops from 'app/sop/batch_ops';
import * as stock_ops from './stock_ops';
import { tapLog } from 'app/utils';

const save = (version) => kv.set('version', version);
const load = () => kv.get(null, 'version');

const itemHasBatch = (itemId) =>
  free.of(itemId)
    .chain(batch_ops.getAll)
    .map(R.complement(R.isEmpty))

const updateItemStockStatusBaseOnBatch = (itemId) =>
  free.of(itemId)
    .chain(itemHasBatch)
    .map(R.cond([
      [R.equals(true), R.always(stock_ops.Status.has_stock)],
      [R.equals(false), R.always(stock_ops.Status.out_of_stock)]
    ]))
    .chain(stock_ops.updateItemStockStatus(itemId))

const migrateOutOfStockStatus = () =>
  free.of(db_ops.makeStartEndRangeAllDocOption('i_'))
    .chain(database.allDocs)
    .map(R.pluck('_id'))
    .map(R.map(updateItemStockStatusBaseOnBatch))
    .chain(free.sequence);

const migrate = (previousVersion) =>
  free.of(previousVersion)
    .chain(
      R.cond([
        [R.equals(1), R.always(migrateOutOfStockStatus())],
        [R.T, R.always(free.of({}))]
      ])
    )

export { save, load, migrate };
