"use client"

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC } from 'react'



const UploadCareButtonNoSSR = dynamic(() => import('./uploadCare'), {
  ssr: false,
});


interface profilePictureProps {
    userImage: string | null
    onDelete?: any
    onUpload: any
}

const ProfilPicture: FC<profilePictureProps> = ({ userImage, onDelete, onUpload }: profilePictureProps) => {

 const router = useRouter()

  const onRemoveProfileImage = async () => {
    const response = await onDelete()
    if (response) {
      router.refresh()
    }
  }


  return (
    <div className="flex flex-col">
      <p className="text-lg text-white"> Profile Picture</p>
      <div className="flex h-[40vh] flex-col items-center justify-center">
      {userImage ? (
          <>
            <div className="relative h-full w-2/12">
              <Image
                src={userImage}
                alt="User_Image"
                fill
              />
            </div>
            <Button
              onClick={onRemoveProfileImage}
              className="bg-transparent text-white/70 hover:bg-transparent hover:text-white"
            >
              <X /> Remove Logo
            </Button>
          </>
        ) : (
          
          <UploadCareButtonNoSSR onUpload={onUpload} />
        )}
      </div>
    </div>
  )
}

export default ProfilPicture