<script context="module">
  import { createRef } from '../ref';

  export const items = createRef([]);
  export const goToItem = createRef([]);
  export const goToCreateItem = createRef();
  export const goToSetting = createRef();
</script>

<script>
  import Filter from './Filter.svelte';
</script>

<!-- Grid -->
<div class="p-4 grid grid-cols-3 md:grid-cols-6 gap-2">
  {#each $items as item, index}
    <div class="relative" on:click={$goToItem[index]}>
      <!-- {item.name} -->
      <span
        class="absolute bottom-0 left-0 px-2 bg-secondary-accent bg-opacity-50 text-sm text-primary filter w-full truncate"
        >{item.name}</span
      >
      {#if item.blob}
        <img
          class="object-cover w-full border"
          src={URL.createObjectURL(item.blob)}
          alt=""
        />
      {/if}
    </div>
  {/each}
</div>

<!-- Bottom Bar -->
<div
  class="fixed bottom-4 left-1/2 transform -translate-x-1/2 inline-flex left-0 mx-auto justify-between bg-primary w-11/12 rounded-3xl"
>
  <a
    class="inline-flex flex-col items-center text-xs font-medium text-white py-3 px-4 flex-grow"
    href="#"
    on:click|preventDefault={$goToSetting}
  >
    <svg
      class="w-7 h-7"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clip-rule="evenodd"
      />
    </svg>
  </a>
  <span class="sr-only">Settings</span>
  <button
    class="relative inline-flex flex-col items-center text-xs font-medium text-white py-3 px-6 flex-grow"
    on:click={$goToCreateItem}
  >
    <div
      class="absolute bottom-5 p-3 rounded-full border-4 border-white  bg-primary"
    >
      <svg
        class="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      <!-- 
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg> -->
    </div>
    <span class="sr-only">Add</span>
  </button>

  <Filter />
</div>
