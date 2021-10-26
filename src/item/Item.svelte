<script context="module">
  import { createRef } from '../ref';
  export const name = createRef();
  export const nameError = createRef();
  export const photoBlob = createRef();
  export const editingPhotoBlob = createRef();
  export const performEditName = createRef();
  export const performEditPhoto = createRef();
  export const backFromEditPhoto = createRef();
  export const backFromItemPage = createRef();
</script>

<script>
  import { slide } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  import Backheader from '../view/BackHeader.svelte';
  import Photo from './photo-edit/Photo.svelte';
  import NameInput from './NameInput.svelte';
  import Tags from './Tags.svelte';
  import Batches from './Batches.svelte';

  const editName = (newName) => {
    $performEditName(newName);
  };

  const photoChanged = (blob) => {
    $performEditPhoto(blob);
  };
</script>

<div
  class="container md:mx-auto text-primary "
  transition:slide={{ delay: 0, duration: 500, easing: circInOut }}
>
  <Backheader />
  <Photo {photoChanged} />
  <NameInput name={$name} {editName} />
  <Tags />
  <!-- Line divider -->
  <div class="h-4 mt-4 mx-10 border-t " />
  <Batches />
  <!-- Tail buffer -->
  <div class="h-20" />
</div>
