import http from 'http';
import { Room, Client } from 'colyseus';
import { GameState, Player, Hex } from './state';
import * as Honeycomb from 'honeycomb-grid';

const MAX_PLAYERS = 2;

export class GameRoom extends Room<GameState> {
	onCreate(options: any) {
		this.setState(new GameState());
	}

	onAuth(client: Client, options: any, request: http.IncomingMessage) {
		return true;
	}

	onJoin(client: Client, options: any, auth: any) {
		const player = new Player();
		player.sessionId = client.sessionId;
		this.state.players.push(player);
		//if (this.state.players.length === MAX_PLAYERS) {
		this.state.currentPlayerId = this.state.players[0].sessionId;
		const grid = Honeycomb.defineGrid().ring({ radius: 3 });
		this.state.hexes = grid.map(({ x, y }) => new Hex(x, y));
		//}
	}

	onLeave(client: Client, consented: boolean) {
		this.state.players = this.state.players.filter(
			(player) => player.sessionId !== client.sessionId,
		);
	}

	onDispose() {}
}
