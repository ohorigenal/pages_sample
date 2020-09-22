import Phaser from '../lib/phaser.js'
import Carrot from '../game/carrot.js'

export default class Game extends Phaser.Scene{

    platforms

    player

    cursors

    carrots

    carrotsCollected = 0

    carrotsCollectedText

    constructor(){
        super('game')
    }

    init() {
        this.carrotsCollected = 0
    }

    preload(){
        this.load.image('background', 'assets/bg_layer1.png')

        this.load.image('platform', 'assets/ground_grass.png')
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
        this.load.image('bunny-jump', 'assets/bunny1_jump.png')

        this.load.image('carrot', 'assets/carrot.png')

        this.load.audio('jump', 'assets/sfx/phaseJump1.ogg')

        this.cursors = this.input.keyboard.createCursorKeys()

    }

    create(){

        this.add.image(240,320,'background').setScrollFactor(1,0)

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

        this.cameras.main.setDeadzone(this.scale.width * 1.5)

        //const carrot = new Carrot(this, 240, 320, 'carrot')
        //this.add.existing(carrot)


        this.carrots = this.physics.add.group({
            classType: Carrot
        })
        // this.carrots.get(240, 320, 'carrot')

        this.physics.add.collider(this.platforms, this.carrots)

        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot,
            undefined,
            this
        )
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        const style = { color: '#000', fontSize:24 }
        this.carrotsCollectedText = this.add.text(240, 10, 'Carrots: 0', style).setScrollFactor(0).setOrigin(0.5, 0)
        // this.add.image(240,320,'platform').setScale(0.5)
        // this.physics.add.image(240,320,'platform').setScale(0.5)


    }

    update() {

        this.platforms.children.iterate(child => {
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if(platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()

                //this.recycle(platform)

                this.addCarrotAbove(platform)
            }

        })


        const pointer = this.input.activePointer
        let flag = true

        if(pointer.isDown) {
            const touchX = pointer.x
            if(touchX < this.scale.width/2){
                this.player.setVelocityX(-200)
            } else {
                this.player.setVelocityX(200)
            }
            flag = false
        }

        const touchingDown = this.player.body.touching.down

        if(touchingDown) {
            this.player.setVelocityY(-300)
            this.player.setTexture('bunny-jump')

            this.sound.play('jump')
        }

        const vy = this.player.body.velocity.y
        if(0 < vy && this.player.texture.key !== 'bunny-stand') {
            this.player.setTexture('bunny-stand')
        }


        if(this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
        } else if(this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200)
        } else if(flag) {
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform()
        if(this.player.y > bottomPlatform.y + 200) {
            this.scene.start('game-over')
        }
    }

    horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        // console.log(sprite.x + " : " + halfWidth + " : " + gameWidth)
        if(sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        } else if(sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
        }
    }

    addCarrotAbove(sprite) {
        const y = sprite.y - sprite.displayHeight

        const carrot = this.carrots.get(sprite.x, y, 'carrot')

        carrot.setActive(true)
        carrot.setVisible(true)

        this.add.existing(carrot)

        carrot.body.setSize(carrot.width, carrot.height)
        carrot.body.checkCollision.up = false

        this.physics.world.enable(carrot)

        return carrot
    }

    handleCollectCarrot(player, carrot) {
        this.carrots.killAndHide(carrot)
        this.physics.world.disableBody(carrot.body)

        this.carrotsCollected++
        const value = `Carrots: ${this.carrotsCollected}`
        this.carrotsCollectedText.text = value
    }

    recycle(sprite) {
        this.platforms.killAndHide(sprite)
        this.physics.world.disableBody(sprite.body)

        //sprite.setActive(true)
        sprite.setVisible(true)

        this.physics.world.enable(sprite)
    }

    findBottomMostPlatform() {
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]

        // console.log(platforms.length)

        platforms.forEach(platform => {
            if(bottomPlatform.y < platform.y){
                bottomPlatform = platform
            }
        })

        return bottomPlatform
    }
}
