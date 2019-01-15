import { app } from "hyperapp"

// function saveState(stateString) {
//     fs.writeFileSync("../save/save.json", stateString)
// }

// function loadState() {
//     return JSON.parse(fs.readFileSync("../save/save.json"))
// }

import { state } from './state.js'
import { actions } from './actions.js'
import { view } from './view.js'

// window.addEventListener("beforeunload", function (event) {
//     event.preventDefault();
//     let str = "Suck nutt"
//     event.returnValue = str;

//     /*
//     Add strigify and save state to text file
//     also remember to add state restore on load
//     */

//     return str
// });

const main = app(state, actions, view, document.body)