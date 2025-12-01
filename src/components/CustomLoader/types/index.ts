export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg';

export interface CustomLoaderProps {
  size?: LoaderSize;
  content?: string;
  className?: string;
}
