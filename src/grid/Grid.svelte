<script>
  import {
    items,
    goToItem,
    goToCreateItem,
    filteringTags,
    performRemoveTagFromFilter,
    tagSelections,
    performAddTagToFilter,
  } from './grid_store';
</script>

<div>
  <span>Filter:</span>
  {#each $filteringTags as filteringTag, index}
    <button class="btn btn-red" on:click={$performRemoveTagFromFilter[index]}>
      {filteringTag}
    </button>
  {/each}
  <br />
  <span>Tag Available</span>
  {#each $tagSelections as selection, index}
    <button class="btn btn-blue" on:click={$performAddTagToFilter[index]}>
      {selection}
    </button>
  {/each}
</div>

<br />

<div class="px-2 grid grid-cols-3 md:grid-cols-6 gap-2">
  {#each $items as item, index}
    <div class="relative" on:click={$goToItem[index]}>
      <!-- {item.name} -->
      <span class="absolute top-0 left=0 w-full truncate">{item.name}</span>
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
