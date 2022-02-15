import * as R from 'ramda';

import * as free from 'fp/free';
import { get, put } from 'app/database';
import * as batch_ops from 'app/sop/batch_ops';

const Status = {
  brand_new: 0,
  has_stock: 1,
  out_of_stock: 2,
}

const L = {
  stockStatus: R.lensProp('stockStatus')
}

const getItemStockStatus = (itemId) =>
  free.of(itemId)
    .chain(get)
    .map(R.view(L.stockStatus))
    .map(R.defaultTo(Status.brand_new))

const updateItemStockStatus = R.curry((itemId, newStatus) =>
  free.of(itemId)
    .chain(get)
    .map(R.set(L.stockStatus, newStatus))
    .chain(put)
);

const determineStatus = R.curry((previousStatus, hasBatch) =>
  R.cond([
    [
      R.always(R.and(R.equals(Status.brand_new, previousStatus), R.equals(true, hasBatch))),
      R.always(Status.has_stock)
    ],
    [
      R.always(R.and(R.equals(Status.has_stock, previousStatus), R.equals(false, hasBatch))),
      R.always(Status.out_of_stock)
    ],
    [
      R.always(R.and(R.equals(Status.out_of_stock, previousStatus), R.equals(true, hasBatch))),
      R.always(Status.has_stock)
    ],
    [
      R.T, R.always(previousStatus)
    ]
  ])()
);

const refreshItemStockStatus = (itemId) =>
  free.of(determineStatus)
    .ap(getItemStockStatus(itemId))
    .ap(batch_ops.getAll(itemId).map(R.complement(R.isEmpty)))
    .chain(updateItemStockStatus(itemId));

export { Status, getItemStockStatus, refreshItemStockStatus };