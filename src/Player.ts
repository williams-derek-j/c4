export enum validTokens {
    X = "X",
    O = "O",
}

export default class Player {
    #id: number;
    #token: validTokens;
    #numOfWins: number = 0;
    #gamesPlayed: number = 0;

    constructor(id: number, token: validTokens) {
        this.#id = id;
        this.#token = token;
    }

    get id() {
        return this.#id;
    }

    get token() {
        return this.#token;
    }

    get numOfWins() {
        return this.#numOfWins;
    }

    set numOfWins(val) {
        this.#numOfWins = val;
    }

    get gamesPlayed() {
        return this.#gamesPlayed;
    }

    set gamesPlayed(val) {
        this.#gamesPlayed = val;
    }
}