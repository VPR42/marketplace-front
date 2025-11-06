import React, { useState } from 'react';
import { Modal, Button, Form, Uploader, RadioGroup, Radio } from 'rsuite';
import type { FileType } from 'rsuite/Uploader';

import './service-modal.scss';
import { ServiceIcon } from '@/shared/icons/ServiceModal/ServiceModalDownloadIcon';

import type { ServiceFormValue, ServiceOrderModalProps } from '../types';

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
  open,
  onClose,
  mode,
  onSubmit,
  onDelete,
  initialValues = {},
}) => {
  const [formValue, setFormValue] = useState<ServiceFormValue>({
    serviceName: initialValues.serviceName || '',
    description: initialValues.description || '',
    category: initialValues.category || '',
    cost: initialValues.cost || '',
    city: initialValues.city || '',
    district: initialValues.district || '',
    workFormat: initialValues.workFormat || '',
    experience: initialValues.experience || '',
  });

  const [files, setFiles] = useState<FileType[]>([]);

  const handleFileChange = (fileList: FileType[]): void => {
    setFiles(fileList);
  };

  const handleChange = (value: Partial<ServiceFormValue>) => {
    setFormValue({ ...formValue, ...value });
  };

  const handleSubmit = () => onSubmit(formValue);

  return (
    <Modal size="lg" open={open} onClose={onClose} className="ServiceOrderModal">
      <Modal.Header className="ServiceOrderModal__header">
        <Modal.Title className="ServiceOrderModal__title">
          {mode === 'edit' ? '✏️ Редактировать услугу' : '✨ Создать услугу'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="ServiceOrderModal__body">
        <Form
          fluid
          className="ServiceOrderModal__form"
          formValue={formValue}
          onChange={handleChange}
        >
          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">Фото услуги</Form.ControlLabel>
            <Uploader
              className="ServiceOrderModal__uploader"
              listType="picture-text"
              autoUpload={false}
              fileList={files}
              onChange={handleFileChange}
              action="#"
            >
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: 24, color: '#b8bdc7', marginBottom: 8 }}>
                  <ServiceIcon width={34} height={34} />
                </div>
                <div className="ServiceOrderModal__upload-label">
                  {mode === 'edit' ? 'Изменить фото' : 'Загрузить фото'}
                </div>
                <div className="ServiceOrderModal__upload-tip">
                  Рекомендуется: 1200x600px, JPG или PNG
                </div>
              </div>
            </Uploader>
          </Form.Group>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">
              Название услуги *
            </Form.ControlLabel>
            <Form.Control className="ServiceOrderModal__input" name="serviceName" />
          </Form.Group>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">Описание *</Form.ControlLabel>
            <textarea
              className="ServiceOrderModal__textarea"
              name="description"
              rows={3}
              value={formValue.description}
              onChange={(e) => handleChange({ description: e.target.value })}
            />
          </Form.Group>
          {mode === 'create' && (
            <Form.ControlLabel className="ServiceOrderModal__tip">
              💡 Подробное описание повышает доверие клиентов
            </Form.ControlLabel>
          )}

          <div className="ServiceOrderModal__form-wrapper">
            <Form.Group className="ServiceOrderModal__formGroup">
              <Form.ControlLabel className="ServiceOrderModal__label">
                Категория *
              </Form.ControlLabel>
              <Form.Control className="ServiceOrderModal__input" name="category" />
            </Form.Group>
            <Form.Group className="ServiceOrderModal__formGroup">
              <Form.ControlLabel className="ServiceOrderModal__label">
                Стоимость (₽) *
              </Form.ControlLabel>
              <Form.Control className="ServiceOrderModal__input" name="cost" type="number" />
            </Form.Group>
            <Form.Group className="ServiceOrderModal__formGroup">
              <Form.ControlLabel className="ServiceOrderModal__label">Город *</Form.ControlLabel>
              <Form.Control className="ServiceOrderModal__input" name="city" />
            </Form.Group>
            <Form.Group className="ServiceOrderModal__formGroup">
              <Form.ControlLabel className="ServiceOrderModal__label">Район *</Form.ControlLabel>
              <Form.Control className="ServiceOrderModal__input" name="district" />
            </Form.Group>
          </div>
          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">
              Формат работы *
            </Form.ControlLabel>
            <RadioGroup className="ServiceOrderModal__radioGroup" name="workFormat">
              <Radio className="ServiceOrderModal__radio" value="client">
                🏠 У клиента
              </Radio>
              <Radio className="ServiceOrderModal__radio" value="master">
                🏢 У мастера
              </Radio>
              <Radio className="ServiceOrderModal__radio" value="online">
                💻 Онлайн
              </Radio>
            </RadioGroup>
          </Form.Group>
          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">
              Опыт работы *
            </Form.ControlLabel>
            <Form.Control className="ServiceOrderModal__input" name="experience" />
          </Form.Group>
        </Form>
        <Form.Group className="ServiceOrderModal__statistics">
          {mode === 'edit' ? (
            <>
              <Form.ControlLabel>📊 Статистика после публикации</Form.ControlLabel>
              <div className="ServiceOrderModal__statisticsRow">
                <Form.Group className="ServiceOrderModal__statisticsItem">
                  <Form.ControlLabel className="ServiceOrderModal__statisticsValue ServiceOrderModal__statisticsValue--blue">
                    312
                  </Form.ControlLabel>
                  <Form.HelpText className="ServiceOrderModal__statisticsLabel">
                    Просмотров
                  </Form.HelpText>
                </Form.Group>

                <Form.Group className="ServiceOrderModal__statisticsItem">
                  <Form.ControlLabel className="ServiceOrderModal__statisticsValue ServiceOrderModal__statisticsValue--green">
                    18
                  </Form.ControlLabel>
                  <Form.HelpText className="ServiceOrderModal__statisticsLabel">
                    Запросов
                  </Form.HelpText>
                </Form.Group>

                <Form.Group className="ServiceOrderModal__statisticsItem">
                  <Form.ControlLabel className="ServiceOrderModal__statisticsValue ServiceOrderModal__statisticsValue--yellow">
                    3
                  </Form.ControlLabel>
                  <Form.HelpText className="ServiceOrderModal__statisticsLabel">
                    Активных
                  </Form.HelpText>
                </Form.Group>
              </div>
            </>
          ) : (
            <>
              <div className="ServiceOrderModal__statisticsInfo">
                <Form.ControlLabel className="ServiceOrderModal__statisticsInfoTitle">
                  📊 Статистика после публикации
                </Form.ControlLabel>
                <Form.HelpText className="ServiceOrderModal__statisticsInfoDesc">
                  После публикации вы сможете отслеживать просмотры, запросы клиентов и активные
                  заказы
                </Form.HelpText>
              </div>
            </>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="ServiceOrderModal__footer">
        {mode === 'edit' && (
          <Button
            className="ServiceOrderModal__buttonDanger"
            appearance="subtle"
            style={{ marginRight: 'auto' }}
            onClick={onDelete}
          >
            Удалить услугу
          </Button>
        )}
        <Button className="ServiceOrderModal__buttonSubtle" appearance="subtle" onClick={onClose}>
          Отмена
        </Button>
        <Button
          className="ServiceOrderModal__buttonPrimary"
          appearance="primary"
          onClick={handleSubmit}
        >
          {mode === 'edit' ? 'Сохранить изменения' : 'Опубликовать услугу'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
