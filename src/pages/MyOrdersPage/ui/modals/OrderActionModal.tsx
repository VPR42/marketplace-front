import { Button, Modal } from 'rsuite';

import './order-action-modal.scss';
import type { ActionType, OrderActionModalProps } from '@/pages/MyOrdersPage/types';

const getCopy = (
  type: ActionType,
  role: 'customer' | 'worker',
): {
  title: string;
  description: string;
  confirm: string;
  tone: 'start' | 'complete' | 'complete-worker' | 'cancel';
} => {
  if (type === 'start') {
    return {
      title: 'Начать выполнение заказа',
      description: 'Подтвердите, что готовы приступить. Клиент получит уведомление.',
      confirm: 'Начать',
      tone: 'start',
    };
  }

  if (type === 'complete') {
    if (role === 'worker') {
      return {
        title: 'Завершить работу',
        description: 'Подтвердите, что работы завершены. Клиент проверит результат.',
        confirm: 'Завершить принудительно',
        tone: 'complete-worker',
      };
    }
    return {
      title: 'Подтвердить завершение',
      description: 'Убедитесь, что работы выполнены. После подтверждения заказ закроется.',
      confirm: 'Завершить заказ',
      tone: 'complete',
    };
  }

  return {
    title: 'Отменить заказ',
    description:
      role === 'worker'
        ? 'Подтвердите отмену. Клиент получит уведомление.'
        : 'Подтвердите отмену заказа.',
    confirm: 'Отменить заказ',
    tone: 'cancel',
  };
};

export const OrderActionModal: React.FC<OrderActionModalProps> = ({
  open,
  type,
  role = 'customer',
  onClose,
  onConfirm,
}) => {
  const { title, description, confirm, tone } = getCopy(type, role);

  const handleSubmit = () => onConfirm();

  return (
    <Modal open={open} onClose={onClose} className="OrderActionModal" size="sm">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="OrderActionModal__desc">{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="subtle" onClick={onClose}>
          Отмена
        </Button>
        <Button
          appearance="primary"
          className={`OrderActionModal__btn OrderActionModal__btn--${tone}`}
          onClick={handleSubmit}
        >
          {confirm}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
