<script>
  import { Nav } from '../stores';
  const { backToHome } = Nav;

  export let back = $backToHome;
</script>

<header class="sticky top-0 w-full z-10">
  <button class="ml-2 p-2 font-light text-primary " on:click={back}
    >&#60; Back</button
  >
</header>
