// 참고: https://medium.com/geekculture/react-hook-to-allow-undo-redo-d9d791c5cd94
// 출처: https://github.com/jzcling/react-use-undoable-state#readme
// 아래 코드는 출처 typescript 코드를 참고하여 javascript로 변경한 코드임

import { useMemo, useState, useEffect } from "react";
// If you're only working with primitives, this is not required
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import React from "react";

export default function useUndoableState(init, debouncePeriod) {
  const [index, setIndex] = React.useState(0);
  const [state, setRawState] = React.useState(init);
  const [states, setStates] = React.useState([init]);

  const debouncedSetStates = React.useMemo(() => {
    return debounce((value) => {
        const copy = [...states];
        copy.length = index + 1; // delete all history after index
        copy.push(value);
        setStates(copy);
        setIndex(copy.length - 1);
      },
      debouncePeriod ?? 500
    );
  }, [states, index]);

  const setState = (value) => {
    if (isEqual(state, value)) {
      return;
    }
    setRawState(value);
    debouncedSetStates(value);
  };

  const resetState = (init) => {
    setIndex(0);
    setRawState(init);
    setStates([init]);
  };

  const goBack = (steps = 1) => {
    const newIndex = Math.max(0, index - (Number(steps) || 1));
    setIndex(newIndex);
    setRawState(states[newIndex]);
    return states[newIndex].text;
  };

  const goForward = (steps = 1) => {
    const newIndex = Math.min(
      states.length - 1,
      index + (Number(steps) || 1)
    );
    setIndex(newIndex);
    setRawState(states[newIndex]);
    return states[newIndex].text;
  };

  return {
    state,
    setState,
    resetState,
    index,
    lastIndex: states.length - 1,
    goBack,
    goForward,
  };
}
