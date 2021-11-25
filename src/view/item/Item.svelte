<script>
  import { slide } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  import { ItemStores } from 'app/stores';

  import Backheader from 'view/BackHeader.svelte';
  import Photo from './photo-edit/Photo.svelte';
  import NameInput from './NameInput.svelte';
  import Tags from './Tags.svelte';
  import Reminder from './Reminder.svelte';
  import Batches from './Batches.svelte';

  const { name, performEditName, performEditPhoto, performDeleteItem } =
    ItemStores;

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
  <Backheader
    actions={[
      {
        classes: 'btn-secondary',
        label: 'Delete',
        action: $performDeleteItem,
      },
    ]}
  />

  <Photo {photoChanged} />
  <NameInput name={$name} {editName} />
  <Tags />
  <Reminder />
  <!-- Line divider -->
  <div class="h-4 mt-4 mx-10 border-t " />
  <Batches />
  <!-- Tail buffer -->
  <div class="h-20" />
</div>
