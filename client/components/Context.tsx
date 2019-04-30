import React, { useState } from 'react';
import * as actions from '../actions';

interface Context {
  state?: Record<string, any>;
  setState?: CallableFunction;
  users?: any;
}

export const Context = React.createContext<Context | null>(null);

export const ContextProvider = ({
  initialState,
  children,
}: {
  initialState: Record<string, any>;
  children: any;
}): JSX.Element => {
  const [state, setState] = useState(initialState);

  const providerActions = {
    setState: (values: Record<string, any>): void =>
      setState(
        (prevState: Record<string, any>): Record<string, any> => {
          return { ...prevState, ...values };
        },
      ),
    ...actions,
  };
  return (
    <Context.Provider
      value={{
        state: { ...state },
        ...providerActions,
      }}
    >
      {children}
    </Context.Provider>
  );
};
