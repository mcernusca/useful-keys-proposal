import React from 'react'
import cx from 'classnames'
import { useKeyState } from './use-key-state'

export default function ASD() {
  const { esc, tab, shift, left, up, down, right, enter } = useKeyState(
    {
      esc: 'esc',
      tab: 'tab',
      shift: 'shift',
      left: 'left',
      up: 'up',
      down: 'down',
      right: 'right',
      enter: 'enter'
    },
    { keyRepeat: true }
  )

  const classesEsc = cx({
    shortcut: true,
    esc: true,
    pressed: esc.pressed
  })

  const classesTab = cx({
    shortcut: true,
    tab: true,
    pressed: tab.pressed
  })

  const classesShift = cx({
    shortcut: true,
    'shift-left': true,
    pressed: shift.pressed
  })

  const classesUp = cx({
    shortcut: true,
    up: true,
    pressed: up.pressed
  })

  const classesLeft = cx({
    shortcut: true,
    left: true,
    pressed: left.pressed
  })

  const classesDown = cx({
    shortcut: true,
    down: true,
    pressed: down.pressed
  })

  const classesRight = cx({
    shortcut: true,
    right: true,
    pressed: right.pressed
  })

  const classesReturn = cx({
    shortcut: true,
    return: true,
    pressed: enter.pressed
  })

  return (
    <div className="grid">
      <span className={classesEsc}>esc</span>
      <span className={classesTab}>tab</span>
      <span className={classesShift}>⇧</span>
      <span className={classesUp}>↑</span>
      <span className={classesLeft}>←</span>
      <span className={classesDown}>↓</span>
      <span className={classesRight}>→</span>
      <span className={classesReturn}>return</span>
    </div>
  )
}
