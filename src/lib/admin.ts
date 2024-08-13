"use server"

import { User } from "./database/schema";
import { connectToDB } from "./database/db";
import jwt from "jsonwebtoken"

export const adminLogin = async (formData : FormData) => {

    const email = formData.get("email");

    console.log(email)
    // const password = formData.get("password");
    connectToDB();
    const user = await User.findOne({email});

    if(!user) {
        throw new Error("please sign Up")
    }

    if(!user.isAdmin){
        throw new Error("please log in as admin")
    }

    const token = jwt.sign("user", "your_secret_key_here")

    return true;
}

export const checkAdmin = async (id:any) => {
    console.log(id)
    const user = await User.findOne({id})
      if(user.isAdmin){
        throw new Error("not admin")
      }

      return user
}

