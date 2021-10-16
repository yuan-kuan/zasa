<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .btn {
    @apply m-1 border rounded-full font-bold text-sm select-none leading-loose px-3 py-1;
  }
  .btn-primary {
    @apply bg-primary text-white;
  }
  .btn-secondary {
    @apply bg-secondary text-white;
  }
  .btn-primary:hover {
    @apply bg-primary font-semibold;
  }

  .btn-primary:hover:disabled {
    @apply bg-gray-400;
  }
</style>
