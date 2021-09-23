<script>
  import { onDestroy } from 'svelte';

  import { nameError, performSave, backFromItemPage } from './item_store';
  import PhotoEdit from './photo-edit/PhotoEdit.svelte';

  let workingName;
  $: preventSave = workingName == undefined || workingName.length == 0;

  let saveButton;
  const nameKeyDown = (e) => {
    if (e.key == 'Enter') {
      saveButton.focus();
      e.preventDefault();
    }
  };

  let blob;
  let photoUrl;
  let isTakingPhoto = false;

  const photoComplete = (v) => {
    blob = v;
    photoUrl = URL.createObjectURL(blob);
    isTakingPhoto = false;
  };

  const photoCancel = () => (isTakingPhoto = false);

  const saveItem = () => {
    $performSave(workingName, blob);
  };

  onDestroy(() => {
    URL.revokeObjectURL(photoUrl);
  });
</script>

<div class="container md:mx-auto">
  <header class="sticky top-0 bg-gray-200 bg-opacity-50 w-full z-10">
    <button class="ml-2 p-2 font-light" on:click={$backFromItemPage}
      >&#60; Back</button
    >
  </header>

  <div
    class="pt-1 w-64 mx-auto relative"
    on:click={() => (isTakingPhoto = true)}
  >
    <img
      class="object-cover h-64 w-64 border-solid border-4 border-blue-400"
      src={photoUrl}
      alt=""
    />
    <div
      class="absolute bottom-2 right-2 px-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
    >
      <svg class="fill-current w-10 h-10" viewBox="0 0 20 20">
        <!-- xmlns="http://www.w3.org/2000/svg" -->
        <path
          d="M10,6.536c-2.263,0-4.099,1.836-4.099,4.098S7.737,14.732,10,14.732s4.099-1.836,4.099-4.098S12.263,6.536,10,6.536M10,13.871c-1.784,0-3.235-1.453-3.235-3.237S8.216,7.399,10,7.399c1.784,0,3.235,1.452,3.235,3.235S11.784,13.871,10,13.871M17.118,5.672l-3.237,0.014L12.52,3.697c-0.082-0.105-0.209-0.168-0.343-0.168H7.824c-0.134,0-0.261,0.062-0.343,0.168L6.12,5.686H2.882c-0.951,0-1.726,0.748-1.726,1.699v7.362c0,0.951,0.774,1.725,1.726,1.725h14.236c0.951,0,1.726-0.773,1.726-1.725V7.195C18.844,6.244,18.069,5.672,17.118,5.672 M17.98,14.746c0,0.477-0.386,0.861-0.862,0.861H2.882c-0.477,0-0.863-0.385-0.863-0.861V7.384c0-0.477,0.386-0.85,0.863-0.85l3.451,0.014c0.134,0,0.261-0.062,0.343-0.168l1.361-1.989h3.926l1.361,1.989c0.082,0.105,0.209,0.168,0.343,0.168l3.451-0.014c0.477,0,0.862,0.184,0.862,0.661V14.746z"
        />
      </svg>
    </div>
  </div>

  {#if isTakingPhoto}
    <PhotoEdit {photoComplete} {photoCancel} />
  {/if}

  <div class="flex flex-col items-center pt-6">
    <input
      class="appearance-none bg-transparent border-b border-blue-500 text-gray-700 w-48 mr-3 py-1 px-2 w-64 leading-tight focus:outline-none text-center"
      type="text"
      placeholder="Name (required)"
      bind:value={workingName}
      on:keydown={nameKeyDown}
    />
    <button
      class="btn btn-blue mt-6 w-64 disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={preventSave}
      bind:this={saveButton}
      on:click={saveItem}>Save</button
    >
  </div>
</div>
