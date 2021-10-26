<script context="module">
  import { createRef } from '../ref';

  export const performSave = createRef();
  export const backFromItemPage = createRef();
</script>

<script>
  import { slide } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';
  import { onDestroy } from 'svelte';

  import Backheader from '../view/BackHeader.svelte';
  import Photo from './photo-edit/Photo.svelte';

  let workingName;
  $: preventSave = workingName == undefined || workingName.length == 0;

  let saveButton;
  const nameKeyDown = (e) => {
    if (e.key == 'Enter') {
      saveItem();
      e.preventDefault();
    }
  };

  let blob;
  let photoUrl;

  const photoCompleted = (v) => {
    blob = v;
    photoUrl = URL.createObjectURL(blob);
  };

  const saveItem = () => {
    $performSave(workingName, blob);
  };

  onDestroy(() => {
    URL.revokeObjectURL(photoUrl);
  });
</script>

<div
  class="container md:mx-auto"
  transition:slide={{ delay: 0, duration: 500, easing: circInOut }}
>
  <Backheader />

  <Photo {photoUrl} {photoCompleted} />

  <div class="flex flex-col items-center pt-6">
    <div class="relative flex p-2 pt-6 pb-4 mx-4 flex-initial">
      <!-- New tag input -->
      <input
        class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200 text-center"
        type="text"
        placeholder="Name (required)"
        bind:value={workingName}
        on:keydown={nameKeyDown}
      />

      <!-- Add button -->
      <button
        class="px-4 py-2 rounded-r-lg bg-primary  text-gray-800 font-bold uppercase border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
        disabled={preventSave}
        bind:this={saveButton}
        on:click={saveItem}>Save</button
      >
    </div>
  </div>
</div>
