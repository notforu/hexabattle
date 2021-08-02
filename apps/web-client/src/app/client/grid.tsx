import 'phaser';
import { GameObjects, Input, Actions, Cameras } from 'phaser';
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin';
import { TileXYType } from 'phaser3-rex-plugins/plugins/board/types/Position';

const COLOR_PRIMARY = 0x03a9f4;
const COLOR_LIGHT = 0x67daff;
const COLOR_DARK = 0x007ac1;

class Grid extends Phaser.Scene {
	private rexBoard!: BoardPlugin;
	private board!: BoardPlugin.Board;
	private graphics!: GameObjects.Graphics;
	private cameraController!: Cameras.Controls.SmoothedKeyControl;

	constructor() {
		super({
			key: 'examples',
		});
	}

	preload() {
		this.load.image('tile', 'tile2.png');
		this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
		this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');
	}

	create() {
		this.graphics = this.add.graphics({
			lineStyle: {
				width: 2,
				color: 0xffffff,
				alpha: 1,
			},
		});
		this.board = this.rexBoard.add
			.board({
				grid: {
					gridType: 'hexagonGrid',
					x: 60,
					y: 60,
					size: 50,
					staggeraxis: 'x',
					staggerindex: 'odd',
				},
				width: 20,
				height: 20,
			})
			.setInteractive()
			.on('tileout', (pointer: Input.Pointer, tileXY: TileXYType) => {})
			.on(
				'tileover',
				(pointer: Input.Pointer, tileXY: TileXYType) => {
					Actions.Call(this.board.tileZToChessArray(0), (gameObject) => gameObject.destroy(), null);

					if (!this.board.contains(tileXY.x, tileXY.y)) {
						return;
					}

					this.rexBoard.add.shape(this.board, tileXY.x, tileXY.y, 0, 0x77aa77).setScale(0.85);
				},
				this,
			)
			.on('tiledown', function (pointer: any, tileXY: any) {});

		this.board.forEachTileXY((tileXY) => this.renderTile(tileXY));

		const cursors = this.input.keyboard.createCursorKeys();
		this.cameraController = new Phaser.Cameras.Controls.SmoothedKeyControl({
			camera: this.cameras.main,

			left: cursors.left,
			right: cursors.right,
			up: cursors.up,
			down: cursors.down,
			zoomIn: this.input.keyboard.addKey(Input.Keyboard.KeyCodes.Q),
			zoomOut: this.input.keyboard.addKey(Input.Keyboard.KeyCodes.E),

			acceleration: 0.085,
			drag: 0.0015,
			maxSpeed: 1,
		});
	}

	update(time: number, delta: number) {
		this.cameraController.update(delta);
	}

	private renderTile = (tileXY: TileXYType) => {
		this.add
			.graphics({
				lineStyle: {
					width: 2,
					color: 0xffffff,
					alpha: 1,
				},
				fillStyle: {
					color: 0x77aa77,
				},
			})
			.strokePoints(this.board.getGridPoints(tileXY.x, tileXY.y, true), true)
			.setInteractive();
		//this.add.sprite(tileXY.x, tileXY.y, 'tile');
		/*const worldXY = this.board.tileXYToWorldXY(tileXY.x, tileXY.y);
		this.add.text(worldXY.x, worldXY.y, `${tileXY.x},${tileXY.y}`).setOrigin(0.5);*/
	};

	private getHexagonGrid() {
		return this.rexBoard.add.hexagonGrid({
			x: 50,
			y: 50,
			size: 50,
			staggeraxis: 'x',
			staggerindex: 'odd',
		});
	}
}

const config = {
	type: Phaser.AUTO,
	parent: 'game',
	width: 800,
	height: 600,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: Grid,
	plugins: {
		scene: [
			{
				key: 'rexBoard',
				plugin: BoardPlugin,
				mapping: 'rexBoard',
			},
		],
	},
};

const game = new Phaser.Game(config);
