<script>
  import { Accordion, AccordionItem } from 'svelte-collapsible';

  let accordionKey = 'a1';
</script>

<div class="p-8  bg-neutral">
  <div class="font-bold text-center text-xl">How to use?</div>
  <div class="italic font-thin text-center text-sm leading-tight">
    Use with a mobile phone.
  </div>

  <Accordion bind:key={accordionKey}>
    <AccordionItem key="a1">
      <header slot="header">Add New Item</header>
      <article slot="body">
        <p>
          Tap on
          <button
            class="inline-flex flex-col items-center text-xs font-medium text-white"
          >
            <div
              class="relative p-1 rounded-full border-2 border-white  bg-primary"
            >
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </button>
          in the main page.
        </p>
        <p>
          In the next page, tap on the empty image box to upload a photo of the
          new item.
        </p>
        <p>Lastly, give the new item a name. This step is mandatory.</p>
      </article>
    </AccordionItem>
    <AccordionItem key="a2">
      <header slot="header">Tagging</header>
      <article slot="body">Tag this tag that</article>
    </AccordionItem>
    <AccordionItem key="addnewbatch">
      <header slot="header">Add New Batch</header>
      <article slot="body">Tag this tag that</article>
    </AccordionItem>
    <AccordionItem key="changereminddays">
      <header slot="header">Edit Remind Days</header>
      <article slot="body">Tag this tag that</article>
    </AccordionItem>
    <AccordionItem key="filterwithtag">
      <header slot="header">Filter Items with Tags</header>
      <article slot="body">Tag this tag that</article>
    </AccordionItem>
    <AccordionItem key="showexpiring">
      <header slot="header">Show Only Expiring Items</header>
      <article slot="body">Tag this tag that</article>
    </AccordionItem>
  </Accordion>
</div>

<style>
  :global(.accordion) {
    width: 100%;
    margin: 0 auto;
  }

  :global(.accordion-item) {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgb(100, 120, 140);
  }

  header {
    padding: 1rem;
    font-size: 1.125rem /* 18px */;
    line-height: 1.75rem /* 28px */;
    cursor: pointer;
    user-select: none;
  }

  article {
    padding: 0.5rem;
    border-left-width: 2px;
  }

  p {
    line-height: 1.625;
    padding-top: 1rem;
  }
</style>
