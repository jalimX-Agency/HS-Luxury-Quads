import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details !== undefined ? { details } : {}),
    },
    { status },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError('Validation failed', 400, error.flatten().fieldErrors);
  }

  if (error instanceof Error) {
    console.error('[API Error]', error.message);

    if (error.message.includes('Unique constraint')) {
      return jsonError('A record with this value already exists', 409);
    }

    return jsonError(error.message, 500);
  }

  console.error('[API Error]', error);
  return jsonError('An unexpected error occurred', 500);
}
