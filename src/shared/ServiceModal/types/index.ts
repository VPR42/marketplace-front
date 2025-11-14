export interface ServiceFormValue {
  serviceName: string;
  description: string;
  category: string;
  cost: string;
  city: string;
  district: string;
  workFormat: string;
  experience: string;
}

export interface ServiceOrderModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  onSubmit: (data: ServiceFormValue) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  initialValues?: Partial<ServiceFormValue>;
}
