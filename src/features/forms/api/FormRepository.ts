import type { FormDefinition, Submission } from '../domain/formTypes';

export interface FormRepository {
  getForm(formId: string): Promise<FormDefinition>;
  saveForm(def: FormDefinition): Promise<void>;
  listForms(): Promise<Pick<FormDefinition, 'id' | 'title'>[]>;
  createSubmission(sub: Submission): Promise<{ id: string }>;
}

// Context for dependency injection
import { createContext, useContext } from 'react';

const FormRepositoryContext = createContext<FormRepository | null>(null);

export const FormRepositoryProvider = FormRepositoryContext.Provider;

export function useFormRepository(): FormRepository {
  const repository = useContext(FormRepositoryContext);
  if (!repository) {
    // Fallback to in-memory implementation
    const { InMemoryFormRepository } = require('./InMemoryFormRepository');
    return new InMemoryFormRepository();
  }
  return repository;
}

export function provideFormRepository(): FormRepository {
  const repository = useContext(FormRepositoryContext);
  if (!repository) {
    const { InMemoryFormRepository } = require('./InMemoryFormRepository');
    return new InMemoryFormRepository();
  }
  return repository;
}
