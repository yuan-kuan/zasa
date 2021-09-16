<script>
  import Cropper from 'svelte-easy-crop';
  import { editingPhotoBlob } from './item_store';
  import { getCroppedImg } from './canvasUtils';

  let image, pixelCrop, croppedImage;
  editingPhotoBlob.subscribe((value) => {
    if (value) {
      image = URL.createObjectURL(value);
    }
  });

  let crop = { x: 0, y: 0 };
  let zoom = 1;

  const preview = (e) => {
    console.log('e :>> ', e);
    console.log(e.detail);
    pixelCrop = e.detail.pixels;
  };

  async function cropImage() {
    croppedImage = await getCroppedImg(image, pixelCrop);
  }
</script>

{#if image}
  <div style="position: relative; width: 100%; height: 50%;">
    <Cropper {image} bind:crop bind:zoom on:cropcomplete={preview} />
  </div>
  {#if croppedImage}
    <h2>Cropped Output</h2>
    <img src={croppedImage} alt="Cropped profile" /><br />
  {:else}
    <br /><button
      type="button"
      on:click={async () => {
        croppedImage = await getCroppedImg(image, pixelCrop);
      }}>Crop!</button
    >
  {/if}
{/if}
