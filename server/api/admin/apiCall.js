const rp = require('request-promise-native')
const crypto = require('crypto')
const config = require('../../app.config').zeroKit

/**
 * Convenience function to call admin endpoints on the tenant server.
 * Calls the api endpoint in the first parameter, using post if there is an object in the second parameter, GET otherwise.
 * @param urlPart Path to the endpoint
 * @param contentObj Object to post, use undefined for GET
 * @return {Promise<*>} Returns a promise to whatever the server returns.
 */
//
module.exports = function (urlPart, contentObj, method, contentType) {
  method = method || (contentObj ? 'POST' : 'GET')
  urlPart = config.apiPath + urlPart
  const contentBuffer = contentObj ? (contentObj instanceof Buffer ? contentObj : contentify(contentObj)) : null
  const headers = adminCallAuth(urlPart, contentBuffer, method, contentType)

  return rp({
    method,
    uri: config.apiBase + urlPart,
    headers: headers,
    body: contentBuffer
  }).then(body => body.length > 0 ? JSON.parse(body) : {})
}

/**
 * Concatenates the headers into a canonical format used to sign the request
 * @param verb Verb of the call
 * @param path Path to the endpoint
 * @param headers Headers of the call
 * @param hmacHeaders Headers to include in hmac
 * @return {string} Canonical string
 */
function getHeaderStringToHash (verb, path, headers, hmacHeaders) {
  return verb + '\n' + path + '\n' + hmacHeaders.map(key => key + ':' + headers[key]).join('\n')
}

/**
 * Calculates the necessary headers for authentication. The exact definitions and a detailed guide on this type of
 * authentication can be found in the in the provided documentation.
 * @param path The path to the endpoint
 * @param contentBuffer The bytes that will be sent or undefined (or null) for GET
 * @return {*} The headers to pass
 */
function adminCallAuth (path, contentBuffer, method, type) {
  // Format ISO8601 with no milliseconds
  const date = new Date().toISOString().substr(0, 19) + 'Z'
  const headers = {
    UserId: config.adminUserId,
    TresoritDate: date,
    'Content-Type': type || 'application/json'
  }

  if (contentBuffer) {
    headers['Content-SHA256'] = sha256hex(contentBuffer)
    headers['Content-Length'] = contentBuffer.length
  }

  const hmacHeaders = Object.keys(headers)
  hmacHeaders.push('HMACHeaders')
  headers['HMACHeaders'] = hmacHeaders.join(',')

  const headerStringToHash = getHeaderStringToHash(method, path, headers, hmacHeaders)
  headers['Authorization'] = 'AdminKey ' + hmacSha256base64(headerStringToHash, config.adminKey)
  return headers
}

// Convenience functions to make the code above more concise
// Encode an object into a buffer to be sent.
function contentify (obj) {
  return Buffer.from(JSON.stringify(obj))
}

function sha256hex (data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}
function hmacSha256base64 (data, key) {
  return crypto.createHmac('sha256', Buffer.from(key, 'hex')).update(data).digest('base64')
}
