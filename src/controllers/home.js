/**
 * Show the list of all users
 *
 * @example GET /users/
 * @return {Object} The list of users || status code 404
 */
module.exports.show = (request, h) => {
  return h.view('home/index')
}
