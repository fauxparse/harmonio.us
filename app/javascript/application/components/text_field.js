import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class TextField extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
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

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false
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
        {this.input()}
        {label &&
          <label htmlFor={this.id()}>
            {label}
          </label>}
        {children}
      </div>
    )
  }

  hasValue() {
    return !!this.props.value
  }

  id() {
    return this.props.id || this.props.name
  }

  input() {
    const { type, name, value, label, children, required, onChange, ...otherProps } = this.props

    return (
      <input
        type={type}
        name={name}
        id={this.id()}
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
      if (this._mounted) {
        this.setState({ focused })
        focused ? (onFocus && onFocus(e)) : (onBlur && onBlur(e))
      }
    })
  }
}
