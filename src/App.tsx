import React from 'react';
import FileInput from './lib/components/FileInput';
import useFileUrl from './lib/hooks/useFileUrl';
import SkinViewer from './lib/components/SkinViewer';

export default function App() {
  const [file, setFile] = React.useState<File | null>(null);
  const url = useFileUrl(file);

  return (
    <div className="h-screen grid grid-rows-[auto_1fr] p-2 gap-2">
      <FileInput value={file} onChange={setFile} />
      {url && <SkinViewer skin={url} />}
    </div>
  );
}
