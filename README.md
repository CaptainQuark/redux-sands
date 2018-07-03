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
  
  <a href="https://www.npmjs.com/package/redux-sands">
  <img src="https://img.shields.io/bundlephobia/min/redux-sands.svg">
</a>

<a href="https://www.npmjs.com/package/redux-sands">
  <img src="https://img.shields.io/npm/dm/redux-sands.svg">
</a>

<a href="https://www.npmjs.com/package/redux-sands">
  <img src="https://img.shields.io/travis/CaptainQuark/redux-sands.svg">
</a>

  <a href="https://github.com/CaptainQuark/redux-sands/blob/master/LICENSE">
  <img src="https://img.shields.io/npm/l/redux-sands.svg" >
</a>

  <a href="https://github.com/CaptainQuark/redux-sands/blob/master/LICENSE">
  <img src="https://github.com/CaptainQuark/redux-sands/blob/master/coverage/badge-functions.svg" >
</a>



</p>

<br/><br/></br>

## Quick Intro

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
  .add({ update: (state, action) => ({ ...state, ...action }) });

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

<br/>

<p align="center">
  <a href="https://neue-moderne.gitbook.io/redux-sands/">
  <img src="https://raw.githubusercontent.com/CaptainQuark/redux-sands/master/assets/gitbook-banner.png" width="100%"/>
  </a>
</p>
