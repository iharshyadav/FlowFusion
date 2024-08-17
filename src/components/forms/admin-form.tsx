"use client"

import { adminLogin } from '@/lib/admin'
import { emailSend } from '@/lib/emails/nodemailer'
import { sendVerificationEmail } from '@/lib/emails/sendEmail'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from "sonner"

interface AdminFormProps {
  setloading : (loading: boolean) => void
}

const AdminForm: FC<AdminFormProps> = ({setloading}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {userId} = useAuth();

  // useEffect(() => {
  //   const fetch = async () => {
  //     await axios.get("/metrices")
  //     .then((res) => console.log(res));
  //   }
  //   fetch();
  // },[])

  const randomOtp:number = Math.ceil(Math.random() * 1000000);
  console.log(randomOtp);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData();
    formData.append('email', email);
    
    const userAuth = await adminLogin(formData,userId!,randomOtp);

    if(userAuth){
      await emailSend(email,randomOtp)
      toast("successfully email send");
      setloading(true)
    }else{
      toast("error login");
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg border w-96 bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="font-semibold tracking-tight text-2xl">Admin Login</h3>
          <p className="text-sm text-muted-foreground">
            Enter your email & password below for Admin Login
          </p>
        </div>
        <div className="p-6 pt-0 grid gap-4">
          <div className="grid gap-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* <div className="grid gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Password</label>
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="password"
          type="password"
          placeholder='******'
        />
      </div> */}
        </div>
        <div className="flex items-center p-6 pt-0">
          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            Admin Login
          </button>
        </div>
      </div>
    </form>
  );
}

export default AdminForm