import React from 'react'

// TODO extract
class EventEmitter {
  constructor() {
    this.events = {}
  }
  _getEventListByName(eventName) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = new Set()
    }
    return this.events[eventName]
  }
  on(eventName, fn) {
    this._getEventListByName(eventName).add(fn)
  }
  once(eventName, fn) {
    const self = this
    const onceFn = function(...args) {
      self.removeListener(eventName, onceFn)
      fn.apply(self, args)
    }
    this.on(eventName, onceFn)
  }
  emit(eventName, ...args) {
    this._getEventListByName(eventName).forEach(
      function(fn) {
        fn.apply(this, args)
      }.bind(this)
    )
  }
  removeListener(eventName, fn) {
    this._getEventListByName(eventName).delete(fn)
  }
}

const eventEmitter = new EventEmitter()
const eventsBeingListenedTo = {}
function emitDomEvent(event) {
  eventEmitter.emit(event.type, event)
}

const DocumentEventListener = {
  addEventListener(eventName, listener) {
    if (!eventsBeingListenedTo[eventName]) {
      document.addEventListener(eventName, emitDomEvent, true)
    }
    eventEmitter.on(eventName, listener)
  },
  removeEventListener(eventName, listener) {
    eventEmitter.removeListener(eventName, listener)
  }
}

//--

const KeyState = function(isDown = false, justReset = false) {
  this.pressed = isDown //current (live) combo pressed state
  this.down = isDown //only true for one read after combo becomes valid
  this.up = justReset //only true for one read after combo is no longer valid
}

const _get = function(context, key) {
  const expiredKey = `_${key}Expired`
  const valueKey = `_${key}`
  if (context[expiredKey]) {
    return false
  }
  context[expiredKey] = true
  return context[valueKey]
}

const _set = function(context, key, value) {
  const expiredKey = `_${key}Expired`
  const valueKey = `_${key}`
  context[expiredKey] = false
  context[valueKey] = value
}

Object.defineProperty(KeyState.prototype, 'down', {
  get: function() {
    return _get(this, 'down')
  },
  set: function(value) {
    return _set(this, 'down', value)
  }
})

Object.defineProperty(KeyState.prototype, 'up', {
  get: function() {
    return _get(this, 'up')
  },
  set: function(value) {
    return _set(this, 'up', value)
  }
})

// --

const toKey = str => {
  switch (str.toLowerCase()) {
    case 'tab':
      return 'Tab'
    case 'enter':
    case 'return':
      return 'Enter'
    case 'shift':
      return 'Shift'
    case 'ctrl':
    case 'cntrl':
      return 'Control'
    case 'option':
    case 'opt':
    case 'alt':
      return 'Alt'
    case 'esc':
    case 'escape':
      return 'Escape'
    case 'space':
      return ' '
    case 'left':
      return 'ArrowLeft'
    case 'up':
      return 'ArrowUp'
    case 'right':
      return 'ArrowRight'
    case 'down':
      return 'ArrowDown'
    case 'cmd':
    case 'meta':
      return 'Meta'
    case 'plus':
      return '+'
    case 'minus':
      return '-'
    default:
      return null
  }
}

const strDown = (input, down) => {
  const key = strToKey(input)
  return down(key)
}

const strToKey = input => {
  const key = toKey(input)
  return key ? key : input
}

const parseRule = rule => {
  return rule.split('+').map(str => str.trim())
}

const matchRule = (rule, down) => {
  const parts = parseRule(rule)
  const results = parts.map(str => strDown(str, down))
  return results.every(r => r === true)
}

// split parts, extract capture
const extractCaptureFlag = function(rule) {
  const parts = rule.split(',')
  if (parts[1] && parts[1].trim() === 'capture') {
    return { rule: parts[0].trim(), needsCapture: true }
  }
  // return { rules: [rule], needsCapture: false }
  return { rule: rule, needsCapture: false }
}

const initRulesMap = function(rulesMap, captureSet) {
  // extract capture set from rules
  const cleanMap = {}
  Object.entries(rulesMap).forEach(([key, value]) => {
    const { rule, needsCapture } = extractCaptureFlag(value)
    if (needsCapture) {
      const parts = parseRule(rule)
      parts.forEach(str => {
        captureSet.add(strToKey(str))
      })
    }
    cleanMap[key] = rule
  })
  return cleanMap
}

const initState = function(rulesMap) {
  const keysToStatus = {}
  Object.entries(rulesMap).forEach(([key, value]) => {
    keysToStatus[key] = new KeyState(false)
  })
  return keysToStatus
}

// --

const defaultConfig = {
  keyRepeat: true, // allow repeat events
  ignoreCapturedEvents: true // ignore defaultPrevented events

  //filterInputAcceptingElements: true,
  //filterTextInputs: true,
  //filterContentEditable: true
}

// should capture function? capture property on the state that can
// update based on other state? leftKey.capture = isDragging
// on key down, parse rule, check the current state prop?

export const useKeyState = function(rulesMap, config) {
  config = config ? { ...defaultConfig, ...config } : defaultConfig
  // Query live key state and some common key utility fns:
  const query = React.useMemo(
    () => ({
      pressed: input => {
        return matchRule(input, down)
      },
      space: () => {
        return down(toKey('space'))
      },
      shift: () => {
        return down(toKey('shift'))
      },
      ctrl: () => {
        return down(toKey('ctrl'))
      },
      alt: () => {
        return down(toKey('alt'))
      },
      option: () => {
        return down(toKey('option'))
      },
      meta: () => {
        return down(toKey('meta'))
      },
      esc: () => {
        return down(toKey('esc'))
      }
    }),
    []
  )

  // Set of keys to capture
  const captureSet = React.useRef(new Set([]))
  // Maintain a clean copy of the rules map passed in
  const cleanRulesMap = React.useRef({})
  // Keep track of what keys are down, currently bound to window
  const keyMap = React.useRef({})

  // This gets passed back to the caller and is updated
  // once any hotkey rule matches or stops matching
  const [state, setState] = React.useState(() => {
    cleanRulesMap.current = initRulesMap(rulesMap, captureSet.current)
    return {
      ...initState(cleanRulesMap.current),
      ...query
    }
  })

  const down = key => {
    return keyMap.current[key] || false
  }

  const updateState = () => {
    setState(prevState => {
      const tempState = { ...prevState }
      Object.entries(cleanRulesMap.current).forEach(([key, value]) => {
        const matched = matchRule(value, down)
        if (prevState[key].pressed !== matched) {
          const up = prevState[key].pressed && !matched
          tempState[key] = new KeyState(matched, up)
        }
      })
      return JSON.stringify(prevState) === JSON.stringify(tempState)
        ? prevState
        : tempState
    })
  }

  const handleDown = event => {
    // Ignore handled event
    if (event.defaultPrevented && config.ignoreCapturedEvents) {
      return
    }
    if (captureSet.current.has(event.key)) {
      event.preventDefault()
    }
    if (config.keyRepeat && event.repeat && keyMap.current[event.key]) {
      // handle it as a key up (drop every other frame, hack)
      handleUp(event)
      return
    }
    if (!keyMap.current[event.key]) {
      keyMap.current[event.key] = true
      updateState()
    }
  }

  const handleUp = event => {
    if (!keyMap.current[event.key]) {
      return
    }
    delete keyMap.current[event.key]
    updateState()
  }
  React.useEffect(() => {
    DocumentEventListener.addEventListener('keydown', handleDown)
    DocumentEventListener.addEventListener('keyup', handleUp)
    return () => {
      DocumentEventListener.removeEventListener('keydown', handleDown)
      DocumentEventListener.removeEventListener('keyup', handleUp)
    }
  }, [])
  return state
}

export default useKeyState
