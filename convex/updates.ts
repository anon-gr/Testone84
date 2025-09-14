import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listUpdates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("updates")
      .order("desc")
      .take(10);
  },
});

export const createUpdate = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("info"), v.literal("warning"), v.literal("success")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    return await ctx.db.insert("updates", {
      ...args,
      isRead: false,
    });
  },
});

export const markUpdateAsRead = mutation({
  args: { updateId: v.id("updates") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.updateId, { isRead: true });
  },
});
