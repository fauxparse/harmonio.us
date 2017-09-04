import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql, gql } from 'react-apollo'

class LoginForm extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    logIn: PropTypes.func.isRequired
  }

  state = {
    email: '',
    password: ''
  }

  render() {
    const { loading } = this.props
    const { email, password } = this.state

    return (
      <div className={classNames('login-form', { loading })}>
        <form onSubmit={e => this._logIn(e)}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <button type="submit">Log in</button>
        </form>
        <ul>
          <li><a href="/auth/facebook">Log in with Facebook</a></li>
          <li><a href="/auth/google">Log in with Google</a></li>
          <li><a href="/auth/twitter">Log in with Twitter</a></li>
        </ul>
      </div>
    )
  }

  _logIn = async (e) => {
    const { email, password } = this.state
    e.preventDefault()
    await this.props.logIn(email, password)
  }
}

export default LoginForm
