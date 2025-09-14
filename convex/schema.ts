import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_order", ["order"]),

  channels: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    categoryId: v.id("categories"),
    streamUrl: v.string(),
    qualities: v.array(v.object({
      label: v.string(),
      url: v.string(),
      resolution: v.string(),
    })),
    isActive: v.boolean(),
    order: v.number(),
    language: v.optional(v.string()),
    country: v.optional(v.string()),
  }).index("by_category", ["categoryId"])
    .index("by_category_order", ["categoryId", "order"]),

  settings: defineTable({
    key: v.string(),
    value: v.union(v.string(), v.number(), v.boolean()),
    description: v.optional(v.string()),
  }).index("by_key", ["key"]),

  updates: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("info"), v.literal("warning"), v.literal("success")),
    isRead: v.boolean(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
