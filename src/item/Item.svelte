<script>
  import { name, performSave } from './item_store';

  let workingName = '';
  const saveItem = () => {
    $performSave(workingName, photoBlob);
  };

  let cameraInput;
  function addPhoto() {
    cameraInput.click();
  }

  var photoBlob;
  var photoUrl;
  function photoTaken(e) {
    photoBlob = e.target.files[0];
    if (photoBlob) {
      photoUrl = URL.createObjectURL(photoBlob);
    }
  }
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
<div>
  <input type="text" bind:value={workingName} />
</div>
<button on:click={saveItem}>Save</button>
