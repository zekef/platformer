import 'pixi'
import 'p2'
import Phaser from 'phaser'
import PlayState from './PlayState'

class Game extends Phaser.Game {
  constructor () {
    super(900, 600, Phaser.AUTO, 'game', null);
    this.state.add('Play', PlayState);
    this.state.start('Play', true, false, {level: 0});
  }
}

window.game = new Game();
