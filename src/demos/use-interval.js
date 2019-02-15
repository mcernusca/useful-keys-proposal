// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import React from 'react'

export const useInterval = function(callback, delay) {
  const savedCallback = React.useRef()

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback
  })

  // Set up the interval.
  React.useEffect(
    () => {
      function tick() {
        savedCallback.current()
      }
      if (delay !== null) {
        let id = setInterval(tick, delay)
        return () => clearInterval(id)
      }
    },
    [delay]
  )
}
