import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class TextField extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool.isRequired,
    children: PropTypes.node,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    type: 'text',
    required: false
  }

  state = {
    focused: false
  }

  render() {
    const { type, name, value, label, children, required } = this.props
    const { focused } = this.state
    const filled = this.hasValue()
    const className = classNames('field', `${type}-field`, {
      focused,
      filled
    })

    return (
      <div className={className}>
        {label &&
          <label htmlFor={this.id()}>
            {label}
          </label>}
        {this.input()}
        {children}
      </div>
    )
  }

  id() {
    return this.props.name
  }

  hasValue() {
    return !!this.props.value
  }

  input() {
    const { type, name, value, label, children, required, onChange, ...otherProps } = this.props

    return (
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        onFocus={(e) => this._setFocused(e, true)}
        onBlur={(e) => this._setFocused(e, false)}
        {...otherProps}
      />
    )
  }

  _setFocused(e, focused = true) {
    const { onFocus, onBlur } = this.props

    setTimeout(() => {
      this.setState({ focused })
      focused ? (onFocus && onFocus(e)) : (onBlur && onBlur(e))
    })
  }
}
