import { ReactNode } from 'react';

export interface IAppProps {
  children?: ReactNode;
}

export default function Section({ children }: IAppProps) {
  return <div>section{children}</div>;
}
