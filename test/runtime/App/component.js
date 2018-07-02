import React, { PureComponent } from "react";
import Home from "../Home";
import Settings from "../Settings";

export default class App extends PureComponent {
  render() {
    return (
      <div>
        <Home />
        <Settings />
      </div>
    );
  }
}
