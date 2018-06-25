//
//  redux/index.js
//  medoboard
//
//  Created by Thomas Schönmann on 20.6.2018.
//  Copyright © expressFlow GmbH. All rights reserved.
//
//  Model to minify Redux-debris in app.
//

const { connect } = require("react-redux");
const { takeEvery, call, put } = require("redux-saga/effects");

/*
 *
 * Classes.
 *
 */

exports.default = class ReduxWrapper {
  constructor(props) {
    if (!props.called) {
      throw Error("ReduxWrapper : constructor - missing 'called'-arg");
    }

    this._id = props.called;
    this.component = props.component || null;
    this.actionReducers = {};
    this.saga = [];
    this.otherStateProps = {};
    this.otherStateActions = {};
  }

  mapStateToProps(state) {
    let mapped = { ...state[this._id] };
    const props = { ...this.otherStateProps };

    //console.log(`ReduxWrapper : mapStateToProps : ...state[${this._id}] -`, mapped);
    //console.log("ReduxWrapper : mapStateToProps : ...this.otherStateProps -", props, ", _id -", this._id);

    Object.keys(props).forEach(id => {
      if (props[id] === "all") {
        return (mapped = { ...mapped, ...state[id] });
      }

      if (props[id].constructor === Array) {
        const otherCopy = { ...state[id] };

        // Now let's check each element in the array. It may be either
        //  - a String
        //  - an Object
        // based on the caller input. If it's an object, the wrapped comp
        // uses the foreign state-prop under a custom name. If only a string
        // is provided, we can copy as is.
        return props[id].forEach(element => {
          if (element.constructor === String) return (mapped[element] = otherCopy[element]);
          if (element.constructor === Object) return (mapped[element.as] = otherCopy[element.origin]);
          throw Error(`ReduxWrapper : mapStateToProps - Unsupported type as value for ${id} in ${element}`);
        });
      }

      throw Error(`ReduxWrapper : mapStateToProps - Unsupported type as value for ${id}`);
    });

    return { ...mapped };
  }

  mapDispatchToProps(dispatch) {
    return this.dispatches(dispatch);
  }

  add(props) {
    const { initState, component, reducer, otherStateProps } = props;

    // Let's see what param has been passed. Only one per add-call is valid.
    // If non was found, the caller uses the shorthand version to add an actionReducer.
    if (initState) this.initState = initState;
    else if (component) this.component = component;
    else if (reducer) this._addActionReducer({ action: reducer });
    else if (otherStateProps) this.otherStateProps = { ...this.otherStateProps, otherStateProps };
    // No matching key, which means we the caller provides a reducerAction. Now we
    // have to check if the value equals a function or an object containing the fn-key
    // (and maybe a 'withSaga'). If 'withSaga' is provided, the 'fn'-key is too.
    else this._addActionReducer({ action: props });

    return this;
  }

  import(props) {
    if (props.reducer) {
      this._importOtherDispatchProps(props);
    }

    if (props.state) {
      this._importOtherStateProps(props);
    }

    return this;
  }

  dispatches(dispatch) {
    const { actionReducers } = this;
    let obj = {};

    // Process own actionReducers.
    Object.keys(actionReducers).forEach(type => {
      obj = { ...obj, ...this._dispatch({ dispatch, type, action: actionReducers[type] }) };
      //obj[fnName] = params => dispatch(actionReducers[type].f({ type, ...params }));
    });

    // There might be imported ones as well.
    Object.keys(this.otherStateActions).forEach(wrapperName => {
      if (this._id === "waitingList") {
        console.log("ReduxWrapper : dispatches : this.otherStateActions -", this.otherStateActions);
      }

      this.otherStateActions[wrapperName].forEach(element => {
        const names = ReduxWrapper._extractImportReducerParams(element);
        const t = ReduxWrapper._createExternalTypes({
          namespace: wrapperName,
          fName: names.fName,
          _id: this._id
        });
        obj[names.exposedName] = params => dispatch({ type: t.proxy, dispatch, ...params });
      });
    });

    this._id === "waitingList" && console.log("ReduxWrapper : dispatches : obj for", this._id, " -", obj);

    return obj;
  }

  get connection() {
    return connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(this.component);
  }

  // Exposed to store.
  reducer(state = this.initState, action) {
    //console.log("ReduxWrapper : reducer : action -", action);
    //console.log("ReduxWrapper : reducer : this.actionReducers -", this.actionReducers);

    if (this.actionReducers[action.type] && this.actionReducers[action.type].isReducable)
      return this.actionReducers[action.type].f(state, action);

    return { ...state };
  }

  /*
   * Internal.
   */

  _dispatch(props) {
    const { dispatch, type, action } = props;
    const _action = { ...action };

    // If no name is provided, the action only lives
    // as a reducer without being exposed to the caller.
    // This is a valid use case, e.g. when implementing sagas.
    if (!_action.name) return;

    return {
      [_action.name]: params =>
        _action.params ? dispatch({ type, ...params, ..._action.params }) : dispatch({ type, ...params })
    };
  }

  _importOtherDispatchProps(props) {
    const copy = { ...props.reducer };

    Object.keys(copy).forEach(wrapperName => {
      this.otherStateActions[wrapperName] = copy[wrapperName];

      // Now add a saga call for each external action. The saga itself enables
      // a safe way for dispatching another action, in this the external one.
      //
      // This is necessary, b/c during the app's init it isn't guraranteed that
      // the external functions already exists. Therefore, we're using a proxy
      // that provides the 'real' action upon being called.
      copy[wrapperName].forEach(tuple => {
        const { fName, exposedName, withSaga } = ReduxWrapper._extractImportReducerParams(tuple);
        const t = ReduxWrapper._createExternalTypes({
          namespace: wrapperName,
          fName,
          _id: this._id,
          withSaga
        });

        this.saga.push(
          takeEvery(t.proxy, function*(action) {
            const copy = { ...action };
            const { dispatch } = copy;
            let foreignParams = {};

            Object.keys(action)
              .filter(key => key !== "dispatch" && key !== "type")
              .forEach(key => (foreignParams[key] = copy[key]));

            //console.log("ReduxWrapper : proxy reducer : action -", action);
            //console.log("ReduxWrapper : proxy reducer : dispatch -", { type: t.basic, ...foreignParams });

            // TODO:
            //
            // This is some redundant code. The saga-signatures for actions should be created in one place.
            // In this very example, we're dispatching a SAGA_REQ_...-action from another comp, if desired.
            withSaga
              ? yield put({ type: t.saga.req, call, put, result: { type: t.saga.rec }, ...foreignParams })
              : yield put({ type: t.basic, ...foreignParams });
          })
        );
      });

      /*
      console.log();
      console.log("ReduxWrapper : import : for _id -", this._id);
      console.log("ReduxWrapper : import : this.otherStateActions -", this.otherStateActions);
      console.log("ReduxWrapper : import : this.saga -", this.saga);
      */
    });
  }

  _importOtherStateProps(props) {
    const stateCopy = { ...props.state };
    Object.keys(stateCopy).forEach(
      id => (this.otherStateProps = { ...this.otherStateProps, [id]: stateCopy[id] })
    );
  }

  _addActionReducer({ action }) {
    if (action[Object.keys(action)[0]].withSaga) return this._addSaga(action);
    else this._addAtomicActionReducer({ action, isShort: !action[Object.keys(action)[0]].fn });
  }

  _addAtomicActionReducer({ action, isShort = false }) {
    const _action = { ...action };
    const actionKey = Object.keys(_action)[0];
    const type = `${this._id.toUpperCase()}_${actionKey.toUpperCase()}`;

    //console.log("ReduxWrapper : addAction : this.actionReducers -", this.actionReducers);
    this.actionReducers[type] = {
      name: actionKey,
      f: isShort ? _action[actionKey] : _action[actionKey].fn,
      isReducable: true
    };
  }

  _addSaga(action) {
    // Only one key in 'withSaga', which is the name of
    // the saga-function that listens, e.g. takeEvery.
    const exposedFnName = Object.keys(action)[0];
    const sagaFnName = Object.keys(action[exposedFnName].withSaga)[0];
    switch (sagaFnName) {
      case "takeEvery":
        return this._addSagaAction({ action, exposedFnName, sagaFnName, sagaListener: takeEvery });
      default:
        throw "ReduxWrapper : _addSaga : fn-signature unknown. The key in 'withSaga' can't be used or isn't provided.";
    }
  }

  _addSagaAction({ action, exposedFnName, sagaFnName, sagaListener }) {
    const _action = { ...action };
    const actionKey = Object.keys(_action)[0];
    const reqType = `SAGA_REQ_${this._id.toUpperCase()}_${actionKey.toUpperCase()}`;
    const recType = `SAGA_REC_${this._id.toUpperCase()}_${actionKey.toUpperCase()}`;

    // First declare the action to trigger the saga-sideeffect. Won't be registered
    // in the reducer, but will provide some params in the action.
    this.actionReducers[reqType] = {
      name: actionKey,
      isReducable: false,
      params: { call, put, result: { type: recType } }
    };

    // Now provide the saga-fn. The logic is contained as a function
    // in 'withSaga' by the caller.
    this.saga.push(sagaListener(reqType, _action[exposedFnName].withSaga[sagaFnName]));

    // Finally add the reducer provided by the caller. This function
    // deals with the saga's result.
    this.actionReducers[recType] = { f: _action[actionKey].fn, isReducable: true };

    console.log("ReduxWrapper : _addSagaAction : this.saga -", this.saga);
    console.log("ReduxWrapper : _addSagaAction : this.actionReducers -", this.actionReducers);
  }

  static _createExternalTypes({ namespace, fName, _id, withSaga = false }) {
    const tuples = {
      basic: `${namespace.toUpperCase()}_${fName.toUpperCase()}`,
      proxy: `${_id.toUpperCase()}_PROXY_${namespace.toUpperCase()}_${fName.toUpperCase()}`
    };

    if (withSaga)
      tuples.saga = {
        req: `SAGA_REQ_${namespace.toUpperCase()}_${fName.toUpperCase()}`,
        rec: `SAGA_REC_${namespace.toUpperCase()}_${fName.toUpperCase()}`
      };

    return { ...tuples };
  }

  static _extractImportReducerParams(element) {
    let names = {};
    if (element.constructor === String) names = { fName: element, exposedName: element, withSaga: false };
    else if (element.constructor === Object) {
      if (!element.origin) throw Error("No 'origin' provided in element to read from.");
      names = {
        fName: element.origin,
        exposedName: element.as || element.origin,
        withSaga: element.withSaga || false
      };
    } else throw Error("Unexpected type in otherStateActions' key found.");

    return { ...names };
  }
};
