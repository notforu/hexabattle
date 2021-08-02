import { SVG } from '@svgdotjs/svg.js'
import * as Honeycomb from 'honeycomb-grid';

const draw = SVG().addTo('.root').size('100%', '100%')

const Hex = Honeycomb.extendHex({ size: 35 })
const Grid = Honeycomb.defineGrid(Hex)
// get the corners of a hex (they're the same for all hexes created with the same Hex factory)
const corners = Hex().corners()
const points = corners.map(({ x, y }) => `${x},${y}`);
// an SVG symbol can be reused
const hexSymbol = draw.symbol()
	// map the corners' positions to a string and create a polygon
	.polygon(points as any)
	.fill('none')
	.stroke({ width: 1, color: '#999' })

// render 10,000 hexes
Grid.rectangle({ width: 15, height: 45 }).forEach(hex => {
	const { x, y } = hex.toPoint()
	// use hexSymbol and set its position for each hex
	draw.use(hexSymbol).translate(x, y).css('fill', 'red')
})
