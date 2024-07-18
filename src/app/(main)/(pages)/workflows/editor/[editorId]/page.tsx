import { ConnectionsProvider } from '@/providers/connections-provider'
import EditorProvider from '@/providers/editor-provider'
import { FC } from 'react'

interface pageProps {
  
}

const Page: FC<pageProps> = ({}) => {
  return (
    <div className="h-full">
      <EditorProvider>
        <ConnectionsProvider>
          {/* <EditorCanvas /> */}
         do later remember once i will come back........
        </ConnectionsProvider>
      </EditorProvider>
    </div>
  )
}

export default Page