import { Modal, Button } from 'rsuite';

import type { PaymentStatus } from './PaymentModal';

interface PaymentResultModalProps {
  open: boolean;
  status: PaymentStatus;
  orderId: number | string;
  amount: number;
  cardMask: string;
  datetime?: string;
  onClose: () => void;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

export const PaymentResultModal: React.FC<PaymentResultModalProps> = ({
  open,
  status,
  orderId,
  amount,
  cardMask,
  datetime,
  onClose,
  onPrimary,
  onSecondary,
}) => {
  const isSuccess = status === 'success';
  return (
    <Modal open={open} onClose={onClose} className="PaymentModal" size="sm">
      <Modal.Header>
        <Modal.Title>{isSuccess ? 'Оплата успешна!' : 'Ошибка оплаты'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="PaymentModal__result">
          <div className="PaymentModal__result-row">
            <span>Заказ #{orderId}</span>
            <span>{isSuccess ? 'Оплачен' : 'Не удалось оплатить'}</span>
          </div>
          <div className="PaymentModal__result-row">
            <span>Карта</span>
            <span>{cardMask}</span>
          </div>
          <div className="PaymentModal__result-row">
            <span>Сумма</span>
            <span>{amount.toLocaleString('ru-RU')} ₽</span>
          </div>
          {datetime && (
            <div className="PaymentModal__result-row">
              <span>Дата и время</span>
              <span>{datetime}</span>
            </div>
          )}
        </div>
        {isSuccess ? (
          <div className="PaymentModal__hint PaymentModal__hint--success">
            <div className="PaymentModal__hint-title">Что дальше?</div>
            <div className="PaymentModal__hint-text">
              Мастер получил ваш заказ и свяжется с вами в течение 30 минут. Следите в разделе «Мои
              заказы».
            </div>
          </div>
        ) : (
          <div className="PaymentModal__hint PaymentModal__hint--error">
            <div className="PaymentModal__hint-title">Возможные причины</div>
            <ul>
              <li>Недостаточно средств на карте</li>
              <li>Карта заблокирована банком</li>
              <li>Неверно введены данные</li>
              <li>Превышен лимит операций</li>
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="subtle" onClick={onClose}>
          {isSuccess ? 'Закрыть' : 'Отмена'}
        </Button>
        {isSuccess ? (
          <>
            <Button appearance="ghost" onClick={onSecondary}>
              Мои заказы
            </Button>
            <Button appearance="primary" onClick={onPrimary}>
              Написать мастеру
            </Button>
          </>
        ) : (
          <Button appearance="primary" onClick={onPrimary}>
            Попробовать снова
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
