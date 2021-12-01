<script>
  import { Accordion, AccordionItem } from 'svelte-collapsible';

  import { Nav } from 'app/stores';
  const { backToHome } = Nav;

  import Batch from 'view/item/Batch.svelte';
  import BottomSideButton from 'view/home/BottomSideButton.svelte';
  import Tag from 'view/Tag.svelte';

  let accordionKey = '';
</script>

<div class="p-8 rounded-3xl  bg-neutral">
  <div class="font-bold text-center text-xl">How to use?</div>
  <div class="italic font-thin text-center text-sm leading-tight">
    Always use B4 with a mobile phone.
  </div>

  <Accordion bind:key={accordionKey}>
    <AccordionItem key="addnewitem">
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
          on the main page. You will see a new page.
        </p>
        <p>
          On that page, tap on the empty image box to upload a photo of the new
          item.
        </p>
        <p>
          Lastly, give the new item a name. Press enter or click on "DONE"
          button to complete.
        </p>
      </article>
    </AccordionItem>

    <AccordionItem key="tagtheitem">
      <header slot="header">Tag the item</header>
      <article slot="body">
        <p>
          Select an item from the grid. Then, at the item page, tap on
          <button
            class="btn inline-flex bg-secondary-accent items-center text-primary"
          >
            <svg
              class="w-5 h-5"
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
            <span class="pl-1"> add tag </span>
          </button>
        </p>

        <p>
          If you are just getting started with B4TheDate, you will see an empty
          pop-up with an input box. Use it to add a new tag for your item.
        </p>

        <p>You can have multiple tags for each item.</p>

        <p>
          Close the pop-up when you completed your tagging. You will notice the
          tags of the item is displayed instead.
        </p>
      </article>
    </AccordionItem>

    <AccordionItem key="changetag">
      <header slot="header">Manage Item's Tags</header>
      <article slot="body">
        <p>
          To add or remove tags from an item. Go to its page and tap on the tags
          section:
          <span class="mt-2 flex flex-row flex-wrap justify-center items-start">
            <Tag name="Tag 1" dense />
            <Tag name="Tag 2" dense />
          </span>
        </p>

        <p>
          Selected tag is highlighted
          <span class="flex flex-row justify-center items-start">
            <Tag name="selected" selected />
          </span>
          Tap on it to <strong>remove</strong> this tag from the item.
        </p>

        <p>
          Available tag has no color
          <span class="flex flex-row justify-center items-start">
            <Tag name="available" selected={false} />
          </span>
          Tap on it to <strong>add</strong> this tag to the item.
        </p>

        <p>
          If you do not find the tag you want, create a new one with the input
          box at the top of the pop-up
        </p>
      </article>
    </AccordionItem>

    <AccordionItem key="filterwithtag">
      <header slot="header">Filter Items with Tags</header>
      <article slot="body">
        <p>
          You can configure the main page to only show items with certain tags.
          To do that, tap on the Filter

          <span class="inline-flex  bg-primary w-16 rounded-r-3xl">
            <BottomSideButton title="Filter" />
          </span>
        </p>

        <p>
          From the pop-up, select the tags you want to use as a filter. As you
          select the tags, you can see the grid changes its content.
        </p>

        <p>
          When none of the tags is selected, all items will be shown. This is
          the default behaviour.
        </p>
      </article>
    </AccordionItem>

    <AccordionItem key="addnewbatch">
      <header slot="header">Create A Batch</header>
      <article slot="body">
        <p>
          A batch has two things: An expiry date and a stock count. You can have
          multiple batches for each item.
        </p>

        <p>
          Create a new batch by tapping on
          <button class="btn bg-primary-accent inline text-right text-primary ">
            Pick a Date
          </button>
        </p>

        <p>
          Once a date is selected, a new line will be created right above the
          button:
          <span class="inline-block">
            <Batch batch={{ expiry: new Date(), count: 1 }} />
          </span>
        </p>

        <p>
          This is the new batch you just created. You can adjust the stock count
          with the "+" and "-" button.
        </p>
      </article>
    </AccordionItem>

    <AccordionItem key="updatestockcount">
      <header slot="header">Update Stock</header>
      <article slot="body">
        <p>Now and then, you will consume the food and buy new stock.</p>

        <p>
          When you take one out for use, remember to deduct it from the batch it
          belongs to (hint: same expiry date).
        </p>

        <p>
          If you happen to buy new stock that shares the existing expiry date,
          add one to the batch's stock with the "+" button. Otherwise, create a
          new batch for the new stock with a new date.
        </p>

        <p>
          It is common to have multiple batches with multiple stock counts of a
          single item.
        </p>

        <p>
          When you take the last one out from a batch, reduce its stock count to
          zero. A delete button will appear. Tap on it to remove the batch.
        </p>
      </article>
    </AccordionItem>

    <AccordionItem key="remindb4thedate">
      <header slot="header">Remind You Before The Date</header>
      <article slot="body">
        <p>
          Each item has its reminder period (in days). An item will be marked as
          expiring when one of its batches have an expiry date that falls within
          the reminding period.
        </p>

        <p>days = expiry - today</p>
        <p>
          Expiring = days {'<'} reminder
        </p>

        <p>
          By default, each item has a 30 days reminder period. To change it, use
          the reminder section on the item page:
          <span class="mx-auto relative flex justify-center p-2 pt-6 pb-4">
            <span class="text-right">Remind me in</span>

            <input
              class="w-12 px-2 rounded border border-gray-200 text-right text-primary"
              type="text"
              value="30"
              readonly
            />

            <span>Days</span>
          </span>
        </p>
      </article>
    </AccordionItem>

    <AccordionItem key="showexpiring">
      <header slot="header">Show Only Expiring Items</header>
      <article slot="body">
        <p>
          When you have expiring items, the Expiring filter will have the number
          of expiring items to it:
          <span class="flex flex-row justify-center items-start">
            <Tag name="Expiring (3)" selected={false} />
          </span>
        </p>

        <p>
          Selecting this filter tag will show you all the expiring items in the
          grid. You can further filter it by your tags too.
        </p>

        <p>
          Find it from the Filter button:
          <span class="inline-flex  bg-primary w-16 rounded-r-3xl">
            <BottomSideButton title="Filter" />
          </span>
        </p>
      </article>
    </AccordionItem>

    <AccordionItem key="backup">
      <header slot="header">Backup</header>
      <article slot="body">
        <p>
          Backup to the internet is possible, but it requires more care and
          technicality. Talk to kuan or email him at
          <a class="underline" href="mailto:kuan@hey.com">kuan@hey.com</a>
        </p>
      </article>
    </AccordionItem>
  </Accordion>

  <div class="flex flex-row-reverse">
    <button
      class="mt-6 font-light text-primary underline place-self-end"
      on:click={$backToHome}>close</button
    >
  </div>
</div>

<style>
  :global(.accordion) {
    width: 100%;
    margin: 0 auto;
  }

  :global(.accordion-item) {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid white;
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
    border-left-color: white;
  }

  p {
    line-height: 1.625;
    padding-bottom: 1rem;
  }
</style>
