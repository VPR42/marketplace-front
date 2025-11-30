import React from 'react';
import { Button, Modal } from 'rsuite';

import './delete-modal.scss';

interface ServiceDeleteModalProps {
  open: boolean;
  serviceName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  onExited?: () => void;
}

export const ServiceDeleteModal: React.FC<ServiceDeleteModalProps> = ({
  open,
  serviceName,
  onConfirm,
  onCancel,
  loading = false,
  onExited,
}) => (
  <Modal
    open={open}
    onClose={onCancel}
    onExited={onExited}
    size="xs"
    className="ServiceDeleteModal"
    backdrop="static"
  >
    <Modal.Header className="ServiceDeleteModal__header">
      <Modal.Title className="ServiceDeleteModal__title">Удалить услугу?</Modal.Title>
    </Modal.Header>
    <Modal.Body className="ServiceDeleteModal__body">
      <div className="ServiceDeleteModal__text">
        {serviceName ? (
          <div className="ServiceDeleteModal__line">
            <span>Удалить услугу</span> <b>{serviceName}</b>?
          </div>
        ) : null}
        <div className="ServiceDeleteModal__sub">Действие необратимо, услугу нельзя вернуть.</div>
      </div>
    </Modal.Body>
    <Modal.Footer className="ServiceDeleteModal__footer">
      <Button
        appearance="subtle"
        onClick={onCancel}
        className="ServiceDeleteModal__button ServiceDeleteModal__button--secondary"
        disabled={loading}
      >
        Отмена
      </Button>
      <Button
        appearance="primary"
        onClick={onConfirm}
        loading={loading}
        className="ServiceDeleteModal__button ServiceDeleteModal__button--danger"
      >
        Удалить
      </Button>
    </Modal.Footer>
  </Modal>
);
