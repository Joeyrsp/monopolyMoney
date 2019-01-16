import firebase from "firebase/app";
import database from "firebase/database";

firebase.initializeApp({
    apiKey: "AIzaSyD5TH5QIjPHUdg1bQeAZ8EOSrSQi3XW-9c",
    authDomain: "monopoly-money-31ed7.firebaseapp.com",
    databaseURL: "https://monopoly-money-31ed7.firebaseio.com",
    projectId: "monopoly-money-31ed7",
    storageBucket: "monopoly-money-31ed7.appspot.com",
    messagingSenderId: "5953251832"
});

const startingBalance = 1500

export const actions = {

    setTransferAmount: transferAmount => state => ({
        ...state,
        transferAmount: transferAmount
    }),

    setCreationName: newPlayerName => state => ({
        ...state,
        newPlayerName: newPlayerName
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

    setPlayers: players => state => ({
        ...state,
        players
    }),

    setNewPlayerName: newPlayerName => state => ({
        ...state,
        newPlayerName
    }),

    addPlayer: player => (state, actions) => {

        actions.setPlayers([ 
            ...state.players, 
            { 
                name: `Player ${state.players.length + 1}`, 
                balance: startingBalance, ...player
            }
        ])
        actions.setNewPlayerName("")
        actions.storePlayers("")

    },

    removePlayer: id => state => {

        let players = [ ...state.players ]

        if (id != -1) {
            players.splice(id, 1)
            id = -1
        }

        actions.setPlayers(players)
        actions.setSenderID(-1)
        actions.setRecipientID(-1)
        actions.setRemovalID(-1)
        actions.storePlayers("")
        
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

            actions.storePlayers()
        }

    },

    logHistory: value => state => {

        
        let history = [ ...state.history ]
        // console.log(history)

        history.unshift(value)

        return {
            ...state,
            history
        }

    },

    storePlayers: () => async state => {
        firebase.database().ref('players').set(state.players)
    }

}