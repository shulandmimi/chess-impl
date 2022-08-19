import { Square, SQUARE_MAP, format_board_string, format_board } from './core/chess/board';
import { genernal_map, format_map_view } from './core/map';
import { size, row } from './core/types/board';
import { Pieces, PIECES_MAP } from './core/types/piece';

const ATTACK_BIT = {
    [Pieces.PAWN]: 0,
    [Pieces.NIGHT]: 1,
    [Pieces.BISHOP]: 2,
    [Pieces.ROOK]: 3,
    [Pieces.QUEEN]: 4,
    [Pieces.KING]: 5,
};

const attack_map = genernal_map([Pieces.PAWN, Pieces.NIGHT, Pieces.BISHOP, Pieces.ROOK, Pieces.QUEEN, Pieces.KING], (piece, map, position) => {
    const bit = 1 << ATTACK_BIT[piece];
    map[position] |= bit;
});

const direction_map = genernal_map([Pieces.QUEEN], (piece, map, position, offset) => {
    if (offset === 1 || offset === -1) map[position] = offset;
    else map[position] = -offset;
});

class Piece {
    constructor(public type: Pieces, public color: 'b' | 'w') {}
}

class Chess {
    board: (Piece | undefined)[] = new Array(size);
    color: 'b' | 'w' = 'w';

    put(piece: Piece, square: Square) {
        this.board[SQUARE_MAP[square]] = piece;
    }

    remove(square: Square) {
        let piece = this.board[SQUARE_MAP[square]];

        if (!piece) return null;

        this.board[SQUARE_MAP[square]] = undefined;

        return piece;
    }

    move(from: Square, to: Square) {
        const [from_position, to_position] = [SQUARE_MAP[from], SQUARE_MAP[to]];
        const piece = this.board[SQUARE_MAP[from]];

        if (!piece) return null;

        const { color, type } = piece;
        if (color !== this.color) return null;

        // 计算两点之间的距离
        // + 199 是因为在 attack_map 表中距离偏移的问题
        let diff = from_position - to_position + 119;

        // 验证距离是否存储可达标记
        if (attack_map[diff] & (1 << ATTACK_BIT[type])) {
            const offset = direction_map[diff];
            let i = from_position + offset;

            // 障碍检测
            while (i !== to_position && this.board[i] === undefined) {
                i += offset;
            }

            if (i !== to_position) {
                return null;
            }

            this.remove(from);
            this.put(piece, to);
        }
    }

    clear() {
        this.board = new Array(size);
        this.color = 'w';
    }

    toString() {
        const res: string[][] = [];

        for (let i = 0; i < this.board.length; i++) {
            if (i % row === 0) res.push([]);
            if (i & 0x88) {
                i += 7;
                continue;
            }
            const piece = this.board[i];
            res[res.length - 1].push(piece ? PIECES_MAP[piece.type] : '*');
        }

        return res.map(row => row.map(item => item.padStart(4, ' ')).join('')).join('\n');
    }

    fen() {
        const res: string[] = [];
        const line: string[] = [];
        let line_pieces_count = 0;
        for (let i = 0; i < this.board.length; i++) {
            if (i & 0x88) {
                i += 7;
                continue;
            }

            if (i % row === 0 && i !== 0) {
                if (line_pieces_count) line.push(line_pieces_count.toString());
                res.push(line.join(''));
                line.length = 0;
                line_pieces_count = 0;
            }

            const piece = this.board[i];
            if (!piece) line_pieces_count++;
            else {
                if (line_pieces_count) {
                    line.push(line_pieces_count.toString());
                    line_pieces_count = 0;
                }
                const type = PIECES_MAP[piece.type];
                line.push(piece.color === 'w' ? type.toLocaleUpperCase() : type.toLocaleLowerCase());
            }
        }

        if (line_pieces_count) {
            line.push(line_pieces_count.toString());
        }
        res.push(line.join(''));
        return res.join('/');
    }
}

const chess = new Chess();

chess.put(new Piece(Pieces.ROOK, 'w'), Square.a1);

chess.put(new Piece(Pieces.PAWN, 'w'), Square.a5);

console.log(chess.fen());

chess.move(Square.a1, Square.a8);
console.log(chess.fen());
chess.move(Square.a1, Square.a2);
console.log(chess.fen());
chess.move(Square.a8, Square.a1);

// console.log(format_map_view(chess.board, (piece) => piece?.type.toString()));

console.log(format_board_string(format_board(chess.board, piece => (piece ? PIECES_MAP[piece.type] : '-'))));

// const createChessBoard = () => {
//     const board = new Array(size);
//     for (let i = 0; i < size; i++) {
//         if (i & 0x88) {
//             i += 7;
//             continue;
//         }
//         board[i] = i;
//     }

//     return board;
// };

console.log(format_map_view(attack_map));
console.log();
console.log(format_map_view(direction_map));
// console.log();
// console.log(format_board_string(format_board(createChessBoard())));
