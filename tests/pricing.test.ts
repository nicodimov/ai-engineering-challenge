import { describe, expect, it } from "vitest";
import { calculateSubtotal, priceOrder } from "../src/pricing.js";
import type { Order } from "../src/types.js";

const baseOrder: Order = {
  customerTier: "STANDARD",
  shippingMethod: "STANDARD",
  items: [{ sku: "keyboard", unitPrice: 30, quantity: 1 }],
};

function orderWith(overrides: Partial<Order> & { unitPrice?: number }): Order {
  const { unitPrice, items, ...rest } = overrides;
  return {
    ...baseOrder,
    ...rest,
    items: items ?? [{ sku: "keyboard", unitPrice: unitPrice ?? 30, quantity: 1 }],
  };
}

describe("pricing", () => {
  it("calculates a merchandise subtotal", () => {
    expect(
      calculateSubtotal({
        ...baseOrder,
        items: [
          { sku: "keyboard", unitPrice: 30, quantity: 1 },
          { sku: "mouse", unitPrice: 12.5, quantity: 2 },
        ],
      }),
    ).toBe(55);
  });

  it("charges standard shipping based on merchandise subtotal", () => {
    expect(priceOrder(baseOrder)).toEqual({
      subtotal: 30,
      discount: 0,
      shipping: 5,
      tax: 3,
      total: 38,
    });
  });

  it("caps a fixed promotion at the merchandise subtotal", () => {
    expect(priceOrder(baseOrder, { type: "FIXED", value: 100 })).toEqual({
      subtotal: 30,
      discount: 30,
      shipping: 5,
      tax: 0,
      total: 5,
    });
  });

  it("charges express shipping independently from standard shipping", () => {
    expect(
      priceOrder({ ...baseOrder, shippingMethod: "EXPRESS" }),
    ).toMatchObject({ shipping: 15 });
  });

  describe("percentage promotions", () => {
    it("applies a percentage discount to merchandise only", () => {
      expect(priceOrder(baseOrder, { type: "PERCENT", value: 20 })).toEqual({
        subtotal: 30,
        discount: 6,
        shipping: 5,
        tax: 2.4,
        total: 31.4,
      });
    });

    it("still charges shipping when merchandise is fully discounted", () => {
      expect(priceOrder(baseOrder, { type: "PERCENT", value: 100 })).toEqual({
        subtotal: 30,
        discount: 30,
        shipping: 5,
        tax: 0,
        total: 5,
      });
    });
  });

  describe("premium standard shipping", () => {
    it("gives free standard shipping at a $50 post-promotion subtotal", () => {
      expect(priceOrder(orderWith({ customerTier: "PREMIUM", unitPrice: 50 }))).toEqual({
        subtotal: 50,
        discount: 0,
        shipping: 0,
        tax: 5,
        total: 55,
      });
    });

    it("does not waive shipping just below the $50 threshold", () => {
      expect(
        priceOrder(orderWith({ customerTier: "PREMIUM", unitPrice: 49.99 })),
      ).toMatchObject({ shipping: 5 });
    });

    it("evaluates the $50 threshold after a promotion is applied", () => {
      const premiumCart = orderWith({ customerTier: "PREMIUM", unitPrice: 60 });

      expect(priceOrder(premiumCart, { type: "FIXED", value: 15 })).toMatchObject({
        discount: 15,
        shipping: 5,
      });
      expect(priceOrder(premiumCart, { type: "FIXED", value: 5 })).toEqual({
        subtotal: 60,
        discount: 5,
        shipping: 0,
        tax: 5.5,
        total: 60.5,
      });
    });

    it("never makes express shipping free for premium customers", () => {
      expect(
        priceOrder(
          orderWith({
            customerTier: "PREMIUM",
            shippingMethod: "EXPRESS",
            unitPrice: 50,
          }),
        ),
      ).toMatchObject({ shipping: 15 });
    });

    it("does not change standard-customer shipping at $50", () => {
      expect(priceOrder(orderWith({ unitPrice: 50 }))).toMatchObject({
        shipping: 5,
      });
    });
  });

  describe("shipping rate table", () => {
    it("charges $8 for standard shipping below $25", () => {
      expect(priceOrder(orderWith({ unitPrice: 20 }))).toMatchObject({
        shipping: 8,
      });
    });

    it("waives standard shipping at a $75 pre-promotion subtotal", () => {
      expect(priceOrder(orderWith({ unitPrice: 75 }))).toMatchObject({
        shipping: 0,
      });
    });

    it("charges $18 for express shipping below $25", () => {
      expect(
        priceOrder(orderWith({ shippingMethod: "EXPRESS", unitPrice: 20 })),
      ).toMatchObject({ shipping: 18 });
    });

    it("charges $12 for express shipping at $75", () => {
      expect(
        priceOrder(orderWith({ shippingMethod: "EXPRESS", unitPrice: 75 })),
      ).toMatchObject({ shipping: 12 });
    });
  });
});
