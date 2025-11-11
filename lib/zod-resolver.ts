import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
  ResolverOptions,
  ResolverResult,
} from 'react-hook-form';
import type { z } from 'zod';

type UnknownFieldErrors = FieldErrors<FieldValues>;

export function createZodResolver<TSchema extends z.ZodTypeAny>(
  schema: TSchema
): Resolver<z.infer<TSchema>> {
  return async (
    values,
    _context,
    _options: ResolverOptions<z.infer<TSchema>>
  ): Promise<ResolverResult<z.infer<TSchema>>> => {
    const parsed = await schema.safeParseAsync(values);

    if (parsed.success) {
      return {
        values: parsed.data,
        errors: {},
      };
    }

    const formErrors: UnknownFieldErrors = {};

    for (const issue of parsed.error.issues) {
      const path = issue.path.map(String);
      if (!path.length) continue;

      setNestedError(formErrors, path, {
        type: issue.code,
        message: issue.message,
      });
    }

    return {
      values: {},
      errors: formErrors,
    };
  };
}

function setNestedError(target: UnknownFieldErrors, path: string[], value: FieldError) {
  let current: UnknownFieldErrors | FieldError = target;

  path.forEach((segment, index) => {
    const isLast = index === path.length - 1;
    if (isLast) {
      (current as UnknownFieldErrors)[segment] = value;
      return;
    }

    if (!(current as UnknownFieldErrors)[segment]) {
      (current as UnknownFieldErrors)[segment] = {};
    }

    current = (current as UnknownFieldErrors)[segment] as UnknownFieldErrors;
  });
}
