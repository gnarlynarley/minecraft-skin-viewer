import React from 'react';

export default function useFileUrl(file: File | null) {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file === null) return;
    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  return url;
}
