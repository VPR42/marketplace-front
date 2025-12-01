import { Edit2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal, SelectPicker, TagPicker, Uploader } from 'rsuite';
import type { FileType } from 'rsuite/Uploader';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { selectServicesState } from '@/redux-rtk/store/services/selectors';
import {
  createService,
  updateService,
  uploadServiceCover,
} from '@/redux-rtk/store/services/servicesThunks';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories, fetchTags } from '@/redux-rtk/store/utils/utilsThunks';
import { ServiceIcon } from '@/shared/icons/ServiceModal/ServiceModalDownloadIcon';

import type { ServiceCreationProps, ServiceFormValue } from '../types';

import './service-modal.scss';

const PLACEHOLDER_COVER = 'https://placehold.co/800x450';

const MAX_COVER_SIZE = 5 * 1024 * 1024;
const validate = (values: ServiceFormValue) => {
  const errors: Partial<Record<keyof ServiceFormValue | 'submit', string>> = {};

  if (!values.name || values.name.trim().length < 5) {
    errors.name = 'Название должно быть не короче 5 символов';
  } else if (values.name.trim().length > 60) {
    errors.name = 'Название не должно превышать 60 символов';
  }

  if (!values.description || values.description.trim().length < 20) {
    errors.description = 'Описание должно быть не короче 20 символов';
  } else if (values.description.trim().length > 200) {
    errors.description = 'Описание не должно превышать 200 символов';
  }

  if (values.price === '' || Number.isNaN(Number(values.price))) {
    errors.price = 'Цена обязательна';
  } else {
    const priceNum = Number(values.price);

    if (priceNum < 100) {
      errors.price = 'Минимум 100';
    }

    if (priceNum > 1000000) {
      errors.price = 'Цена должна быть меньше 1 000 000';
    }
  }

  if (!values.categoryId) {
    errors.categoryId = 'Укажите категорию';
  }

  if (!values.tags || values.tags.length === 0) {
    errors.tags = 'Выберите теги';
  }

  return errors;
};
export const ServiceCreationModal: React.FC<ServiceCreationProps> = ({
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

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [coverUploading, setCoverUploading] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormValue | 'submit', string>>>(
    {},
  );

  useEffect(() => {
    dispatch(fetchCategories({ jobsCountSort: null, query: null }));

    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    if (coverUrl && mode === 'edit') {
      setFiles([{ name: 'cover.jpg', url: coverUrl } as FileType]);
    } else {
      setFiles([]);
    }
  }, [open, coverUrl, mode]);

  const handleFileChange = (fileList: FileType[]): void => {
    if (fileList.length === 0) {
      setFiles([]);

      setCoverFile(null);

      return;
    }

    const file = fileList[0];

    if (file.blobFile && !file.blobFile.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, submit: 'Загружайте только изображения JPG/PNG' }));

      return;
    }

    if (file.blobFile && file.blobFile.size > MAX_COVER_SIZE) {
      setErrors((prev) => ({ ...prev, submit: 'Размер файла не должен превышать 5 МБ' }));

      return;
    }

    setFiles(fileList);

    setCoverFile(file.blobFile ?? null);

    if (mode === 'edit' && serviceId && file.blobFile) {
      setCoverUploading(true);

      dispatch(uploadServiceCover({ id: serviceId, file: file.blobFile }))
        .unwrap()

        .then((res) => {
          setFormValue((prev) => ({ ...prev, coverUrl: res.url }));

          setFiles([{ name: file.name, url: res.url } as FileType]);

          setCoverFile(null);

          setErrors((prev) => ({ ...prev, submit: undefined }));
        })

        .catch((e) => {
          setErrors((prev) => ({
            ...prev,

            submit: (e as string) || 'Не удалось загрузить обложку',
          }));
        })

        .finally(() => setCoverUploading(false));
    } else if (mode === 'create' && file.blobFile) {
      setFormValue((prev) => ({
        ...prev,

        coverUrl: URL.createObjectURL(file.blobFile as Blob),
      }));
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
      setErrors((prev) => ({ ...prev, name: 'Вы не авторизованы, войдите в аккаунт' }));

      return;
    }

    try {
      if (mode === 'create') {
        const created = await dispatch(createService(payload)).unwrap();

        let coverUrlToUse = payload.coverUrl;

        if (coverFile && created?.id) {
          try {
            const uploaded = await dispatch(
              uploadServiceCover({ id: created.id, file: coverFile }),
            ).unwrap();

            coverUrlToUse = uploaded.url;

            setFiles([{ name: coverFile.name, url: uploaded.url } as FileType]);

            setCoverFile(null);
          } catch (uploadError) {
            setErrors((prev) => ({
              ...prev,

              submit: (uploadError as string) || 'Не удалось загрузить обложку',
            }));

            return;
          }
        }

        onSubmit({ ...formValue, price: Number(formValue.price), coverUrl: coverUrlToUse });
      } else if (mode === 'edit' && serviceId) {
        await dispatch(updateService({ id: serviceId, body: payload })).unwrap();

        onSubmit({ ...formValue, price: Number(formValue.price), coverUrl: payload.coverUrl });
      }

      onClose();
    } catch (e) {
      setErrors((prev) => ({ ...prev, submit: (e as string) || 'Ошибка при сохранении' }));
    }
  };

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.category.name, value: c.category.id })),

    [categories],
  );

  const tagOptions = useMemo(() => tags.map((t) => ({ label: t.name, value: t.id })), [tags]);

  return (
    <Modal size="lg" open={open} onClose={onClose} className="ServiceOrderModal" backdrop="static">
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
                                setErrors((prev) => ({
                                  ...prev,

                                  submit: 'Загружайте только изображения JPG/PNG',
                                }));

                                return;
                              }

                              if (newFile.size > MAX_COVER_SIZE) {
                                setErrors((prev) => ({
                                  ...prev,

                                  submit: 'Размер файла не должен превышать 5 МБ',
                                }));

                                return;
                              }

                              const fileObj: FileType = {
                                blobFile: newFile,

                                name: newFile.name,
                              };

                              handleFileChange([fileObj]);
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
                multiple={false}
                onChange={handleFileChange}
                action="#"
                accept="image/jpeg, image/png, image/gif, image/webp, image/bmp, image/jpg, .pptx"
              >
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: 24, color: '#b8bdc7', marginBottom: 8 }}>
                    <ServiceIcon width={34} height={34} />
                  </div>

                  <div className="ServiceOrderModal__upload-label">Загрузить фото</div>

                  <div className="ServiceOrderModal__upload-tip">
                    Рекомендуется формат 16:9, JPG или PNG
                  </div>
                </div>
              </Uploader>
            )}

            {coverUploading ? (
              <div className="ServiceOrderModal__upload-tip">Загрузка обложки...</div>
            ) : null}
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
              min={100}
              max={1000000}
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

          {errors.submit ? <div className="input-error-text">{errors.submit}</div> : null}
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
          loading={serviceStatus === 'loading' || coverUploading}
        >
          {mode === 'edit' ? 'Сохранить' : 'Опубликовать услугу'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
