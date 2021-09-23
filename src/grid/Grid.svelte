<script>
  import { items, goToItem, goToCreateItem, goToSetting } from './grid_store';
  import Filter from './Filter.svelte';
</script>

<Filter />

<div class="px-2 grid grid-cols-3 md:grid-cols-6 gap-2">
  {#each $items as item, index}
    <div class="relative" on:click={$goToItem[index]}>
      <!-- {item.name} -->
      <span
        class="absolute top-0 left-1 bg-blue-100 bg-opacity-50 filter drop-shadow-md w-full truncate"
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

<button
  class="fixed bottom-4 right-4 p-0 w-20 h-20 bg-blue-600 rounded-full hover:bg-blue-700 active:shadow-lg mouse filter drop-shadow-lg transition ease-in duration-200 focus:outline-none"
  on:click={$goToCreateItem}
>
  <svg
    viewBox="0 0 20 20"
    enable-background="new 0 0 20 20"
    class="w-10 h-10 inline-block"
  >
    <path
      fill="#FFFFFF"
      d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z"
    />
  </svg>
</button>

<button
  class="fixed bottom-4 right-24 p-0 w-10 h-10 bg-gray-600 rounded-full hover:bg-gray-700 active:shadow-lg mouse filter drop-shadow-lg transition ease-in duration-200 focus:outline-none"
  on:click={$goToSetting}
>
  <svg
    viewBox="0 0 20 20"
    enable-background="new 0 0 20 20"
    class="w-5 h-5 inline-block"
  >
    <path
      fill="#FFFFFF"
      d="M15.808,14.066H6.516v-1.162H5.354v1.162H4.193c-0.321,0-0.581,0.26-0.581,0.58s0.26,0.58,0.581,0.58h1.162
  v1.162h1.162v-1.162h9.292c0.32,0,0.58-0.26,0.58-0.58S16.128,14.066,15.808,14.066z M15.808,9.419h-1.742V8.258h-1.162v1.161
  h-8.71c-0.321,0-0.581,0.26-0.581,0.581c0,0.321,0.26,0.581,0.581,0.581h8.71v1.161h1.162v-1.161h1.742
  c0.32,0,0.58-0.26,0.58-0.581C16.388,9.679,16.128,9.419,15.808,9.419z M17.55,0.708H2.451c-0.962,0-1.742,0.78-1.742,1.742v15.1
  c0,0.961,0.78,1.74,1.742,1.74H17.55c0.962,0,1.742-0.779,1.742-1.74v-15.1C19.292,1.488,18.512,0.708,17.55,0.708z M18.13,17.551
  c0,0.32-0.26,0.58-0.58,0.58H2.451c-0.321,0-0.581-0.26-0.581-0.58v-15.1c0-0.321,0.26-0.581,0.581-0.581H17.55
  c0.32,0,0.58,0.26,0.58,0.581V17.551z M15.808,4.774H9.419V3.612H8.258v1.162H4.193c-0.321,0-0.581,0.26-0.581,0.581
  s0.26,0.581,0.581,0.581h4.065v1.162h1.161V5.935h6.388c0.32,0,0.58-0.26,0.58-0.581S16.128,4.774,15.808,4.774z"
    />
  </svg>
</button>
