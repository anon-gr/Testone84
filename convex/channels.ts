import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listChannels = query({
  args: { categoryId: v.optional(v.id("categories")) },
  handler: async (ctx, args) => {
    if (args.categoryId) {
      const categoryId = args.categoryId;
      const channels = await ctx.db
        .query("channels")
        .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
      
      return channels.sort((a, b) => a.order - b.order);
    } else {
      const channels = await ctx.db
        .query("channels")
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
      
      return channels.sort((a, b) => a.order - b.order);
    }
  },
});

export const getChannel = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.channelId);
  },
});

export const createChannel = mutation({
  args: {
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
    language: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const channelsCount = await ctx.db
      .query("channels")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();

    return await ctx.db.insert("channels", {
      ...args,
      isActive: true,
      order: channelsCount.length,
    });
  },
});

export const updateChannel = mutation({
  args: {
    channelId: v.id("channels"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    streamUrl: v.optional(v.string()),
    qualities: v.optional(v.array(v.object({
      label: v.string(),
      url: v.string(),
      resolution: v.string(),
    }))),
    isActive: v.optional(v.boolean()),
    language: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const { channelId, ...updates } = args;
    return await ctx.db.patch(channelId, updates);
  },
});

export const deleteChannel = mutation({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    return await ctx.db.delete(args.channelId);
  },
});
