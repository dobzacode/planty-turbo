import baseConfig, { restrictEnvAccess } from "@planty/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [...baseConfig, ...restrictEnvAccess];