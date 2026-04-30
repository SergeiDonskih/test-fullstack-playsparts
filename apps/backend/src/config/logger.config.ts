import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { EnvKey, Environment, LogLevel } from '@/core/constants';

export const getLoggerConfig = (configService: ConfigService): Params => {
  const nodeEnv = configService.get<Environment>(
    EnvKey.NODE_ENV,
    Environment.Development,
  );
  const isProduction = nodeEnv === Environment.Production;

  return {
    pinoHttp: {
      level: isProduction ? LogLevel.Info : LogLevel.Debug,
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      transport: !isProduction
        ? {
            target: 'pino-pretty',
            options: { singleLine: true },
          }
        : undefined,
      customProps: () => ({
        env: nodeEnv,
      }),
    },
  };
};
