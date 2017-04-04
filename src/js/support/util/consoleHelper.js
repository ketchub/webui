/**
 * Do this funky .bind stuff because the console will keep track of the stack
 * trace and/or where it was invoked and log that location in the code. Doing
 * it this will make the invocation work properly!
 */
export default {
  blue: console.log.bind(
    console, '%c--> %s', 'color:#4bbfcc;background:#3d3d3d;'
  ),
  green: console.log.bind(
    console, '%c--> %s', 'color:#28ab8e;background:#3d3d3d;'
  )
};
