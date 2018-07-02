import { all } from "redux-saga/effects";
import { saga as settings } from "../Settings";

/*
 *
 * Exports.
 *
 */

export default function*() {
  yield all([...settings]);
}
