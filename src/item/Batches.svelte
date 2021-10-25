<script context="module">
  import { createRef } from '../ref';

  export const batches = createRef([]);
  export const performAddBatch = createRef();
  export const performBatchInc = createRef([]);
  export const performBatchDec = createRef([]);
  export const performDeleteBatch = createRef([]);
</script>

<script>
  import { slide } from 'svelte/transition';

  import BatchCreation from './BatchCreation.svelte';
  import Batch from './Batch.svelte';

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
