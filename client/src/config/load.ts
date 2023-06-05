import configJson from "./config.json";
import { configSchema } from "./schema";

export const config = configSchema.parse(configJson);
