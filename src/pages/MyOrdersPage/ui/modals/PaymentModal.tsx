import { useState } from 'react';
import { Modal, Button, Radio, RadioGroup } from 'rsuite';

import './payment-modals.scss';

export type PaymentStatus = 'success' | 'error';

interface PaymentMethod {
  id: string;
  brand: string;
  masked: string;
  expire: string;
}

export interface PaymentModalProps {
  open: boolean;
  title: string;
  serviceTitle: string;
  price: number;
  fee?: number;
  methods: PaymentMethod[];
  onClose: () => void;
  onConfirm: (methodId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  title,
  serviceTitle,
  price,
  fee = 0,
  methods,
  onClose,
  onConfirm,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(methods[0]?.id ?? '');

  const total = price + fee;

  return (
    <Modal open={open} onClose={onClose} className="PaymentModal" size="sm">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="PaymentModal__summary">
          <div className="PaymentModal__summary-title">{serviceTitle}</div>
          <div className="PaymentModal__summary-row">
            <span>Устранение протечки</span>
            <span>{price.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="PaymentModal__summary-row">
            <span>Комиссия сервиса</span>
            <span>{fee.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="PaymentModal__summary-row PaymentModal__summary-row--total">
            <span>Итого</span>
            <span>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <div className="PaymentModal__methods">
          <div className="PaymentModal__label">Способ оплаты</div>
          <RadioGroup value={selectedMethod} onChange={(val) => setSelectedMethod(String(val))}>
            {methods.map((method) => (
              <Radio value={method.id} key={method.id} className="PaymentModal__card">
                <div className="PaymentModal__card-brand">{method.brand}</div>
                <div className="PaymentModal__card-mask">{method.masked}</div>
                <div className="PaymentModal__card-expire">Срок: {method.expire}</div>
              </Radio>
            ))}
          </RadioGroup>
        </div>

        <div className="PaymentModal__info">
          <span role="img" aria-label="lock">
            🔒
          </span>
          Деньги будут переведены мастеру после выполнения работы
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="subtle" onClick={onClose}>
          Отмена
        </Button>
        <Button
          appearance="primary"
          className="PaymentModal__btn"
          onClick={() => onConfirm(selectedMethod)}
        >
          Оплатить {total.toLocaleString('ru-RU')} ₽
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
