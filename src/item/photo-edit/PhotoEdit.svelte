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

  let aspect = 1;
  let crop = { x: 0, y: 0 };
  let zoom = 1;

  const preview = (e) => {
    pixelCrop = e.detail.pixels;
  };

  async function cropImage() {
    console.log('pixelCrop :>> ', pixelCrop);
    const blob = await getCroppedImg(image, pixelCrop);
    console.log('after lenght :>> ', blob.size);
    photoComplete(blob);
  }

  let cameraInput;
  function photoTaken(e) {
    let blob = e.target.files[0];
    if (blob) {
      image = URL.createObjectURL(blob);
      console.log('before lenght :>> ', blob.size);
      // photoComplete(blob);
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
    <header class="sticky top-0 bg-gray-200 bg-opacity-50 w-full z-10">
      <button class="ml-2 p-2 font-light" on:click={photoCancel}
        >&#60; Back</button
      >
    </header>

    <input
      style="display: none"
      bind:this={cameraInput}
      type="file"
      accept="image/*"
      on:change={photoTaken}
    />

    {#if image}
      <div class="py-2 mx-auto w-full text-center">Adjust your image</div>
      <div class="relative w-full h-1/2 border-solid border-4 border-blue-200">
        <Cropper
          {image}
          bind:aspect
          bind:crop
          bind:zoom
          on:cropcomplete={preview}
        />
      </div>

      <div class="flex w-full justify-center pt-2">
        <button class="btn btn-blue" on:click={cropImage}>Done!</button>
        <button class="btn" on:click={startCamera}>Retake Photo</button>
      </div>
    {:else}
      <div class="flex w-full justify-center pt-2">
        <button class="btn" on:click={startCamera}>Retake Photo</button>
      </div>
    {/if}
  </div>
</div>
