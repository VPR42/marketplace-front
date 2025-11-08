export interface OrderPlacementModalProps {
  open: boolean;
  onClose: () => void;
  service: {
    id: number;
    title: string;
    workerName: string;
    category?: string;
    tags?: string[];
    price?: string;
  };
  onSubmit?: (data: OrderFormData) => void;
}

export interface OrderFormData {
  problemDescription: string;
  address: string;
  desiredDate: string;
  urgency: 'not-urgent' | 'urgent';
  photos?: File[];
  contactPhone: string;
}
