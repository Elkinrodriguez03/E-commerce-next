'use client';

import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface UseFormValidationOptions<T> {
  schema: ZodSchema<T>;
  initialValues: T;
}

interface FieldState {
  touched: boolean;
  dirty: boolean;
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  initialValues,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateField = useCallback(
    (name: string, currentValues: T) => {
      try {
        schema.parse(currentValues);
        setErrors(prev => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      } catch (err) {
        if (err instanceof ZodError) {
          const fieldError = err.issues.find(issue => issue.path[0] === name);
          setErrors(prev => ({
            ...prev,
            [name]: fieldError ? fieldError.message : '',
          }));
          if (!fieldError) {
            setErrors(prev => {
              const next = { ...prev };
              delete next[name];
              return next;
            });
          }
        }
      }
    },
    [schema]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newValues = { ...values, [name]: value } as T;
      setValues(newValues);

      setFieldStates(prev => ({
        ...prev,
        [name]: { touched: prev[name]?.touched ?? false, dirty: true },
      }));

      // Validate on change only if field was already touched or submit was attempted
      if (fieldStates[name]?.touched || submitAttempted) {
        validateField(name, newValues);
      }
    },
    [values, fieldStates, submitAttempted, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      setFieldStates(prev => ({
        ...prev,
        [name]: { touched: true, dirty: prev[name]?.dirty ?? false },
      }));
      validateField(name, values);
    },
    [values, validateField]
  );

  const validateAll = useCallback((): boolean => {
    setSubmitAttempted(true);
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach(issue => {
          const field = issue.path[0];
          if (typeof field === 'string' && !newErrors[field]) {
            newErrors[field] = issue.message;
          }
        });
        setErrors(newErrors);

        // Mark all fields as touched
        const allTouched: Record<string, FieldState> = {};
        Object.keys(values).forEach(key => {
          allTouched[key] = { touched: true, dirty: fieldStates[key]?.dirty ?? false };
        });
        setFieldStates(allTouched);
      }
      return false;
    }
  }, [schema, values, fieldStates]);

  const getFieldProps = useCallback(
    (name: string) => ({
      name,
      value: (values[name] as string) ?? '',
      onChange: handleChange,
      onBlur: handleBlur,
    }),
    [values, handleChange, handleBlur]
  );

  const getFieldState = useCallback(
    (name: string) => {
      const state = fieldStates[name];
      const hasError = !!errors[name];
      const isTouched = state?.touched ?? false;
      const isDirty = state?.dirty ?? false;
      const isValid = isTouched && !hasError && isDirty;

      return {
        error: errors[name] || '',
        hasError: (isTouched || submitAttempted) && hasError,
        isValid,
        isTouched,
        isDirty,
      };
    },
    [fieldStates, errors, submitAttempted]
  );

  const populateValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
    setErrors({});
    setFieldStates({});
    setSubmitAttempted(false);
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setFieldStates({});
    setSubmitAttempted(false);
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    validateAll,
    getFieldProps,
    getFieldState,
    populateValues,
    reset,
    submitAttempted,
  };
}
