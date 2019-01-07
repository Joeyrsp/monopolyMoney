import { h, app } from "hyperapp"
import cc from "classcat"

const startingBalance = 1500

const state = {
    players: [],
    senderID: -1,
    recipientID: -1,
    removalID: -1,
    transferAmount: 0,
    creationName: "",
}

const actions = {

    setTransferAmount: transferAmount => state => ({
        ...state,
        transferAmount: parseInt(transferAmount)
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

        let sender = state.players[fromID]
        let recipient = state.players[toID]

        if (fromID !== toID) {
            if (fromID > -1)
                actions.setPlayerBalance({id: fromID, balance: parseInt(sender.balance) - parseInt(amount)})
            if (toID > -1)
                actions.setPlayerBalance({id: toID, balance: parseInt(recipient.balance) + parseInt(amount)})
        }

    },

}

const getPlayerIDByName = (name, players) => players.map(p => p.name).indexOf(name)

const view = (state, actions) =>
    h("main", {onselectstart: event => {event.preventDefault()}}, [
        // (() => console.log(state))(),
        h("div", {class: "container"}, [
            h("section", {class: "scoreboard"}, [
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
                    h("input", {type: "number", value: state.transferAmount, oninput: event => actions.setTransferAmount(event.target.value), onkeyup: event => {if (event.key == "Enter") {actions.transferPlayerFunds({fromID: -1, toID: state.recipientID, amount: state.transferAmount})}}}),
                    h("button", {onclick: () => actions.transferPlayerFunds({fromID: -1, toID: state.recipientID, amount: state.transferAmount})}, "Pay"),
                    h("button", {onclick: () => actions.transferPlayerFunds({fromID: state.senderID, toID: state.recipientID, amount: state.transferAmount})}, "Transfer")
                ]),
                h("div", { class: "controls"}, [
                    h("input", {type: "textarea", value: state.creationName, oninput: event => actions.setCreationName(event.target.value), onkeyup: event => {if (event.key == "Enter") {actions.addPlayer({name: state.creationName})}}}),
                    h("button", {onclick: event => actions.addPlayer({name: state.creationName})}, "Add Player"),
                    h("select", {onchange: event => actions.setRemovalID(event.target.value)}, state.players.map((player, index) => h("option", {value: index}, player.name))),
                    h("button", {onclick: event => actions.removePlayer(state.removalID)}, "Remove Player")
                ])
            ])
        ])
    ])

const main = app(state, actions, view, document.body)