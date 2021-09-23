<script>
  import { onDestroy, onMount } from 'svelte';
  import Cropper from 'svelte-easy-crop';
  import { getCroppedImg } from './canvasUtils';

  import pica from 'pica';
  import ImageBlobReduce from 'image-blob-reduce';

  export let photoComplete;
  export let photoCancel;

  onMount(() => {
    startCamera();
  });

  onDestroy(() => {
    URL.revokeObjectURL(image);
  });

  const startCamera = () => cameraInput.click();

  let image, pixelCrop, mimeType;

  let aspect = 1;
  let crop = { x: 0, y: 0 };
  let zoom = 1;

  const preview = (e) => {
    pixelCrop = e.detail.pixels;
  };

  let isCropping = false;
  async function cropImage() {
    isCropping = true;
    const blob = await getCroppedImg(image, pixelCrop, mimeType);
    isCropping = false;
    photoComplete(blob);
  }

  let cameraInput;
  function photoTaken(e) {
    let blob = e.target.files[0];
    if (blob) {
      const ibr = ImageBlobReduce({ pica: pica() });

      ibr.toBlob(blob, { max: 512 }).then((resizedBlob) => {
        image = URL.createObjectURL(resizedBlob);
      });
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
      <div class="relative w-full h-1/3 border-solid border-4 border-blue-200">
        <Cropper
          {image}
          bind:aspect
          bind:crop
          bind:zoom
          on:cropcomplete={preview}
        />
      </div>

      <div class="flex w-full justify-center pt-2">
        {#if isCropping}
          <div>Saving Image... please wait...</div>
        {:else}
          <button class="btn btn-blue" on:click={cropImage}>Done!</button>
          <button class="btn" on:click={startCamera}>Retake Photo</button>
        {/if}
      </div>
    {:else}
      <div class="flex w-full justify-center pt-2">
        <button class="btn" on:click={startCamera}>Retake Photo</button>
      </div>
    {/if}
  </div>
</div>
