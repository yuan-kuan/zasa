<script context="module">
  import { createRef } from 'fp/ref';
  import Modal from './Modal.svelte';

  export const primaryView = createRef(null);
  export const modalView = createRef(null);
  export const closeModal = createRef(null);
  export const toastMessage = createRef(null);
</script>

<script>
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { onMount } from 'svelte';
  import Tailwindcss from './Tailwindcss.svelte';

  $: modalViewComponent = $modalView == '' ? null : $modalView;

  onMount(() => {
    toastMessage.subscribe((message) => {
      if (message) {
        toast.push(message);
      }
    });
  });
</script>

<Tailwindcss />
<SvelteToast />
<main
  class="bg-white relative min-h-screen max-h-screen max-w-screen-md mx-auto overflow-y-auto"
>
  <svelte:component this={$primaryView} />

  {#if modalViewComponent}
    <Modal on:click={$closeModal}>
      <svelte:component this={modalViewComponent} />
    </Modal>
  {/if}
</main>
