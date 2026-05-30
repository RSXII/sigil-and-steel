<script lang="ts">
  import type { ShopItem } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  export let item: ShopItem;
  export let vendorName: string;

  const dispatch = createEventDispatcher<{ add: { item: ShopItem; vendorName: string } }>();

  let flashing = false;

  function handleAdd() {
    dispatch('add', { item, vendorName });
    flashing = true;
    setTimeout(() => (flashing = false), 300);
  }
</script>

<button class="item-card" class:flash={flashing} on:click={handleAdd}>
  <div class="item-card__name">{item.name}</div>
  <div class="item-card__desc">{item.description}</div>
  <div class="item-card__footer">
    <span class="item-card__price">{item.price} {item.unit}</span>
    <span class="item-card__hint">Tap to add</span>
  </div>
</button>

<style>
  .item-card {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.85rem 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    font-family: var(--font-body);
    cursor: pointer;
    text-align: left;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }

  .item-card:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-gold);
    transform: translateY(-1px);
  }

  .item-card.flash {
    background: var(--color-gold-dim);
    border-color: var(--color-gold);
  }

  .item-card__name {
    font-family: var(--font-heading);
    font-size: 1rem;
    color: var(--color-gold);
  }

  .item-card__desc {
    font-size: 0.82rem;
    color: var(--color-text-muted);
    line-height: 1.4;
  }

  .item-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  .item-card__price {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .item-card__hint {
    font-size: 0.72rem;
    color: var(--color-text-muted);
    font-style: italic;
  }
</style>
