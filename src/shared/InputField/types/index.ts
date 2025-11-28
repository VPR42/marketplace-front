export interface InputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  isPassword?: boolean;
  showStrengthBar?: boolean;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}
