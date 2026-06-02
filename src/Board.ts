import Tile from "./Tile";
import {validTokens} from "./Player";

export default class Board {
    #board: Tile[][] = []
    #width: number = 0
    #height: number = 0
    #numToWin = 3 // minimum is 3 or first player to move always wins
    #coordsToTile: Map<number[], Tile> = new Map()

    constructor(width: number, height: number) {
        this.#width = width
        this.#height = height

        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                const tile: Tile = new Tile(r, c)

                this.#board[r][c] = tile

                for (let i = 1; i < this.#numToWin; i++) { // count contiguous tiles < numToWin away in any direction to find potential winning sequences
                    let nextRow = r + i
                    let nextCol = c + i
                    let prevRow = r - i
                    let prevCol = c - i

                    let NE = 0 // number of contiguous tiles to NE
                    let NW = 0
                    let SW = 0
                    let SE = 0
                    let counter = this.#numToWin - 1;
                    while (counter > 0) { // count contiguous tiles SE
                        if (r - counter >= 0 && c + counter < this.#width) { // NE
                            if (NE == 0) { // NE hasn't been set yet
                                NE = counter
                            }
                        }
                        if (r - counter >= 0 && c - counter >= 0) { // NW
                            if (NW == 0) { // NW hasn't been set yet
                                NW = counter
                            }
                        }
                        if (r + counter < this.#height && c - counter >= 0) { // SW
                            if (SW == 0) { // SW hasn't been set yet
                                SW = counter
                            }
                        }
                        if (r + counter < this.#height && c + counter < this.#width) { // SE
                            if (SE == 0) { // SE hasn't been set yet
                                SE = counter
                            }
                        }
                        counter--
                    }
                    if (NW + SE >= this.#numToWin - 1) { // NW + SE + 1 (current tile) >= numToWin?
                        // SE diagonal
                        if (r < this.#height - 1 && c < this.#width - 1) { // can't be last row or colum to have a tile to SE
                            tile.addSeqCoords(nextRow, nextCol)
                        }
                        // NW diagonal
                        if (r > 0 && c > 0) { // can't be first row or column to have a tile to NW
                            tile.addSeqCoords(prevRow, prevCol)
                        }
                    }
                    if (SW + NE >= this.#numToWin - 1) { // SW + NE + 1 (current tile) >= numToWin?
                        //NE diagonal
                        if (r > 0 && c < this.#width - 1) { // can't be first row or last colum to have a tile to NE
                            tile.addSeqCoords(prevRow, nextCol)
                        }
                        // SW diagonal
                        if (r < this.#height - 1 && c > 0) { // can't be last row or first column to have a tile to SW
                            tile.addSeqCoords(nextRow, prevCol)
                        }
                    }

                    if (nextRow < height) { // to wrap around row/column
                        tile.addSeqCoords(nextRow, c)
                    }
                    if (nextCol < width) {
                        tile.addSeqCoords(r, nextCol)
                    }
                    if (prevRow >= 0) {
                        tile.addSeqCoords(prevRow, c)
                    }
                    if (prevCol >= 0) {
                        tile.addSeqCoords(r, prevCol);
                    }
                }
            }
        }

        for (const row of this.#board) { // populating adjacency list of each tile with obj references to sequential/adjacent tiles sharing winning sequences with current tile
            for (const tile of row) {
                for (const sequential of tile.seqCoords) {
                    const r = sequential[0]
                    const c = sequential[1]

                    if (r == tile.r) {
                        tile.addSeqTileRow(this.#board[r][c])
                    } else if (c == tile.c) {
                        tile.addSeqTileCol(this.#board[r][c])
                    } else if (r > tile.r && c > tile.c || r < tile.r && c < tile.c) {
                        tile.addSeqTile_NW_SE(this.#board[r][c])
                    } else if (r > tile.r && c < tile.c || r < tile.r && c > tile.c) {
                        tile.addSeqTile_SW_NE(this.#board[r][c])
                    }
                }
            }
        }
    }

    get width() {
        return this.#width
    }

    get height() {
        return this.#height
    }

    getTile(r: number, c: number) {
        return this.#board[r][c]
    }

    getRow(r: number) {
        return this.#board[r]
    }

    getCol(c: number) {
        const column: Tile[] = []

        for (let r = 0; r < this.#width; r++) {
            column[r] = this.#board[r][c]
        }
        return column
    }

    placeToken(token: validTokens, r: number, c: number): boolean {
        const tile = this.getTile(r, c) as Tile

        if (tile.token === null) { tile.token = token } else { return false }

        if(this.#checkWin(tile)) {
            //
        } else {
            //
        }
        return true
    }

    #checkSeq(seq: Tile[], token: validTokens, includeCurrTile?: boolean): boolean {
        let count;
        if (includeCurrTile) {
            count = this.#numToWin - 1
        } else {
            count = this.#numToWin
        }

        for (const tile of seq) {
            if (tile.token === token) {
                count--
                if (count === 0) {
                    return true
                }
            } else {
                count = this.#numToWin
            }
        }
        return false
    }

    #checkWin(tile?: Tile): boolean {
        const board = this.#board

        if (tile) {
            if (tile.token) {
                if (this.#checkSeq(tile.seqRow, tile.token, true)) {
                    return true
                }
                if (this.#checkSeq(tile.seqCol, tile.token, true)) {
                    return true
                }
                if (this.#checkSeq(tile.seq_NW_SE, tile.token, true)) {
                    return true
                }
                if (this.#checkSeq(tile.seq_SW_NE, tile.token, true)) {
                    return true
                }
            } else {
                throw new Error("Tile is empty")
            }
        } else {
            for (const row of this.#board) { // check for wins in rows
                for (const token of Object.values(validTokens)) {
                    if (this.#checkSeq(row, token, false)) {
                        return true
                    }
                }
            }

            for (let c = 0; c < this.#width; c++) { // check for wins in columns
                for (const token of Object.values(validTokens)) {
                    if (this.#checkSeq(this.getCol(c), token, false)) {
                        return true
                    }
                }
            }

            // TO-DO: check all diagonals >= numToWin, probably have to iterate through every tile and check their adjacency lists
        }
        return false
    }
}