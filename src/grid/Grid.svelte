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
<div>
  <ul>
    {#each $items as item, index}
      <li>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={$goToItem[index]}>
          {item.name}
          <div class="p-1 w-1/3 lg:w-1/4 xl:w-1/6 relative">
            {#if item.blob}
              <img
                class="object-cover h-32 w-full border"
                src={URL.createObjectURL(item.blob)}
                alt=""
              />
            {/if}
          </div>
        </a>
      </li>
    {/each}
  </ul>
</div>
<button on:click={$goToCreateItem}>Add Item</button>
