import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from 'class-validator';
import { Environment } from '@/core/constants';

class EnvironmentVariables {
  @IsString()
  DATABASE_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN?: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN?: string;

  @IsString()
  FRONTEND_ORIGIN!: string;

  @IsNumber()
  @Min(1)
  BACKEND_PORT!: number;

  @IsString()
  @IsIn([Environment.Development, Environment.Production])
  @IsOptional()
  NODE_ENV?: Environment;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`ENV validation error: ${JSON.stringify(errors, null, 2)}`);
  }

  return validatedConfig;
}
