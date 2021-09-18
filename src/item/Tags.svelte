<script>
  import {
    tags,
    tagSelections,
    performAddNewTag,
    performAddTag,
    performRemoveTag,
  } from './item_store';

  let isAddingTag = false;
  let workingTag;

  const addNewTag = () => {
    $performAddNewTag(workingTag);
    isAddingTag = false;
  };
</script>

<ul>
  {#each $tagSelections as selection, index}
    <li>
      <button class="btn btn-blue" on:click={$performAddTag[index]}>
        {selection}
      </button>
    </li>
  {/each}
</ul>
<ul>
  {#each $tags as tag, index}
    <li>
      {tag}
      <button class="btn btn-red" on:click={$performRemoveTag[index]}>X</button>
    </li>
  {/each}
</ul>

<br />

{#if isAddingTag}
  <input type="text" bind:value={workingTag} />
  <button class="btn btn-blue" on:click={addNewTag}>Done</button>
{:else}
  <button class="btn" on:click={() => (isAddingTag = true)}>Add new tag</button>
{/if}
