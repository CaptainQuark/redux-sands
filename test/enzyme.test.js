/**
 * @jest-environment jsdom
 */
import React from "react";
import ReactDOM from "react-dom";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount, render, configure } from "enzyme";
import AppReduxContainer from "./App"

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>App</h1>
        <p>The main component</p>
      </div>
    );
  }
}

configure({ adapter: new Adapter() });

describe("<App/>", () => {
  it("should render App", () => {
    const wrapper = shallow(<AppReduxContainer />);
    console.log(wrapper.debug());
  });
});
