import ProfileForm from '@/components/forms/profile-form'
import { FC } from 'react'
import ProfilPicture from './components/profile-picture'
import { currentUser } from '@clerk/nextjs/server'
import { removeProfileImage } from '@/lib/action'
import { User } from '@/lib/database/schema'
import { connectToDB } from '@/lib/database/db'

interface pageProps {
  
}

const Settings: FC<pageProps> = async ({}) => {

  connectToDB();

  const user = await currentUser();

  // console.log(user)

  if(!user) return null;

  const findUser = user?.id;

  const userImage = await User.findOne({
    clerkId: findUser 
  })


   const removeProfileImage = async () => {
    "use server"
    // connectToDB();
    const users = await User.findOneAndUpdate(
      { clerkId: findUser },
      { profileImage : ''},
      {new : true}
    ).lean();

   return users;
 }

  const uploadProfileImage = async (image: string) => {
    'use server'
     
    const updateUser = await User.findOneAndUpdate(
      {clerkId : findUser},
      {profileImage : image},
      {new : true}
    ).lean();

    return updateUser;

  }

  const updateUserInfo = async (name: string) => {
    'use server'
    const updateUser = await User.findOneAndUpdate(
      { clerkId: findUser },
      { name },
      {new : true}
    ).lean();

    return updateUser
}


  return (
    <div className="flex flex-col gap-4">
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
          onDelete={removeProfileImage}
          userImage={userImage?.profileImage || ''}
          onUpload={uploadProfileImage}
        ></ProfilPicture>
        <ProfileForm
        info={userImage}
        onUpdate={updateUserInfo}
        />
      </div>
    </div>
  );
}

export default Settings