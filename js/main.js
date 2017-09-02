function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');
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

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

// add this method –and the ongoing Hero methods– AFTER these lines, or you
// will override them when cloning the Phaser.Sprite prototype
//
// Hero.prototype = Object.create(Phaser.Sprite.prototype);
// Hero.prototype.constructor = Hero;
Hero.prototype._getAnimationName = function () {
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
Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};
Hero.prototype.move = function (direction) {
    
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
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
Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};
function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');
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

function getRandomSpeed() {
    return Math.random() * 100;
}

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;
PlayState = {};
Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -getRandomSpeed(); // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = getRandomSpeed(); // turn right
    }
    
};
Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};
// load game assets here
PlayState.preload = function () {
    this.game.load.json('level:0', 'data/level00.json');
    this.game.load.image('background', 'images/background2.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('icon:coin', 'images/pizza_icon.png');
    this.game.load.image('font:numbers', 'images/numbers.png');


    this.game.load.spritesheet('buttonvertical', 'images/button-vertical.png',64,64);
    this.game.load.spritesheet('buttonhorizontal', 'images/button-horizontal.png',96,64);
    this.game.load.spritesheet('buttondiagonal', 'images/button-diagonal.png',64,64);
    this.game.load.spritesheet('buttonfire', 'images/button-round-a.png',96,96);
    this.game.load.spritesheet('buttonjump', 'images/button-round-b.png',96,96);

    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.spritesheet('coin', 'images/pizza_animated.png', 22, 22);
    this.game.load.spritesheet('door', 'images/door.png', 42, 66);    this.game.load.spritesheet('scenery', 'images/decor.png', 42, 42);
    
    // this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    //this.game.load.image('hero', 'images/square-colors_42x42.png');
    this.game.load.image('key', 'images/key.png');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);
    this.game.load.audio('sfx:bgm', 'audio/bgm.mp3');
};

var left=false;
var right=false;
var duck= false;
var fire=false;
var jump=false;

// create game entities and set up world here
PlayState.create = function () {
     this.sfx = {
         key: this.game.add.audio('sfx:key'),
        door: this.game.add.audio('sfx:door'),
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        bgm: this.game.add.audio('sfx:bgm'),
    };
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
    this._createHud();


    // create our virtual game controller buttons 
     var buttonjump = this.game.add.button(600, 500, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    buttonjump.fixedToCamera = true;  //our buttons should stay on the same place  
    buttonjump.events.onInputOver.add(function(){
        jump=true;
        console.log('jump', jump)
    });
    buttonjump.events.onInputOut.add(function(){
        jump=false;
        console.log('jump', jump)
    });
    buttonjump.events.onInputDown.add(function(){
        jump=true;
        console.log('jump', jump)
    });
    buttonjump.events.onInputUp.add(function(){
        jump=false;
        console.log('jump', jump)
    });

    var buttonfire = this.game.add.button(700, 500, 'buttonfire', null, this, 0, 1, 0, 1);
    buttonfire.fixedToCamera = true;
    buttonfire.events.onInputOver.add(function() {
        fire=true;
        console.log('fire', fire)
    });
    buttonfire.events.onInputOut.add(function(){
        fire=false;
        console.log('fire', fire)
    });
    buttonfire.events.onInputDown.add(function(){
        fire=true;
        console.log('fire', fire)
    });
    buttonfire.events.onInputUp.add(function(){
        fire=false;
        console.log('fire', fire)
    });

    var buttonleft = this.game.add.button(0, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){
        left=true;
        console.log('left', left)
    });
    buttonleft.events.onInputOut.add(function(){
        left=false;
        console.log('left', left)
    });
    buttonleft.events.onInputDown.add(function(){
        left=true;
        console.log('left', left)
    });
    buttonleft.events.onInputUp.add(function(){
        left=false;
        console.log('left', left)
    });

    var buttonbottomleft = this.game.add.button(32, 536, 'buttondiagonal', null, this, 6, 4, 6, 4);
    buttonbottomleft.fixedToCamera = true;
    buttonbottomleft.events.onInputOver.add(function(){
        left=true;
        duck=true;
        console.log('left', left, 'duck', duck)
    });
    buttonbottomleft.events.onInputOut.add(function(){
        left=false;
        duck=false;
        console.log('left', left, 'duck', duck)
    });
    buttonbottomleft.events.onInputDown.add(function(){
        left=true;
        duck=true;
        console.log('left', left, 'duck', duck)
    });
    buttonbottomleft.events.onInputUp.add(function(){
        left=false;
        duck=false;
        console.log('left', left, 'duck', duck)
    });

    var buttonright = this.game.add.button(160, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){
        right=true;
        console.log('right', right)
    });
    buttonright.events.onInputOut.add(function(){
        right=false;
        console.log('right', right)
    });
    buttonright.events.onInputDown.add(function(){
        right=true;
        console.log('right', right)
    });
    buttonright.events.onInputUp.add(function(){
        right=false;
        console.log('right', right)
    });

    var buttonbottomright = this.game.add.button(160, 536, 'buttondiagonal', null, this, 7, 5, 7, 5);
    buttonbottomright.fixedToCamera = true;
    buttonbottomright.events.onInputOver.add(function(){
        right=true;
        duck=true;
        console.log('right', right, 'duck', duck)
    });
    buttonbottomright.events.onInputOut.add(function(){
        right=false;
        duck=false;
        console.log('right', right, 'duck', duck)
    });
    buttonbottomright.events.onInputDown.add(function(){
        right=true;
        duck=true;
        console.log('right', right, 'duck', duck)
    });
    buttonbottomright.events.onInputUp.add(function(){
        right=false;
        duck=false;
        console.log('right', right, 'duck', duck)
    });

    var buttondown = this.game.add.button(96, 536, 'buttonvertical', null, this, 0, 1, 0, 1);
    buttondown.fixedToCamera = true;
    buttondown.events.onInputOver.add(function(){
        duck=true;
        console.log('duck', duck)
    });
    buttondown.events.onInputOut.add(function(){
        duck=false;
        console.log('duck', duck)
    });
    buttondown.events.onInputDown.add(function(){
        duck=true;
        console.log('duck', duck)
    });
    buttondown.events.onInputUp.add(function(){
        duck=false;
        console.log('duck', duck)
    });

};
PlayState._loadLevel = function (data) {
     this.sfx.bgm.play();
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    data.platforms.forEach(this._spawnPlatform, this);
    console.log(data);   
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});
    data.coins.forEach(this._spawnCoin, this);
    data.decoration.forEach(this._spawnScenery, this);
    // after spawning the coins in this line:
    // data.coins.forEach(this._spawnCoin, this);
    this._spawnDoor(data.door.x, data.door.y);
    // add it below the call to _spawnDoor
    // this._spawnDoor(data.door.x, data.door.y);
    this._spawnKey(data.key.x, data.key.y);
    
    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};
PlayState._spawnScenery = function (scenery) {
    let sprite = this.bgDecoration.create(scenery.x, scenery.y, 'scenery');
    console.log(sprite)
    sprite.frame = scenery.frame;
    sprite.anchor.set(0.5, 0);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

PlayState._spawnSpiders = function(data) {
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);
}

PlayState._spawnCharacters = function (data) {
     // spawn spiders
    this._spawnSpiders(data);
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    console.log(this.hero);
    // this.hero.scale.x = 4;
    // this.hero.scale.y = -1;
    // this.hero.x = 200;
    // this.hero.y = 100;
    // this.spiders.scale.x = 1
    // this.spiders.scale.y = 4
    // this.spiders.x = 200
    // this.spiders.y = 100
    // this.hero.allowrotation  =  false
    this.game.add.existing(this.hero);
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);

    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};
PlayState._spawnPlatform = function (platform) {
    // this.game.add.sprite(platform.x, platform.y, platform.image);
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;    
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};
PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};
PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;
    // add a small 'up & down' animation via a tween
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};
window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play', true, false, {level: 0});
};
const LEVEL_COUNT = 2;


PlayState.init = function (data) {
    this.game.renderer.renderSession.roundPixels = true;
    this.keys = this.game.input.keyboard.addKeys({
        spacebar: Phaser.KeyCode.SPACEBAR,
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP, // add this line
        secretKey: Phaser.KeyCode.TILDE,
        secretspawnkey: Phaser.KeyCode.Z,
    });
    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
    this.keys.secretKey.onDown.add(function () {
        // console.log('die!', this.spiders);
        const spiders = this.spiders.children;
        for (var i = 0; i < spiders.length; i++) {
            spiders[i].die();
            this.sfx.stomp.play();
        }
    }, this);
    this.keys.secretspawnkey.onDown.add(function () {
        // console.log('Spawn!')
        this._spawnSpiders({
            spiders: [
                {
                    "x": this.hero.x + 60,
                    "y": this.hero.y -45,
                },
            ],
        });    
    }, this);

    this.coinPickupCount = 0;
    this.hasKey = false;
    this.level = (data.level || 0) % LEVEL_COUNT;
};
PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.frame = this.hasKey ? 1 : 0;
};
PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
    this.game.physics.arcade.overlap(this.hero, this.spiders,
    this._onHeroVsEnemy, null, this);
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
        null, this)
        this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
        // ignore if there is no key or the player is on air
        function (hero, door) {
            return this.hasKey && hero.body.touching.down;
        }, this);
};
PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();
    this.coinPickupCount++;
};
PlayState._onHeroVsEnemy = function (hero, enemy) {
    if (hero.body.y + 10 < enemy.body.y) { // kill enemies when hero is falling
        hero.bounce();
        enemy.die();
        this.sfx.stomp.play();


        var data = {
            spiders: [],
        };
        for (var i = 0; i < 2; i++) {
            data.spiders.push({
                x: this.hero.x + 60 + (i * 30),
                y: this.hero.y - 45 - (i * 30),
            });
        }
        this._spawnSpiders(data);
    }
    else { // game over -> restart the game
        this.sfx.bgm.stop();
        this.sfx.stomp.play();
        this.game.state.restart(true, false, {level: this.level});
    }
};

PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        // ...          `
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
PlayState._createHud = function () {
    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);
    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);
    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.position.set(10, 10);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
};
PlayState._onHeroVsKey = function (hero, key) {
    this.sfx.key.play();
    key.kill();
    this.hasKey = true;
};
PlayState._onHeroVsDoor = function (hero, door) {
    this.sfx.door.play();
    this.game.state.restart(true, false, { level: this.level + 1 });
};