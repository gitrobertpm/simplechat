/**
 * HELPERS FOR ROUTE HANDLERS - asyncHandler and authentication
 */
'use strict';


/* try catch asynchronously  */
exports.asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      console.log('err : ', err);
      next(err);
    }
  }
}
