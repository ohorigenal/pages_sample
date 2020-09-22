import { banana } from './fruits.js'
import Phaser from './lib/phaser.js'
import Game from './scenes/game.js'
import GameOver from './scenes/gameover.js'

console.log('Hello, World')
console.log(banana)
console.dir(Phaser)
console.dir(Game)

export default new Phaser.Game({
    type: Phaser.Auto,
    width: 480,
    height: 640,
    scene: [Game, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y:200
            },
            debug: true
        }
    },
    autoCenter: true
})
