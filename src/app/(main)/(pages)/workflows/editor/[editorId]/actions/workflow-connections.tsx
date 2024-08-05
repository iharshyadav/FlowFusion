'use server'

import { Workflows } from '@/lib/database/schema'
import { auth } from '@clerk/nextjs/server'

export const onCreateNodesEdges = async (
  flowId: string,
  nodes: string,
  edges: string,
  flowPath: string
) => {
  const result = await Workflows.updateOne(
    { _id: flowId },
    {
      $set: {
        nodes,
        edges,
        flowPath,
      },
    }
  )

  if (result.modifiedCount > 0) return { message: 'flow saved' }
  else return { message: 'no changes made' }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {

  const result = await Workflows.updateOne(
    { _id: workflowId },
    {
      $set: {
        published: state,
      },
    }
  )

  if (result.modifiedCount > 0) return { message: 'workflow published' }
  else return { message: 'workflow unpublished' }
}

export const getGoogleListener = async () => {
  const { userId } = auth()

  if (userId) {
    const listener = await Workflows.findOne(
      { clerkId: userId },
      'googleResourceId' 
    );

    if (listener) return listener
  }
}