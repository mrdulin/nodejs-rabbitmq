import dotenv, { DotenvConfigOutput } from 'dotenv';
import path from 'path';

// tslint:disable-next-line:interface-over-type-literal
type EnvVars = {
  AMQP_URL: string;
};

function main() {
  let envVars: EnvVars;
  return function loadEnv(): EnvVars {
    if (envVars) {
      return envVars;
    }
    const dotenvConfigOutput: DotenvConfigOutput = dotenv.config({ path: path.resolve(__dirname, '../.env') });
    if (dotenvConfigOutput.error) {
      console.error(dotenvConfigOutput.error);
      process.exit(1);
    } else if (!dotenvConfigOutput.parsed) {
      console.error('parse env vars failed.');
      process.exit(1);
    }
    envVars = dotenvConfigOutput.parsed! as EnvVars;
    return envVars;
  };
}

const getEnvVars: () => EnvVars = main();

export { getEnvVars, EnvVars };
