import { Modal } from '../Modal';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false
}: ConfirmDeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title className="flex items-center gap-2">
          <Icon name="alert" ariaLabel="alert" style="w-5 h-5 text-error-500" />
          {title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="text-text-base-500">
          {message}
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-2 border-stroke-base-200 text-text-base-500"
          >
            취소
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-error-400 hover:bg-error-500 text-text-contrast-500"
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};