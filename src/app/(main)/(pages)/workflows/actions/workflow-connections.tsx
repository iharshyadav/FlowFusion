"use server";

import { Option } from "@/components/ui/multiple-selector";
import { Connections, Workflows } from "@/lib/database/schema";
import { currentUser } from "@clerk/nextjs/server";

export const onGetNodesEdges = async (flowId: string) => {
  const nodesEdges = await Workflows.findOne({ _id: flowId }); // Selects only the nodes and edges fields

  if (nodesEdges && nodesEdges.nodes && nodesEdges.edges) {
    return {
      nodes: nodesEdges.nodes,
      edges: nodesEdges.edges,
    };
  }
};

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  if (type === "Discord") {
    const response = await Workflows.findByIdAndUpdate(
      workflowId,
      { discordTemplate: content },
      { new: true }
    );

    if (response) {
      return "Discord template saved";
    }
  }

  if (type === "Slack") {
    const response = await Workflows.findByIdAndUpdate(
      workflowId,
      {
        slackTemplate: content,
        slackAccessToken: accessToken,
      },
      { new: true }
    );

    if (response) {
      const channelList = await Workflows.findById(workflowId);

      if (channelList) {
        // Remove duplicates before insert
        const NonDuplicated = channelList.slackChannels.filter(
          (channel: any) => channel !== channels![0].value
        );

        NonDuplicated!
          .map((channel:any) => channel)
          .forEach(async (channel:any) => {
            await Connections.updateOne(
              { _id: workflowId },
              { $push: { slackChannels: channel } }
            );
          });

        channels!
          .map((channel) => channel.value)
          .forEach(async (channel) => {
            await Connections.updateOne(
              { _id: workflowId },
              { $push: { slackChannels: channel } }
            );
          });

        return "Slack template saved";
      }
    }
  }

  if (type === "Notion") {
    const response = await Workflows.findByIdAndUpdate(
      workflowId,
      {
        notionTemplate: content,
        notionAccessToken: accessToken,
        notionDbId: notionDbId,
      },
      { new: true }
    );

    if (response) return "Notion template saved";
  }
};

export const onGetWorkflows = async () => {
  try {

    const user = await currentUser();

    if (user) {
      const workflows = await Workflows.find({ userId: user.id });
      if (workflows) return workflows;
    }
  } catch (error) {
    console.error('Error fetching workflows:', error);
  }
}

export const onCreateWorkflow = async (name: string, description: string) => {
  try {

    const user = await currentUser();

    if (user) {
      // Create new workflow
      const result = await Workflows.create({
        userId: user.id,
        name,
        description,
      });

      if (result.ok) return { message: 'workflow created' };
      return { message: 'Oops! try again' };
    }
  } catch (error) {
    console.error('Error creating workflow:', error);
    return { message: 'Oops! try again' };
  }
};