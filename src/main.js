import { h, app } from "hyperapp"

const startingBalance = 1500

const state = {
    players: [],
    senderID: 0,
    recieverID: 1,
    inputAmount: 0,
    inputName: ""
}

const actions = {

    addPlayer: player => state => {

        let players = [ ...state.players, player ]

        return Object.assign(state, { players })

    },

    setBalance: ({id, balance}) => state => {
        
        let player = { ...state.players[id] }
        player.balance = balance

        let players = [ ...state.players ]
        players[id] = player

        return Object.assign(state, { players })

    },

    transfer: ({fromID, toID, amount}) => (state, actions) => {

        // console.log(fromID, toID, amount);
        
        let sender = state.players[fromID]
        let reciever = state.players[toID]

        actions.setBalance({id: fromID, balance: sender.balance - amount})
        actions.setBalance({id: toID, balance: reciever.balance + amount})

    },

    setInputAmount: inputAmount => state => {
        return Object.assign(state, { inputAmount: parseInt(inputAmount) })
    }
    

}

const view = (state, actions) =>
    h("main", {}, [
        // (() => console.log(state))(),
        h("div", { class: "container" }, [
            h("table", {}, [
                h("tr", {}, [
                    h("td", {}, "Name"),
                    h("td", {}, "Balance"),
                ]),
                state.players.map((player, index) => (
                    h("tr", {}, [
            //         h("tr", (() => {
            //             var obj = {
            //                 key: index
            //             }
            //             var str = ""
            //             if (index == state.senderID) {
            //                 str += "sender"
            //             }
            //             if (index == state.recieverID) {
            //                 str += "reciever"
            //             }
            //             if (str) {
            //                 obj.class = str
            //             }
            //             return obj
            //         })(), [
                        h("td", {}, player.name),
                        h("td", {}, ` $${player.balance}`),
                    ])
                ))
            ]),
            h("table", {}, [
                h("tr", {}, [
                    h("input", {type: "number", id: "inputAmount", value: state.inputAmount, oninput: event => actions.setInputAmount(event.target.value)})
                ]),
                h("tr", {}, [
                    h("input", {type: "button", class: "button", value: "Pay"})
                ]),
                h("tr", {}, [
                    h("input", {type: "button", class: "button", value: "Transfer", onclick: () => actions.transfer({fromID: 0, toID: 1, amount: 200})})
                ]),
                h("tr", {}, [
                    h("input", {type: "", id: "inputName"})
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
// setTimeout(() => main.transfer({fromID: 0, toID: 1, amount: 200}), 1000)
