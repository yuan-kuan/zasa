<script>
  import { createEventDispatcher } from 'svelte';

  export let original;

  const dispatch = createEventDispatcher();

  $: workingTag = original;
  $: isRenaming = !isRemoving && workingTag != original;
  $: isRemoving = workingTag == '';

  const initInput = (inputElement) => {
    inputElement?.focus();
    inputElement?.select();
  };

  const addNewTag = () => {
    dispatch('rename', workingTag);
    dispatch('close');
  };

  const addTagKeyDown = (e) => {
    if (e.key == 'Enter') {
      addNewTag();
      e.preventDefault();
    }
  };
</script>

<span class="text-primary font-semibold">Rename Tag</span>

<div class="relative flex p-2 pt-2 pb-4 mx-4 text-primary ">
  <!-- New tag input -->
  <input
    type="text"
    class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200 text-center w-40"
    bind:value={workingTag}
    use:initInput
    on:keydown={addTagKeyDown}
  />

  <!-- Add button -->
  <button
    class="px-4 py-2 rounded-r-lg bg-secondary-accent font-bold text-primary  border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
    disabled={workingTag == original}
    on:click={addNewTag}>{isRemoving ? 'Remove' : 'Rename'}</button
  >
</div>

{#if isRenaming}
  <span class="text-primary"
    ><strong>{original}</strong> to <strong>{workingTag}</strong></span
  >
{/if}
{#if isRemoving}
  <span class="text-danger"
    >Removing tag <strong>{original}</strong> entirely</span
  >
{/if}
