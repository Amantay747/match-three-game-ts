import { Table, Column, Model, DataType, HasMany, PrimaryKey, Default } from 'sequelize-typescript';
import { Difficulty, GameStatus } from '../types/game.types';
import { GameMove } from './GameMove';

@Table({
  tableName: 'games',
  timestamps: true,
})
export class Game extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.ENUM('easy', 'medium', 'hard', 'custom'),
    allowNull: false,
  })
  difficulty!: Difficulty;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  boardSize!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  targetScore!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  oneSwapMode!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  randomItemMode!: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 6,
  })
  itemsCount!: number;

  @Column(DataType.JSON)
  boardState!: string[][];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  score!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  selectedItem!: string | null;

  @Column({
    type: DataType.ENUM('active', 'completed', 'failed'),
    defaultValue: 'active',
  })
  status!: GameStatus;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  startTime!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endTime!: Date | null;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  lastActivity!: Date;

  @HasMany(() => GameMove)
  moves!: GameMove[];
}