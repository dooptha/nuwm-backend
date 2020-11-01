/*
* If there will be errors from 3rd party apis there will be custom codes 400, 404 etc.
* For our server errors we have default 500 error and other error codes depending on request logic
*/

module.exports = class ErrorHandler {}

module.exports.CustomError = class CustomError extends Error {
  constructor(message, responseCode) {
    super(message)
    this.code = responseCode || 500
    // logger/metrics goes here
    console.error('CustomError:', message)
  }
}
