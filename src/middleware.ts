import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import cookie from 'cookie';

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();
  const url = new URL(req.url);

  if (isProtectedRoute(req)) {
    auth().protect();
  }
  const { isAdmin } = await checkAdminStatus(userId!, req);
  
  if (isAdmin && url.pathname === '/adinsignin') {
    return NextResponse.redirect(new URL("/admin", url.origin));
  }

  if (isAdminProtectedRoute(req)) {
    if (!userId) {
      // console.log("User is not signed in, redirecting to sign-in.");
      return auth().redirectToSignIn({ returnBackUrl: req.url });
    }


    if (url.pathname.startsWith("/admin")) {
      if (!isAdmin) {
        // console.log("User is not an admin, redirecting to /adinsignin.");
        return NextResponse.redirect(new URL("/adinsignin", url.origin));
      }
      // console.log("User is admin, no need to redirect.");
      return NextResponse.next();
    }
    if (!isAdmin) {
      // console.log("User is not an admin, redirecting to /adinsignin.");
      return NextResponse.redirect(new URL("/adinsignin", url.origin));
    }
  }

  return NextResponse.next();
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
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies['access-token'];

    const apiUrl = new URL(`/api/admin?userId=${userId}`, baseUrl);

    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      // console.error("Error fetching admin status:", response.statusText);
      return { isAdmin: false };
    }

    const data = await response.json();

    // console.log("Admin check response:", data);

    return { isAdmin: data.isAdmin };

  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false }; 
  }
}