import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, Default } from 'sequelize-typescript';
import { Game } from './Game';

@Table({
  tableName: 'game_moves',
  timestamps: true,
})

export class GameMove extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Game)
  @Column(DataType.UUID)
  gameId!: string;

  @Column(DataType.JSON)
  moveData!: any;

  @Column(DataType.INTEGER)
  scoreBefore!: number;

  @Column(DataType.INTEGER)
  scoreAfter!: number;

  @BelongsTo(() => Game)
  game!: Game;
}

const snapshots: any[] = [];
    let currentBoard = board.map(row => [...row]);
    let totalScore = 0;
    let hasMatches = false;

    do {
      const matches = this.findMatches(currentBoard);
      if (matches.length === 0) break;

      hasMatches = true;
      
      const moveScore = randomItem 
        ? matches.filter(match => currentBoard[match.row][match.col] === randomItem).length
        : matches.length;
      
      totalScore += moveScore;

      currentBoard = this.removeMatches(currentBoard, matches);
      snapshots.push({
        board: currentBoard.map(row => [...row]),
        score: totalScore,
        action: 'matches_removed' as const
      });

      currentBoard = this.applyGravity(currentBoard);
      snapshots.push({
        board: currentBoard.map(row => [...row]),
        score: totalScore,
        action: 'gravity_applied' as const
      });

      currentBoard = this.fillEmptySpaces(currentBoard, itemsCount);
      snapshots.push({
        board: currentBoard.map(row => [...row]),
        score: totalScore,
        action: 'spaces_filled' as const
      });

    } while (this.hasMatches(currentBoard));

    return {
      finalBoard: currentBoard,
      snapshots,
      score: totalScore,
      hadMatches: hasMatches
    };
  }

  isValidSwap(board: string[][], fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const size = board.length;
    
    if (fromRow < 0  fromRow >= size  fromCol < 0  fromCol >= size 
        toRow < 0  toRow >= size  toCol < 0 || toCol >= size) {
      return false;
    }
    
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  checkGameCompletion(currentScore: number, targetScore: number): boolean {
    return currentScore >= targetScore;
  }

  canMakeValidMove(board: string[][]): boolean {
    const size = board.length;
    
    // Check all possible swaps
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Check right swap
        if (col < size - 1) {
          const swapped = this.swapItems(board, row, col, row, col + 1);
          if (this.hasMatches(swapped)) return true;
        }
        
        // Check down swap
        if (row < size - 1) {
          const swapped = this.swapItems(board, row, col, row + 1, col);
          if (this.hasMatches(swapped)) return true;
        }
      }
    }
    
    return false;
  }
}

export const gameService = new GameService();