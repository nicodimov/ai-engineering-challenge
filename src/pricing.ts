import type { Order, PriceBreakdown, Promotion } from "./types.js";

const TAX_RATE = 0.1;

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateSubtotal(order: Order): number {
  return roundMoney(
    order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
}

export function priceOrder(order: Order, promotion?: Promotion): PriceBreakdown {
  const subtotal = calculateSubtotal(order);

  let shipping = 0;
  if (order.shippingMethod === "STANDARD") {
    if (subtotal >= 75) {
      shipping = 0;
    } else if (subtotal >= 25) {
      shipping = 5;
    } else {
      shipping = 8;
    }
  } else {
    if (subtotal >= 75) {
      shipping = 12;
    } else if (subtotal >= 25) {
      shipping = 15;
    } else {
      shipping = 18;
    }
  }

  let discount = 0;
  if (promotion?.type === "PERCENT") {
    // Known issue: percentage promotions are currently affecting shipping too.
    discount = roundMoney((subtotal + shipping) * (promotion.value / 100));
  } else if (promotion?.type === "FIXED") {
    discount = Math.min(subtotal, roundMoney(promotion.value));
  }

  const discountedMerchandise = Math.max(0, roundMoney(subtotal - discount));
  const tax = roundMoney(discountedMerchandise * TAX_RATE);
  const total = roundMoney(discountedMerchandise + shipping + tax);

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
}
