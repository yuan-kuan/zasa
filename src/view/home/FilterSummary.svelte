<script>
  import Tag from 'view/Tag.svelte';

  import { FilterStores } from 'app/stores';
  const { tags, expiringItemCount, expiringFilterSelected } = FilterStores;
</script>

<div class="fixed bottom-12 right-2 ">
  <div class="flex flex-col-reverse items-start">
    {#each $tags as tag}
      <Tag name={tag} dense on:tagclick />
    {/each}
    {#if $expiringFilterSelected}
      <Tag name={`Expiring (${$expiringItemCount})`} dense on:tagclick />
    {/if}
  </div>
</div>
