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
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@clerk/nextjs"
import { FC } from "react"
import { checkAdmin } from "@/lib/admin"
import { useRouter } from "next/navigation"
 
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

interface otpFormProps {
  
}

const OtpForm: FC<otpFormProps> = ({}) => {

    const router = useRouter();

    const {userId} = useAuth()

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        pin: "",
      },
    })
   
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await checkAdmin(userId!, data.pin);
    console.log(response);
    // return response;
    if(response.status === 200){
      toast({
        title: "logged in successfully",
       
      })
      router.push("/admin")
    }else{
      router.push("/adinsignin")
    }
  }

    // const handleSubmit = async () => {
    //   const response = await checkAdmin(userId!,otp);
    //   console.log(response);
    //   return response;
    // }


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

      <Button type="submit">Submit</Button>
    </form>
  </Form>
  );
}

export default OtpForm