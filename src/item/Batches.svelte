<script>
  import {
    batches,
    performAddBatch,
    performDeleteBatch,
    performBatchInc,
    performBatchDec,
  } from './item_store';

  const toDateString = (batch) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(batch.expiry).toLocaleDateString('en-GB', options);
  };

  let isAddingBatch = false;
  let workingDate;
  let workingCount = 1;
  const addNewBatch = () => {
    // <input type="date"> return a FFFF-MM-DD string, convert it to date
    $performAddBatch(new Date(workingDate), workingCount);
  };

  let confirmingDeleteIndex = -1;
  const decrementBatchCount = (index) => {
    confirmingDeleteIndex = -1;
    const batch = $batches[index];
    if (batch.count <= 1) {
      confirmingDeleteIndex = index;
    } else {
      $performBatchDec[index]();
    }
  };

  const incrementBatchCount = (index) => {
    confirmingDeleteIndex = -1;
    $performBatchInc[index]();
  };
</script>

<div class="flex w-full flex-col items-center">
  {#each $batches as batch, index}
    <div class="grid grid-cols-2 py-2 items-center">
      <span class="mr-4 pt-2 text-right">
        {toDateString(batch)}
      </span>

      {#if index == confirmingDeleteIndex}
        <div class="flex h-10 w-32">
          <button class="btn btn-red" on:click={$performDeleteBatch[index]}
            >Delete?</button
          >
          <button class="btn" on:click={() => (confirmingDeleteIndex = -1)}
            >Wait...</button
          >
        </div>
      {:else}
        <div class="h-10 w-32">
          <div
            class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1"
          >
            <button
              class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-8 rounded-l cursor-pointer"
              on:click={() => decrementBatchCount(index)}
            >
              <span class="m-auto text-2xl">−</span>
            </button>
            <span
              class="outline-none focus:outline-none text-center w-8 bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center justify-center text-gray-700"
            >
              {batch.count}
            </span>
            <button
              class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-8 rounded-r cursor-pointer"
              on:click={() => incrementBatchCount(index)}
            >
              <span class="m-auto text-2xl">+</span>
            </button>
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<br />
<p class="text-green-600">Batches</p>
{#if isAddingBatch}
  <input type="date" bind:value={workingDate} />
  <span>{workingCount}</span>
  <button class="btn btn-blue" on:click={() => workingCount++}>+</button>
  <br />
  <button class="btn btn-blue" on:click={addNewBatch}>Done Batch</button>
{:else}
  <button on:click={() => (isAddingBatch = true)}>New Batch</button>
{/if}
