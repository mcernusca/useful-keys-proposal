import React from 'react'
import styled from 'styled-components'
import { useGesture } from 'react-with-gesture'
import { useSprings, animated } from 'react-spring'
import {
  gridFrameToPxFrame,
  gridSizeForContainerSize,
  snapToGrid,
  cap,
  zipMap,
  pxToGrid,
  moveH,
  moveV
} from './utils'
import cx from 'classnames'
import { useResizeHandles } from './resize-handles.js'
import { useEventCallback } from './use-event-callback'
import { useKeyState } from '../use-key-state'
import tabbable from 'tabbable'

const SPRING_CONFIG = { friction: 50, tension: 500 }

export default function Grid({ frame, rows, cols, children, dispatch }) {
  const [isDragging, setIsDragging] = React.useState(true)
  const [focusKey, setFocusKey] = React.useState(null)

  const cellSize = gridSizeForContainerSize(frame.size, rows, cols)
  const childrenArr = React.Children.toArray(children)

  // Springs
  const [animProps, set] = useSprings(childrenArr.length, index => {
    const child = childrenArr[index]
    const childFrame = gridFrameToPxFrame(child.props.frame, cellSize)
    return {
      origin: childFrame.origin,
      originSnap: childFrame.origin,
      size: childFrame.size,
      sizeSnap: childFrame.size,
      config: SPRING_CONFIG
    }
  })

  // Drag
  const bindDragHandlers = useGesture(
    useEventCallback(
      ({
        args: [index],
        event,
        first,
        delta: [xDelta, yDelta],
        down,
        shift
      }) => {
        // if (first) setIsDragging(true)
        // if (!down) setIsDragging(false)
        if (first) {
          event.target.focus()
        }

        const child = childrenArr[index]
        const childFrame = gridFrameToPxFrame(child.props.frame, cellSize)

        const _origin = [
          cap(
            childFrame.origin[0] + xDelta,
            0,
            frame.size[0] - childFrame.size[0]
          ),
          cap(
            childFrame.origin[1] + yDelta,
            0,
            frame.size[1] - childFrame.size[1]
          )
        ]
        const _originSnap = zipMap(snapToGrid, _origin, cellSize)

        set(
          i =>
            index === i && {
              immediate: down,
              origin: down ? _origin : _originSnap,
              originSnap: _originSnap
            }
        )

        if (!down && (xDelta || yDelta)) {
          dispatch({
            type: 'move',
            index: index,
            payload: {
              origin: zipMap(pxToGrid, _originSnap, cellSize)
            }
          })
        }
      }
    )
  )

  // Contain focus
  // TODO extract
  const canvasRef = React.useRef()
  const getFirstFocusableElement = () => {
    return tabbable(canvasRef.current)[0] || canvasRef.current
  }
  const containFocus = function(event) {
    if (
      isDragging &&
      canvasRef.current &&
      !canvasRef.current.contains(event.target)
    ) {
      event.stopPropagation()
      event.preventDefault()
      getFirstFocusableElement().focus()
    }
  }
  React.useEffect(
    () => {
      window.document.addEventListener('focus', containFocus, true)
      return () => {
        window.document.removeEventListener('focus', containFocus, true)
      }
    },
    [isDragging]
  )

  // Steal focus after we mount
  React.useEffect(() => {
    // This is not so fun with codesandbox...
    const isSandbox = window.location.host.endsWith('sandbox.io')
    if (isDragging && !isSandbox) {
      getFirstFocusableElement().focus()
    }
  }, [])

  // Keep active focus key so we know what to move
  // when using keyboard.
  // TODO: Think this could be a ref?
  const bindFocusHandlers = function(key) {
    return {
      onFocus: event => {
        setFocusKey(key)
      },
      onBlur: event => {
        setFocusKey(null)
      }
    }
  }

  // Keyboard
  const {
    esc,
    upArrow,
    downArrow,
    leftArrow,
    rightArrow,
    enter,
    shift
  } = useKeyState({
    esc: 'esc',
    upArrow: 'up,capture',
    downArrow: 'down,capture',
    leftArrow: 'left,capture',
    rightArrow: 'right,capture',
    enter: 'enter',
    shift: 'shift'
  })

  if (isDragging && focusKey !== null) {
    const index = focusKey
    const frame = childrenArr[index].props.frame
    let newFrame = frame
    const ammt = shift.pressed ? 5 : 1

    if (esc.down) {
      setIsDragging(false)
    } else {
      if (upArrow.down) {
        newFrame = moveV(ammt, -1, newFrame, cols, rows)
      }
      if (downArrow.down) {
        newFrame = moveV(ammt, 1, newFrame, cols, rows)
      }
      if (leftArrow.down) {
        newFrame = moveH(ammt, -1, newFrame, cols, rows)
      }
      if (rightArrow.down) {
        newFrame = moveH(ammt, 1, newFrame, cols, rows)
      }
    }

    if (newFrame !== frame) {
      dispatch({
        type: 'move',
        index: index,
        payload: newFrame
      })
    }
  } else if (enter.down) {
    setIsDragging(true)
  }

  // Resize
  const buildResizeHandles = useResizeHandles(
    useEventCallback(
      ({ args: [index], first, down, sizeDelta: [wDelta, hDelta] }) => {
        // if (first) setIsDragging(true)
        // if (!down) setIsDragging(false)

        const child = childrenArr[index]
        const {
          size: [w, h],
          origin: [x, y]
        } = gridFrameToPxFrame(child.props.frame, cellSize)

        const _origin = [w + wDelta, h + hDelta]
        const _size = zipMap(cap, _origin, cellSize, [
          frame.size[0] - x,
          frame.size[1] - y
        ])
        const _sizeSnap = zipMap(snapToGrid, _size, cellSize)

        set(
          i =>
            index === i && {
              immediate: down,
              size: down ? _size : _sizeSnap,
              sizeSnap: _sizeSnap
            }
        )

        if (!down) {
          dispatch({
            type: 'resize',
            index: index,
            payload: {
              size: zipMap(pxToGrid, _sizeSnap, cellSize)
            }
          })
        }
      }
    )
  )

  // Handle model updates
  React.useEffect(
    () => {
      React.Children.map(children, (child, index) => {
        set(i => {
          if (i === index) {
            const childFrame = gridFrameToPxFrame(child.props.frame, cellSize)
            return {
              immediate: false,
              origin: childFrame.origin,
              originSnap: childFrame.origin,
              size: childFrame.size,
              sizeSnap: childFrame.size
            }
          }
        })
      })
    },
    [children]
  )

  const canvasClasses = cx({
    'grid-canvas': true,
    'is-dragging': isDragging
  })

  return (
    <Canvas
      className={canvasClasses}
      frame={frame}
      cellSize={cellSize}
      onDragStart={event => event.preventDefault()}
      ref={canvasRef}
    >
      <RelativeWrapper>
        {React.Children.map(children, (child, i) => {
          const animChildProps = animProps[i]
          return (
            <>
              <StickyShadow
                className="grid-shadow"
                style={{
                  ...interpolateStyles(
                    animChildProps.sizeSnap,
                    animChildProps.originSnap
                  )
                }}
              />
              <animated.div
                {...bindFocusHandlers(i)}
                {...bindDragHandlers(i)}
                className="grid-item"
                tabIndex={0}
                style={{
                  position: 'absolute',
                  ...interpolateStyles(
                    animChildProps.size,
                    animChildProps.origin
                  )
                }}
              >
                {child}
                {buildResizeHandles(i)}
              </animated.div>
            </>
          )
        })}
      </RelativeWrapper>
    </Canvas>
  )
}

const interpolateStyles = function(animSize, animOrigin) {
  return {
    width: animSize.interpolate((w, _) => `${w}px`),
    height: animSize.interpolate((_, h) => `${h}px`),
    transform: animOrigin.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`)
  }
}

const Canvas = styled.div`
  position: relative;
  margin-top: ${props => props.frame.origin[1]}px;
  margin-left: ${props => props.frame.origin[0]}px;
  width: ${props => props.frame.size[0]}px;
  height: ${props => props.frame.size[1]}px;

  background: #e4edf4;
  background: lightblue;

  border-radius: 20px;

  &.is-dragging {
    background-size: ${props => props.cellSize[0]}px ${props =>
  props.cellSize[1]}px
    background-image: linear-gradient(
        to right,
        rgba(84, 84, 84, 0.2) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(84, 84, 84, 0.2) 1px, transparent 1px);
  }
`
const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`
const StickyShadow = styled(animated.div)`
  position: absolute;
  background: rgba(84, 84, 84, 0.2);
  will-change: transform, width, height;
  pointer-events: none;
`
