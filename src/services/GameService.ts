import { 
  GameConfig, 
  Coordinate, 
  MoveResult, 
  Direction,
  SwapRequest
} from '../types/game.type';

export class GameService {
  private directions: Record<Direction, Coordinate> = {
    UP: { row: -1, col: 0 },
    DOWN: { row: 1, col: 0 },
    LEFT: { row: 0, col: -1 },
    RIGHT: { row: 0, col: 1 }
  };

  generateBoard(size: number, itemsCount: number): string[][] {
    const board: string[][] = [];
    
    for (let i = 0; i < size; i++) {
      const row: string[] = [];
      for (let j = 0; j < size; j++) {
        row.push(this.getRandomItem(itemsCount));
      }
      board.push(row);
    }
    
    // Ensure no initial matches
    while (this.hasMatches(board)) {
      return this.generateBoard(size, itemsCount);
    }
    
    return board;
  }

  getRandomItem(itemsCount: number): string {
    const items = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, itemsCount);
    return items[Math.floor(Math.random() * items.length)];
  }

  swapItems(board: string[][], fromRow: number, fromCol: number, toRow: number, toCol: number): string[][] {
    const newBoard = board.map(row => [...row]);
    const temp = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = newBoard[toRow][toCol];
    newBoard[toRow][toCol] = temp;
    return newBoard;
  }

  findMatches(board: string[][]): Coordinate[] {
    const matches = new Set<string>();
    const size = board.length;

    // Check horizontal matches
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size - 2; col++) {
        if (board[row][col] && 
            board[row][col] === board[row][col + 1] && 
            board[row][col] === board[row][col + 2]) {
          
          let matchLength = 3;
          while (col + matchLength < size && board[row][col] === board[row][col + matchLength]) {
            matchLength++;
          }
          
          for (let i = 0; i < matchLength; i++) {
            matches.add(`${row},${col + i}`);
          }
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < size; col++) {
      for (let row = 0; row < size - 2; row++) {
        if (board[row][col] && 
            board[row][col] === board[row + 1][col] && 
            board[row][col] === board[row + 2][col]) {
          
          let matchLength = 3;
          while (row + matchLength < size && board[row][col] === board[row + matchLength][col]) {
            matchLength++;
          }
          
          for (let i = 0; i < matchLength; i++) {
            matches.add(`${row + i},${col}`);
          }
        }
      }
    }

    return Array.from(matches).map(coord => {
      const [row, col] = coord.split(',').map(Number);
      return { row, col };
    });
  }

  removeMatches(board: string[][], matches: Coordinate[]): string[][] {
    const newBoard = board.map(row => [...row]);
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = '';
    });
    return newBoard;
  }

  applyGravity(board: string[][]): string[][] {
    const size = board.length;
    const newBoard = board.map(row => [...row]);
    
    for (let col = 0; col < size; col++) {
      let emptySpaces = 0;
      
      // Move from bottom to top
      for (let row = size - 1; row >= 0; row--) {
        if (newBoard[row][col] === '') {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newBoard[row + emptySpaces][col] = newBoard[row][col];
          newBoard[row][col] = '';
        }
      }
    }
    
    return newBoard;
  }

  fillEmptySpaces(board: string[][], itemsCount: number): string[][] {
    const size = board.length;
    const newBoard = board.map(row => [...row]);
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (newBoard[row][col] === '') {
          newBoard[row][col] = this.getRandomItem(itemsCount);
        }
      }
    }
    
    return newBoard;
  }

  hasMatches(board: string[][]): boolean {
    return this.findMatches(board).length > 0;
  }

  processMove(board: string[][], itemsCount: number, randomItem: string | null = null): MoveResult {
    const snapshots: any[] = [];
    let currentBoard = board.map(row => [...row]);
    let totalScore = 0;
    let hasMatches = false;

    do {
      const matches = this.findMatches(currentBoard);
      if (matches.length === 0) break;

      hasMatches = true;
      
      // Calculate score
      const moveScore = randomItem 
        ? matches.filter(match => currentBoard[match.row][match.col] === randomItem).length
        : matches.length;
      
      totalScore += moveScore;

      // Remove matches and apply gravity
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
    
    // Check if coordinates are valid
    if (fromRow < 0 || fromRow >= size || fromCol < 0 || fromCol >= size || 
        toRow < 0 || toRow >= size || toCol < 0 || toCol >= size) {
      return false;
    }
    
    // Check if swap is adjacent
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