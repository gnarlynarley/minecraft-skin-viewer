import React from 'react';
import usePersistedState from './usePersistedState';

const FILE_SYSTEM_SUPPORTED = typeof window.showOpenFilePicker !== 'undefined';

export default function useFile(key: string) {
  const [file, setFile] = usePersistedState<File | null>(`${key}-file`);
  const [fileHandler, setFileHandler] =
    usePersistedState<FileSystemFileHandle | null>(`${key}-file-handler`);

  React.useEffect(() => {
    if (!FILE_SYSTEM_SUPPORTED) return;
    if (fileHandler === null) return;

    const id = setInterval(async () => {
      try {
        fileHandler.requestPermission({ mode: 'read' });
        const nextFile = await fileHandler.getFile();
        if (file?.lastModified !== nextFile.lastModified) {
          setFile(nextFile);
        }
      } catch {
        setFileHandler(null);
        setFile(null);
      }
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [fileHandler, file?.lastModified]);

  const getFile = async () => {
    if (FILE_SYSTEM_SUPPORTED) {
      const [handler] = await window.showOpenFilePicker({
        types: [{ accept: { 'image/*': ['.png', '.jpg', '.gif'] } }],
      });
      setFileHandler(handler);
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png';
      input.addEventListener('change', () => {
        console.log('changed', input.files);
        const [nextFile] = input.files ?? [];
        if (nextFile) {
          setFile(nextFile);
        }
        input.remove();
      });
      input.click();
    }
  };

  return {
    file,
    getFile,
    fileSystemEnabled: FILE_SYSTEM_SUPPORTED,
  };
}
