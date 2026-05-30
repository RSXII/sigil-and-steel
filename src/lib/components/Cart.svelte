<script lang="ts">
  import { cart, cartTotal, clearCart } from '$lib/stores/cart';
  import { showToast } from '$lib/stores/toast';
  import { postPurchase } from '$lib/discord';
  import CartItem from './CartItem.svelte';

  export let charName: string = '';

  let submitting = false;

  $: canSubmit = $cart.length > 0 && charName.trim().length > 0 && !submitting;

  async function handlePurchase() {
    if (!canSubmit) return;
    submitting = true;
    try {
      await postPurchase(charName, $cart);
      clearCart();
      showToast('Purchase sent to the Merchant Quarter!', 'success');
    } catch (err) {
      showToast('Failed to submit purchase. Try again.', 'error');
    } finally {
      submitting = false;
    }
  }
</script>

<aside class="cart">
  <h2 class="cart-title">Cart</h2>

  {#if $cart.length === 0}
    <p class="cart-empty">Your satchel is empty.</p>
  {:else}
    <ul class="cart-list">
      {#each $cart as cartItem (cartItem.item.id)}
        <CartItem {cartItem} />
      {/each}
    </ul>

    <div class="cart-total">
      <span>Total</span>
      <span>
        {Number.isInteger($cartTotal) ? $cartTotal : $cartTotal.toFixed(2)} gp
      </span>
    </div>
  {/if}

  <button
    class="btn-purchase"
    disabled={!canSubmit}
    on:click={handlePurchase}
  >
    {submitting ? 'Sending…' : 'Complete Purchase'}
  </button>
</aside>

<style>
  .cart {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    min-height: 200px;
  }

  .cart-title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--color-gold);
    margin: 0;
  }

  .cart-empty {
    color: var(--color-muted);
    font-style: italic;
    font-size: 0.9rem;
  }

  .cart-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .cart-total {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-heading);
    font-size: 1rem;
    color: var(--color-gold);
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-sm);
  }

  .btn-purchase {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: var(--color-gold);
    color: var(--color-bg);
    font-family: var(--font-heading);
    font-size: 1rem;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-purchase:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-purchase:not(:disabled):hover {
    opacity: 0.85;
  }
</style>
