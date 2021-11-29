<script>
  import { slide } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  import Tag from 'view/Tag.svelte';

  import { FilterStores } from 'app/stores';
  const {
    allTags,
    allTagsSelected,
    performToggleTagFilter,
    expiringItemCount,
    expiringFilterSelected,
    performToggleExpiringFilter,
  } = FilterStores;
</script>

<div
  class="fixed bottom-20 right-4 ml-2 p-2 rounded-lg bg-white shadow-lg"
  transition:slide={{ delay: 0, duration: 500, easing: circInOut }}
>
  <div class="p-2 flex justify-between border-b">
    <span class="text-primary font-semibold"> Filter with Tags </span>
  </div>
  <div class="mt-2 flex flex-row-reverse flex-wrap-reverse items-start">
    {#each $allTags as selection, index}
      <Tag
        name={selection}
        selected={$allTagsSelected[index]}
        on:click={$performToggleTagFilter[index]}
      />
    {/each}
    {#if $expiringItemCount > 0 || $expiringFilterSelected}
      <Tag
        name={`Expiring (${$expiringItemCount})`}
        selected={$expiringFilterSelected}
        on:click={$performToggleExpiringFilter}
      />
    {/if}
  </div>
</div>
