class UserRepository {
  /**
   * @param {Knex} connection
   */
  constructor (connection) {
    this._connection = connection
  }

  /**
   * @param {String} username
   * @param {String} password
   */
  findByUsernameAndPassword (username, password) {
    return this._connection
      .withSchema('clientes_consultoria')
      .select('*')
      .from('usuario')
      .where('usuario', username)
      .where('senha', password)
  }
}

/**
 * @param {Knex} connection
 */
function factoryUserRepository (connection) {
  return new UserRepository(connection)
}

module.exports = {
  factoryUserRepository,
  UserRepository
}
