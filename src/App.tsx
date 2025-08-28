import useFileUrl from './lib/hooks/useFileUrl';
import SkinViewer from './lib/components/SkinViewer';
import useFile from './lib/hooks/useFile';

export default function App() {
  const { file, getFile, fileSystemEnabled } = useFile('minecraft-skin');
  const url = useFileUrl(file);
  let buttonLabel = 'Select file';

  if (file) {
    buttonLabel = `Opened ${file.name}`;
  }

  if (fileSystemEnabled) {
    buttonLabel += ` (with live reload)`;
  }

  return (
    <>
      <div className="h-screen grid grid-rows-[auto_1fr] p-2 gap-2">
        <button onClick={getFile}>{buttonLabel}</button>
        {url && <SkinViewer skin={url} />}
      </div>
    </>
  );
}
