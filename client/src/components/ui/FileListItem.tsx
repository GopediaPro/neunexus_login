import { Icon } from "./Icon";

interface FileListItemProps {
  file: {
    id: string;
    name: string;
    size: number;
    status: 'waiting' | 'uploading' | 'completed' | 'error';
    progress?: number;
    uploadTime?: string;
  };
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onRemove: () => void;
  isUploading: boolean;
  formatFileSize: (size: number) => string;
}

export const FileListItem = ({
  file,
  isSelected,
  onSelect,
  onRemove,
  isUploading,
  formatFileSize
}: FileListItemProps) => {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'uploading':
        return <Icon name="loading" style="w-4 h-4 text-primary-500 animate-spin" />;
      case 'completed':
        return <Icon name="check" style="w-4 h-4 text-primary-500" />;
      case 'error':
        return <Icon name="alert" style="w-4 h-4 text-rose-500" />;
      default:
        return <Icon name="document" style="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (file.status) {
      case 'uploading':
        return 'Processing...';
      case 'completed':
        return file.uploadTime;
      case 'error':
        return 'Processing failed';
      default:
        return 'Waiting...';
    }
  };

  return (
    <div className="border border-stroke-base-100 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 rounded border-stroke-base-300 cursor-pointer"
            disabled={isUploading}
          />
          <div className="w-12 h-12 bg-accent-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="document" style="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-body-l text-text-base-700">
                {file.name}
              </p>
              {getStatusIcon()}
            </div>
            <div className="flex items-center gap-4 text-body-s text-text-base-500">
              <span>{getStatusText()}</span>
              <span>{formatFileSize(file.size)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onRemove}
          disabled={file.status === 'uploading'}
          className={`${
            file.status === 'uploading' 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-100'
          } p-1 rounded`}
        >
          <Icon name="close" style="w-6 h-6 text-text-base-500" />
        </button>
      </div>
          
      {file.status === 'uploading' && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-text-base-500 mb-1">
            <span>처리 중...</span>
            <span>{Math.round(file.progress || 0)}%</span>
          </div>
          <div className="w-full bg-stroke-base-100 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${file.progress || 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};