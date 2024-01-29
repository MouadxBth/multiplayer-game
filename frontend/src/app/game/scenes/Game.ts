import Phaser from 'phaser';

import { White } from '../utils/Colors';
import { PressStart2P } from '../consts/FontKeys';
import { GameBackgroundSceneKey, GameOverSceneKey } from '../consts/SceneKeys';

const GameState = {
  Running: 'running',
  PlayerWon: 'player-won',
  AIWon: 'ai-won',
};

export default class Game extends Phaser.Scene {
  private gameState!: string;
  private paused!: boolean;

  private paddleRightVelocity!: Phaser.Math.Vector2;

  private leftScore!: number;
  private rightScore!: number;

  private leftScoreLabel!: Phaser.GameObjects.Text;
  private rightScoreLabel!: Phaser.GameObjects.Text;

  private ball!: Phaser.GameObjects.Arc;

  private paddleLeft!: Phaser.GameObjects.Rectangle;
  private paddleRight!: Phaser.GameObjects.Rectangle;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private fps!: Phaser.GameObjects.Text;

  private timeText!: Phaser.GameObjects.Text;

  private startTime!: number;

  private readonly AIDifficulty = 0.3;

  init() {
    this.gameState = GameState.Running;
    this.paused = false;

    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);

    this.leftScore = 0;
    this.rightScore = 0;
  }

  create() {
    this.scene.run(GameBackgroundSceneKey);
    this.scene.sendToBack(GameBackgroundSceneKey);

    this.physics.world.setBounds(-100, 0, 1000, 500);

    this.ball = this.add.circle(400, 250, 10, White, 1);
    this.physics.add.existing(this.ball);

    (this.ball.body! as Phaser.Physics.Arcade.Body).setCircle(10);
    (this.ball.body! as Phaser.Physics.Arcade.Body).setBounce(1, 1);
    (this.ball.body! as Phaser.Physics.Arcade.Body).setMaxSpeed(400);
    (this.ball.body! as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
      true,
      1,
      1
    );

    (this.ball.body! as Phaser.Physics.Arcade.Body).onWorldBounds = true;

    this.paddleLeft = this.add.rectangle(50, 250, 30, 100, White, 1);
    this.physics.add.existing(this.paddleLeft, true);

    this.paddleRight = this.add.rectangle(750, 250, 30, 100, White, 1);
    this.physics.add.existing(this.paddleRight, true);

    this.physics.add.collider(
      this.paddleLeft,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.paddleRight,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    // this.physics.world.on('worldbounds', this.handleBallWorldBoundsCollision, this);

    const scoreStyle = {
      fontSize: 48,
      fontFamily: PressStart2P,
    };

    this.leftScoreLabel = this.add
      .text(300, 125, '0', scoreStyle)
      .setOrigin(0.5, 0.5);

    this.rightScoreLabel = this.add
      .text(500, 375, '0', scoreStyle)
      .setOrigin(0.5, 0.5);

    this.cursors = this.input.keyboard?.createCursorKeys()!;

    this.fps = this.add
      .text(10, 10, 'FPS: 0', {
        fontSize: '16px',
        fontFamily: PressStart2P,
      })
      .setOrigin(0);

    this.timeText = this.add
      .text(750, 10, 'Time: 0s', {
        fontSize: '16px',
        fontFamily: PressStart2P,
      })
      .setOrigin(1, 0);

    this.time.delayedCall(1500, () => {
      this.resetBall();
    });
  }

  override update() {
    if (this.paused || this.gameState !== GameState.Running) {
      return;
    }

    this.processPlayerInput();
    this.updateAI();
    this.checkScore();

    this.fps.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);

    if (!this.startTime) {
      this.startTime = this.time.now;
    }

    const elapsedSeconds = Math.floor((this.time.now - this.startTime) / 1000);
    this.timeText.setText(`Time: ${elapsedSeconds}s`);
  }

  // handleBallWorldBoundsCollision(body, up, down, left, right) {
  //   if (left || right) {
  //     return;
  //   }
  //   // this.sound.play(AudioKeys.PongPlop)
  // }

  handlePaddleBallCollision(
    paddle:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    // this.sound.play(AudioKeys.PongBeep)
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    const vel = body.velocity;
    vel.x *= 1.05;
    vel.y *= 1.05;
    body.setVelocity(vel.x, vel.y);
  }

  processPlayerInput() {
    const body = this.paddleLeft.body as Phaser.Physics.Arcade.StaticBody;

    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10;
      body.updateFromGameObject();
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10;
      body.updateFromGameObject();
    }
  }

  updateAI() {
    const diff = this.ball.y - this.paddleRight.y;

    if (Math.abs(diff) < 10) {
      return;
    }

    let aiSpeed = Math.abs(diff * this.AIDifficulty);

    if (diff < 0) {
      aiSpeed = Math.min(aiSpeed, 10); // Cap speed to avoid jittering
      this.paddleRightVelocity.y = -aiSpeed;
    } else if (diff > 0) {
      aiSpeed = Math.min(aiSpeed, 10); // Cap speed to avoid jittering
      this.paddleRightVelocity.y = aiSpeed;
    }

    this.paddleRight.y += this.paddleRightVelocity.y;
    (this.paddleRight.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
  }

  // updateAI() {
  //   const diff = this.ball.y - this.paddleRight.y;
  //   if (Math.abs(diff) < 10) {
  //     return;
  //   }

  //   const aiSpeed = 3;
  //   if (diff < 0) {
  //     this.paddleRightVelocity.y = -aiSpeed;
  //     if (this.paddleRightVelocity.y < -10) {
  //       this.paddleRightVelocity.y = -10;
  //     }
  //   } else if (diff > 0) {
  //     this.paddleRightVelocity.y = aiSpeed;
  //     if (this.paddleRightVelocity.y > 10) {
  //       this.paddleRightVelocity.y = 10;
  //     }
  //   }

  //   this.paddleRight.y += this.paddleRightVelocity.y;
  //   (
  //     this.paddleRight.body as Phaser.Physics.Arcade.StaticBody
  //   ).updateFromGameObject();
  // }

  checkScore() {
    const x = this.ball.x;
    const leftBounds = -30;
    const rightBounds = 830;

    if (x >= leftBounds && x <= rightBounds) {
      return;
    }

    if (this.ball.x < leftBounds) {
      this.incrementRightScore();
    } else if (this.ball.x > rightBounds) {
      this.incrementLeftScore();
    }

    const maxScore = 3;
    if (this.leftScore >= maxScore) {
      this.gameState = GameState.PlayerWon;
    } else if (this.rightScore >= maxScore) {
      this.gameState = GameState.AIWon;
    }

    if (this.gameState === GameState.Running) {
      this.resetBall();
    } else {
      this.ball.active = false;
      this.physics.world.remove(this.ball.body! as Phaser.Physics.Arcade.Body);
      this.scene.stop(GameBackgroundSceneKey);

      this.scene.start(GameOverSceneKey, {
        leftScore: this.leftScore,
        rightScore: this.rightScore,
      });
    }
  }

  incrementLeftScore() {
    this.leftScore += 1;
    this.leftScoreLabel.text = this.leftScore.toString();
  }

  incrementRightScore() {
    this.rightScore += 1;
    this.rightScoreLabel.text = this.rightScore.toString();
  }

  resetBall() {
    this.ball.setPosition(400, 250);
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 300);
    (this.ball.body! as Phaser.Physics.Arcade.Body).setVelocity(vec.x, vec.y);
  }
}
