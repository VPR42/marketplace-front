import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal, SelectPicker, TagPicker, Uploader } from 'rsuite';
import type { FileType } from 'rsuite/Uploader';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { selectServicesState } from '@/redux-rtk/store/services/selectors';
import { createService, updateService } from '@/redux-rtk/store/services/servicesThunks';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories, fetchTags } from '@/redux-rtk/store/utils/utilsThunks';
import { ServiceIcon } from '@/shared/icons/ServiceModal/ServiceModalDownloadIcon';

import type { ServiceFormValue, ServiceOrderModalProps } from '../types';
import './service-modal.scss';

import { Edit2 } from 'lucide-react';

const PLACEHOLDER_COVER = 'https://placehold.co/800x450';

const validate = (values: ServiceFormValue) => {
  const errors: Partial<Record<keyof ServiceFormValue | 'submit', string>> = {};
  if (!values.name || values.name.trim().length < 5) {
    errors.name = 'Название от 5 символов';
  } else if (values.name.trim().length > 60) {
    errors.name = 'Название до 60 символов';
  }
  if (!values.description || values.description.trim().length < 10) {
    errors.description = 'Описание от 10 символов';
  } else if (values.description.trim().length > 200) {
    errors.description = 'Описание до 200 символов';
  }
  if (values.price === '' || Number.isNaN(Number(values.price))) {
    errors.price = 'Укажите цену';
  } else {
    const priceNum = Number(values.price);
    if (priceNum < 10) {
      errors.price = 'Минимум 10';
    }
    if (priceNum > 9999999999) {
      errors.price = 'Слишком большая цена';
    }
  }
  if (!values.categoryId) {
    errors.categoryId = 'Выберите категорию';
  }
  if (!values.tags || values.tags.length === 0) {
    errors.tags = 'Добавьте хотя бы один тег';
  }
  return errors;
};

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
  open,
  onClose,
  mode,
  onSubmit,
  onDelete,
  showDelete = false,
  initialValues = {},
  coverUrl = PLACEHOLDER_COVER,
  serviceId,
}) => {
  const dispatch = useAppDispatch();
  const { status: serviceStatus } = useAppSelector(selectServicesState);
  const { categories, tags } = useAppSelector(selectUtilsState);
  const { isAuthenticated } = useAppSelector(selectAuthState);

  const [formValue, setFormValue] = useState<ServiceFormValue>({
    name: initialValues.name || '',
    description: initialValues.description || '',
    price: initialValues.price ?? '',
    categoryId: initialValues.categoryId ?? null,
    tags: initialValues.tags || [],
    coverUrl: initialValues.coverUrl || coverUrl,
  });

  const [files, setFiles] = useState<FileType[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormValue | 'submit', string>>>(
    {},
  );

  useEffect(() => {
    dispatch(fetchCategories({ jobsCountSort: null, query: null }));
    dispatch(fetchTags());
  }, [dispatch]);

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
        alert('Пожалуйста, выберите изображение');
        return;
      }
      setFiles(fileList);
    }
  };

  const handleChange = (value: Partial<ServiceFormValue>) => {
    setFormValue({ ...formValue, ...value });
    const key = Object.keys(value)[0] as keyof ServiceFormValue;
    if (key) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate(formValue);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      price: Number(formValue.price),
      categoryId: formValue.categoryId!,
      tags: formValue.tags,
      coverUrl: formValue.coverUrl || PLACEHOLDER_COVER,
    };

    if (!isAuthenticated) {
      setErrors((prev) => ({ ...prev, name: 'Авторизуйтесь, чтобы создать услугу' }));
      return;
    }

    try {
      if (mode === 'create') {
        await dispatch(createService(payload)).unwrap();
      } else if (mode === 'edit' && serviceId) {
        await dispatch(updateService({ id: serviceId, body: payload })).unwrap();
      }
      onSubmit({ ...formValue, price: Number(formValue.price), coverUrl: payload.coverUrl });
      onClose();
    } catch (e) {
      setErrors((prev) => ({ ...prev, submit: (e as string) || 'Ошибка сохранения' }));
    }
  };

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.category.name, value: c.category.id })),
    [categories],
  );

  const tagOptions = useMemo(() => tags.map((t) => ({ label: t.name, value: t.id })), [tags]);

  return (
    <Modal size="lg" open={open} onClose={onClose} className="ServiceOrderModal">
      <Modal.Header className="ServiceOrderModal__header">
        <Modal.Title className="ServiceOrderModal__title">
          {mode === 'edit' ? 'Редактировать услугу' : 'Создать услугу'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="ServiceOrderModal__body">
        <Form
          fluid
          className="ServiceOrderModal__form"
          formValue={formValue}
          onChange={(value) => setFormValue(value as ServiceFormValue)}
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
                                alert('Добавьте изображение JPG/PNG');
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
                    Рекомендуется 16:9, JPG или PNG
                  </div>
                </div>
              </Uploader>
            )}
          </Form.Group>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">
              Название услуги <b className="required">*</b>
            </Form.ControlLabel>
            <Form.Control
              className="ServiceOrderModal__input"
              name="name"
              value={formValue.name}
              onChange={(val) => handleChange({ name: val as string })}
            />
            {errors.name ? <span className="input-error-text">{errors.name}</span> : null}
          </Form.Group>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">
              Описание <b className="required">*</b>
            </Form.ControlLabel>
            <textarea
              className="ServiceOrderModal__textarea"
              name="description"
              rows={3}
              value={formValue.description}
              onChange={(e) => handleChange({ description: e.target.value })}
            />
            {errors.description ? (
              <span className="input-error-text">{errors.description}</span>
            ) : null}
          </Form.Group>

          <Form.ControlLabel className="ServiceOrderModal__tip">
            Подробное описание повышает доверие клиентов
          </Form.ControlLabel>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">
              Цена (₽) <b className="required">*</b>
            </Form.ControlLabel>
            <Form.Control
              className="ServiceOrderModal__input"
              name="price"
              type="number"
              value={formValue.price}
              onChange={(val) => handleChange({ price: Number(val) })}
            />
            {errors.price ? <span className="input-error-text">{errors.price}</span> : null}
          </Form.Group>

          <Form.Group className="ServiceOrderModal__formGroup">
            <Form.ControlLabel className="ServiceOrderModal__label">
              Категория <b className="required">*</b>
            </Form.ControlLabel>
            <SelectPicker
              className="ServiceOrderModal__input category-tag-picker"
              data={categoryOptions}
              value={formValue.categoryId}
              onChange={(value) => handleChange({ categoryId: (value as number) ?? null })}
              placeholder="Выбери категорию"
              container={() => document.body}
              placement="autoVerticalStart"
              searchable
              block
            />
            {errors.categoryId ? (
              <span className="input-error-text">{errors.categoryId}</span>
            ) : null}
          </Form.Group>

          <Form.Group className="ServiceOrderModal__formGroup ">
            <Form.ControlLabel className="ServiceOrderModal__label">
              Теги <b className="required">*</b>
            </Form.ControlLabel>
            <TagPicker
              className="ServiceOrderModal__input category-tag-picker service-tag-picker"
              data={tagOptions}
              value={formValue.tags}
              onChange={(value) => handleChange({ tags: (value as number[]) ?? [] })}
              placeholder="Выбери теги"
              container={() => document.body}
              placement="autoVerticalStart"
              block
            />
            {errors.tags ? <span className="input-error-text">{errors.tags}</span> : null}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="ServiceOrderModal__footer">
        {mode === 'edit' && (showDelete || onDelete) && (
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
          loading={serviceStatus === 'loading'}
        >
          {mode === 'edit' ? 'Сохранить' : 'Опубликовать услугу'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
