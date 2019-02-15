import { Frame } from './models'
import { zip } from 'lodash'

export const gridFrameToPxFrame = function(frame, cellSize) {
  const _origin = zipMap(gridToPx, frame.origin, cellSize)
  const _size = zipMap(gridToPx, frame.size, cellSize)
  return Frame(..._origin, ..._size)
}

export const gridSizeForContainerSize = function(containerSize, rows, cols) {
  return [
    Math.round(containerSize[0] / cols),
    Math.round(containerSize[1] / rows)
  ]
}

export const pxToGrid = function(val, cellDim) {
  return Math.round(val / cellDim)
}

export const gridToPx = function(val, cellDim) {
  return Math.round(val * cellDim)
}

export const snapToGrid = function(val, cellDim) {
  return pxToGrid(val, cellDim) * cellDim
}

export const cap = function(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

export const zipMap = function(fn, ...arrs) {
  return zip(...arrs).map(v => fn(...v))
}

export const moveH = function(count, direction, frame, rows, cols) {
  const { origin, size } = frame
  const x = cap(origin[0] + count * direction, 0, cols - size[0])
  return {
    ...frame,
    origin: [x, origin[1]]
  }
}

export const moveV = function(count, direction, frame, rows, cols) {
  const { origin, size } = frame
  const y = cap(origin[1] + +(count * direction), 0, rows - size[1])
  return {
    ...frame,
    origin: [origin[0], y]
  }
}
