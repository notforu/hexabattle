import { Server } from 'colyseus';
import { GameRoom } from './room';
const port = parseInt(process.env.port, 10) || 3001;

const gameServer = new Server();
gameServer
	.define('game', GameRoom)
	.on('create', (room) => console.log('room created:', room.roomId))
	.on('dispose', (room) => console.log('room disposed:', room.roomId))
	.on('join', (room, client) => console.log(client.id, 'joined', room.roomId))
	.on('leave', (room, client) => console.log(client.id, 'left', room.roomId));

gameServer.listen(port).then(() => console.log(`[GameServer] Listening on Port: ${port}`));
