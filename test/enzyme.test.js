/**
 * @jest-environment jsdom
 */
import React from "react";
import ReactDOM from "react-dom";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount, render, configure } from "enzyme";
import AppReduxContainer from "./App";
import App from "./App/component";
import Home from "./Home";

configure({ adapter: new Adapter() });

/*
 *
 * Setup.
 *
 */

const wrapper = mount(<AppReduxContainer />);

/*
 *
 * Tests.
 *
 */

describe("<AppReduxContainer/>", () => {
  it("should render AppReduxContainer", () => {
    expect(wrapper).toBeTruthy();
    //console.log(wrapper.children().debug());
  });

  it("should contain <Home/>", () => {
    expect(wrapper.find(Home).length).toEqual(1);
  });

  it("should contain init props in <Home/>", () => {
    //console.log(wrapper.find(Home).children().debug());
    expect(wrapper.find(Home).children().prop("count")).toEqual(5);
  });
});
