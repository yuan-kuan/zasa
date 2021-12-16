<script>
  import { scale } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  import Modal from 'view/Modal.svelte';
  import TagSummary from './TagSummary.svelte';
  import TagNewInput from './TagNewInput.svelte';
  import TagCloud from './TagCloud.svelte';

  let isEditingTag = false;

  const closeTagSelection = () => (isEditingTag = false);
  const openTagSelection = () => (isEditingTag = true);
</script>

<TagSummary on:tagclick={openTagSelection} />

{#if isEditingTag}
  <Modal on:click={closeTagSelection}>
    <div
      class="mx-3 p-4 flex flex-col justify-center items-center rounded-lg bg-white shadow-lg"
      transition:scale={{ delay: 0, duration: 500, easing: circInOut }}
    >
      <TagNewInput />
      <TagCloud />

      <div class="my-1 mx-10 border-t" />
      <button
        class="font-light text-primary underline place-self-end"
        on:click={closeTagSelection}>close</button
      >
    </div>
  </Modal>
{/if}
