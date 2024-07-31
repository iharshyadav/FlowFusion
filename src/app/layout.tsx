import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import ModelProvider from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowFusion",
  description: "Automate yourself",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ModelProvider>
              {children}
              <Toaster />
              </ModelProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
