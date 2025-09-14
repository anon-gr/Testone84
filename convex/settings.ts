import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    const settingsMap: Record<string, any> = {};
    
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });
    
    return settingsMap;
  },
});

export const updateSetting = mutation({
  args: {
    key: v.string(),
    value: v.union(v.string(), v.number(), v.boolean()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        value: args.value,
        description: args.description,
      });
    } else {
      return await ctx.db.insert("settings", args);
    }
  },
});
