<script>
  import { categoryName, items, goToItem, goToCreateItem } from './grid_store';
</script>

<div><p>Category: {$categoryName}</p></div>
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
