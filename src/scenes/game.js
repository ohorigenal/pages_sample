import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene{

    platforms

    player

    constructor(){
        super('game')
    }

    preload(){
        this.load.image('background', 'assets/bg_layer1.png')

        this.load.image('platform', 'assets/ground_grass.png')
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
        test()
        this.test1()
    }

    create(){

        this.add.image(240,320,'background')

        this.platforms = this.physics.add.staticGroup()

        for(let i=0; i<5; i++) {
            const x = Phaser.Math.Between(80, 480)
            const y = 150*i

            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            //const body = platform.body
            platform.body.updateFromGameObject()
            // body.updateFromGameObject()
        }

        this.player = this.physics.add.sprite(240,320, 'bunny-stand').setScale(0.5)
        this.physics.add.collider(this.platforms, this.player)

        this.cameras.main.startFollow(this.player)

        // this.add.image(240,320,'platform').setScale(0.5)
        // this.physics.add.image(240,320,'platform').setScale(0.5)
    }

    update() {
        const touchingDown = this.player.body.touching.down

        if(touchingDown) {
            this.player.setVelocityY(-300)
        }
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
    }

    test1(){
        console.log("test1")
    }
}

export class Test {

    constructor(name, address) {
        this.name = name
        this.address = address
    }
}

function test() {
    console.log("TESTETSTESTES")
}
