import { col, row, size } from '../types/board';

// export const board = new Array(size);

// export const board

// for (let i = 0; i < size; i++) {
//     if (i & 0x88) {
//         i += 7;
//         continue;
//     }
//     board[i] = i;
// }

export enum Square {
    a1 = 'a1',
    a2 = 'a2',
    a5 = 'a5',
    a8 = 'a8',
    h1 = 'h1',
}

export const SQUARE_MAP = {
    [Square.a1]: 112,
    [Square.a2]: 96,
    [Square.a5]: 48,
    [Square.a8]: 0,
    [Square.h1]: 119,
};

export function format_board<T, R>(board: T[], callback: (item: T) => R) {
    const result: R[][] = [];
    for (let i = 0; i < board.length; i++) {
        if (i & 0x88) {
            i += 7;
            continue;
        }

        if (i % 16 === 0) {
            result.push([]);
        }

        result[result.length - 1].push(callback(board[i]));
    }

    return result;
}

export function format_board_string<T>(board: T[][]) {
    // @ts-ignore
    return board.map(row => row.map(item => item?.toString().padStart(4, ' ')).join('')).join('\n');
}
