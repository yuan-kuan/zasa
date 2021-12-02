<script context="module">
  import { createRef } from 'fp/ref';
  import Modal from './Modal.svelte';

  export const primaryView = createRef(null);
  export const modalView = createRef(null);
  export const closeModal = createRef(null);
</script>

<script>
  import SvelteSeo from 'svelte-seo';
  import Tailwindcss from './Tailwindcss.svelte';

  $: modalViewComponent = $modalView == '' ? null : $modalView;
</script>

<SvelteSeo
  title="B4 The Date"
  description="Remind you to consume the otherwise expired food. Stop the waste."
  keywords="food waste, expiry date, best before"
  openGraph={{
    title: 'B4 The Date',
    description:
      'Remind you to consume the otherwise expired food. Stop the waste.',
    url: 'https://b4the.date',
    type: 'website',
    images: [
      {
        url: 'https://b4the.date/images/b4_logo_withname_1200.jpg',
        width: 1200,
        height: 628,
        alt: 'Logo that read B 4',
      },
    ],
  }}
  twitter={{
    site: '@yuankuan_',
    title: 'B4 The Date',
    description:
      'Remind you to consume the otherwise expired food. Stop the waste.',
    image: 'https://b4the.date/images/b4_logo_withname_1200.jpg',
    imageAlt: 'Logo that read B 4',
  }}
/>

<Tailwindcss />
<main class="bg-white relative min-h-screen max-w-screen-md mx-auto">
  <svelte:component this={$primaryView} />

  {#if modalViewComponent}
    <Modal on:click={$closeModal}>
      <svelte:component this={modalViewComponent} />
    </Modal>
  {/if}
</main>
