"use server"

import { Option } from "@/components/ui/multiple-selector";
import { Connections, Slack, User } from "@/lib/database/schema";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";

export const onSlackConnect = async (
  app_id: string,
  authed_user_id: string,
  authed_user_token: string,
  slack_access_token: string,
  bot_user_id: string,
  team_id: string,
  team_name: string,
  user_id: string
): Promise<void> => {
  if (!slack_access_token) return;

  try {
    // Check if a Slack connection already exists
    let slackConnection = await Slack.findOne({ slackAccessToken: slack_access_token },{ projection: { connections: 1 } });

    // console.log(slackConnection)

    if (!slackConnection) {
      // Create a new Slack document
      slackConnection = await Slack.create({
        userId: user_id,
        appId: app_id,
        authedUserId: authed_user_id,
        authedUserToken: authed_user_token,
        slackAccessToken: slack_access_token,
        botUserId: bot_user_id,
        teamId: team_id,
        teamName: team_name,
      });
      
      // Create a new Connections document
      const connection = await Connections.create({
        userId: user_id,
        type: 'Slack',
        slackId: slackConnection._id,
      });

      await Slack.findOneAndUpdate(
        {userId: user_id},
        {$push : {connections: [connection._id]}},
        { new: true, useFindAndModify: false }
      )

      // Update the User's connections field
      await User.findOneAndUpdate(
        { clerkId: user_id },
        { $push: { connections: connection._id.toString() } },
        { new: true, useFindAndModify: false }
      );

    }
  } catch (error) {
    console.error('Error in onSlackConnect:', error);
  }
};

export const getSlackConnection = async () => {
  try {
    const user = await currentUser();
    if (user) {
      const connection = await Slack.findOne({
        userId: user.id,
      });

      return connection ? connection.toObject() : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Slack connection:', error);
    return null; 
  }
}

export async function listBotChannels(
  slackAccessToken: string
): Promise<Option[]> {
  const url = `https://slack.com/api/conversations.list?${new URLSearchParams({
    types: 'public_channel,private_channel',
    limit: '200',
  })}`

  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${slackAccessToken}` },
    })

    console.log(data)

    if (!data.ok) throw new Error(data.error)

    if (!data?.channels?.length) return []

    return data.channels
      .filter((ch: any) => ch.is_member)
      .map((ch: any) => {
        return { label: ch.name, value: ch.id }
      })
  } catch (error: any) {
    console.error('Error listing bot channels:', error.message)
    throw error
  }
}

const postMessageInSlackChannel = async (
  slackAccessToken: string,
  slackChannel: string,
  content: string
): Promise<void> => {
  try {
    await axios.post(
      'https://slack.com/api/chat.postMessage',
      { channel: slackChannel, text: content },
      {
        headers: {
          Authorization: `Bearer ${slackAccessToken}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    )
    console.log(`Message posted successfully to channel ID: ${slackChannel}`)
  } catch (error: any) {
    console.error(
      `Error posting message to Slack channel ${slackChannel}:`,
      error?.response?.data || error.message
    )
  }
}

export const postMessageToSlack = async (
  slackAccessToken: string,
  selectedSlackChannels: Option[],
  content: string
): Promise<{ message: string }> => {
  if (!content) return { message: 'Content is empty' }
  if (!selectedSlackChannels?.length) return { message: 'Channel not selected' }

  try {
    selectedSlackChannels
      .map((channel) => channel?.value)
      .forEach((channel) => {
        postMessageInSlackChannel(slackAccessToken, channel, content)
      })
  } catch (error) {
    return { message: 'Message could not be sent to Slack' }
  }

  return { message: 'Success' }
}
