const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const jwtVerify = promisify(jwt.verify)

class UserDomain {
  /**
   * @param {UserRepository} repository
   */
  constructor (repository) {
    this.repository = repository
  }

  /**
   * @param {String} username
   * @param {String} password
   */
  async makeLogin (username, password) {
    const user = await this.repository.findByUsernameAndPassword(username, password)
    if (!user || user.length === 0) {
      return [[], { statusCode: 403, message: 'Usuário ou senha inválidos!' }]
    }

    const token = jwt.sign({
      id: user.idusuario
    }, process.env.SECRET, { expiresIn: 21600 }) // 6 hours

    return [{ token }, { message: 'Usuário autenticado com successo!' }]
  }

  /**
   * @param {String} token
   */
  isAuthenticated (token) {
    return jwtVerify(token, process.env.SECRET)
  }
}

/**
 * @param {UserRepository} repository
 */
function factoryUserDomain (repository) {
  return new UserDomain(repository)
}

module.exports = {
  UserDomain,
  factoryUserDomain
}
