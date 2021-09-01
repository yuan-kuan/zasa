<script>
  import {
    isCreation,
    name,
    photoBlob,
    performSave,
    nameError,
  } from './item_store';

  let workingName;
  const saveItem = () => {
    $performSave(workingName, blob);
  };

  let cameraInput;
  function addPhoto() {
    cameraInput.click();
  }

  var photoUrl;
  var blob;
  function photoTaken(e) {
    blob = e.target.files[0];
    if (blob) {
      photoUrl = URL.createObjectURL(blob);
    }
  }

  photoBlob.subscribe((value) => {
    if (value) {
      photoUrl = URL.createObjectURL(value);
    }
  });
</script>

<input
  style="display: none"
  bind:this={cameraInput}
  type="file"
  accept="image/*"
  on:change={photoTaken}
/>
<div class="p-1 w-1/3 lg:w-1/4 xl:w-1/6 relative">
  <img class="object-cover h-32 w-full border" src={photoUrl} alt="" />
  <button on:click={addPhoto}>Add Photo</button>
</div>

{#if $isCreation}
  <div>
    {#if $nameError}
      <p class="text-red-500">{$nameError}</p>
    {/if}
    <input type="text" bind:value={workingName} />
  </div>
{:else}
  <p>{$name}</p>
{/if}
<button on:click={saveItem}>Save</button>
