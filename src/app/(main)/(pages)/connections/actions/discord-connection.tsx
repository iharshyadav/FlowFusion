'use server'

import { Connections, DiscordWebhook, User } from '@/lib/database/schema';
import { currentUser } from '@clerk/nextjs/server';
import axios from 'axios'

export const onDiscordConnect = async (
  channel_id: string,
  webhook_id: string,
  webhook_name: string,
  webhook_url: string,
  _id: string,
  guild_name: string,
  guild_id: string,
) => {
  if (webhook_id) {
    try {
      // Check if webhook exists
      let webhook = await DiscordWebhook.findOne(
        { userId: _id },
        { projection: { connections: 1 } }
      );

      console.log("Webhook found:", webhook);

      if (!webhook) {
        // Create new webhook
        webhook = await DiscordWebhook.create({
          userId: _id,
          webhookId: webhook_id,
          channelId: channel_id,
          guildId: guild_id,
          name: webhook_name,
          url: webhook_url,
          guildName: guild_name,
        });

        console.log("Created new webhook:", webhook);

        const newConnection = await Connections.create({
          userId: _id,
          type: 'DiscordWebhook',
          notionId: webhook._id
        });

        console.log("Created new connection:", newConnection);

        await DiscordWebhook.findOneAndUpdate(
          { userId: _id },
          { $push: { connections: [newConnection._id] } },
          { new: true, useFindAndModify: false }
        );

        await User.findOneAndUpdate(
          { clerkId: _id },
          { $push: { connections: newConnection._id.toString() } },
          { new: true, useFindAndModify: false }
        );
      }

      // Check for webhook by channel
      const webhook_channel = await DiscordWebhook.findOne(
        { channelId: channel_id },
        'connections.type'
      );

      console.log("Webhook channel found:", webhook_channel);

      // If no webhook for channel, create new webhook
      if (!webhook_channel) {
        await DiscordWebhook.create({
          userId: _id,
          webhookId: webhook_id,
          channelId: channel_id,
          guildId: guild_id,
          name: webhook_name,
          url: webhook_url,
          guildName: guild_name,
          connections: [
            {
              userId: _id,
              type: 'Discord',
            },
          ],
        });

        console.log("Created new webhook for channel:", channel_id);
      }
    } catch (error) {
      console.error("Error in onDiscordConnect:", error);
    }
  }
};




export const getDiscordConnectionUrl = async () => {
  try {
    const user = await currentUser();
    if (user) {
      const webhook = await DiscordWebhook.findOne({
        userId: user.id, 
      }).select('url name guildName');

      return webhook ? webhook.toObject() : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Discord connection URL:', error);
    return null; 
  }
}

export const postContentToWebHook = async (content: string, url: string) => {
  console.log(content)
  if (content != '') {
    const posted = await axios.post(url, { content })
    if (posted) {
      return { message: 'success' }
    }
    return { message: 'failed request' }
  }
  return { message: 'String empty' }
}