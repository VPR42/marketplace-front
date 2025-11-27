export interface ServiceFormValue {
  name: string;
  description: string;
  price: number | '';
  categoryId: number | null;
  tags: number[];
  coverUrl?: string;
}

export interface ServiceOrderModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  onSubmit: (data: ServiceFormValue) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  initialValues?: Partial<ServiceFormValue>;
  coverUrl?: string;
  serviceId?: string;
}
