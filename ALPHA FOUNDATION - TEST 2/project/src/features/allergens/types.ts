import { type LucideIcon } from 'lucide-react';

export type AllergenType = keyof typeof import('./constants').ALLERGENS;

export interface AllergenInfo {
  type: AllergenType;
  label: string;
  icon: keyof typeof import('lucide-react');
  color: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface AllergenData {
  allergens: AllergenType[];
  notes?: string;
}

export interface AllergenWarning {
  type: AllergenType;
  message: string;
  severity: 'high' | 'medium' | 'low';
}