import React from 'react';

type Props = {
  value: File | null;
  onChange: (value: Props['value']) => void;
};

export default function LiveReloadFileInput({ value, onChange }: Props) {
  const [fileHandler, setFileHandler] =
    React.useState<FileSystemFileHandle | null>(null);

  React.useEffect(() => {
    if (fileHandler === null) return;

    const id = setInterval(async () => {
      const nextFile = await fileHandler.getFile();
      if (value?.lastModified !== nextFile.lastModified) {
        onChange(nextFile);
      }
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [fileHandler, onChange, value?.lastModified]);

  const handleClick = async () => {
    const [handler] = await window.showOpenFilePicker({
      types: [{ accept: { 'image/*': ['.png', '.jpg', '.gif'] } }],
    });
    setFileHandler(handler);
  };

  return (
    <button type="button" onClick={handleClick}>
      Choose file
    </button>
  );
}
