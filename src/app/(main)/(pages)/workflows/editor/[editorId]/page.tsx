import { ConnectionsProvider } from '@/providers/connections-provider'
import EditorProvider from '@/providers/editor-provider'
import { FC } from 'react'
import EditorCanvas from './components/editor-canvas'

interface pageProps {
  
}

const Page: FC<pageProps> = ({}) => {
  return (
    <div className="h-screen">
      <EditorProvider>
        <ConnectionsProvider>
          <EditorCanvas />
        </ConnectionsProvider>
      </EditorProvider>
    </div>
  )
}

export default Page