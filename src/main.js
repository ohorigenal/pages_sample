import { banana } from './fruits.js'
import Phaser from './lib/phaser.js'
import Game from './scenes/game.js'
import { Test as Ta } from './scenes/game.js'

console.log('Hello, World')

console.log(banana)
console.dir(Phaser)
console.dir(Game)
console.log(new Ta("a", "b"))

export default new Phaser.Game({
    type: Phaser.Auto,
    width: 480,
    height: 640,
    scene: Game,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y:200
            },
            debug: true
        }
    }
})
