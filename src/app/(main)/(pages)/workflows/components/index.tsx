import React from 'react'
import Workflows from './workflows'
type Props = {}

const Workflow = async (props: Props) => {

  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col m-2 gap-4">
        <Workflows
        description='Creating a test workflow'
        id='wefhyweigf7773839'
        name='Automation Workflow'
        publish={false}
        />
        <Workflows
        description='Creating a test workflow'
        id='wefhyweigf7773839'
        name='Automation Workflow'
        publish={false}
        />
        <Workflows
        description='Creating a test workflow'
        id='wefhyweigf7773839'
        name='Automation Workflow'
        publish={false}
        />
        <Workflows
        description='Creating a test workflow'
        id='wefhyweigf7773839'
        name='Automation Workflow'
        publish={false}
        />
        <Workflows
        description='Creating a test workflow'
        id='wefhyweigf7773839'
        name='Automation Workflow'
        publish={false}
        />
      </section>
    </div>
  )
}

export default Workflow