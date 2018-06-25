<p align="center">
  <img src="https://github.com/CaptainQuark/redux-sands/blob/master/assets/ReduxSands%20hero.004.png" width="100%"/>
</p>

<br/><br/><br/>

<p align="center">
Redux-wrapper for React-components. As DRY as the desert: takes care of managing all boilerplate-code and lets you focus on the state-reducing functions. Supports saga-integration. Furthermore makes importing of actions/state-props from other Redux-components as simple as possible.
</p>

<br/><br/></br>

### Introduction
'redux-sands' gives you a class called `ReduxWrapper`. Here's a simple example that demonstrates how you could it:

```js
import ReduxWrapper from "redux-sands";
import component from "./component";

// Instantiate the wrapper.
const wrapper = new ReduxWrapper({ called: "example" });

// Simply add the inital state, the component for render + a reducer.
wrapper
  .add({ initState: { count: 0 } })
  .add({ component })
  .add({ update: (state, { element }) => ({ ...state, ...element }) })
  
// Expose the redux-wrapper as any other redux-component.
export default wrapper.connection;
export const reducer = wrapper.reducer;
```
<br/><br/>
As far as basic use cases go, that's it! No more hassle with manually creating actions, mappings and endless switches. Action-types get inferred automatically, as well as the linking to the reducer. You can focus on the acutal app logic without having to deal with refactoring etc.
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
// Important: 'saga' has to be exported when using 'import(...)'.
export default wrapper.connection;
export const reducer = wrapper.reducer;
export const saga = wrapper.saga;
```
<br/><br/>
You're also able to import reducers as well as state-props from other `ReduxWrapper`s in a dead-simple fashion. As demonstrated above, you can either import them 'as-is' or apply renaming.
