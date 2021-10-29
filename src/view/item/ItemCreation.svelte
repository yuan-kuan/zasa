<script>
  import { slide } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';
  import { ItemStores } from 'app/stores';

  import Backheader from 'view/BackHeader.svelte';
  import Photo from './photo-edit/Photo.svelte';
  import NameInput from './NameInput.svelte';

  const { performSave } = ItemStores;

  let blob;
  const photoChanged = (v) => {
    blob = v;
  };

  const saveItem = (newName) => {
    $performSave(newName, blob);
  };
</script>

<div
  class="container md:mx-auto"
  transition:slide={{ delay: 0, duration: 500, easing: circInOut }}
>
  <Backheader />
  <Photo {photoChanged} />
  <NameInput isEditingName={true} editName={saveItem} />
</div>
