"use server"

import { User } from "@/lib/database/schema";

export const getUserData = async (id: string) => {
    try {
      const user_info = await User.findOne({ clerkId: id })
        .populate('connections') 
        .exec();
  
      return user_info ? user_info.toObject() : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null; 
    }
  }