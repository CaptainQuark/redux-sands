import { combineReducers } from "redux";
import { reducer as home } from "../Home";
import { reducer as settings } from "../Settings";

export default combineReducers({ home, settings });
