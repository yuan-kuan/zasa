<script>
  import { createEventDispatcher } from 'svelte';

  export let count = 0;
  export let disabled = false;

  let workingCount;
  let isEditing = false;
  let clickedToActivate = false;

  const startEdit = () => {
    workingCount = count;
    isEditing = true;
    clickedToActivate = true;
  };

  const initInput = (inputElement) => {
    if (clickedToActivate) {
      inputElement?.focus();
      inputElement?.select();
    }
  };

  const onEditCount = () => {
    if (Number.isInteger(workingCount) && workingCount > 0) {
      if (count != workingCount) {
        count = workingCount;
        updateDirect(workingCount);
      }
    }
    isEditing = false;
  };

  const countKeyDown = (e) => {
    if (e.key == 'Enter') {
      onEditCount();
      e.preventDefault();
    }
  };

  const dispatch = createEventDispatcher();

  function decrement() {
    dispatch('decrement');
  }
  function increment() {
    dispatch('increment');
  }
  function updateDirect(value) {
    dispatch('update', value);
  }
</script>

<div class="h-10 w-32">
  <div
    class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1"
  >
    {#if isEditing}
      <span class="w-8" />
      <input
        class="w-12 px-2 rounded border border-gray-200 text-right text-primary"
        type="number"
        bind:value={workingCount}
        use:initInput
        on:keydown={countKeyDown}
      />
      <button class="btn" on:click={onEditCount}> Update </button>
    {:else}
      <button
        class=" bg-transparent text-secondary font-semibold h-full w-8 rounded-l cursor-pointer"
        {disabled}
        on:click={decrement}
      >
        <span class="m-auto text-2xl">−</span>
      </button>
      <button
        class="outline-none focus:outline-none text-center w-8 bg-transparent font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center justify-center"
        on:click={startEdit}
      >
        {count}
      </button>
      <button
        class="bg-transparent text-secondary font-semibold h-full w-8 rounded-r cursor-pointer"
        {disabled}
        on:click={increment}
      >
        <span class="m-auto text-2xl">+</span>
      </button>
    {/if}
  </div>
</div>
