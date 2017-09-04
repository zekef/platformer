import Phaser from 'phaser'

function getRandomSpeed () {
  return Math.random() * 100;
}

export default class Spider extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'spider');
    this.speed = getRandomSpeed();

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = getRandomSpeed();
  }
  update () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
      this.body.velocity.x = -getRandomSpeed(); // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
      this.body.velocity.x = getRandomSpeed(); // turn right
    }
  };
  die () {
    this.body.enable = false;
    this.animations.play('die').onComplete.addOnce(function () {
      this.kill();
    }, this);
  };
}
