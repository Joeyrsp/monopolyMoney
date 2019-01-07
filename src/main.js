import { h, app } from "hyperapp"
import cc from "classcat"

const startingBalance = 1500

const state = {
    players: [],
    senderID: -1,
    recipientID: -1,
    transferAmount: 100,
    newPlayerName: "",
}

const actions = {

    setTransferAmount: transferAmount => state => ({
        ...state,
        transferAmount: parseInt(transferAmount) 
    }),

    addPlayer: player => state => ({
        ...state,
        players: [ ...state.players, { name: `Player ${state.players.length + 1}`, balance: startingBalance, ...player} ]
    }),

    setSenderID: id => state => ({
        ...state,
        senderID: parseInt(id)
    }),

    setRecipientID: id => state => ({
        ...state,
        recipientID: parseInt(id)
    }),

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

        console.log(fromID, toID)
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
    h("main", {}, [
        // (() => console.log(state))(),
        h("div", { class: "container" }, [
            h("section", { class: "scoreboard"}, [
                state.players.map((player, index) => (
                    h("div", { 
                        class: cc({
                            "scorecard": true,
                            "sender": index === state.senderID && state.senderID !== state.recipientID,
                            "recipient": index === state.recipientID && state.senderID !== state.recipientID,
                            "negative": player.balance < 0,
                        }) 
                    }, [
                        h("div", { class: "scorecard__name" }, player.name),
                        h("div", { 
                            class: cc({
                                "scorecard__balance": true,
                            })
                        }, [
                            h("span", {}, "$"),
                            h("span", {}, player.balance),
                        ]),
                    ])
                ))
            ]),
            h("section", { class: "sidebar" }, [
                h("div", { class: "controls"}, [
                    h("div", {class: "w-50"}, [
                        h('label', {}, "Sender"),
                        h("select", { oninput: event => actions.setSenderID(event.target.value)}, [
                            h("option", {value: -1}, "Bank"),
                            state.players.map(player => {
                                let id = getPlayerIDByName(player.name, state.players)
                                return h("option", {value: id, selected: id === state.senderID}, player.name)
                            } ),
                        ]),
                    ]),

                    h("div", {class: "w-50"}, [
                        h('label', {}, "Recipient"),
                        h("select", { oninput: event => actions.setRecipientID(event.target.value)}, [
                            h("option", {value: -1}, "Bank"),
                            state.players.map(player => {
                                let id = getPlayerIDByName(player.name, state.players)
                                return h("option", {value: id, selected: id === state.recipientID}, player.name)
                            } ),
                        ]),
                    ]),
                    h("input", {type: "number",value: state.transferAmount, oninput: event => actions.setTransferAmount(event.target.value)}),
                    h("button", {onclick: () => actions.transferPlayerFunds({fromID: state.senderID, toID: state.recipientID, amount: state.transferAmount})}, "Transfer"),
                ]),
                // TODO
                h("div", { class: "controls"}, [
                    h("input", {type: ""}),
                    h("button", {onmousedown: ""}, "Add Player"),
                ])
            ])
        ])
    ])

const main = app(state, actions, view, document.body)

/*
main.addPlayer({name: "String", balance: startingBalance})
main.setPlayerBalance({id: Int, balance: Int})
main.transferPlayerFunds({fromID: Int, toID: Int, amount: Int})
*/

main.addPlayer({name: "joey"})
main.addPlayer({name: "astrid"})
main.addPlayer({balance: 50})
