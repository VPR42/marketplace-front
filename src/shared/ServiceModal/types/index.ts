export interface ServiceFormValue {
  serviceName: string;
  description: string;
  cost: string;
  category: string;
  tags: string[];
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
}
