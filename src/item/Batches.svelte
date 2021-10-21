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

  const toDateString = (batch) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(batch.expiry).toLocaleDateString('en-GB', options);
  };

  let workingDate;
  let lastAddedDate;

  const addNewBatch = () => {
    // <input type="date"> return a FFFF-MM-DD string, convert it to date
    lastAddedDate = new Date(workingDate);
    $performAddBatch(lastAddedDate, 1);

    workingDate = undefined;
  };

  const newlyAdded = (batch) => batch.expiry == lastAddedDate?.valueOf();

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

<!-- <div class="pl-4 leading-3 text-lg text-primary ">Batch</div> -->

<div class="flex flex-col pl-4 items-center text-primary ">
  {#each $batches as batch, index}
    <div
      class="grid grid-cols-2 py-2 items-center"
      class:normal-order={!newlyAdded(batch)}
      class:focus-order={newlyAdded(batch)}
      transition:slide|local
    >
      <span class="mr-4 pt-2 text-right">
        {toDateString(batch)}
      </span>

      {#if index == confirmingDeleteIndex}
        <div class="flex h-10 w-32">
          <button
            class="btn btn-secondary"
            on:click={$performDeleteBatch[index]}>delete?</button
          >
          <button class="btn" on:click={() => (confirmingDeleteIndex = -1)}
            >wait...</button
          >
        </div>
      {:else}
        <div class="h-10 w-32">
          <div
            class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1"
          >
            <button
              class=" bg-transparent text-secondary font-semibold h-full w-8 rounded-l cursor-pointer"
              on:click={() => decrementBatchCount(index)}
            >
              <span class="m-auto text-2xl">−</span>
            </button>
            <span
              class="outline-none focus:outline-none text-center w-8 bg-transparent font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center justify-center"
            >
              {batch.count}
            </span>
            <button
              class="bg-transparent text-secondary font-semibold h-full w-8 rounded-r cursor-pointer"
              on:click={() => incrementBatchCount(index)}
            >
              <span class="m-auto text-2xl">+</span>
            </button>
          </div>
        </div>
      {/if}
    </div>
  {/each}

  <div class="grid grid-cols-2 py-2 items-center new-batch-order">
    <div class="pt-2 ">
      <input
        type="date"
        class="btn bg-primary-accent text-right text-primary "
        placeholder="yyyy-mm-dd"
        bind:value={workingDate}
        on:change={addNewBatch}
      />
    </div>

    <div class="h-10 w-32">
      <div
        class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1"
      >
        <button
          class=" bg-transparent text-gray-200 font-semibold h-full w-8 rounded-l cursor-pointer"
          disabled
        >
          <span class="m-auto text-2xl">−</span>
        </button>
        <span
          class="outline-none focus:outline-none text-center w-8 bg-transparent text-gray-200 font-semibold text-md  md:text-basecursor-default flex items-center justify-center"
        >
          0
        </span>
        <button
          class="bg-transparent text-gray-200 font-semibold h-full w-8 rounded-r cursor-pointer"
          disabled
        >
          <span class="m-auto text-2xl">+</span>
        </button>
      </div>
    </div>
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
