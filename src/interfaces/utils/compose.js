module.exports = compose;

/**
 * compile all middleware
 * @param {any} middleware 
 * @returns next()
 */
function compose(middleware) {

  /** check middleware */
  if (!Array.isArray(middleware) || !middleware.length) throw new TypeError('Middleware must be an array.');
  for (const fn of middleware) {
    if ('function' !== typeof fn) throw new TypeError('Middleware must be a function');
  }

  return (ctx, next) => {
    let count = -1;
    
    return dispatch(0);
    function dispatch(index) {
      if (index <= count) throw new Error('next() call multi times.');
      count = index;
      let fn = middleware[index];
      if (index === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(ctx, function next() {
          return dispatch(index + 1);
        }));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
}