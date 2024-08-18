import { AreaChartComponent } from '@/components/charts/area-chart'
import { redis } from '@/lib/redis'
import { FC } from 'react'

interface AdminProps {
  
}

const Admin: FC<AdminProps> = async ({}) => {

  const servedRequest = await redis.get('served-request')

  return (
    <>
       <AreaChartComponent />
       <h1>{Number(servedRequest)}</h1>
    </>
  )
}

export default Admin