<script>
  import { GridStores } from 'app/stores';
  const { items, goToItem } = GridStores;

  const dayInMs = 24 * 60 * 60 * 1000;
  const expireInDays = (expiry) => {
    const today = new Date();
    return Math.floor((expiry - today.valueOf()) / dayInMs);
  };
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
      {#if item.expiry}
        <span
          class="absolute top-0 right-0 px-2 bg-red-300 bg-opacity-50 text-sm text-primary filter w-full truncate"
          >{expireInDays(item.expiry)} days left</span
        >
      {/if}
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
