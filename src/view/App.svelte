<script>
  import Tailwindcss from './Tailwindcss.svelte';
  import { primaryView, modalView, closeModal } from './view_store';

  $: modalViewComponent = $modalView == '' ? null : $modalView;
</script>

<Tailwindcss />
<main class="bg-gray-200 h-screen overflow-y-hidden border-red-500">
  <svelte:component this={$primaryView} />

  {#if modalViewComponent}
    <div
      class="modal opacity-100 fixed z-30 w-full h-full top-0 right-0 flex items-center justify-center"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-25"
        on:click={$closeModal}
      />

      <div
        class="modal-container bg-white fixed right-0 w-full h-full md:max-w-md lg:max-w-lg xl:max-w-4xl mx-auto rounded shadow-lg z-50 overflow-y-auto"
      >
        <svelte:component this={modalViewComponent} />
      </div>
    </div>
  {/if}
</main>
