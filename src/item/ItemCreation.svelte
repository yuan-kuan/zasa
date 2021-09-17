<script>
  import { nameError, performSave } from './item_store';
  import PhotoEdit from './PhotoEdit.svelte';

  let workingName;
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
</script>

<div class="p-1 w-1/3 lg:w-1/4 xl:w-1/6 relative">
  <img class="object-cover h-32 w-full border" src={photoUrl} alt="" />
  <button on:click={() => (isTakingPhoto = true)}>Add Photo</button>
</div>

<br />

<div>
  {#if $nameError}
    <p class="text-red-500">{$nameError}</p>
  {/if}
  <input type="text" bind:value={workingName} />
</div>

<br />
<button on:click={saveItem}>Save</button>

{#if isTakingPhoto}
  <PhotoEdit {photoComplete} {photoCancel} />
{/if}
