<script>
  import { slide } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  import Tag from 'view/Tag.svelte';

  import { FilterStores } from 'app/stores';
  const {
    tags,
    allTags,
    allTagsSelected,
    performToggleTagFilter,
    expiringItemCount,
    expiringFilterSelected,
    performToggleExpiringFilter,
    performClearFilter,
  } = FilterStores;

  $: hasSelectedTag = $tags.length > 0;
</script>

<div
  class="fixed bottom-20 right-4 ml-2 p-2 rounded-lg bg-white shadow-lg"
  transition:slide={{ delay: 0, duration: 500, easing: circInOut }}
>
  <div class="p-2 flex justify-between border-b">
    <span class="text-primary font-semibold"> Filter with Tags </span>
    {#if hasSelectedTag}
      <button
        class="border rounded-full text-sm text-white select-none bg-secondary px-2 py-1 ml-4 flex"
        on:click={$performClearFilter}>Clear</button
      >
    {/if}
  </div>
  <div class="mt-2 flex flex-row-reverse flex-wrap-reverse items-start">
    {#each $allTags as selection, index}
      <Tag
        name={selection}
        selected={$allTagsSelected[index]}
        on:tagclick={$performToggleTagFilter[index]}
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
