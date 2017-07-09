function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
     this.game.physics.enable(this);
     this.body.collideWorldBounds = true;
     
     this.maxAirJump = 1;
     this.currentAirJumps = 0;
    //  this.body.allowGravity = false;
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

// add this method –and the ongoing Hero methods– AFTER these lines, or you
// will override them when cloning the Phaser.Sprite prototype
//
// Hero.prototype = Object.create(Phaser.Sprite.prototype);
// Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
    
};
Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;
    canJump = true;

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};
PlayState = {};
// load game assets here
PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.image('hero', 'images/hero_stopped.png');
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
};
// create game entities and set up world here
PlayState.create = function () {
     this.sfx = {
        jump: this.game.add.audio('sfx:jump')
    };
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON('level:1'));
};
PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.platforms = this.game.add.group();

    data.platforms.forEach(this._spawnPlatform, this);
    console.log(data);   
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero});
    
    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};
PlayState._spawnCharacters = function (data) {
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    console.log(this.hero);
    // this.hero.scale.x = 109877654321;
    // this.hero.scale.y = -1;
    // this.hero.x = 50;
    // this.hero.y = 100;

    this.game.add.existing(this.hero);
};
PlayState._spawnPlatform = function (platform) {
    // this.game.add.sprite(platform.x, platform.y, platform.image);
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};
window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
};
PlayState.init = function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP, // add this line
    });
   this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
};
PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
};
PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.hero, this.platforms);
};
PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        // ...
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        // ...
        this.hero.move(1);

    }
    else { // stop
        this.hero.move(0);
    }
};