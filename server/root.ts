import { dirname } from 'path';
import { fileURLToPath } from 'url';

export { root };

const root = dirname(fileURLToPath(import.meta.url));
