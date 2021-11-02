<script>
  let count = 30;
</script>

<div class="mx-auto relative flex justify-center p-2 pt-6 pb-4">
  <span class="text-right">Remind me in</span>

  <input
    class="w-12 px-2 rounded border border-gray-200 text-right text-primary"
    type="text"
    placeholder="Number of"
    bind:value={count}
  />

  <span>Days</span>
</div>
