import configJson from './config.js';
import { configSchema } from './schema/index.js';

export const config = configSchema.strict().parse(configJson);
