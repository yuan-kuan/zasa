<script>
  import { createEventDispatcher } from 'svelte';

  export let count = 0;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function decrement() {
    dispatch('decrement');
  }
  function increment() {
    dispatch('increment');
  }
</script>

<div class="h-10 w-32">
  <div
    class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1"
  >
    <button
      class=" bg-transparent text-secondary font-semibold h-full w-8 rounded-l cursor-pointer"
      {disabled}
      on:click={decrement}
    >
      <span class="m-auto text-2xl">−</span>
    </button>
    <span
      class="outline-none focus:outline-none text-center w-8 bg-transparent font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center justify-center"
    >
      {count}
    </span>
    <button
      class="bg-transparent text-secondary font-semibold h-full w-8 rounded-r cursor-pointer"
      {disabled}
      on:click={increment}
    >
      <span class="m-auto text-2xl">+</span>
    </button>
  </div>
</div>
