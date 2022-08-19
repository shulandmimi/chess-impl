export enum Pieces {
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

export const PIECES_MAP = {
    [Pieces.PAWN]: 'p',
    [Pieces.ROOK]: 'r',
    [Pieces.NIGHT]: 'n',
    [Pieces.BISHOP]: 'b',
    [Pieces.QUEEN]: 'q',
    [Pieces.KING]: 'k',
};
