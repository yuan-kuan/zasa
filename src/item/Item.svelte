<script>
  import {
    name,
    nameError,
    photoBlob,
    performAddExpiry,
    performEditName,
  } from './item_store';

  let workingName;
  let isEditingName = false;

  const editName = () => {
    isEditingName = false;
    $performEditName(workingName);
  };

  let isAddingBatch = false;

  let cameraInput;
  function addPhoto() {
    cameraInput.click();
  }

  let photoUrl;
  function photoTaken(e) {
    let blob = e.target.files[0];
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

<br />

{#if isEditingName}
  <input type="text" bind:value={workingName} />
  <button on:click={editName}>Done</button>
{:else}
  <p>{$name}</p>
  <button on:click={() => (isEditingName = true)}>Edit</button>
{/if}

<br />

<br />
<p class="text-green-600">Batches</p>
{#if isAddingBatch}
  <input type="date" />
  <span>count</span>
  <button>+</button>
{:else}
  <button on:click={() => (isAddingBatch = true)}>New Batch</button>
{/if}
