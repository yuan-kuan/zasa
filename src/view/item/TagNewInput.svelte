<script>
  import { TagStores } from 'app/stores';

  const { performAddNewTag } = TagStores;

  let workingTag;
  const addNewTag = () => {
    $performAddNewTag(workingTag);
    workingTag = undefined;
  };

  const addTagKeyDown = (e) => {
    if (e.key == 'Enter') {
      addNewTag();
      e.preventDefault();
    }
  };
</script>

<div class="relative flex p-2 pt-2 pb-4 mx-4 text-primary ">
  <!-- New tag input -->
  <input
    type="text"
    placeholder="new tag"
    class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200 text-center w-40"
    bind:value={workingTag}
    on:keydown={addTagKeyDown}
  />

  <!-- Add button -->
  <button
    class="px-4 py-2 rounded-r-lg bg-secondary-accent font-bold text-primary  border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
    disabled={!workingTag}
    on:click={addNewTag}>add</button
  >
</div>
