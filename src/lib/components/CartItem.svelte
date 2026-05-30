<script lang="ts">
  import type { CartItem as CartItemType } from '$lib/types';
  import { updateQty, removeFromCart } from '$lib/stores/cart';

  export let cartItem: CartItemType;
</script>

<div class="cart-item">
  <div class="cart-item__info">
    <span class="cart-item__name">{cartItem.item.name}</span>
    <span class="cart-item__vendor">{cartItem.vendorName}</span>
  </div>

  <div class="cart-item__controls">
    <button
      class="qty-btn"
      aria-label="Decrease quantity"
      on:click={() => updateQty(cartItem.item.id, -1)}
    >−</button>
    <span class="qty-display">{cartItem.qty}</span>
    <button
      class="qty-btn"
      aria-label="Increase quantity"
      on:click={() => updateQty(cartItem.item.id, 1)}
    >+</button>
  </div>

  <div class="cart-item__price">
    {cartItem.item.price * cartItem.qty} {cartItem.item.unit}
  </div>

  <button
    class="remove-btn"
    aria-label="Remove item"
    on:click={() => removeFromCart(cartItem.item.id)}
  >×</button>
</div>

<style>
  .cart-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.85rem;
  }

  .cart-item__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .cart-item__name {
    color: var(--color-text);
    font-weight: 500;
  }

  .cart-item__vendor {
    font-size: 0.72rem;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .cart-item__controls {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .qty-btn {
    width: 24px;
    height: 24px;
    padding: 0;
    background: var(--color-surface-hover);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text);
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
  }

  .qty-btn:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
  }

  .qty-display {
    min-width: 1.5rem;
    text-align: center;
    color: var(--color-text);
  }

  .cart-item__price {
    min-width: 4rem;
    text-align: right;
    color: var(--color-text);
    font-weight: 500;
  }

  .remove-btn {
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 4px;
  }

  .remove-btn:hover {
    color: var(--color-danger);
  }
</style>
