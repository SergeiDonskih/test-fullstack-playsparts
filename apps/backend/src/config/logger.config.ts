import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export const getLoggerConfig = (configService: ConfigService): Params => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const isProduction = nodeEnv === 'production';

  return {
    pinoHttp: {
      level: isProduction ? 'info' : 'debug',
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
