<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { Datepicker } from 'svelte-calendar';

  import BatchCounter from './BatchCounter.svelte';

  const theme = {
    calendar: {
      colors: {
        background: {
          highlight: '#ffd03a',
        },
      },
    },
  };

  let store;
  const dispatch = createEventDispatcher();

  onMount(() => {
    store.subscribe((v) => {
      if (v.hasChosen) {
        dispatch('dateSelected', v.selected);

        v.hasChosen = false;
        store.set(v);
      }
    });
  });
</script>

<div class="grid grid-cols-2 py-2 items-center ">
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
