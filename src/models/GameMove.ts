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