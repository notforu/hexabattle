import 'phaser';
import {GameObjects, Input, Actions, Cameras} from 'phaser';
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin';
import {TileXYType} from 'phaser3-rex-plugins/plugins/board/types/Position';

const SCROLLABLE_AREA = 150;
const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

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
		/*this.load.image('tile', 'tile2.png');
		this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
		this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');*/
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
				width: 40,
				height: 30,
			})
			.setInteractive()
			.on('tileout', (pointer: Input.Pointer, tileXY: TileXYType) => {
			})
			.on(
				'tileover',
				this.onTileOver,
				this,
			)
			.on('tiledown', (pointer: Input.Pointer, tileXY: TileXYType) => {
			});

		this.board.forEachTileXY((tileXY) => this.renderTile(tileXY));
		this.initCamera();
		this.initGestures();
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

	private initCamera = () => {
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

	private initGestures = () => {
		const camera = this.cameras.main;
		this.input.on('pointermove', (pointer: Input.Pointer) => {
			if (!pointer.isDown) {
				/*console.log(pointer.worldX, pointer.x, SCROLLABLE_AREA, GAME_WIDTH, pointer.worldX + SCROLLABLE_AREA)
				if (pointer.worldX + SCROLLABLE_AREA > GAME_WIDTH) {
					camera.scrollX = (pointer.x) / camera.zoom;
				}
				camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
				camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;*/
			} else {
				camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
				camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
			}
		});
		this.input.on('wheel', (pointer: Input.Pointer, gameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
			if (deltaY > 0) {
				camera.zoom -= 0.015;
			}

			if (deltaY < 0) {
				camera.zoom += 0.015;
			}
		})
	}

	private onTileOver = (pointer: Input.Pointer, tileXY: TileXYType) => {
		Actions.Call(this.board.tileZToChessArray(0), (gameObject) => gameObject.destroy(), null);

		if (!this.board.contains(tileXY.x, tileXY.y)) {
			return;
		}

		this.rexBoard.add.shape(this.board, tileXY.x, tileXY.y, 0, 0x77aa77).setScale(0.85);
	}
}

const config = {
	type: Phaser.AUTO,
	parent: 'game',
	width: GAME_WIDTH,
	height: GAME_HEIGHT,
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
			}
		],
	},
};

const game = new Phaser.Game(config);
