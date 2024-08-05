"use server";

import { Connections, Notion, User } from "@/lib/database/schema";
import { currentUser } from "@clerk/nextjs/server";
import { Client } from "@notionhq/client";

export const onNotionConnect = async (
  access_token: string,
  workspace_id: string,
  workspace_icon: string,
  workspace_name: string,
  database_id: string,
  _id: string,
) => {
  try {
    if (access_token) {
      // Check if Notion is already connected
      const notion_connected = await Notion.findOne(
        { accessToken: access_token },
        { projection: { "connections.type": 1 } }
      );

      if (!notion_connected) {
        // Create a new connection
        const newConnection = await Connections.create({
          userId: _id,
          type: 'Notion',
          notionId : notion_connected._id
        });

        // Create a new Notion entry
        await Notion.create({
          userId: _id,
          workspaceIcon: workspace_icon,
          accessToken: access_token,
          workspaceId: workspace_id,
          workspaceName: workspace_name,
          databaseId: database_id,
          connections: [newConnection._id],
        });

        // Update the User document with the new connection
        await User.findOneAndUpdate(
          { clerkId: _id },
          { $push: { connections: newConnection._id.toString() } },
          { new: true, useFindAndModify: false }
        );
      }
    }
  } catch (error) {
    console.error("Error in onNotionConnect:", error);
    // Handle error, e.g., log it, notify user, or rethrow it
  }
};

export const getNotionConnection = async () => {
  try {
    const user = await currentUser();
    if (user) {
      const connection = await Notion.findOne({
        userId: user.id,
      });

      return connection ? connection.toObject() : null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Notion connection:", error);
    return null;
  }
};

export const getNotionDatabase = async (
  databaseId: string,
  accessToken: string
) => {
  const notion = new Client({
    auth: accessToken,
  });
  const response = await notion.databases.retrieve({ database_id: databaseId });
  return response;
};

export const onCreateNewPageInDatabase = async (
  databaseId: string,
  accessToken: string,
  content: string
) => {
  const notion = new Client({
    auth: accessToken,
  });

  console.log(databaseId);
  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: databaseId,
    },
    properties: {
      name: [
        {
          text: {
            content: content,
          },
        },
      ],
    },
  });
  if (response) {
    return response;
  }
};
