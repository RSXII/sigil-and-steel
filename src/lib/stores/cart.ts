import { writable, derived } from "svelte/store";
import type { CartItem, ShopItem } from "$lib/types";

export const cart = writable<CartItem[]>([]);

export const cartTotal = derived(cart, ($cart) => {
  const multiplier = { gp: 1, sp: 0.1, cp: 0.01 };
  return $cart.reduce((sum, ci) => {
    return sum + ci.item.price * ci.qty * (multiplier[ci.item.unit] ?? 1);
  }, 0);
});

export function addToCart(item: ShopItem, vendorName: string) {
  cart.update((items) => {
    const existing = items.find((ci) => ci.item.id === item.id);
    if (existing) {
      return items.map((ci) =>
        ci.item.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci,
      );
    }
    return [...items, { item, vendorName, qty: 1 }];
  });
}

export function updateQty(itemId: string, delta: number) {
  cart.update((items) => {
    return items
      .map((ci) =>
        ci.item.id === itemId ? { ...ci, qty: ci.qty + delta } : ci,
      )
      .filter((ci) => ci.qty > 0);
  });
}

export function removeFromCart(itemId: string) {
  cart.update((items) => items.filter((ci) => ci.item.id !== itemId));
}

export function clearCart() {
  cart.set([]);
}
