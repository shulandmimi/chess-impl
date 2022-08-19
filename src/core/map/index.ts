import { SQUARE_MAP } from '../chess/board';
import { col, row } from '../types/board';
import { Pieces } from '../types/piece';

export const MAP_SIZE = (SQUARE_MAP.h1 - SQUARE_MAP.a8) * 2 + 1;

const PIECE_OFFSETS = {
    [Pieces.PAWN]: [row - 1, row + 1, -(row - 1), -(row + 1)],
    [Pieces.NIGHT]: [-18, -33, -31, -14, 18, 33, 31, 14],
    [Pieces.BISHOP]: [-(row + 1), -(row - 1), row + 1, row - 1],
    [Pieces.ROOK]: [-row, row, -1, 1],
    [Pieces.QUEEN]: [-(row + 1), -(row - 1), row + 1, row - 1, -row, row, -1, 1],
    [Pieces.KING]: [-17, -16, -15, 1, -1, 17, 16, 15],
};

function piece_moves(piece: Pieces, position: number, map: number[], callback: (position: number, offset: number) => void) {
    const offset = PIECE_OFFSETS[piece];

    switch (piece) {
        case Pieces.PAWN: {
            for (let i = 0; i < offset.length; i++) {
                const v = position + offset[i];
                callback(v, offset[i]);
            }
            break;
        }
        case Pieces.NIGHT: {
            for (let i = 0; i < offset.length; i++) {
                const v = position + offset[i];
                callback(v, offset[i]);
            }
            break;
        }
        case Pieces.BISHOP: {
            let start = position;

            for (let j = 0; j < 2; j++) {
                for (let i = start + offset[j]; i >= 0; i += offset[j]) {
                    callback(i, offset[j]);
                }
            }

            for (let j = 2; j < 4; j++) {
                for (let i = start + offset[j]; i < map.length; i += offset[j]) {
                    callback(i, offset[j]);
                }
            }
            break;
        }
        case Pieces.ROOK: {
            let start = position - 7,
                end = position + 8;
            for (let i = start; i < end; i++) {
                if (i === position) continue;
                callback(i, i < position ? 1 : -1);
            }
            start = position % 16;
            for (let i = start; i < map.length; i += 16) {
                if (i === position) continue;
                callback(i, i > position ? 16 : -16);
            }
            break;
        }
        case Pieces.QUEEN: {
            let start = position - 7,
                end = position + 8;
            for (let i = start; i < end; i++) {
                if (i === position) continue;
                callback(i, i < position ? 1 : -1);
            }
            start = position % 16;
            for (let i = start; i < map.length; i += 16) {
                if (i === position) continue;
                callback(i, i > position ? 16 : -16);
            }

            start = position;

            const offset = [-(row + 1), -(row - 1), row + 1, row - 1];
            for (let j = 0; j < 2; j++) {
                for (let i = start + offset[j]; i >= 0; i += offset[j]) {
                    callback(i, offset[j]);
                }
            }

            for (let j = 2; j < 4; j++) {
                for (let i = start + offset[j]; i < map.length; i += offset[j]) {
                    callback(i, offset[j]);
                }
            }
            break;
        }
        case Pieces.KING: {
            const offset = [-17, -16, -15, 1, 17, 16, 15, -1];
            for (let i = 0; i < offset.length; i++) {
                const v = position + offset[i];
                callback(v, offset[i]);
            }
            break;
        }
    }
}

export function genernal_map(pices: Pieces[], callback: (piece: Pieces, map: number[], position: number, offset: number) => void) {
    const map = new Array(MAP_SIZE).fill(0);

    const center = (map.length / 2) >> 0;

    // 棋子所在位置
    map[center] = 'x';

    pices.forEach(piece => {
        piece_moves(piece, center, map, (position, offset) => {
            callback(piece, map, position, offset);
        });
    });

    return map;
}

export function format_map_view(map: number[]): string {
    const res: number[][] = [];

    for (let i = 0; i < map.length; i++) {
        if (i % 16 === 0) {
            res.push([]);
        }
        res[res.length - 1].push(map[i]);
    }

    return res.map(row => row.map(item => (item || '0').toString().padStart(4, ' ')).join('')).join('\n');
}
