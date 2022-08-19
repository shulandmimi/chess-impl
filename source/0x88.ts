const col = 8;
const row = 16;

const total = col * row;

const board = new Array(total);

for (let i = 0; i < total; i++) {
    if (i & 0x88) {
        i += 7;
        continue;
    }
    board[i] = i;
}

enum Piece {
    /** 兵 */
    PAWN,
    /** 车 */
    ROOK,
    /** 马 */
    NIGHT,
    /** 象 */
    BISHOP,
    /** 皇后 */
    QUEEN,
    /** 王 */
    KING,
}

const ATTACK_BIT = {
    [Piece.PAWN]: 0,

    [Piece.NIGHT]: 1,
    [Piece.BISHOP]: 2,
    [Piece.ROOK]: 3,
    [Piece.QUEEN]: 4,
    [Piece.KING]: 5,
};

const SQUARE_MAP = {
    a8: 0,
    h1: 119,
};

const MAP_POINT = {};

const MAP_SIZE = (SQUARE_MAP.h1 - SQUARE_MAP.a8) * 2 + 1;
const ATTACK_MAP = new Array(MAP_SIZE).fill(0);

function find_moves(piece: Piece, position: number) {
    const moves: number[] = [];

    if (position & 0x88) return moves;

    switch (piece) {
        case Piece.QUEEN: {
            // 左上 - 右上 - 右下 - 左下
            const offset = [-(row + 1), -(row - 1), row + 1, row - 1];
            for (let i = 0; i < offset.length; i++) {
                for (let j = position + offset[i]; !(j & 0x88); j += offset[i]) {
                    moves.push(j);
                }
            }
        }
        case Piece.ROOK: {
            const start = (position >> 4) * row;
            const end = start + col;

            // 横
            for (let i = start; i < end; i++) {
                if (i === position) continue;
                moves.push(i);
            }

            // 纵
            for (let i = position % row; !(i & 0x88); i += row) {
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
    const result: number[][] = Array.from({ length: col }, () => Array.from({ length: col }, () => 0));
    for (let i = 0; i < board.length; i++) {
        if (i & 0x88) {
            i += 7;
            continue;
        }

        const x = Math.floor(i >> 4);
        const y = i % row;
        result[x][y] = 1;
    }

    return result;
}

function format_moves(moves: number[], position: number) {
    const formatBoard = format_board(board);
    for (let i = 0; i < moves.length; i++) {
        const square = moves[i] >> 4;
        const x = Math.floor(square);
        const y = moves[i] % row;
        formatBoard[x][y] = 0;
    }
    // @ts-ignore
    formatBoard[position >> 4][position % row] = 'x';
    return formatBoard.map(item => item.join(' ')).join('\n');
}
// console.log(format_moves(find_moves(Piece.ROOK, 0), 0));
// console.log(format_moves(find_moves(Piece.QUEEN, row * 2 + 4), row * 2 + 4));

function create_axis_by_position(position: number, row: number) {
    return [(position / row) >> 0, position % row] as const;
}

const PIECE_OFFSETS = {
    [Piece.PAWN]: [row - 1, row + 1, -(row - 1), -(row + 1)],
    [Piece.NIGHT]: [-18, -33, -31, -14, 18, 33, 31, 14],
    [Piece.BISHOP]: [-(row + 1), -(row - 1), row + 1, row - 1],
    [Piece.ROOK]: [-row, row, -1, 1],
    [Piece.QUEEN]: [-(row + 1), -(row - 1), row + 1, row - 1, -row, row, -1, 1],
    [Piece.KING]: [-17, -16, -15, 1, -1, 17, 16, 15],
};

function piece_attack(piece: Piece, position: number, attack: number[]) {
    const bit = 1 << ATTACK_BIT[piece];
    const offset = PIECE_OFFSETS[piece];

    switch (piece) {
        case Piece.PAWN: {
            for (let i = 0; i < attack.length; i++) {
                const v = position + offset[i];
                attack[v] = attack[v] | bit;
            }
            break;
        }
        case Piece.NIGHT: {
            for (let i = 0; i < offset.length; i++) {
                const v = position + offset[i];
                attack[v] = attack[v] | bit;
            }
            break;
        }
        case Piece.BISHOP: {
            let start = position;

            for (let j = 0; j < 2; j++) {
                for (let i = start + offset[j]; i >= 0; i += offset[j]) {
                    attack[i] = attack[i] | bit;
                }
            }

            for (let j = 2; j < 4; j++) {
                for (let i = start + offset[j]; i < attack.length; i += offset[j]) {
                    attack[i] = attack[i] | bit;
                }
            }
            break;
        }
        case Piece.ROOK: {
            let start = position - 7,
                end = position + 8;
            const bit = 1 << ATTACK_BIT[Piece.ROOK];
            for (let i = start; i < end; i++) {
                if (i === position) continue;
                attack[i] = attack[i] | bit;
            }
            start = position % 16;
            for (let i = start; i < attack.length; i += 16) {
                if (i === position) continue;
                attack[i] = attack[i] | bit;
            }
            break;
        }
        case Piece.QUEEN: {
            let start = position - 7,
                end = position + 8;
            const bit = 1 << ATTACK_BIT[Piece.QUEEN];
            for (let i = start; i < end; i++) {
                if (i === position) continue;
                attack[i] = attack[i] | bit;
            }
            start = position % 16;
            for (let i = start; i < attack.length; i += 16) {
                if (i === position) continue;
                attack[i] = attack[i] | bit;
            }

            start = position;

            const offset = [-(row + 1), -(row - 1), row + 1, row - 1];
            for (let j = 0; j < 2; j++) {
                for (let i = start + offset[j]; i >= 0; i += offset[j]) {
                    attack[i] = attack[i] | bit;
                }
            }

            for (let j = 2; j < 4; j++) {
                for (let i = start + offset[j]; i < attack.length; i += offset[j]) {
                    attack[i] = attack[i] | bit;
                }
            }
            break;
        }
        case Piece.KING: {
            const offset = [-17, -16, -15, 1, 17, 16, 15, -1];
            const bit = 1 << ATTACK_BIT[Piece.KING];
            for (let i = 0; i < offset.length; i++) {
                const v = position + offset[i];
                attack[v] = attack[v] | bit;
            }
            break;
        }
    }
}

function genernal_attack_map() {
    const ATTACK_MAP = new Array(MAP_SIZE).fill(0);

    const center = (ATTACK_MAP.length / 2) >> 0;

    // 棋子所在位置
    ATTACK_MAP[center] = 'x';

    [Piece.PAWN, Piece.NIGHT, Piece.BISHOP, Piece.ROOK, Piece.QUEEN, Piece.KING].forEach(piece => {
        piece_attack(piece, center, ATTACK_MAP);
    });

    function format_view() {
        const res: number[][] = [];

        for (let i = 0; i < ATTACK_MAP.length; i++) {
            if (i % 16 === 0) {
                res.push([]);
            }
            res[res.length - 1].push(ATTACK_MAP[i]);
        }

        return res.map(row => row.map(item => (item || '0').toString().padStart(4, ' ')).join('')).join('\n');
    }

    console.log(format_view());
}
genernal_attack_map();

export {};
