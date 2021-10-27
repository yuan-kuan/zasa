<script>
  import { onDestroy } from 'svelte';
  import { ItemStores } from '../../stores';

  import PhotoEdit from './PhotoEdit.svelte';

  const { photoBlob } = ItemStores;

  export let photoChanged;

  let isTakingPhoto = false;
  let photoUrl;

  const updatePhotoUrl = (blob) => {
    if (photoUrl != undefined) {
      URL.revokeObjectURL(photoUrl);
      photoUrl = undefined;
    }

    if (blob) {
      photoUrl = URL.createObjectURL(blob);
    }
  };

  photoBlob.subscribe(updatePhotoUrl);

  const onPhotoChanged = (blob) => {
    isTakingPhoto = false;
    updatePhotoUrl(blob);
    photoChanged(blob);
  };

  const onPhotoCancelled = () => {
    isTakingPhoto = false;
  };

  onDestroy(() => {
    URL.revokeObjectURL(photoUrl);
    photoUrl = undefined;
  });
</script>

<div class="pt-1 w-64 mx-auto relative" on:click={() => (isTakingPhoto = true)}>
  <img class="object-cover h-64 w-64 bg-primary-accent" src={photoUrl} alt="" />
  <div
    class="absolute bottom-2 right-2 px-2 text-primary  bg-primary-accent opacity-75 rounded-xl"
  >
    <svg class="fill-current w-10 h-10" viewBox="0 0 20 20">
      <!-- xmlns="http://www.w3.org/2000/svg" -->
      <path
        d="M10,6.536c-2.263,0-4.099,1.836-4.099,4.098S7.737,14.732,10,14.732s4.099-1.836,4.099-4.098S12.263,6.536,10,6.536M10,13.871c-1.784,0-3.235-1.453-3.235-3.237S8.216,7.399,10,7.399c1.784,0,3.235,1.452,3.235,3.235S11.784,13.871,10,13.871M17.118,5.672l-3.237,0.014L12.52,3.697c-0.082-0.105-0.209-0.168-0.343-0.168H7.824c-0.134,0-0.261,0.062-0.343,0.168L6.12,5.686H2.882c-0.951,0-1.726,0.748-1.726,1.699v7.362c0,0.951,0.774,1.725,1.726,1.725h14.236c0.951,0,1.726-0.773,1.726-1.725V7.195C18.844,6.244,18.069,5.672,17.118,5.672 M17.98,14.746c0,0.477-0.386,0.861-0.862,0.861H2.882c-0.477,0-0.863-0.385-0.863-0.861V7.384c0-0.477,0.386-0.85,0.863-0.85l3.451,0.014c0.134,0,0.261-0.062,0.343-0.168l1.361-1.989h3.926l1.361,1.989c0.082,0.105,0.209,0.168,0.343,0.168l3.451-0.014c0.477,0,0.862,0.184,0.862,0.661V14.746z"
      />
    </svg>
  </div>
</div>

{#if isTakingPhoto}
  <PhotoEdit photoChanged={onPhotoChanged} photoCancelled={onPhotoCancelled} />
{/if}
