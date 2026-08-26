export function httpError(
  statusCode: number,
  code: string,
  message: string,
  details: unknown[] = []
) {
  return { statusCode, code, message, details };
}
