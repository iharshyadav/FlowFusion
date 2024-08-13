"use server"

import VerificationEmail from "../emails/emailTemplate";
import { resend } from "../resend";

export async function sendVerificationEmail(
  email: string,
  verifyCode: number
){
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'harshkumar2213007@akgec.ac.in',
      subject: 'Admin Access Verification Code',
      react: VerificationEmail({ email, otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}