import { CheckCircle, XCircle } from 'lucide-react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'success' | 'error';
  title?: string;
  message: string;
}

export function AlertModal({ open, onOpenChange, type, title, message }: AlertModalProps) {
  const { t } = useLanguage();

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            {type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-primary" />
            ) : (
              <XCircle className="h-6 w-6 text-destructive" />
            )}
            <ModalTitle>{title || (type === 'success' ? t('success') : t('error'))}</ModalTitle>
          </div>
        </ModalHeader>
        <div className="py-4">
          <p className="text-muted-foreground">{message}</p>
        </div>
        <ModalFooter>
          <Button onClick={() => onOpenChange(false)} className="hover-gradient">
            {t('close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}