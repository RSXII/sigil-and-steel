<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cart, cartTotal, clearCart } from '$lib/stores/cart';
  import { showToast } from '$lib/stores/toast';
  import { postPurchase } from '$lib/discord';
  import CartItem from './CartItem.svelte';

  export let charName: string = '';
  export let onClose: () => void;

  let submitting = false;

  $: canSubmit = $cart.length > 0 && charName.trim().length > 0 && !submitting;

  async function handlePurchase() {
    if (!canSubmit) return;
    submitting = true;
    try {
      await postPurchase(charName, $cart);
      clearCart();
      showToast('Purchase sent to the Merchant Quarter!', 'success');
      onClose();
    } catch {
      showToast('Failed to submit purchase. Try again.', 'error');
    } finally {
      submitting = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="modal-backdrop" on:click|self={onClose} role="presentation">
  <div
    class="cart-modal"
    role="dialog"
    aria-modal="true"
    aria-label="Cart"
    transition:fly={{ y: 40, duration: 220 }}
  >
    <header class="modal-header">
      <h2 class="modal-title">Your Satchel</h2>
      <button class="close-btn" on:click={onClose} aria-label="Close cart">✕</button>
    </header>

    <div class="modal-body">
      {#if $cart.length === 0}
        <p class="cart-empty">Your satchel is empty.</p>
      {:else}
        <ul class="cart-list">
          {#each $cart as cartItem (cartItem.item.id)}
            <CartItem {cartItem} />
          {/each}
        </ul>
      {/if}
    </div>

    {#if $cart.length > 0}
      <div class="modal-total">
        <span>Total</span>
        <span class="total-amount">
          {Number.isInteger($cartTotal) ? $cartTotal : $cartTotal.toFixed(2)} gp
        </span>
      </div>
    {/if}

    <footer class="modal-footer">
      {#if !charName.trim()}
        <p class="char-warning">Enter your character name to check out.</p>
      {/if}
      <button class="btn-primary btn-purchase" disabled={!canSubmit} on:click={handlePurchase}>
        {submitting ? 'Sending…' : 'Complete Purchase'}
      </button>
    </footer>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 300;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 1rem;
  }

  .cart-modal {
    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    width: 100%;
    max-width: 400px;
    max-height: calc(100vh - 5rem);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem 0.875rem;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .modal-title {
    font-family: var(--font-heading);
    font-size: 1.15rem;
    color: var(--color-gold);
    margin: 0;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--color-muted);
    font-size: 1rem;
    cursor: pointer;
    padding: 0.25rem 0.4rem;
    border-radius: 4px;
    line-height: 1;
  }

  .close-btn:hover {
    color: var(--color-text);
    background: var(--color-bg-hover);
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem 1.25rem;
  }

  .cart-empty {
    color: var(--color-muted);
    font-style: italic;
    font-size: 0.9rem;
    padding: 0.5rem 0;
  }

  .cart-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .modal-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--color-border);
    font-family: var(--font-heading);
    font-size: 1rem;
    flex-shrink: 0;
  }

  .total-amount {
    color: var(--color-gold);
    font-size: 1.1rem;
  }

  .modal-footer {
    padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex-shrink: 0;
  }

  .char-warning {
    font-size: 0.8rem;
    color: var(--color-muted);
    font-style: italic;
    margin: 0;
  }

  .btn-purchase {
    width: 100%;
    padding: 0.65rem 1rem;
    font-size: 0.95rem;
  }

  @media (max-width: 500px) {
    .modal-backdrop {
      align-items: flex-end;
      justify-content: stretch;
      padding: 0;
    }

    .cart-modal {
      max-width: 100%;
      border-radius: 12px 12px 0 0;
      max-height: 85vh;
    }
  }
</style>
