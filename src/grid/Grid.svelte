<script>
  import { categoryName, items, goToCreateItem } from './grid_store';
</script>

<div><p>Category: {$categoryName}</p></div>
<div>
  <ul>
    {#each $items as item}
      <li>
        {item[1].name}
        <div class="p-1 w-1/3 lg:w-1/4 xl:w-1/6 relative">
          <img
            class="object-cover h-32 w-full border"
            src={URL.createObjectURL(item[1].blob)}
            alt=""
          />
        </div>
      </li>
    {/each}
  </ul>
</div>
<button on:click={$goToCreateItem}>Add Item</button>
