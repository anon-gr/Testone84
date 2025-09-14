import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_order")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return categories;
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const categoriesCount = await ctx.db.query("categories").collect();

    return await ctx.db.insert("categories", {
      ...args,
      order: categoriesCount.length,
      isActive: true,
    });
  },
});

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const { categoryId, ...updates } = args;
    return await ctx.db.patch(categoryId, updates);
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Check if category has channels
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();

    if (channels.length > 0) {
      throw new Error("Cannot delete category with channels");
    }

    return await ctx.db.delete(args.categoryId);
  },
});
