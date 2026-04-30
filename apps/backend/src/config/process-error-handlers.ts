import { Logger } from '@nestjs/common';

const logger = new Logger('Process');

function formatReason(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.stack ?? reason.message;
  }
  try {
    return JSON.stringify(reason);
  } catch {
    return String(reason);
  }
}

export function registerProcessErrorHandlers(): void {
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error(`Unhandled rejection: ${formatReason(reason)}`);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error(
      `Uncaught exception: ${error.stack ?? error.message ?? String(error)}`,
    );
    process.exit(1);
  });
}
