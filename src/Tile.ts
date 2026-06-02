import Player from './Player'
import { validTokens } from './Player'

export default class Tile {
    #r: number
    #c: number
    #token: validTokens | null
    #seqCoords: number[][] = []
    #seqRow: Tile[] = []
    #seqCol: Tile[] = []
    #seq_NW_SE: Tile[] = []
    #seq_SW_NE: Tile[] = []

    #visited = false

    constructor(r: number, c : number) {
        this.#r = r
        this.#c = c

        this.#token = null
    }

    get token() {
        return this.#token
    }

    set token(val: validTokens | null) {
        this.#token = val
    }

    get r() {
        return this.#r
    }

    get c() {
        return this.#c
    }

    get seqCoords() {
        return this.#seqCoords
    }

    addSeqCoords(r: number, c: number) {
        this.#seqCoords.push([r, c])
    }

    get seqRow() {
        return this.#seqRow
    }

    get seqCol() {
        return this.#seqCol
    }

    get seq_NW_SE() {
        return this.#seq_NW_SE
    }

    get seq_SW_NE() {
        return this.#seq_SW_NE
    }

    addSeqTileRow(tile: Tile) {
        if (tile.r < this.#r) {
            this.#seqRow.unshift(tile)
        } else {
            this.#seqRow.push(tile)
        }
    }

    addSeqTileCol(tile: Tile) {
        if (tile.c < this.#c) {
            this.#seqCol.unshift(tile)
        } else {
            this.#seqCol.push(tile)
        }
    }

    addSeqTile_NW_SE(tile: Tile) {
        if (tile.c < this.#c) {
            this.#seq_NW_SE.unshift(tile)
        } else {
            this.#seq_NW_SE.push(tile)
        }
    }

    addSeqTile_SW_NE(tile: Tile) {
        if (tile.c < this.#c) {
            this.#seq_SW_NE.unshift(tile)
        } else {
            this.#seq_SW_NE.push(tile)
        }
    }

    searchTileSequence()

    compare(other: Tile): number {
        if (this.#r !== other.#r) {
            return this.#r - other.#r
        } else if (this.#c !== other.#c) {
            return this.#c - other.#c
        }
        return 0
    }
}