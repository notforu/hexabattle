import { ArraySchema, Schema, type } from '@colyseus/schema';

export class Player extends Schema {
	@type('string') sessionId: string;
}

export class Hex extends Schema {
	@type('number') x: number;
	@type('number') y: number;
	@type('string') id: string;
	constructor(x: number, y: number) {
		super();
		this.x = x;
		this.y = y;
		this.id = `${this.x}_${this.y}`;
	}
}

export class GameState extends Schema {
	@type([Player]) players = new ArraySchema<Player>();
	@type([Hex]) hexes = [];
	@type('string') currentPlayerId = null;
}
