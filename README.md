<p align="center">
  <img src="https://raw.githubusercontent.com/CaptainQuark/redux-sands/master/assets/ReduxSands%20hero.004.png" width="100%"/>
</p>

<br/><br/><br/>

<p align="center">
Redux-wrapper for React-components. As DRY as the desert: takes care of managing all boilerplate-code and lets you focus on the state-reducing functions. Supports saga-integration. Furthermore makes importing of actions/state-props from other Redux-components as simple as possible.
</p>

<br/><br/></br>

<p align="center">
<a href="https://www.npmjs.com/package/redux-sands">
  <img src="https://img.shields.io/npm/v/redux-sands.svg">
</a>
  <a href="https://github.com/CaptainQuark/redux-sands/blob/master/LICENSE">
  <img src="https://img.shields.io/npm/l/redux-sands.svg" >
</a>
  <a href="https://www.npmjs.com/package/redux-sands">
  <img src="https://img.shields.io/npm/dm/redux-sands.svg">
</a>
  <a href="https://www.npmjs.com/package/redux-sands">
  <img src="https://img.shields.io/bundlephobia/min/redux-sands.svg">
</a>
</a>
  <a href="https://www.npmjs.com/package/redux-sands">
  <img src="https://img.shields.io/travis/CaptainQuark/redux-sands.svg">
</a>
</p>

<br/><br/></br>

## Chapters

- [Installing](#installing)
- [Introduction](#introduction)
- [API](#api)
- [Change-Log](#change-log)

<br/><br/></br>

## Installing

Using npm:

> ```
> npm install redux-sands
> ```

Using yarn:

> ```
> yarn add redux-sands
> ```

<br/><br/></br>

## Introduction

`redux-sands` gives you a single class as default export, from now on called `ReduxWrapper`. Here's a simple example that demonstrates how you could use it:

```js
import ReduxWrapper from "redux-sands";
import component from "./component";

// Instantiate the wrapper.
const wrapper = new ReduxWrapper({ called: "example" });

// Simply add the initial state, the component for render + a reducer.
wrapper
  .add({ initState: { count: 0 } })
  .add({ component })
  .add({ update: (state, action) => ({ ...state, ...action.element }) });

// Expose the redux-wrapper as any other redux-component.
export default wrapper.connection;
export const reducer = wrapper.reducer;
```

And now let's call it:

```jsx
class Comp extends PureComponent {
  render() {
    // When using 'ReduxWrapper', only an object as param is allowed.
    // Provide your values then via that object.
    return (
      <div onClick={() => this.props.update({ count: this.props.count + 1 })}>
        Increment
      </div>
    );
  }
}
```

As far as basic use cases go, that's it! No more hassle with manually creating actions, mappings and endless switches. Action-types get inferred automatically, as well as the linking to the reducer. You can focus on the actual app logic without having to deal with refactoring etc.
<br/><br/>

Furthermore, `ReduxWrapper` provides additional skills to simplify redux-usage:

```js
...

wrapper
  .add({ initState: { count: 0 } })
  .add({ component })
  .add({ update: (state, { element }) => ({ ...state, ...element }) })
  .import({ reducer: { otherReduxComp: ["reset", { origin: "delete", as: "otherDelete" }] } })
  .import({ state: { otherReduxComp: ["schemas"] } });

// Expose the redux-wrapper as any other redux-component.
// Important: 'saga' has to be exported when using 'import(...)' and integrated into the store-middleware.
export default wrapper.connection;
export const reducer = wrapper.reducer;
export const saga = wrapper.saga;
```

You're able to import reducers as well as state-props from other `ReduxWrapper`s in a dead-simple fashion. As demonstrated above, you can either import them 'as-is' or apply renaming.
<br/><br/>

Last but not least, as hinted above, `redux-saga` is also supported. Here's how:

```js
...

wrapper
  .add({ initState: { data: {} } })
  .add({ component })
  .add({
    refetch: {
      fn: (state, { data = {} }) => {
        return { ...state, data };
      },
      withSaga: {
        takeEvery: function*(action) {
          const { url, result, put } = action;

          try {
            const data = yield fetch(url);
            yield put({ ...result, data });
          } catch (e) {
            yield put({ ...result, error: e });
          }
        }
      }
    }
  })

// Expose the redux-wrapper as any other redux-component.
export default wrapper.connection;
export const reducer = wrapper.reducer;
export const saga = wrapper.saga;
```

Here you can see a dummy-implementation that leverages the saga-integration. You provide both the standard reducer-function and a saga-function. The specific saga-fn gets derived by its key (currently only 'takeEvery' is implemented), with the value representing the actual generator-method used by saga. After the async calls are done, you place your params in the 'put' method, which is provided in the action (including 'call' from saga). The params then get passed to the reducer, where stuff gets done as usual.
<br/><br/>

That's it for an overview. For detailed info, take a look at the API-specs following.

<br/><br/></br>

## API

### `constructor`

Instantiate a new wrapper by providing arguments as values in an object.

Required args to pass:

- `called`
  - Provide a unique id for the wrapper in your app's namespace. Required for namespacing every added reducer/state.
  - Example: `const wrapper = new ReduxWrapper({ called: "demo" });`

Optional:

- `component`
  - React-component to connect to. Can be provided during init or via `add`.

### `add`

The function `add` is responsible for building your wrapper to actually do some stuff. Every `add` returns the instance, so you can nicely chain your additions.

Every `add`-call only takes an object which itself only has a single root-key, thus limiting each addition to one specific task.

#### `add({ initState: })`

Define a default state to fetch if no matching action-type has been found. Has to be provided, else redux can't set the default state, too. Same as in every standard reducer used with redux.

#### `add({ component: })`

Define the component for this wrapper. Not necessary if already done during init.

#### `add({ reducer: })`

Add a new reducer. **This call has a shorthand version, see next listing.**. You define a reducer by providing its name as the next key after `reducer`. The name-key itself has possible two children:

- `fn`: The reducer function, just as you know from standard redux.
  - Takes `(state, action)` as function-params.
  - Has to return a state-copy, as it's usally done by redux.
- `withSaga`: Provide an additional saga-listener.
  - Has only one children, which itself is a key, too: Represents one of saga's effect-functions, such as `takeEvery`, provided as strnig. The mapping to the correct function gets done by the wrapper.
  - The effect-name-key has the usual saga-generator as child.

#### `add({ ?: })`

When none of the keys above is provided, it's assumed you're providing a reducer in the shorthand version. Therefore, the key describes the reducer name and its child represents the reducer-functions itself. This is shortest way possible to add a reducer.

> Example: `.add({ update: (state, action) => ({...state, ...action}))`

### `connection`

Get the react-redux connection component. Variable, not a function.

### `reducer`

Get reducer for integration with the store. Variable, not a function.

### `saga`

Get the saga for integration with the store's middleware. Variable, not a function.

### `types(...)`

Get a mapping of all used reducer-names to the internally used action-types. If no strings are provided, a complete map of all names is returned. Otherwise provide a set of requested names, separated by colon.

> Example: ```wrapper.types("update", "remove")

<br/><br/></br>

## Change-Log

- 1.0.0-beta.2:
  - Added `types(...)` to export the internal types used. Returns an object, where each key is the reducer name and its value the matching internal type
  - First jest tests
- 1.0.0-beta.1:
  - Initial upload. Full support for state-prop + reducer creation. Full support for importing other's state and reducers. Basic saga integration (only observing 'takeEvery')
