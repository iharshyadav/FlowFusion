import React from 'react'
import Workflows from './workflows'
import { onGetWorkflows } from '../actions/workflow-connections'
type Props = {}

const Workflow = async (props: Props) => {

  const workflowsFromDb = await onGetWorkflows();

  const workflows = workflowsFromDb?.map(flow => ({
    id: flow._id.toString(), 
    name: flow.name,
    description: flow.description,
    publish: flow.publish
  }))

  // console.log(workflows)
  
  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col m-2">
        {workflows?.length ? (
          workflows.map((flow) => (
            <Workflows
              key={flow.id}
              {...flow}
            />
          ))
        ) : (
          <div className="mt-28 flex text-muted-foreground items-center justify-center">
            No Workflows
          </div>
        )}
      </section>
    </div>
  )
}

export default Workflow