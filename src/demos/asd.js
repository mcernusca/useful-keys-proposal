import React from 'react'
import cx from 'classnames'
import { useInterval } from './use-interval'
import { useKeyState } from './use-key-state'

const FrameBool = function(frame, active) {
  return {
    frame: frame,
    active: active
  }
}

export default function ASD() {
  let [count, setCount] = React.useState(FrameBool(0, false))
  let [isPressed, setPressed] = React.useState(false)
  let [isDown, setDown] = React.useState(false)
  let [isUp, setUp] = React.useState(false)

  const { a, s, d, asd } = useKeyState(
    {
      a: 'a',
      s: 's',
      d: 'd',
      asd: 'a+s+d'
    },
    { keyRepeat: false }
  )

  // Because the changes happen too fast we have to
  // capture the down and up events and update the
  // state in a controlled loop:

  const capturedDown = React.useRef(false)
  if (asd.down) capturedDown.current = true
  const capturedUp = React.useRef(false)
  if (asd.up) capturedUp.current = true

  useInterval(() => {
    setCount(count + 1)
    setDown(capturedDown.current)
    setPressed(asd.pressed)
    setUp(capturedUp.current)
    capturedDown.current = false
    capturedUp.current = false
  }, 300)

  const classesA = cx({
    shortcut: true,
    a: true,
    pressed: a.pressed
  })

  const classesS = cx({
    shortcut: true,
    s: true,
    pressed: s.pressed
  })

  const classesD = cx({
    shortcut: true,
    d: true,
    pressed: d.pressed
  })

  const highlightClasses = cx({
    highlight: true,
    active: asd.pressed
  })

  return (
    <>
      <pre>
        <code>{`(asd.down)     ${isDown ? 'true' : 'false'}
(asd.pressed)  ${isPressed ? 'true' : 'false'}
(asd.up)       ${isUp ? 'true' : 'false'}`}</code>
      </pre>

      <div className="grid-asd">
        <div className={highlightClasses}>
          <span className={classesA}>A</span>
          <span className={classesS}>S</span>
          <span className={classesD}>D</span>
        </div>
      </div>
    </>
  )
}
