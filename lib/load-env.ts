import { config } from 'dotenv';
import path from 'path';

const root = process.cwd();

config({ path: path.join(root, '.env') });
config({ path: path.join(root, '.env.local'), override: true });
