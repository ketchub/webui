import { noop } from 'lodash';
const isBrowser = (process.title === 'browser');

global.describeBrowser = !isBrowser ? noop : describe;
global.itBrowser = !isBrowser ? noop : it;
global.contextBrowser = !isBrowser ? noop : context;

require('./manifest');
