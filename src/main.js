import { h, app } from "hyperapp"
import cc from "classcat"
// var fs = require("fs")

const nums = /[^\d]/g
const startingBalance = 1500

// function saveState(stateString) {
//     fs.writeFileSync("../save/save.json", stateString)
// }

// function loadState() {
//     return JSON.parse(fs.readFileSync("../save/save.json"))
// }

const state = {
    players: [{"name": "Free Parking", "balance":0}],
    senderID: -1,
    recipientID: -1,
    removalID: -1,
    transferAmount: 0,
    creationName: "",
    history: [],
}

const actions = {

    setTransferAmount: transferAmount => state => ({
        ...state,
        transferAmount: transferAmount
    }),

    setCreationName: creationName => state => ({
        ...state,
        creationName: creationName
    }),

    setRemovalID: removalID => state => ({
        ...state,
        removalID: removalID
    }),

    setSenderID: id => state => ({
        ...state,
        senderID: parseInt(id)
    }),

    setRecipientID: id => state => ({
        ...state,
        recipientID: parseInt(id)
    }),

    addPlayer: player => state => ({
        ...state,
        players: [ ...state.players, { name: `Player ${state.players.length + 1}`, balance: startingBalance, ...player } ],
        creationName: ""
    }),

    removePlayer: id => state => {

        let players = [ ...state.players ]

        if (id != -1) {
            players.splice(id, 1)
            id = -1
        }

        return {
            ...state,
            players,
            senderID: -1,
            recipientID: -1,
            removalID: -1
        }
    },

    setPlayerBalance: ({id, balance}) => state => {

        let players = [ ...state.players ]
        players[id] = {
            ...players[id],
            balance
        }

        return {
            ...state,
            players
        }

    },

    transferPlayerFunds: ({fromID, toID, amount}) => (state, actions) => {


        if (fromID !== toID) {
            if (fromID > -1) {
                let sender = state.players[fromID]
                actions.setPlayerBalance({id: fromID, balance: parseInt(sender.balance) - parseInt(amount)})
            }
            if (toID > -1) {
                let recipient = state.players[toID]
                actions.setPlayerBalance({id: toID, balance: parseInt(recipient.balance) + parseInt(amount)})
            }
        }

    },

    logHistory: value => state => {

        console.log(value)

        let history = [ ...state.history ]
        history.unshift(value)

        return {
            ...state,
            history
        }

    }

}

const view = (state, actions) =>
    h("main", {/*onkeyup: event => handleGlobalInput(event), */onselectstart: event => {event.preventDefault()}}, [
        // (() => actions.saveState(state)),
        (() => console.log(state)),
        h("div", {class: "container"}, [
            h("section", {class: "scoreboard"}, [
                h("div", {
                    id: -1,
                    onmouseup: event => {
                        let element = event.target
                        let id = element.id

                        while (id == "") {
                            element = element.parentElement
                            id = element.id
                        }

                        if (event.button == 0 && !event.shiftKey) {
                            actions.setRecipientID(parseInt(id))
                        } else if (event.button == 2 || event.button == 0 && event.shiftKey) {
                            actions.setSenderID(parseInt(id))
                        }
                    },
                    class: cc({
                        "scorecard": true,
                        "sender": -1 === state.senderID /*&& state.senderID >= 0*/,
                        "recipient": -1 === state.recipientID /*&& state.recipientID >= 0*/
                    })
                }, [
                    h("div", {
                        class: "scorecard__name"
                    }, "Bank"),
                    h("div", {
                        class: "scorecard__balance"
                    }, [
                        h("span", {}, "$"),
                        h("span", {}, "Heaps")
                    ])
                ]),
                state.players.map((player, index) => (
                    h("div", {
                        id: index,
                        onmouseup: event => {
                            let element = event.target
                            let id = element.id

                            while (id == "") {
                                element = element.parentElement
                                id = element.id
                            }

                            if (event.button == 0 && !event.shiftKey) {
                                actions.setRecipientID(parseInt(id))
                            } else if (event.button == 2 || event.button == 0 && event.shiftKey) {
                                actions.setSenderID(parseInt(id))
                            }
                        },
                        class: cc({
                            "scorecard": true,
                            "sender": index === state.senderID && state.senderID >= 0,
                            "recipient": index === state.recipientID && state.recipientID >= 0,
                            "negative": player.balance < 0,
                        })
                    }, [
                        h("div", {
                            class: "scorecard__name"
                        }, player.name),
                        h("div", {
                            class: "scorecard__balance"
                        }, [
                            h("span", {}, "$"),
                            h("span", {}, player.balance)
                        ])
                    ])
                ))
            ]),
            h("section", {class: "sidebar"}, [
                h("div", { class: "controls" }, [
                    h("div", {class: "w-50"}, [
                        h("label", {}, "Sender"),
                        h("select", { oninput: event => actions.setSenderID(event.target.value)}, [
                            h("option", {value: -1}, "Bank"),
                            state.players.map((player, index) => h("option", {value: index, selected: index === state.senderID}, player.name))
                        ])
                    ]),
                    h("div", {class: "w-50"}, [
                        h("label", {}, "Recipient"),
                        h("select", { oninput: event => actions.setRecipientID(event.target.value)}, [
                            h("option", {value: -1}, "Bank"),
                            state.players.map((player, index) => h("option", {value: index, selected: index === state.recipientID}, player.name))
                        ])
                    ]),
                    h("input", {type: "textarea", /*value: state.transferAmount,*/ oninput: event => {
                        event.target.value = event.target.value.replace(nums, "")
                        let amount = parseInt(event.target.value)
                        if (![NaN, 0].includes(amount)) {
                            actions.setTransferAmount(parseInt(event.target.value))
                        }
                    }}),
                    h("div", {class: "button-container"}, [
                        h("input", {type: "button", value: "Transfer", class: "transfer", onclick: () => {
                            actions.transferPlayerFunds({fromID: state.senderID, toID: state.recipientID, amount: state.transferAmount})
                            actions.logHistory([state.senderID >= 0 ? state.players[state.senderID].name : "The Bank", " gave ", state.recipientID >= 0 ? state.players[state.recipientID].name : "The Bank", " $", state.transferAmount, "."].join(""))
                        }}),
                        h("input", {type: "button", value: "All", onclick: () => {
                            actions.transferPlayerFunds({fromID: state.senderID, toID: state.recipientID, amount: state.senderID >= 0 ? state.players[state.senderID].balance : 0})
                            actions.logHistory([state.senderID >= 0 ? state.players[state.senderID].name : "The Bank", " gave ", state.recipientID >= 0 ? state.players[state.recipientID].name : "The Bank", " $", state.transferAmount, "."].join(""))
                        }})
                    ]),
                    h("div", {class: "button-container"}, [
                        h("input", {type: "button", value: "Give", class: "w-50",  onclick: () => {
                            actions.transferPlayerFunds({fromID: -1, toID: state.recipientID, amount: state.transferAmount})
                            actions.logHistory(["The Bank", " gave ", state.recipientID >= 0 ? state.players[state.recipientID].name : "The Bank", " $", state.transferAmount, "."].join(""))
                        }}),
                        h("input", {type: "button", value: "Take", class: "w-50",  onclick: () => {
                            actions.transferPlayerFunds({fromID: -1, toID: state.recipientID, amount: -state.transferAmount})
                            actions.logHistory(["The Bank", " took ", state.recipientID >= 0 ? state.players[state.recipientID].name : "The Bank", "'s $", state.transferAmount, "."].join(""))
                        }})
                    ])
                ]),
                h("div", { class: "controls"}, [
                    h("input", {type: "textarea", value: state.creationName, oninput: event => actions.setCreationName(event.target.value), onkeyup: event => {if (event.key == "Enter") {actions.addPlayer({name: state.creationName})}}}),
                    h("input", {type: "button", value: "Add Player", onclick: event => actions.addPlayer(state.creationName != "" ? {name: state.creationName} : {})}),
                    h("select", {value: state.removalID, onchange: event => actions.setRemovalID(event.target.value)}, [
                        h("option", {value: -1}, "No-one"),
                        state.players.map((player, index) => h("option", {value: index}, player.name))
                    ]),
                    h("input", {type: "button", value: "Remove Player", onclick: event => {actions.removePlayer(state.removalID)}}),
                ]),
                h("pre", {class: "history"}, state.history.join("\n"))
            ])
        ])
    ])

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    let str = "Suck nutt"
    event.returnValue = str;

    /*
    Add strigify and save state to text file
    also remember to add state restore on load
    */

    return str
});

const main = app(state, actions, view, document.body)