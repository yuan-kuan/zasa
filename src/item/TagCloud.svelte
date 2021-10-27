<script>
  import { TagStores } from '../stores';
  const { allTags, allTagsSelected, performToggleTagFilter } = TagStores;

  import Tag from '../grid/Tag.svelte';
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
