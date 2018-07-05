import { all } from "redux-saga/effects";
import { saga as settings } from "../Settings";
import { saga as home } from "../Home";

/*
 *
 * Exports.
 *
 */

export default function*() {
  yield all([...settings, ...home]);
}
