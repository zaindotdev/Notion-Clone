"use server";
import { db } from "@/db";
import { workspaces, pages, collaborators, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

// Workspace CRUD
export const createWorkspace = async ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) => {
  try {
    return await db
      .insert(workspaces)
      .values({
        id: crypto.randomUUID(),
        name,
        user_id: userId,
      })
      .returning();
  } catch (error) {
    console.error("Error creating workspace:", error);
    throw error;
  }
};

export const getWorkspaceById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching workspace:", error);
    throw error;
  }
};

export const getAllWorkspaces = async (userId: string) => {
  try {
    if (userId) {
      return await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.user_id, userId));
    }
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw error;
  }
};

export const updateWorkspace = async (id: string, name: string) => {
  try {
    return await db
      .update(workspaces)
      .set({ name })
      .where(eq(workspaces.id, id))
      .returning();
  } catch (error) {
    console.error("Error updating workspace:", error);
    throw error;
  }
};

export const deleteWorkspace = async (id: string) => {
  try {
    return await db.delete(workspaces).where(eq(workspaces.id, id));
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  }
};

// Pages CRUD
export const createPage = async ({
  title,
  content,
  workspaceId,
  inTrash,
}: {
  title: string;
  content: string;
  workspaceId: string;
  inTrash: string;
}) => {
  try {
    return await db
      .insert(pages)
      .values({
        id: crypto.randomUUID(),
        title,
        content,
        workspace_id: workspaceId,
        in_trash: inTrash,
      })
      .returning();
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
};

export const getPages = async () => {
  try {
    return await db.select().from(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
};

export const getPageById = async (id: string) => {
  try {
    const result = await db.select().from(pages).where(eq(pages.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching page:", error);
    throw error;
  }
};

export const deletePage = async (id: string) => {
  try {
    return await db.delete(pages).where(eq(pages.id, id));
  } catch (error) {
    console.error("Error deleting page:", error);
    throw error;
  }
};

export const updatePage = async (
  id: string,
  title?: string,
  content?: string
) => {
  try {
    const updates: Partial<{ title: string; content: string }> = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;

    if (Object.keys(updates).length === 0) {
      throw new Error("No values to set");
    }

    return await db
      .update(pages)
      .set(updates)
      .where(eq(pages.id, id))
      .returning();
  } catch (error) {
    console.error("Error updating page:", error);
    throw error;
  }
};

export const getPagesByWorkspaceId = async (workspaceId: string) => {
  try {
    return await db
      .select()
      .from(pages)
      .where(eq(pages.workspace_id, workspaceId));
  } catch (error) {
    console.error("Error fetching pages for workspace:", error);
    throw error;
  }
};

// Collaborator CRUD
const ROLE_ENUM = {
  OWNER: "owner",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

type RoleType = (typeof ROLE_ENUM)[keyof typeof ROLE_ENUM];

export const getCollaborators = async () => {
  try {
    return await db.select().from(collaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    throw error;
  }
};

export const addCollaborators = async ({
  userId,
  workspaceId,
  role,
}: {
  userId: string;
  workspaceId: string;
  role: RoleType;
}) => {
  try {
    return await db
      .insert(collaborators)
      .values({
        id: crypto.randomUUID(),
        user_id: userId,
        workspace_id: workspaceId,
        role,
      })
      .returning();
  } catch (error) {
    console.error("Error adding collaborator:", error);
    throw error;
  }
};

export const getCollaboratorsByWorkspaceId = async (workspaceId: string) => {
  try {
    return await db
      .select()
      .from(collaborators)
      .where(eq(collaborators.workspace_id, workspaceId));
  } catch (error) {
    console.error("Error fetching collaborators for workspace:", error);
    throw error;
  }
};

export const removeCollaborator = async (id: string) => {
  try {
    return await db.delete(collaborators).where(eq(collaborators.id, id));
  } catch (error) {
    console.error("Error removing collaborator:", error);
    throw error;
  }
};

export const getCollaboratorById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(collaborators)
      .where(eq(collaborators.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching collaborator:", error);
    throw error;
  }
};

// Subscription CRUD
const STATUS_ENUM = {
  ACTIVE: "active",
  CANCELED: "canceled",
  TRIAL: "trial",
} as const;

type StatusType = (typeof STATUS_ENUM)[keyof typeof STATUS_ENUM];

export const createSubscription = async ({
  userId,
  status,
}: {
  userId: string;
  status: StatusType;
}) => {
  try {
    return await db
      .insert(subscriptions)
      .values({
        id: crypto.randomUUID(),
        status,
        user_id: userId,
      })
      .returning();
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

export const getSubscriptionByUserId = async (userId: string) => {
  try {
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.user_id, userId));
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    throw error;
  }
};

export const deleteSubscription = async (id: string) => {
  try {
    return await db.delete(subscriptions).where(eq(subscriptions.id, id));
  } catch (error) {
    console.error("Error deleting subscription:", error);
    throw error;
  }
};
