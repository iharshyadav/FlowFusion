"use server"

import { Workflows } from "@/lib/database/schema";


export const onGetNodesEdges = async (flowId: string) => {
    
    const nodesEdges = await Workflows.findOne({ _id: flowId }); // Selects only the nodes and edges fields
    
    if (nodesEdges && nodesEdges.nodes && nodesEdges.edges) {
      return {
        nodes: nodesEdges.nodes,
        edges: nodesEdges.edges,
      };
    }
  }