import Phaser from 'phaser'
import { White } from '../utils/Colors'

export default class GameBackground extends Phaser.Scene
{
	create()
	{

		this.add.line(
			400, 250,
			0, 0,
			0, 500,
			White, 1
		)
		.setLineWidth(2.5, 2.5)

		this.add.circle(400, 250, 50)
			.setStrokeStyle(5, White, 1)
	}
}
