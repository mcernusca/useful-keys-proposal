import React from "react";
import { cap } from "./grid/utils";

import useWindowSize from "./grid/use-window-size";
import styled from "styled-components";
import GridApp from "./grid/index";
import KeyboardDemo from "./keyboard";

const rc = 32;
const keyboardHeight = 180;
const topMargin = 3 * 20;

export default function GridDemo() {
  // Figure out available space for the grid given we have 32 columns
  // and we will give it half the screen horizontally
  // and full height - 200px for the bottom keyboard demo

  const { width, height } = useWindowSize();
  const cappedWith = cap(width, 1200, Number.MAX_SAFE_INTEGER);
  const avHeight = Math.round(height - keyboardHeight - topMargin);
  let dim = Math.round(cappedWith / 2);
  dim = Math.min(dim, avHeight);
  dim = Math.round(dim / rc) * rc;
  const x = (Math.round(cappedWith / 2) - dim) / 2;
  const y = 0;

  return (
    <div>
      <GridApp x={x} y={y} w={dim} h={dim} rows={rc} cols={rc} />
      <KeyboardWrapper>
        <KeyboardDemo />
      </KeyboardWrapper>
    </div>
  );
}

const KeyboardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${keyboardHeight}px;
  display: flex;
  align-items: center;
`;
