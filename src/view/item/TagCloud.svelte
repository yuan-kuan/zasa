<script>
  import { TagStores } from 'app/stores';
  const { allTags, allTagsSelected, performToggleTagFilter } = TagStores;

  import Tag from 'view/Tag.svelte';
</script>

<!-- Tags cloud -->
<div class="mt-2 flex flex-row flex-wrap justify-center items-start">
  {#each $allTags as selection, index}
    <Tag
      name={selection}
      selected={$allTagsSelected[index]}
      on:click={$performToggleTagFilter[index]}
    />
  {/each}
</div>
