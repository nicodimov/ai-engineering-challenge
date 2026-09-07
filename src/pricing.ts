import type { Order, PriceBreakdown, Promotion, ShippingMethod } from "./types.js";

const TAX_RATE = 0.1;
const PREMIUM_FREE_STANDARD_SHIPPING_THRESHOLD = 50;

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateSubtotal(order: Order): number {
  return roundMoney(
    order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
}

function calculateDiscount(subtotal: number, promotion?: Promotion): number {
  if (promotion?.type === "PERCENT") {
    return roundMoney(subtotal * (promotion.value / 100));
  }

  if (promotion?.type === "FIXED") {
    return Math.min(subtotal, roundMoney(promotion.value));
  }

  return 0;
}

function calculateBaseShipping(
  method: ShippingMethod,
  merchandiseSubtotal: number,
): number {
  if (method === "STANDARD") {
    if (merchandiseSubtotal >= 75) {
      return 0;
    }
    if (merchandiseSubtotal >= 25) {
      return 5;
    }
    return 8;
  }

  if (merchandiseSubtotal >= 75) {
    return 12;
  }
  if (merchandiseSubtotal >= 25) {
    return 15;
  }
  return 18;
}

function qualifiesForPremiumFreeStandardShipping(
  order: Order,
  discountedMerchandise: number,
): boolean {
  return (
    order.customerTier === "PREMIUM" &&
    order.shippingMethod === "STANDARD" &&
    discountedMerchandise >= PREMIUM_FREE_STANDARD_SHIPPING_THRESHOLD
  );
}

export function priceOrder(order: Order, promotion?: Promotion): PriceBreakdown {
  const subtotal = calculateSubtotal(order);
  const discount = calculateDiscount(subtotal, promotion);
  const discountedMerchandise = Math.max(0, roundMoney(subtotal - discount));

  let shipping = calculateBaseShipping(order.shippingMethod, subtotal);
  if (qualifiesForPremiumFreeStandardShipping(order, discountedMerchandise)) {
    shipping = 0;
  }

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
