import ProfileForm from '@/components/forms/profile-form'
import { FC } from 'react'
import ProfilPicture from './components/profile-picture'
import { currentUser } from '@clerk/nextjs/server'
import { removeProfileImage } from '@/lib/action'

interface pageProps {
  
}

const Settings: FC<pageProps> = async ({}) => {

  const user = await currentUser();

  // console.log(user)

  const findUser = user?.id;

  const removeProfilePhoto = await removeProfileImage(findUser)

  


  return (
    <div className="flex flex-col gap-4 ">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-base text-white/50">
            Add or update your information
          </p>
        </div>
        <ProfilPicture
          onDelete={removeProfilePhoto}
          userImage={''}
          onUpload={""}
        ></ProfilPicture>
        <ProfileForm />
      </div>
    </div>
  );
}

export default Settings