import React, { useEffect, useRef } from 'react';
import * as Colyseus from 'colyseus.js';
import { ArrayXY, SVG } from '@svgdotjs/svg.js';
import * as Honeycomb from 'honeycomb-grid';
import { GameState } from '../../schema/GameState';
import styles from './styles.module.scss';

interface IClientProps {}

const client = new Colyseus.Client('ws://localhost:3001');

const options = { size: { xRadius: 50, yRadius: 50 } };
const Hex = Honeycomb.extendHex(options);
const Grid = Honeycomb.defineGrid(Hex);
const corners: ArrayXY[] = Hex()
	.corners()
	.map(({ x, y }) => [x, y]);

export function Client(props: IClientProps): JSX.Element {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		try {
			client.joinOrCreate<GameState>('game').then((room) => {
				console.log('joined successfully', room);

				room.state.listen('hexes', (hexes, prev) => {
					const elem = ref.current;
					if (!elem) {
						return;
					}
					const draw = SVG().addTo(elem).size('100%', '100%');
					const grid = Grid(
						JSON.parse(JSON.stringify(hexes.map((hex) => ({ ...hex, ...options })))),
					);
					console.log(JSON.parse(JSON.stringify(hexes.map((hex) => ({ ...hex, ...options })))));
					const hexSymbol = draw
						.symbol()
						.polygon(corners)
						.fill('none')
						.stroke({ width: 1, color: '#999' });

					grid.forEach((hex) => {
						const { x, y } = hex.toPoint();
						console.log(x, y);
						draw.use(hexSymbol).translate(x, y);
					});
				});

				room.state.players.onAdd = (player, key) => {
					console.log(player.sessionId);
				};
			});
		} catch (e) {
			console.error('join error', e);
		}
	}, []);

	return <div ref={ref} className={styles.container} />;
}
