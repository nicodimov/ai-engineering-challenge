import type { Order, PriceBreakdown, Promotion } from "./types.js";

const TAX_RATE = 0.1;
const PREMIUM_FREE_STANDARD_SHIPPING_MINIMUM = 50;

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateSubtotal(order: Order): number {
  return roundMoney(
    order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
}

function calculateDiscount(
  subtotal: number,
  promotion?: Promotion,
): number {
  if (promotion?.type === "PERCENT") {
    return roundMoney(subtotal * (promotion.value / 100));
  }
  if (promotion?.type === "FIXED") {
    return Math.min(subtotal, roundMoney(promotion.value));
  }
  return 0;
}

function calculateShipping(
  order: Order,
  subtotal: number,
  discountedMerchandise: number,
): number {
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

  if (
    order.shippingMethod === "STANDARD" &&
    order.customerTier === "PREMIUM" &&
    discountedMerchandise >= PREMIUM_FREE_STANDARD_SHIPPING_MINIMUM
  ) {
    return 0;
  }
  return shipping;
}

export function priceOrder(order: Order, promotion?: Promotion): PriceBreakdown {
  const subtotal = calculateSubtotal(order);
  const discount = calculateDiscount(subtotal, promotion);
  const discountedMerchandise = Math.max(0, roundMoney(subtotal - discount));
  const shipping = calculateShipping(order, subtotal, discountedMerchandise);
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
