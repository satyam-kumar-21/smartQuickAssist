'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function TrailingSlashRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      pathname !== '/' &&
      !pathname.endsWith('/') &&
      !pathname.match(/\.[a-zA-Z0-9]{2,5}$/) // don't redirect files like .js, .css, .png
    ) {
      const search = window.location.search;
      const hash = window.location.hash;
      const newUrl = pathname + '/' + search + hash;
      router.replace(newUrl);
    }
  }, [pathname]);

  return null;
}
