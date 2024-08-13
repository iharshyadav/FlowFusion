"use client"

import { useRouter } from 'next/navigation';
import { FC, useEffect, useState, useTransition } from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"  


interface otpFormProps {
  
}

const OtpForm: FC<otpFormProps> = ({}) => {

    const router = useRouter();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);
  
    const [isPending, startTransition] = useTransition();
  
    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (resendCountdown > 0) {
        timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      }
      return () => clearTimeout(timer);
    }, [resendCountdown]);


  return (
    <div>
      <h1 className='w-full mb-8 text-xl font-semibold'>Otp sent to email. verify to continue.</h1>
      <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}

export default OtpForm