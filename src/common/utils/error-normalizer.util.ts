export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (typeof error === 'object' && error !== null) {
    const errorWithMessage = error as { message?: unknown };

    if (typeof errorWithMessage.message === 'string') {
      return new Error(errorWithMessage.message);
    }

    return new Error(JSON.stringify(error));
  }

  return new Error('Unknown error');
}
