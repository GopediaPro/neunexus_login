export const createProgressSimulator = (
  fileIds: string[],
  setFiles: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const interval = setInterval(() => {
    setFiles(prev => prev.map(f => 
      fileIds.includes(f.id) && f.status === 'uploading'
        ? { ...f, progress: Math.min((f.progress || 0) + Math.random() * 15, 95) }
        : f
    ));
  }, 300);

  return interval;
};