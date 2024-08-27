// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { webUrl } from '../shared/constants';

// export function middleware(req: NextRequest) {
//   // Exclude the sign-in page from protection
//   const excludedPaths = [webUrl.signIn]; // Adjust this if the sign-in page is at a different path
//   const currentPath = req.nextUrl.pathname;

//   // If the current path is the sign-in page, skip the auth check
//   if (excludedPaths.includes(currentPath)) {
//     return NextResponse.next();
//   }

//   // Check if the user is authenticated by looking for the cookie
//   const isAuthenticated = req.cookies.get('isAuthenticated');

//   if (!isAuthenticated) {
//     // Redirect to the sign-in page if the user is not authenticated
//     const signInUrl = new URL(webUrl.signIn, req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   // Continue to the requested page if the user is authenticated
//   return NextResponse.next();
// }

// // Specify the routes that should be protected by this middleware
// export const config = {
//   matcher: [
//     '/dashboard/:path*', // Protect all routes under /dashboard
//     // Add other protected routes here if necessary
//   ],
// };
"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === "true";
    setIsAuthenticated(auth);

    if (!auth) {
      router.push('/user_master'); // Redirect to sign-in if not authenticated
    }
  }, [router]);

  return isAuthenticated;
};

export default useAuth;
