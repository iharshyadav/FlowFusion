"use server"

import { connectToDB } from "./database/db"
import { User } from "./database/schema"

export const removeProfileImage = async (findUser : string | undefined) => {
    connectToDB();
    const users = await User.findOneAndUpdate(
    { clerkId: findUser },
    { profileImage : ''},
    {new : true}
   )

   return users;
 }