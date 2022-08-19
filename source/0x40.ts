const col = 8;
const row = 8;

const total = col * row;

const board = new Array(total);

for (let i = 0; i < total; i++) {
    board[i] = i;
}

enum Piece {
    /** 兵 */
    PAWN,
    /** 车 */
    ROOK,
    /** 马 */
    KNIGHT,
    /** 象 */
    BISHOP,
    /** 皇后 */
    QUEEN,
    /** 王 */
    KING,
}

function find_moves(piece: Piece, position: number) {
    const moves: number[] = [];

    if (position & 0x40) return moves;

    switch (piece) {
        case Piece.QUEEN: {
            const offset = [-(row + 1), -(row - 1), row + 1, row - 1];
            for (let i = 0; i < offset.length; i++) {
                for (let j = position + offset[i]; !(j & 0x40); j += offset[i]) {
                    moves.push(j);
                }
            }

            // const start = Math.floor(position / )
        }
        case Piece.ROOK: {
            const start = Math.floor(position / row) * row;
            const end = start + row;

            // 横
            for (let i = start; i < end; i++) {
                if (i === position) continue;
                moves.push(i);
            }

            // 纵
            for (let i = position % row; !(i & 0x40); i += row) {
                if (i === position) continue;
                moves.push(i);
            }
            break;
        }
    }

    return moves;
}

// console.log(find_road(Piece.ROOK, 24).length);
// console.log(find_road(Piece.QUEEN, 24).length);

function format_board(board: number[]) {
    const result: number[][] = Array.from({ length: col }, () => Array.from({ length: row }, () => 0));
    for (let i = 0; i < board.length; i++) {
        const x = Math.floor(i / 8);
        const y = i % 8;

        result[x][y] = 1;
    }

    return result;
}

function format_moves(moves: number[], position: number) {
    const formatBoard = format_board(board);
    for (let i = 0; i < moves.length; i++) {
        const x = Math.floor(moves[i] / 8);
        const y = moves[i] % 8;

        formatBoard[x][y] = 0;
    }
    // @ts-ignore
    formatBoard[Math.floor(position / row)][position % row] = 'x';
    return formatBoard.map(item => item.join(' ')).join('\n');
}
console.log(board);
console.log(format_moves(find_moves(Piece.QUEEN, row * 2 + 4), row * 2 + 4));

export {};
