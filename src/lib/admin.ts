"use server"

import { Otp, User } from "./database/schema";
import { connectToDB } from "./database/db";
import jwt from "jsonwebtoken"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const adminLogin = async (formData : FormData,userId : string,randomOtp : number) => {

    const email = formData.get("email");

    console.log(email)
    // const password = formData.get("password");
    connectToDB();
    const user = await User.findOne({email});

    if(user.clerkId != userId){
      throw new Error("User didn't match the same credentials as logged in User")
    }

    if(!user) {
        throw new Error("please sign Up")
    }

    console.log(userId , randomOtp)
    const saveOtp = await Otp.create({
      clerkId : userId,
      otp : randomOtp
    })
    
    console.log("first")
    return true;
}

export const checkAdmin = async ( userId : string, otp : string) => {
    console.log(userId)
    const user = await Otp.findOne({clerkId : userId});

    if(!user){
      throw new Error("Otp not send please try again")
    }

    if(user?.otp != otp){
       throw new Error("Opt didn't match")
    }
    
    // if(!user.isAdmin){
    //   throw new Error("not admin")
    // }

    const cookieOption = {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: true,
      httpOnly: true,
      secure: true,
    }

    const token = jwt.sign({clerkId : userId}, process.env.JWT_SECRET as string)

    const cookieManager = cookies();
    cookieManager.set("access-token", token, { ...cookieOption });

    // const plainUser = user.toObject();

    // const sanitizedUser = JSON.parse(JSON.stringify(plainUser));

    return {
      status : 200,
      message : "success"
    };
}

export const isAdmin = async (userId : string) => {
  return true
}