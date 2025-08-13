import React from 'react';
import LiveReloadFileInput from './LiveReloadFileInput';

type Props = {
  value: File | null;
  onChange: (value: Props['value']) => void;
};

export default function FileInput({ value, onChange }: Props) {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const file = ev.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  if (typeof window.showOpenFilePicker !== 'undefined') {
    return <LiveReloadFileInput value={value} onChange={onChange} />;
  }

  return <input type="file" onChange={handleOnChange} accept="image/png" />;
}
