type LogContext = Record<string, string | number | boolean | null | undefined>;

const blockedKeys = ["password", "token", "secret", "answer", "reflection", "feeling", "sos"];

function sanitizeContext(context: LogContext = {}) {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => {
      const shouldRedact = blockedKeys.some((blockedKey) => key.toLowerCase().includes(blockedKey));
      return [key, shouldRedact ? "[redacted]" : value];
    })
  );
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.info(message, sanitizeContext(context));
  },
  warn(message: string, context?: LogContext) {
    console.warn(message, sanitizeContext(context));
  },
  error(message: string, context?: LogContext) {
    console.error(message, sanitizeContext(context));
  }
};
