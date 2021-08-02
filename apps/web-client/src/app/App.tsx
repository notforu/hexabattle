import React from 'react';
import { ArrayXY, SVG } from '@svgdotjs/svg.js';
import * as Honeycomb from 'honeycomb-grid';
import { Client } from './client/client';
import './client/grid';
import styles from './styles.module.scss';

function App() {
	return (
		<div id="game">
			<Client />
		</div>
	);
}

export default App;
