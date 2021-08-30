<script>
  import { categoryName, goToCreateItem } from './grid_store';
</script>

<div><p>Category: {$categoryName}</p></div>
<button on:click={$goToCreateItem}>Add Item</button>
