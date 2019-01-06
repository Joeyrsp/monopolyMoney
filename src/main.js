import { h, app } from "hyperapp"

const startingBalance = 1500

const state = {
    players: [],
    senderID: 0,
    recieverID: 0,
    inputAmount: 0,
    inputName: ""
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

    },

    setSelected: ({event, element}) => state => {

        console.log(event, element);

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
                    h("tr", () => {
                        var obj = {}
                        var str = ""
                        if (index == state.senderID) {
                            str += "sender"
                        }
                        if (index == state.recieverID) {
                            str += "reciever"
                        }
                        if (str) {
                            obj.class = str
                        }
                        console.log(str, obj);
                        return obj
                    }, [
                        h("td", {}, player.name),
                        h("td", {}, ` $${player.balance}`),
                    ])
                ))
            ]),
            h("table", {}, [
                h("tr", {}, [
                    h("input", {type: "textarea", id: "inputAmount", onInput: () => {state.inputAmount = this.value}})
                ]),
                h("tr", {}, [
                    h("input", {type: "button", class: "button", value: "Pay"})
                ]),
                h("tr", {}, [
                    h("input", {type: "button", class: "button", value: "Transfer", onClick: main.transfer({fromID: state.senderID, toID: state.recieverID, amount: state.inputAmount})})
                ]),
                h("tr", {}, [
                    h("input", {type: "textarea", id: "inputName"})
                ]),
                h("tr", {}, [
                    h("input", {type: "button", class: "button", value: "Add Player", onmousedown: ""})
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
