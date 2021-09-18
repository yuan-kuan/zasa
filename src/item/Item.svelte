<script>
  import {
    name,
    nameError,
    photoBlob,
    performEditName,
    performEditPhoto,
  } from './item_store';
  import PhotoEdit from './photo-edit/PhotoEdit.svelte';
  import Tags from './Tags.svelte';
  import Batches from './Batches.svelte';

  let workingName;
  let isEditingName = false;

  const editName = () => {
    isEditingName = false;
    $performEditName(workingName);
  };

  let photoUrl;
  photoBlob.subscribe((value) => {
    if (value) {
      photoUrl = URL.createObjectURL(value);
    }
  });

  let isTakingPhoto = false;

  const photoComplete = (blob) => {
    console.log('blob in item :>> ', blob);
    $performEditPhoto(blob);
    isTakingPhoto = false;
  };

  const photoCancel = () => (isTakingPhoto = false);
</script>

<div class="p-1 w-1/3 lg:w-1/4 xl:w-1/6 relative">
  <img class="object-cover h-32 w-full border" src={photoUrl} alt="" />
  <button on:click={() => (isTakingPhoto = true)}>Change Photo</button>
</div>

{#if isTakingPhoto}
  <PhotoEdit {photoComplete} {photoCancel} />
{/if}

<br />

{#if isEditingName}
  <input type="text" bind:value={workingName} />
  <button on:click={editName}>Done</button>
{:else}
  <p>{$name}</p>
  <button on:click={() => (isEditingName = true)}>Edit</button>
{/if}

<br />

<Tags />

<br />

<Batches />
