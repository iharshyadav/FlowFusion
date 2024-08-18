"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner"
import { useAuth } from "@clerk/nextjs"
import { FC, useState } from "react"
import { checkAdmin } from "@/lib/admin"
import { useRouter } from "next/navigation"
import { Audio } from "react-loader-spinner"
 
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

interface otpFormProps {
  
}

const OtpForm: FC<otpFormProps> = ({}) => {

  const [loader, setLoader] = useState<boolean>(false)

    const router = useRouter();

    const {userId} = useAuth()

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        pin: "",
      },
    })
   
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoader(true)
    const response = await checkAdmin(userId!, data.pin);
    console.log(response);
    if(response.status === 200){
      toast( response.message as string)
      setLoader(false)
      router.push("/admin")
    }else{
      toast( response.message as string)
      setLoader(false)
      router.push("/adinsignin")
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loader}>
          {loader ? (
            <Audio
              height="30"
              width="30"
              radius="9"
              color="black"
              ariaLabel="loading"
              // @ts-ignore
              wrapperStyle
              // @ts-ignore
              wrapperClass
            />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default OtpForm