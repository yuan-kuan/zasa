<script>
  import BatchCounter from './BatchCounter.svelte';

  export let batch;
  export let decrementBatchCount;
  export let incrementBatchCount;
  export let updateBatchCount;
  export let deleteBatch;

  const toDateString = (batch) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    // @ts-ignore wrong type check?
    return new Date(batch.expiry).toLocaleDateString('en-GB', options);
  };

  let confirmingDelete = false;
  const decrement = () => {
    if (batch.count == 1) {
      confirmingDelete = true;
    } else {
      decrementBatchCount();
    }
  };

  const increment = () => {
    incrementBatchCount();
  };

  const updateDirect = (value) => {
    console.log('value :>> ', value);
    updateBatchCount(value.detail);
  };

  const deleteB = () => {
    confirmingDelete = false;
    deleteBatch();
  };
</script>

<div class="grid grid-cols-2 py-2 items-center">
  <span class="mr-4 pt-2 text-right">
    {toDateString(batch)}
  </span>

  {#if confirmingDelete}
    <div class="flex h-10 w-32">
      <button class="btn btn-secondary" on:click={deleteB}>delete?</button>
      <button class="btn" on:click={() => (confirmingDelete = false)}
        >wait...</button
      >
    </div>
  {:else}
    <BatchCounter
      count={batch.count}
      on:decrement={decrement}
      on:increment={increment}
      on:update={updateDirect}
    />
  {/if}
</div>
