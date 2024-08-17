"use client"

import AdminForm from '@/components/forms/admin-form'
import OtpForm from '@/components/forms/otp-form'
import { FC, useState } from 'react'

interface pageProps {
  
}

const SignIn: FC<pageProps> = ({}) => {

  const [loading, setloading] = useState(false)
  
  return (
    <div className="flex items-center justify-center h-screen w-full">
      {
        loading ? <OtpForm /> : <AdminForm setloading={setloading}/>
      }
    </div>
  );
}

export default SignIn