import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { DummyScene } from './scenes/DummyScene';
import { GameBackgroundSceneKey, GameOverSceneKey, GameSceneKey, PreloadSceneKey, TitleScreenSceneKey } from './consts/SceneKeys';
import Preload from './scenes/Preload';
import TitleScreen from './scenes/TitleScreen';
import Game from './scenes/Game';
import GameBackground from './scenes/GameBackground';
import GameOver from './scenes/GameOver';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      title: 'Pong',
      parent: 'game-container',
      type: Phaser.AUTO,
      width: 800,
      height: 500,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);

    this.phaserGame.scene.add(PreloadSceneKey, Preload);
    this.phaserGame.scene.add(TitleScreenSceneKey, TitleScreen);
    this.phaserGame.scene.add(GameSceneKey, Game);
    this.phaserGame.scene.add(GameBackgroundSceneKey, GameBackground);
    this.phaserGame.scene.add(GameOverSceneKey, GameOver);

    this.phaserGame.scene.start(PreloadSceneKey);
  }
}
