"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaderboard = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Leaderboard = class Leaderboard extends sequelize_typescript_1.Model {
    get rankKey() {
        return `${this.difficulty}_${this.completionTime}`;
    }
};
exports.Leaderboard = Leaderboard;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Leaderboard.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Leaderboard.prototype, "playerName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('easy', 'medium', 'hard', 'custom'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Leaderboard.prototype, "difficulty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        comment: 'Completion time in seconds',
    }),
    __metadata("design:type", Number)
], Leaderboard.prototype, "completionTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Leaderboard.prototype, "score", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Leaderboard.prototype, "boardSize", void 0);
__decorate([
    (0, sequelize_typescript_1.Index)(['difficulty', 'completionTime']),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Leaderboard.prototype, "rankKey", null);
exports.Leaderboard = Leaderboard = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'leaderboards',
        timestamps: true,
    })
], Leaderboard);
//# sourceMappingURL=Leaderboard.js.map