<script context="module">
  import { createRef } from '../ref';
  export const name = createRef();
  export const nameError = createRef();
  export const photoBlob = createRef();
  export const editingPhotoBlob = createRef();
  export const performEditName = createRef();
  export const performEditPhoto = createRef();
  export const backFromEditPhoto = createRef();
  export const backFromItemPage = createRef();
</script>

<script>
  import PhotoEdit from './photo-edit/PhotoEdit.svelte';
  import Tags from './Tags.svelte';
  import Batches from './Batches.svelte';

  let nameInput;
  let workingName;
  let isEditingName = false;

  const startEditName = () => {
    workingName = $name;
    isEditingName = true;
  };

  const editName = () => {
    isEditingName = false;
    $performEditName(workingName);
  };

  $: preventEditName = workingName == $name;

  const nameKeyDown = (e) => {
    if (e.key == 'Enter') {
      if (preventEditName) {
        isEditingName = false;
      } else {
        editName();
      }
      e.preventDefault();
    }
  };

  let photoUrl;
  photoBlob.subscribe((value) => {
    if (photoUrl != undefined) {
      URL.revokeObjectURL(photoUrl);
      photoUrl = undefined;
    }

    if (value) {
      photoUrl = URL.createObjectURL(value);
    }
  });

  let isTakingPhoto = false;

  const photoComplete = (blob) => {
    $performEditPhoto(blob);
    isTakingPhoto = false;
  };

  const photoCancel = () => (isTakingPhoto = false);
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
      class="object-cover h-64 w-64 bg-secondary-accent"
      src={photoUrl}
      alt=""
    />
    <div class="absolute bottom-2 right-2 px-2 bg-secondary-accent rounded">
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

  <div class="mx-auto relative flex justify-center p-2 pt-6 pb-4">
    {#if isEditingName}
      <!-- New tag input -->
      <input
        class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200 text-center"
        type="text"
        autofocus
        bind:value={workingName}
        on:keydown={nameKeyDown}
      />

      <!-- Add button -->
      <button
        class="px-4 py-2 rounded-r-lg bg-primary  text-gray-800 font-bold uppercase border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
        disabled={preventEditName}
        on:click={editName}>Save</button
      >
    {:else}
      <!-- New tag input -->
      <input
        class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200 text-center font-semibold"
        type="text"
        value={$name}
        readonly
      />

      <!-- Add button -->
      <button
        class="px-4 py-2 rounded-r-lg bg-white font-bold uppercase border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
        on:click={startEditName}
      >
        <svg class="fill-current w-5 h-5" viewBox="0 0 20 20">
          <path
            d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"
          />
        </svg>
      </button>
    {/if}
  </div>

  <div class="h-4" />
  <Tags />
  <div class="h-4" />
  <Batches />
  <div class="h-20" />
</div>
