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
        <Modal.CloseButton />
      </Modal.Header>
      
      <Modal.Body>
        <div className="text-text-base-500">
          {message}
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <div className="flex gap-2 justify-end">
          <Button 
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-error-500 hover:bg-error-600 text-text-contrast-200"
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};