<script>
  import { TagStores } from 'app/stores';
  const {
    allTags,
    allTagsSelected,
    performToggleTagFilter,
    performRenameTag,
    performRemoveTag,
  } = TagStores;

  import Tag from 'view/Tag.svelte';

  import { scale } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';
  import TagRenamingPop from 'view/home/TagRenamePop.svelte';
  import Modal from 'view/Modal.svelte';

  let isRenamingTag = false;
  let renamingIndex;
  let original;
  const handleLongPress = (index) => {
    renamingIndex = index;
    original = $allTags[index];
    isRenamingTag = true;
  };

  const closeRenaming = () => {
    renamingIndex = null;
    original = null;
    isRenamingTag = false;
  };

  const handleRename = (event) => {
    $performRenameTag[renamingIndex](event.detail);
  };

  const handleRemove = () => {
    $performRemoveTag[renamingIndex]();
  };
</script>

<!-- Tags cloud -->
<div class="mt-2 flex flex-row flex-wrap justify-center items-start">
  {#each $allTags as selection, index}
    <Tag
      name={selection}
      selected={$allTagsSelected[index]}
      on:tagclick={$performToggleTagFilter[index]}
      on:longpress={() => handleLongPress(index)}
    />
  {/each}
</div>

{#if isRenamingTag}
  <Modal on:click={closeRenaming}>
    <div
      class="mx-3 p-4 flex flex-col justify-center items-center rounded-lg bg-white shadow-lg"
      transition:scale={{ delay: 0, duration: 500, easing: circInOut }}
    >
      <TagRenamingPop
        {original}
        on:rename={handleRename}
        on:remove={handleRemove}
        on:close={closeRenaming}
      />

      <div class="my-1 mx-10 border-t" />
      <button
        class="font-light text-primary underline place-self-center"
        on:click={() => (isRenamingTag = false)}>cancel</button
      >
    </div>
  </Modal>
{/if}
