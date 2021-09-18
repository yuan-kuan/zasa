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
<button on:click={$goToCreateItem}>Add Item</button>
