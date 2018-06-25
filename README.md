<p align="center">
  <img src="https://github.com/CaptainQuark/redux-sands/blob/master/assets/ReduxSands%20hero.004.png" width="100%"/>
</p>

<br/><br/><br/>

<p align="center">
Redux-wrapper for React-components. As DRY as the desert: takes care of managing all boilerplate-code and lets you focus on the state-reducing functions. Supports saga-integration. Furthermore makes importing of actions/state-props from other Redux-components as simple as possible.
</p>

<br/><br/></br>

> Note:
> This package is currently in in beta and under active development, so please install via:<br/>
> `npm install redux-sands@beta`

<br/><br/></br>

### Introduction
`redux-sands` gives you a single class as default export, from now on called `ReduxWrapper`. Here's a simple example that demonstrates how you could use it:

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
And now let's call it:
```jsx
class Comp extends PureComponent {
  render(){
  
    // When using 'ReduxWrapper', only an object as param is allowed.
    // Provide your values then via that object.
    return <div onClick={() => this.props.update({count: this.props.count + 1})>Click</div/>
  }
}
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
<br/><br/>
Here you can see a dummy-implementation that leverages the saga-integration. You provide both the standard reducer-function and a saga-function. The specific saga-fn gets derived by its key (currently only 'takeEvery' is implemented), with the value representing the actual generator-method used by saga. After the async calls are done, you place your params in the 'put' method, which is provided in the action (including 'call' from saga). The params then get passed to the reducer, where stuff gets done as usual.
<br/><br/>

That's it for an overview. For detailed info, take a look at the API-sepcs following (coming soon).
