<script lang="ts">
  import { vendors } from '$lib/stores/vendors';
  import VendorNav from '$lib/components/VendorNav.svelte';
  import ItemCard from '$lib/components/ItemCard.svelte';
  import Cart from '$lib/components/Cart.svelte';
  import ProcurementForm from '$lib/components/ProcurementForm.svelte';
  import ShopkeeperPortrait from '$lib/components/ShopkeeperPortrait.svelte';
  import AdminPanel from '$lib/components/admin/AdminPanel.svelte';
  import { addToCart, cart, cartTotal } from '$lib/stores/cart';
  import type { StandardVendor, ProcurementVendor, ShopItem } from '$lib/types';

  let activeVendorId: string = $vendors[0]?.id ?? '';
  let charName: string = '';
  let adminOpen = false;
  let cartOpen = false;

  // Keep activeVendorId valid when the vendors list changes (e.g. admin deletes active vendor)
  $: {
    if ($vendors.length > 0 && !$vendors.find((v) => v.id === activeVendorId)) {
      activeVendorId = $vendors[0].id;
    }
  }

  $: activeVendor = $vendors.find((v) => v.id === activeVendorId) ?? $vendors[0];
  $: standardVendor = activeVendor?.type === 'standard' ? (activeVendor as StandardVendor) : null;
  $: procurementVendor = activeVendor?.type === 'procurement' ? (activeVendor as ProcurementVendor) : null;

  $: vendorPrimary = activeVendor?.theme?.primaryColor ?? 'var(--color-gold)';
  $: vendorSecondary = activeVendor?.theme?.secondaryColor ?? 'var(--color-bg-alt)';

  $: cartCount = $cart.reduce((sum, ci) => sum + ci.qty, 0);
  $: cartTotalDisplay = Number.isInteger($cartTotal)
    ? $cartTotal
    : $cartTotal.toFixed(2);

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

<div
  class="shop-layout"
  style="--vendor-primary: {vendorPrimary}; --vendor-secondary: {vendorSecondary}"
>
  <aside class="vendor-nav-col">
    <div class="nav-header">
      <h1 class="site-title">The Merchant Quarter</h1>
    </div>
    <VendorNav vendors={$vendors} {activeVendorId} on:select={handleSelect} />
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

  <aside class="portrait-col">
    {#if activeVendor}
      <ShopkeeperPortrait vendor={activeVendor} />
    {/if}
  </aside>
</div>

<!-- Cart FAB -->
<button
  class="cart-fab"
  class:has-items={cartCount > 0}
  on:click={() => (cartOpen = true)}
  aria-label="Open cart"
>
  <span class="cart-fab-label">Satchel</span>
  {#if cartCount > 0}
    <span class="cart-fab-badge">{cartCount}</span>
    <span class="cart-fab-total">{cartTotalDisplay} gp</span>
  {/if}
</button>

{#if cartOpen}
  <Cart {charName} onClose={() => (cartOpen = false)} />
{/if}

{#if import.meta.env.DEV}
  <button class="admin-fab" on:click={() => (adminOpen = true)} title="Open Admin Panel">
    ⚙ Admin
  </button>
  {#if adminOpen}
    <AdminPanel onClose={() => (adminOpen = false)} />
  {/if}
{/if}

<style>
  .shop-layout {
    display: grid;
    grid-template-columns: 220px 1fr 260px;
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
    color: var(--vendor-primary);
    margin: 0 0 0.4rem;
    transition: color 400ms ease;
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
    color: var(--vendor-primary);
    border-bottom: 1px solid color-mix(in srgb, var(--vendor-primary) 35%, var(--color-border) 65%);
    padding-bottom: 0.4rem;
    margin: 0 0 1rem;
    transition: color 400ms ease, border-color 400ms ease;
  }

  .item-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  .portrait-col {
    border-left: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    background: var(--vendor-secondary);
    transition: background 400ms ease;
  }

  /* Cart FAB */
  .cart-fab {
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 200;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: 99px;
    cursor: pointer;
    font-family: var(--font-heading);
    font-size: 0.85rem;
    color: var(--color-text-dim);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    transition:
      background var(--transition),
      border-color var(--transition),
      color var(--transition),
      box-shadow var(--transition);
  }

  .cart-fab:hover {
    background: var(--color-bg-hover);
    color: var(--color-text);
  }

  .cart-fab.has-items {
    border-color: var(--color-gold-dim);
    color: var(--color-text);
  }

  .cart-fab.has-items:hover {
    border-color: var(--color-gold);
    box-shadow: 0 2px 20px rgba(201, 168, 76, 0.2);
  }

  .cart-fab-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .cart-fab-badge {
    background: var(--color-gold);
    color: var(--color-bg);
    font-size: 0.7rem;
    font-weight: 700;
    border-radius: 99px;
    padding: 0.05rem 0.45rem;
    line-height: 1.5;
  }

  .cart-fab-total {
    color: var(--color-gold);
    font-size: 0.85rem;
  }

  /* Admin FAB — only rendered in DEV builds */
  .admin-fab {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    z-index: 200;
    background: var(--color-bg-alt);
    color: var(--color-text-dim);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.35rem 0.7rem;
    font-size: 0.78rem;
    cursor: pointer;
    opacity: 0.55;
    transition: opacity var(--transition), background var(--transition);
  }

  .admin-fab:hover {
    opacity: 1;
    background: var(--color-bg-hover);
    color: var(--color-text);
  }

  /* Responsive */
  @media (max-width: 860px) {
    .shop-layout {
      grid-template-columns: 180px 1fr;
    }

    .portrait-col {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .shop-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }

    .vendor-nav-col {
      position: static;
      height: auto;
      border-right: none;
      border-bottom: 1px solid var(--color-border);
    }

    .cart-fab {
      bottom: 1rem;
      right: 1rem;
    }
  }
</style>
