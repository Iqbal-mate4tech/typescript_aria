

"use client";

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

// Custom hook to handle authentication
const useAuth = (): boolean => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check authentication status and handle redirection
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === "true";

      setIsAuthenticated(auth);

      if (!auth) {
        router.push('/user_master'); // Redirect to sign-in if not authenticated
      }
    };

    checkAuth();
  }, [router]);

  return isAuthenticated;
};

export default useAuth;


