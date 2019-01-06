import { h, app } from "hyperapp"

const startingBalance = 1500

const state = {
    players: [],
    sender: 0,
    reciever: 0
}

const actions = {

    addPlayer: player => state => {

        let players = [ ...state.players, player ]

        return Object.assign(state, { players })

    },

    setBalance: ({id, balance}) => state => {

        let player = state.players[id]
        player.balance = balance

        let players = [ ...state.players ]
        players[id] = player

        return Object.assign(state, { players })

    },

    transfer: ({fromID, toID, amount}) => (state, actions) => {


        let sender = state.players[fromID]
        let reciever = state.players[toID]

        actions.setBalance({id: fromID, balance: sender.balance - amount})
        actions.setBalance({id: toID, balance: reciever.balance + amount})

    }

}

const view = (state, actions) =>
    h("main", {}, [
        h("div", {class: "container"}, [
            h("table", {}, [
                h("tr", {}, [
                    h("td", {}, "Name"),
                    h("td", {}, "Balance"),
                ]),
                state.players.map((player, index) => (
                    h("tr", {}, [
                        h("td", {}, player.name),
                        h("td", {}, ` $${player.balance}`),
                    ])
                ))
            ]),
            h("div", {}, [
                h("table", {}, [
                    h("tr", {}, [
                        h("input", {type: "textarea"})
                    ]),
                    h("tr", {}, [
                        h("input", {type: "button", class: "button", value:"Pay"})
                    ]),
                    h("tr", {}, [
                        h("input", {type: "button", class: "button", value:"Transfer"})
                    ]),
                    h("tr", {}, [
                        h("input", {type: "textarea"})
                    ]),
                    h("tr", {}, [
                        h("input", {type: "button", class: "button", value:"Add Player"})
                    ])
                ])
            ])
        ])
    ])

const main = app(state, actions, view, document.body)

/*
main.addPlayer({name: "String", balance: startingBalance})
main.setBalance({id: Int, balance: Int})
main.transfer({fromID: Int, toID: Int, amount: Int})
*/

main.addPlayer({name: "joey", balance: startingBalance})
main.addPlayer({name: "astrid", balance: startingBalance})
main.transfer({fromID: 0, toID: 1, amount: 200})
