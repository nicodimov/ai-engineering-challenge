import type { Order, PriceBreakdown, Promotion } from "./types.js";

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

function merchandiseDiscount(subtotal: number, promotion?: Promotion): number {
  if (promotion?.type === "PERCENT") {
    return roundMoney(subtotal * (promotion.value / 100));
  }
  if (promotion?.type === "FIXED") {
    return Math.min(subtotal, roundMoney(promotion.value));
  }
  return 0;
}

function baseShippingFee(order: Order, merchandiseSubtotal: number): number {
  if (order.shippingMethod === "STANDARD") {
    if (merchandiseSubtotal >= 75) return 0;
    if (merchandiseSubtotal >= 25) return 5;
    return 8;
  }
  if (merchandiseSubtotal >= 75) return 12;
  if (merchandiseSubtotal >= 25) return 15;
  return 18;
}

function qualifiesForPremiumFreeStandardShipping(
  order: Order,
  merchandiseAfterPromotions: number,
): boolean {
  return (
    order.customerTier === "PREMIUM" &&
    order.shippingMethod === "STANDARD" &&
    merchandiseAfterPromotions >= PREMIUM_FREE_STANDARD_SHIPPING_THRESHOLD
  );
}

export function priceOrder(order: Order, promotion?: Promotion): PriceBreakdown {
  const subtotal = calculateSubtotal(order);
  const discount = merchandiseDiscount(subtotal, promotion);
  const discountedMerchandise = Math.max(0, roundMoney(subtotal - discount));
  const shipping = qualifiesForPremiumFreeStandardShipping(order, discountedMerchandise)
    ? 0
    : baseShippingFee(order, subtotal);
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
