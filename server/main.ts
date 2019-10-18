import { importPollyfills } from './polyfills';

importPollyfills().then(() => import('./server'));
