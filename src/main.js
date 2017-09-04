import 'pixi'
import 'p2'
import Phaser from 'phaser'
import config from './config'
import PlayState from './PlayState'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.AUTO, 'game', null)
    this.state.add('Play', PlayState)
    this.state.start('Play', true, false, {level: 0})
  }
}

window.game = new Game()
