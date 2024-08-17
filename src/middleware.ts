import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {

  const { userId } = auth();
  
  if (isProtectedRoute(req)) auth().protect();
  if (isAdminProtectedRoute(req)) {
    if (!userId) return auth().redirectToSignIn({ returnBackUrl: req.url });
    
    return checkAdminStatus(userId, req);
  }
  
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/connections(.*)',
  '/billing(.*)',
  '/workflows(.*)',
  '/api/clerk-webhook',
  '/api/drive-activity/notification',
  '/api/payment/success',
  '/api/auth/callback/discord',
  '/api/auth/callback/notion',
  '/api/auth/callback/slack',
  '/api/flow',
  '/api/cron/wait',
]);

const isAdminProtectedRoute = createRouteMatcher([
  '/admin(.*)',
])

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

async function checkAdminStatus(userId: string, req: Request) {
  try {
    const baseUrl = `https://${req.headers.get('host')}`;
    const apiUrl = new URL(`/api/admin?userId=${userId}`, baseUrl);
    
    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
    });

    if (response.status !== 200) {
      console.error("Error fetching admin status:", response.statusText);
      return NextResponse.redirect(new URL("/adinsignin", baseUrl));
    }

    const m = await response.json();
    console.log(m)
    const { isAdmin } = await response.json();
    if (!isAdmin) {
      console.log("User is not an admin");
      return NextResponse.redirect(new URL("/adinsignin", baseUrl));
    }

    return NextResponse.redirect(new URL("/admin", baseUrl));

  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.redirect(new URL("/adinsignin", `https://${req.headers.get('host')}`));
  }
}