<script>
  import { TagStores } from 'app/stores';
  const { allTags, allTagsSelected, performToggleTagFilter } = TagStores;

  import Tag from 'view/Tag.svelte';

  import { scale } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';
  import TagRenamingPop from 'view/home/TagRenamePop.svelte';
  import Modal from 'view/Modal.svelte';

  let isRenamingTag = false;
  let original;
  const handleLongPress = (index) => {
    console.log(`long pressed at ${index}`);
    original = $allTags[index];
    isRenamingTag = true;
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
  <Modal on:click={() => (isRenamingTag = false)}>
    <div
      class="mx-3 p-4 flex flex-col justify-center items-center rounded-lg bg-white shadow-lg"
      transition:scale={{ delay: 0, duration: 500, easing: circInOut }}
    >
      <TagRenamingPop {original} on:close={() => (isRenamingTag = false)} />

      <div class="my-1 mx-10 border-t" />
      <button
        class="font-light text-primary underline place-self-center"
        on:click={() => (isRenamingTag = false)}>cancel</button
      >
    </div>
  </Modal>
{/if}
