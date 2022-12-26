import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((
  { buttonLabel, children },ref) =>  {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => {setIsVisible(!isVisible)}
  const hideIfIsVisible = { display: isVisible ? 'none' : '' }
  const showIfIsVisible = { display: isVisible ? '' : 'none' }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <button style={hideIfIsVisible} onClick={toggleVisibility}>
        {buttonLabel}
      </button>
      <div style={showIfIsVisible}>
        {children}
        <button onClick={toggleVisibility}>
                    close
        </button>
      </div>
    </div>
  )
})
Togglable.displayName = 'Togglable'
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}


export default Togglable