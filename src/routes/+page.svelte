<script lang="ts">
  import shopData from '../data/items.json';
  import VendorNav from '$lib/components/VendorNav.svelte';
  import ItemCard from '$lib/components/ItemCard.svelte';
  import Cart from '$lib/components/Cart.svelte';
  import ProcurementForm from '$lib/components/ProcurementForm.svelte';
  import { addToCart } from '$lib/stores/cart';
  import type { Vendor, StandardVendor, ProcurementVendor, ShopItem } from '$lib/types';

  const vendors: Vendor[] = shopData.vendors as Vendor[];

  let activeVendorId: string = vendors[0]?.id ?? '';
  let charName: string = '';

  $: activeVendor = vendors.find((v) => v.id === activeVendorId) ?? vendors[0];
  $: standardVendor = activeVendor?.type === 'standard' ? (activeVendor as StandardVendor) : null;
  $: procurementVendor = activeVendor?.type === 'procurement' ? (activeVendor as ProcurementVendor) : null;

  function handleSelect(event: CustomEvent<{ vendorId: string }>) {
    activeVendorId = event.detail.vendorId;
  }

  function handleAdd(event: CustomEvent<{ item: ShopItem; vendorName: string }>) {
    addToCart(event.detail.item, event.detail.vendorName);
  }
</script>

<svelte:head>
  <title>The Merchant Quarter</title>
</svelte:head>

<div class="shop-layout">
  <aside class="vendor-nav-col">
    <div class="nav-header">
      <h1 class="site-title">The Merchant Quarter</h1>
    </div>
    <VendorNav {vendors} {activeVendorId} on:select={handleSelect} />
  </aside>

  <main class="main-col">
    <div class="char-name-bar">
      <label for="char-name">Character Name</label>
      <input
        id="char-name"
        type="text"
        placeholder="Enter your character's name…"
        bind:value={charName}
        autocomplete="off"
      />
    </div>

    {#if activeVendor}
      <div class="vendor-header">
        <h2 class="vendor-title">{activeVendor.name}</h2>
        <p class="vendor-desc">{activeVendor.description}</p>
      </div>

      {#if activeVendor.type === 'standard' && standardVendor}
        {#each standardVendor.categories as category}
          <section class="category-section">
            <h3 class="category-heading">{category.name}</h3>
            <div class="item-grid">
              {#each category.items as item}
                <ItemCard {item} vendorName={standardVendor.name} on:add={handleAdd} />
              {/each}
            </div>
          </section>
        {/each}
      {:else if procurementVendor}
        <ProcurementForm vendor={procurementVendor} {charName} />
      {/if}
    {/if}
  </main>

  <aside class="cart-col">
    <Cart {charName} />
  </aside>
</div>

<style>
  .shop-layout {
    display: grid;
    grid-template-columns: 220px 1fr 300px;
    grid-template-rows: 1fr;
    min-height: 100vh;
    gap: 0;
  }

  .vendor-nav-col {
    background: var(--color-bg-alt);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .nav-header {
    padding: 1.5rem 1rem 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .site-title {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    color: var(--color-gold);
    margin: 0;
    line-height: 1.3;
  }

  .main-col {
    padding: 1.5rem;
    overflow-y: auto;
    background: var(--color-bg);
  }

  .char-name-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
    padding: 0.75rem 1rem;
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: 4px;
  }

  .char-name-bar label {
    font-family: var(--font-heading);
    color: var(--color-gold);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  .char-name-bar input {
    flex: 1;
  }

  .vendor-header {
    margin-bottom: 1.5rem;
  }

  .vendor-title {
    font-family: var(--font-heading);
    font-size: 1.6rem;
    color: var(--color-gold);
    margin: 0 0 0.4rem;
  }

  .vendor-desc {
    color: var(--color-muted);
    font-style: italic;
    margin: 0;
    font-size: 0.95rem;
  }

  .category-section {
    margin-bottom: 2rem;
  }

  .category-heading {
    font-family: var(--font-heading);
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-dim);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.4rem;
    margin: 0 0 1rem;
  }

  .item-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  .cart-col {
    background: var(--color-bg-alt);
    border-left: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .shop-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }

    .vendor-nav-col,
    .cart-col {
      position: static;
      height: auto;
      border-right: none;
      border-left: none;
      border-bottom: 1px solid var(--color-border);
    }

    .cart-col {
      order: 4;
    }
  }
</style>
