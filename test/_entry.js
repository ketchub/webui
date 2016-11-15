import { noop } from 'lodash';
const isBrowser = process.title === 'browser';

global.describeBrowser = !isBrowser ? noop : describe;
global.itBrowser = !isBrowser ? noop : it;
global.contextBrowser = !isBrowser ? noop : context;
// global.describeBrowser = !isBrowser ? noop : function () {
//   describe.apply(describe, [`browser: ${arguments[0]}`, arguments[1]]);
// };
//
// global.itBrowser = !isBrowser ? noop : function () {
//   it.apply(it, [`browser: ${arguments[0]}`, arguments[1]]);
// };
//
// global.contextBrowser = !isBrowser ? noop : function () {
//   context.apply(context, [`browser: ${arguments[0]}`, arguments[1]]);
// };

require('./manifest');
