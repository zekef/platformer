import 'pixi'
import 'p2'
import Phaser from 'phaser'
import PlayState from './PlayState'

window.onload = function () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game')
  game.state.add('play', PlayState)
  game.state.start('play', true, false, {level: 0})
}

// import BootState from './states/Boot'
// import SplashState from './states/Splash'
// import GameState from './states/Game'

// import config from './config'

// class Game extends Phaser.Game {
//   constructor () {
//     const docElement = document.documentElement
//     const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
//     const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

//     super(width, height, Phaser.CANVAS, 'content', null)

//     this.state.add('Boot', BootState, false)
//     this.state.add('Splash', SplashState, false)
//     this.state.add('Game', GameState, false)

//     this.state.start('Boot')
//   }
// }

// window.game = new Game()
