import React from 'react'
import Grid from './grid'
import GridWindow from './grid-window'
import { Frame } from './models'
import { useImmerReducer } from 'use-immer'

import './styles.css'

const initialState = {
  frames: [
    Frame(9, 4, 6, 4),
    Frame(2, 9, 13, 16),
    Frame(16, 2, 4, 4),
    Frame(16, 7, 14, 9),
    Frame(16, 17, 10, 13)
  ]
}

function reducer(draft, action) {
  switch (action.type) {
    case 'resize':
    case 'move': {
      draft.frames[action.index] = {
        ...draft.frames[action.index],
        ...action.payload
      }
      break
    }
    default: {
      break
    }
  }
}

export default function GridApp({ x, y, w, h, rows, cols }) {
  const [state, dispatch] = useImmerReducer(reducer, initialState)
  return (
    <React.StrictMode>
      <Grid
        frame={Frame(x, y, w, h)}
        rows={rows}
        cols={cols}
        dispatch={dispatch}
      >
        {state.frames.map((f, i) => (
          <GridWindow frame={f} key={i} />
        ))}
      </Grid>
    </React.StrictMode>
  )
}
