import { Table, Column, Model, DataType, PrimaryKey, Default, Index } from 'sequelize-typescript';
import { Difficulty } from '../types/game.types';

@Table({
  tableName: 'leaderboards',
  timestamps: true,
})
export class Leaderboard extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  playerName!: string;

  @Column({
    type: DataType.ENUM('easy', 'medium', 'hard', 'custom'),
    allowNull: false,
  })
  difficulty!: Difficulty;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Completion time in seconds',
  })
  completionTime!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  score!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  boardSize!: number;

  @Index(['difficulty', 'completionTime'])
  @Column(DataType.VIRTUAL)
  get rankKey(): string {
    return ${this.difficulty}_${this.completionTime};
  }
}