<script>
  import { onMount } from 'svelte';
  import Cropper from 'svelte-easy-crop';
  import { getCroppedImg } from './canvasUtils';

  export let photoComplete;
  export let photoCancel;

  onMount(() => {
    startCamera();
  });

  const startCamera = () => cameraInput.click();

  let image, pixelCrop;

  let crop = { x: 0, y: 0 };
  let zoom = 1;

  const preview = (e) => {
    pixelCrop = e.detail.pixels;
  };

  async function cropImage() {
    const blob = await getCroppedImg(image, pixelCrop);
    photoComplete(blob);
  }

  let cameraInput;
  function photoTaken(e) {
    let blob = e.target.files[0];
    if (blob) {
      image = URL.createObjectURL(blob);
    }
  }
</script>

<div
  class="modal opacity-100 fixed z-30 w-full h-full top-0 right-0 flex items-center justify-center"
>
  <div
    class="modal-overlay absolute w-full h-full bg-gray-900 opacity-25"
    on:click={photoCancel}
  />

  <div
    class="modal-container bg-white fixed right-0 w-full h-full md:max-w-md lg:max-w-lg xl:max-w-4xl mx-auto rounded shadow-lg z-50 overflow-y-auto"
  >
    <input
      style="display: none"
      bind:this={cameraInput}
      type="file"
      accept="image/*"
      on:change={photoTaken}
    />

    {#if image}
      <div style="position: relative; width: 100%; height: 50%;">
        <Cropper {image} bind:crop bind:zoom on:cropcomplete={preview} />
      </div>

      <br /><button type="button" on:click={cropImage}>Okay!</button>
    {/if}
    <button class="btn btn-blue" on:click={startCamera}>Retake Photo</button>
  </div>
</div>
