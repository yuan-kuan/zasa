<script>
  import { slide } from 'svelte/transition';
  import { BatchStores } from 'app/stores';

  import BatchCreation from './BatchCreation.svelte';
  import Batch from './Batch.svelte';

  const {
    batches,
    performAddBatch,
    performBatchInc,
    performBatchDec,
    performBatchUpdate,
    performDeleteBatch,
  } = BatchStores;

  let lastAddedDate;

  const addNewBatch = (dateString) => {
    lastAddedDate = new Date(dateString.detail);
    $performAddBatch(lastAddedDate, 1);
  };

  const newlyAdded = (batch) => batch.expiry == lastAddedDate?.valueOf();
</script>

<div class="flex flex-col pl-4 items-center text-primary ">
  {#each $batches as batch, index}
    <div
      class:normal-order={!newlyAdded(batch)}
      class:focus-order={newlyAdded(batch)}
      transition:slide|local
    >
      <Batch
        {batch}
        decrementBatchCount={() => $performBatchDec[index]()}
        incrementBatchCount={() => $performBatchInc[index]()}
        updateBatchCount={(v) => $performBatchUpdate[index](v)}
        deleteBatch={() => $performDeleteBatch[index]()}
      />
    </div>
  {/each}

  <div class="new-batch-order">
    <BatchCreation on:dateSelected={addNewBatch} />
  </div>
</div>

<style>
  .normal-order {
    order: 1;
  }

  .focus-order {
    order: 2;
  }

  .new-batch-order {
    order: 3;
  }
</style>
