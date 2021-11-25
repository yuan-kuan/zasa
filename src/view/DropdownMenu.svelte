<script>
  export let actions;

  let expanded = false;
  const toggle = () => {
    expanded = !expanded;
  };
</script>

<div class="relative">
  <button class="btn" on:click={toggle}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  {#if expanded}
    <div class="fixed bottom-0 right-0 w-screen h-screen" on:click={toggle} />

    <div class="absolute right-0 ml-2 p-2 rounded-lg bg-white shadow-lg">
      <!-- transition:slide={{ delay: 0, duration: 500, easing: circInOut }} -->
      {#each actions as action}
        <button class="btn {action.classes}" on:click={action.action}
          >{action.label}</button
        >
      {/each}
    </div>
  {/if}
</div>
