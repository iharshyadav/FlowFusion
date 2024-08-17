import { AreaChartComponent } from '@/components/charts/area-chart'
import { FC } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

interface AdminProps {
  
}

const Admin: FC<AdminProps> = ({}) => {

  // const { sessionClaims } = auth()
 
//  if (sessionClaims?.metadata.role !== 'admin') {
//    redirect('/')
//  }

  return (
    <>
       <AreaChartComponent />
    </>
  )
}

export default Admin