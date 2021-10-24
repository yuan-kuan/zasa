<script context="module">
  import { createRef } from '../ref';

  export const batches = createRef([]);
  export const performAddBatch = createRef();
  export const performBatchInc = createRef([]);
  export const performBatchDec = createRef([]);
  export const performDeleteBatch = createRef([]);
</script>

<script>
  import { Datepicker } from 'svelte-calendar';
  import { slide } from 'svelte/transition';

  import BatchCounter from './BatchCounter.svelte';
  import { onMount } from 'svelte';

  const theme = {
    calendar: {
      colors: {
        background: {
          highlight: '#ffd03a',
        },
      },
    },
  };

  const toDateString = (batch) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(batch.expiry).toLocaleDateString('en-GB', options);
  };

  let store;
  onMount(() => {
    store.subscribe((v) => {
      if (v.hasChosen) {
        addNewBatch(v.selected);
        v.hasChosen = false;
        store.set(v);
      }
    });
  });

  let lastAddedDate;

  const addNewBatch = (date) => {
    // <input type="date"> return a FFFF-MM-DD string, convert it to date
    lastAddedDate = new Date(date);
    $performAddBatch(lastAddedDate, 1);
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
        <BatchCounter
          count={batch.count}
          on:decrement={() => decrementBatchCount(index)}
          on:increment={() => incrementBatchCount(index)}
        />
      {/if}
    </div>
  {/each}

  <div class="grid grid-cols-2 py-2 items-center new-batch-order">
    <div class="pt-2 ">
      <Datepicker bind:store {theme} let:key let:send let:receive>
        <button
          class="btn bg-primary-accent text-right text-primary "
          in:receive|local={{ key }}
          out:send|local={{ key }}
        >
          {#if $store?.hasChosen}
            Date Chosen. THis is a bug.
          {:else}
            Pick a Date
          {/if}
        </button>
      </Datepicker>
    </div>

    <BatchCounter disabled={true} />
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
