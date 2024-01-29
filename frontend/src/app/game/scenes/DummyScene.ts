export class DummyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }
  create() {
    console.log('create method');
  }
  preload() {
    console.log('preload method');
  }
  override update() {}
}
