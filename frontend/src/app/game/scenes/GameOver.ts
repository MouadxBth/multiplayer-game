import Phaser from 'phaser';
import { PressStart2P } from '../consts/FontKeys';
import { TitleScreenSceneKey } from '../consts/SceneKeys';

export default class GameOver extends Phaser.Scene {

  create({ leftScore, rightScore }: { leftScore: number; rightScore: number }) {
    let titleText = 'Game Over';

    if (leftScore > rightScore) {
      titleText = 'You Win!';
    }

    this.add
      .text(400, 200, titleText, {
        fontFamily: PressStart2P,
        fontSize: 38,
      })
      .setOrigin(0.5);

    this.add
      .text(400, 300, 'Press Space to Continue', {
        fontFamily: PressStart2P,
      })
      .setOrigin(0.5);

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start(TitleScreenSceneKey);
    });
  }
}
