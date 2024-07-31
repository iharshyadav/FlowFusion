import React from 'react'
import Sidebar from '@/components/sidebar'
import InfoBar from '@/components/infobar'
import { connectToDB } from '@/lib/database/db'

type Props = { children: React.ReactNode }

const Layout = async (props: Props) => {

  await connectToDB();
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full">
        <InfoBar /> 
        {props.children}
      </div>
    </div>
  )
}

export default Layout