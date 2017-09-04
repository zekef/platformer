import Phaser from 'phaser'

export default class Hero extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'hero')
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.maxAirJump = 1;
    this.currentAirJumps = 0;
    //  this.body.allowGravity = false;
    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
  }

  _getAnimationName () {
    let name = 'stop'; // default animation

    // jumping
    if (this.body.velocity.y < 0) {
      name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
      name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
      name = 'run';
    }

    return name;
  };
  update () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
      this.animations.play(animationName);
    }
  }
  move (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
    if (this.body.velocity.x < 0) {
      this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
      this.scale.x = 1;
    }
  };
  jump () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;
    canJump = true;

    if (canJump) {
      this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
  };
  bounce () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
  };
}
