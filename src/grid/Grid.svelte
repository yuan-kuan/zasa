<script>
  import { categoryName, items, goToCreateItem } from './grid_store';
</script>

<div><p>Category: {$categoryName}</p></div>
<div>
  <ul>
    {#each $items as item}
      <li>
        {item[1].name}
      </li>
    {/each}
  </ul>
</div>
<button on:click={$goToCreateItem}>Add Item</button>
