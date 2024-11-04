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
