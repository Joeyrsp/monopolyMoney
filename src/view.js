import { h } from "hyperapp"
import cc from "classcat"

const nums = /[^\d]/g
const startingBalance = 1500

export const view = (state, actions) =>
h("main", {
        /*onkeyup: event => handleGlobalInput(event), */
        onselectstart: event => {event.preventDefault()}}, [
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
                h("input", {value: state.transferAmount != 0 ? state.transferAmount : "", oninput: event => {
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