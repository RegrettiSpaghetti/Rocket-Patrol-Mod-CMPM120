// Creates a menu scene
// Use a constructor of the parent scene to create the curr obj.
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images / tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0,
        endFrame: 9});
    }

    create() {
        // place tile sprite bg
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // add Rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket', 0).setScale(0.5, 0.5).setOrigin(0, 0);
        
        //add spaceships [x3]
        this.ship01 = new Spaceship(this, game.config.width + 192, 132,
        'spaceship', 0, 30, 4000).setOrigin(0, 0);
    
        this.ship02 = new Spaceship(this, game.config.width + 96, 196,
        'spaceship', 0, 20, 2000).setOrigin(0, 0);
    
        this.ship03 = new Spaceship(this, game.config.width, 263,
        'spaceship', 0, 10, 0).setOrigin(0, 0);

        // define our keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation configuration
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first:0 }),
            frameRate: 30
        });

        // bind the score to the screen
        this.p1Score = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        
        // Game Over flag
        this.gameOver = false;

        // Create a Time Left Variable
        this.timeLeft = 0;

        // Play Clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.playTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
            game.settings.playTimer = game.settings.gameTimer;
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {
            // update rocket
            this.p1Rocket.update();

            // update ships (x3)
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }

        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }

        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    // play the explosion animation on a hit
    shipExplode(ship) {
        ship.alpha = 0;                             // temporarily hides the ship

        // create an explosion at the ship's location
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');                 // play the explosion animation
        boom.on('animationcomplete', () => {        // callback after anim completes
            ship.reset();                           // reset the ship's position
            ship.alpha = 1;                         // remove cloaking!
            boom.destroy();                         // remove the animation
        });

        // Increment the score!
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // get the current time left in the clock
        // make gameTimer = to the current time left
        // add the time of the ships TimerValue to gameTimer to get the time of the new clock
        // create a new timer event
        // clear the old clock

        // Restablish the config
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.timeLeft = (game.settings.playTimer - this.clock.getElapsed());
        //console.log("this is how much time is left in ms: " + this.timeLeft);
        //console.log("this is the total time of the current timer in ms: " + game.settings.gameTimer);
        game.settings.playTimer = this.timeLeft + ship.time;
        console.log("this is the length of gameTimer: " + game.settings.playTimer);
        //console.log("this is the new timer's length in ms: " + (game.settings.gameTimer + (ship.time)));
        this.clock.destroy();
        //this.clock.remove([false]);
        this.clock = this.time.delayedCall(game.settings.playTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // Play the explosion SFX
        this.sound.play('sfx_explosion');
    }
}