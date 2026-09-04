import { describe, expect, it } from "vitest";
import { calculateSubtotal, priceOrder } from "../src/pricing.js";
import type { Order } from "../src/types.js";

const baseOrder: Order = {
  customerTier: "STANDARD",
  shippingMethod: "STANDARD",
  items: [{ sku: "keyboard", unitPrice: 30, quantity: 1 }],
};

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

  it("applies percentage promotions to merchandise only with standard shipping", () => {
    expect(priceOrder(baseOrder, { type: "PERCENT", value: 10 })).toEqual({
      subtotal: 30,
      discount: 3,
      shipping: 5,
      tax: 2.7,
      total: 34.7,
    });
  });

  it("applies percentage promotions to merchandise only with express shipping", () => {
    expect(
      priceOrder(
        { ...baseOrder, shippingMethod: "EXPRESS" },
        { type: "PERCENT", value: 10 },
      ),
    ).toEqual({
      subtotal: 30,
      discount: 3,
      shipping: 15,
      tax: 2.7,
      total: 44.7,
    });
  });

  it("gives premium customers free standard shipping above the post-promotion threshold", () => {
    expect(
      priceOrder(
        {
          ...baseOrder,
          customerTier: "PREMIUM",
          items: [{ sku: "keyboard", unitPrice: 60, quantity: 1 }],
        },
        { type: "PERCENT", value: 10 },
      ),
    ).toEqual({
      subtotal: 60,
      discount: 6,
      shipping: 0,
      tax: 5.4,
      total: 59.4,
    });
  });

  it("charges premium customers standard shipping below the post-promotion threshold", () => {
    expect(
      priceOrder(
        {
          ...baseOrder,
          customerTier: "PREMIUM",
          items: [{ sku: "keyboard", unitPrice: 60, quantity: 1 }],
        },
        { type: "PERCENT", value: 20 },
      ),
    ).toEqual({
      subtotal: 60,
      discount: 12,
      shipping: 5,
      tax: 4.8,
      total: 57.8,
    });
  });

  it("gives premium customers free standard shipping at the post-promotion threshold", () => {
    expect(
      priceOrder(
        {
          ...baseOrder,
          customerTier: "PREMIUM",
          items: [{ sku: "keyboard", unitPrice: 60, quantity: 1 }],
        },
        { type: "FIXED", value: 10 },
      ),
    ).toMatchObject({ shipping: 0 });
  });

  it("does not give premium customers free express shipping", () => {
    expect(
      priceOrder({
        ...baseOrder,
        customerTier: "PREMIUM",
        shippingMethod: "EXPRESS",
        items: [{ sku: "keyboard", unitPrice: 60, quantity: 1 }],
      }),
    ).toMatchObject({ shipping: 15 });
  });

  it("keeps standard customer shipping unchanged above the premium threshold", () => {
    expect(
      priceOrder({
        ...baseOrder,
        items: [{ sku: "keyboard", unitPrice: 60, quantity: 1 }],
      }),
    ).toMatchObject({ shipping: 5 });
  });

  it("preserves existing free standard shipping when a promotion drops premium merchandise below $50", () => {
    expect(
      priceOrder(
        {
          ...baseOrder,
          customerTier: "PREMIUM",
          items: [{ sku: "keyboard", unitPrice: 80, quantity: 1 }],
        },
        { type: "PERCENT", value: 50 },
      ),
    ).toMatchObject({ shipping: 0 });
  });
});
