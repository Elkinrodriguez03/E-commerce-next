import { useEffect } from 'react';

interface UseDocumentTitleOptions {
  suffix?: string;
}

export function useDocumentTitle(title: string, options: UseDocumentTitleOptions = {}) {
  const { suffix = 'E-commerce' } = options;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${suffix}` : suffix;

    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
}

export default useDocumentTitle;
