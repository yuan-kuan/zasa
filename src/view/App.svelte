<script context="module">
  import { createRef } from 'fp/ref';

  import Modal from './Modal.svelte';

  export const primaryView = createRef(null);
  export const modalView = createRef(null);
  export const closeModal = createRef(null);
</script>

<script>
  import Tailwindcss from './Tailwindcss.svelte';

  $: modalViewComponent = $modalView == '' ? null : $modalView;
</script>

<Tailwindcss />
<main class="bg-white relative min-h-screen max-w-screen-md mx-auto">
  <svelte:component this={$primaryView} />

  {#if modalViewComponent}
    <Modal on:click={$closeModal}>
      <svelte:component this={modalViewComponent} />
    </Modal>
  {/if}
</main>
