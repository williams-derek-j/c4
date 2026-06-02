import Player from './Player'
import { validTokens } from './Player'
import Board from './Board'
import Tile from './Tile'

export class Game {
    #board: Board
    //#events
    #round: number = 1;
    #turn: number = 0;

    constructor(/*events*/) {
        //this.#events = events

        this.#board = new Board(3, 3);
    }
}