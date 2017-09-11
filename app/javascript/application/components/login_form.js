import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql, gql } from 'react-apollo'
import { Facebook, Google, Twitter } from '../icons'
import Logo from './logo'
import TextField from './text_field'

class LoginForm extends React.Component {
  static propTypes = {
    logIn: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.string)
  }

  state = {
    email: '',
    password: '',
    loading: false
  }

  render() {
    const { errors = [] } = this.props
    const { email, password } = this.state
    const loading = this.state.loading || this.props.loading

    return (
      <div className={classNames('login-form', { loading })}>
        <Logo
          loading={loading}
          onClick={() => this.setState({ loading: !loading })}
        />
        <section>
          <form onSubmit={e => this._logIn(e)}>
            {errors.length
              ? errors.map(error =>
                  <p key={error}>
                    {error}
                  </p>
                )
              : <p>Please log in to continue.</p>}
            <TextField
              label="Email"
              type="email"
              name="email"
              value={email}
              required
              onChange={e => this.setState({ email: e.target.value })}
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={password}
              required
              onChange={e => this.setState({ password: e.target.value })}
            />
            <button type="submit">Log in</button>
          </form>
          <section className="oauth">
            <p>…or log in with</p>
            <ul>
              <li>
                <a
                  rel="facebook"
                  href="/auth/facebook"
                  title="Log in with Facebook"
                >
                  <Facebook />
                </a>
              </li>
              <li>
                <a rel="google" href="/auth/google" title="Log in with Google">
                  <Google />
                </a>
              </li>
              <li>
                <a
                  rel="twitter"
                  href="/auth/twitter"
                  title="Log in with Twitter"
                >
                  <Twitter />
                </a>
              </li>
            </ul>
          </section>
        </section>
      </div>
    )
  }

  _logIn = async e => {
    const { email, password } = this.state
    e.preventDefault()
    await this.props.logIn(email, password)
  }
}

export default LoginForm
