import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql, gql } from 'react-apollo'
import { Facebook, Google, Twitter } from '../icons'
import Logo from './logo'
import TextField from './text_field'

const FormErrors = ({ errors, message }) => (
  <div>
    {errors.length
      ? errors.map(error =>
          <p key={error}>
            {error}
          </p>
        )
      : <p>{message}</p>}
  </div>
)

const FormFooter = ({ buttonText, alternative, switchPage }) =>
  <footer className="buttons">
    <button type="submit">
      {buttonText}
    </button>
    <span>
      or&nbsp;
      <a
        href="#"
        onClick={e => {
          e.preventDefault()
          switchPage()
        }}
      >
        {alternative}
      </a>
    </span>
  </footer>

class LoginForm extends React.Component {
  static propTypes = {
    logIn: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.string)
  }

  state = {
    name: '',
    email: '',
    password: '',
    page: 'login',
    loading: false
  }

  render() {
    const { errors = [] } = this.props
    const { name, email, password, page } = this.state
    const loading = this.state.loading || this.props.loading

    return (
      <div className={classNames('login-form', page, { loading })}>
        <Logo
          loading={loading}
          onClick={() => this.setState({ loading: !loading })}
        />
        <section className="forms" ref={el => (this.pages = el)}>
          <form
            aria-hidden={page !== 'password'}
            disabled={page !== 'password'}
            onSubmit={e => this._resetPassword(e)}
            ref={el => this._resize(el, 'password')}
          >
            <FormErrors
              errors={errors}
              message="Enter your email address to reset your password."
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              id="password-email"
              value={email}
              required
              onChange={e => this.setState({ email: e.target.value })}
            />
            <FormFooter
              buttonText="Reset password"
              alternative="log in"
              switchPage={this._switchPage('login')}
            />
          </form>
          <form
            aria-hidden={page !== 'login'}
            onSubmit={e => this._logIn(e)}
            ref={el => this._resize(el, 'login')}
          >
            <FormErrors errors={errors} message="Please log in to continue." />
            <TextField
              label="Email"
              type="email"
              name="email"
              id="login-email"
              value={email}
              required
              onChange={e => this.setState({ email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              id="login-password"
              value={password}
              required
              onChange={e => this.setState({ password: e.target.value })}
            >
              <p className="hint">
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    this.setState({ page: 'password' })
                  }}
                >
                  Forgot your password?
                </a>
              </p>
            </TextField>
            <FormFooter
              buttonText="Log in"
              alternative="register"
              switchPage={this._switchPage('register')}
            />
          </form>
          <form
            aria-hidden={page !== 'register'}
            onSubmit={e => this._register(e)}
            ref={el => this._resize(el, 'register')}
          >
            <FormErrors
              errors={errors}
              message="Let’s get you set up with an account."
            />
            <TextField
              label="Name"
              name="name"
              id="register-name"
              value={name}
              required
              onChange={e => this.setState({ name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              id="register-email"
              value={email}
              required
              onChange={e => this.setState({ email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              id="register-password"
              value={password}
              required
              onChange={e => this.setState({ password: e.target.value })}
            />
            <FormFooter
              buttonText="Register"
              alternative="log in"
              switchPage={this._switchPage('login')}
            />
          </form>
        </section>
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
              <a rel="twitter" href="/auth/twitter" title="Log in with Twitter">
                <Twitter />
              </a>
            </li>
          </ul>
        </section>
      </div>
    )
  }

  _logIn = async e => {
    const { email, password } = this.state
    e.preventDefault()
    await this.props.logIn(email, password)
  }

  _register = async e => {
    const { name, email, password } = this.state
    e.preventDefault()
    await this.props.register(name, email, password)
  }

  _resetPassword = async e => {
    const { email } = this.state
    e.preventDefault()
    await this.props.resetPassword(email)
  }

  _resize(el, page) {
    if (el && page === this.state.page) {
      setTimeout(() => {
        this.pages && (this.pages.style.height = `${el.offsetHeight}px`)
      })
    }
  }

  _switchPage(page) {
    return () => this.setState({ page })
  }
}

export default LoginForm
