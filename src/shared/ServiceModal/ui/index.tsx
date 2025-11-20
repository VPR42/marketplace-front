import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Uploader, TagPicker, SelectPicker } from 'rsuite';
import type { FileType } from 'rsuite/Uploader';

import './service-modal.scss';
import { ServiceIcon } from '@/shared/icons/ServiceModal/ServiceModalDownloadIcon';

import type { ServiceFormValue, ServiceOrderModalProps } from '../types';

import { Edit2 } from 'lucide-react';

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
  open,
  onClose,
  mode,
  onSubmit,
  onDelete,
  initialValues = {},
  coverUrl = '',
}) => {
  const [formValue, setFormValue] = useState<ServiceFormValue>({
    serviceName: initialValues.serviceName || '',
    description: initialValues.description || '',
    cost: initialValues.cost || '',
    category: initialValues.category || '',
    tags: initialValues.tags || [],
  });

  const [files, setFiles] = useState<FileType[]>([]);

  useEffect(() => {
    if (coverUrl && mode === 'edit') {
      setFiles([
        {
          name: 'cover.jpg',
          url: coverUrl,
        } as FileType,
      ]);
    } else {
      setFiles([]);
    }
  }, [open, coverUrl, mode]);

  const handleFileChange = (fileList: FileType[]): void => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.blobFile && !file.blobFile.type.startsWith('image/')) {
        alert('Пожалуйста, загрузите картинку!');
        return;
      }
      setFiles(fileList);
    }
  };

  const handleChange = (value: Partial<ServiceFormValue>) => {
    setFormValue({ ...formValue, ...value });
  };

  const handleSubmit = () => onSubmit(formValue);

  const tagData = [
    { label: 'Экологичная химия', value: 'eco_chemistry' },
    { label: 'Мытьё окон', value: 'window_cleaning' },
    { label: 'Своё оборудование', value: 'own_equipment' },
    { label: 'Гарантия', value: 'warranty' },
    { label: 'Срочный вызов', value: 'urgent_call' },
    { label: '24/7', value: '24_7' },
    { label: 'После ремонта', value: 'after_repair' },
    { label: 'Химчистка', value: 'dry_cleaning' },
    { label: 'Безнал', value: 'cashless' },
    { label: 'Наличные', value: 'cash' },
    { label: 'Выезд сегодня', value: 'today_visit' },
    { label: 'Чек и договор', value: 'check_contract' },
  ];

  const categoryData = [
    { label: 'Электроника', value: 'electronics' },
    { label: 'Уборка', value: 'cleaning' },
    { label: 'Мелкий ремонт', value: 'small_repair' },
    { label: 'Сантехника', value: 'plumbing' },
    { label: 'IT-услуги', value: 'it_services' },
    { label: 'Кондиционеры', value: 'air_conditioning' },
    { label: 'Сборка мебели', value: 'furniture_assembly' },
    { label: 'Монтажные работы', value: 'installation_works' },
    { label: 'Ремонт', value: 'repair' },
    { label: 'Автомобили', value: 'automobiles' },
  ];

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
            {files.length > 0 ? (
              <div className="ServiceOrderModal__uploader-preview">
                {files.map((file, index) => (
                  <div key={index} className="ServiceOrderModal__preview-item">
                    <img
                      src={file.blobFile ? URL.createObjectURL(file.blobFile) : file.url}
                      alt="preview"
                      className="ServiceOrderModal__preview-image"
                    />
                    <div className="ServiceOrderModal__preview-info">
                      <span className="ServiceOrderModal__preview-name">{file.name}</span>
                      <label className="ServiceOrderModal__preview-edit">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const newFile = e.target.files?.[0];
                            if (newFile) {
                              if (!newFile.type.startsWith('image/')) {
                                alert('Только картинки! Допустимые форматы: JPG, PNG, WebP и т.д.');
                                return;
                              }
                              const maxSize = 5 * 1024 * 1024;
                              if (newFile.size > maxSize) {
                                alert('Файл слишком большой! Максимум 5MB.');
                                return;
                              }

                              const file: FileType = {
                                blobFile: newFile,
                                name: newFile.name,
                              };
                              setFiles([file]);
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                        <Edit2 size={16} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                  <div className="ServiceOrderModal__upload-label">Загрузить фото</div>
                  <div className="ServiceOrderModal__upload-tip">
                    Рекомендуется: 1200x600px, JPG или PNG
                  </div>
                </div>
              </Uploader>
            )}
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

          <Form.ControlLabel className="ServiceOrderModal__tip">
            💡 Подробное описание повышает доверие клиентов
          </Form.ControlLabel>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">Цена (₽) *</Form.ControlLabel>
            <Form.Control className="ServiceOrderModal__input" name="cost" type="number" />
          </Form.Group>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">Категория *</Form.ControlLabel>
            <SelectPicker
              className="ServiceOrderModal__input"
              data={categoryData}
              value={formValue.category}
              onChange={(value) => handleChange({ category: value || '' })}
              placeholder="Выбери категорию"
              searchable
            />
          </Form.Group>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">Теги *</Form.ControlLabel>
            <TagPicker
              className="ServiceOrderModal__input"
              data={tagData}
              value={formValue.tags}
              onChange={(value) => handleChange({ tags: value })}
              placeholder="Выбери теги"
            />
          </Form.Group>
        </Form>
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
