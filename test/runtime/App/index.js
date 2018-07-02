import React from "react";
import { Provider } from "react-redux";
import { createStore, createStoreWithMiddleware, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import globalReducers from "./global-reducers";
import globalSagas from "./global-sagas";
import App from "./component";

/*
 *
 * Attributes.
 *
 */

const sagaMiddleware = createSagaMiddleware();

/*
 *
 * Functions.
 *
 */

const AppContainer = () => {
  const createStoreWithMiddleware = compose(applyMiddleware(sagaMiddleware))(createStore);
  let store = createStoreWithMiddleware(globalReducers, {});

  sagaMiddleware.run(globalSagas);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

/*
 *
 * Exports.
 *
 */

export default AppContainer;
