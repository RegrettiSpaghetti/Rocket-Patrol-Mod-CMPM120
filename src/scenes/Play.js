// Creates a menu scene
// Use a constructor of the parent scene to create the curr obj.
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images / tile sprites
        this.load.image('rocket', './assets/new_rocket.png');
        this.load.image('spaceship', './assets/he_cometh.png');
        //this.load.image('spaceship2', './assets/he_cometh2');
        this.load.image('starfield', './assets/star_bg.png');
        this.load.image('planets', './assets/Planets.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0,
        endFrame: 9});
    }

    create() {
        // place tile sprite bg
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0).setDepth(0);
        this.planets = this.add.tileSprite(0, 0, 640, 480, 'planets').setOrigin(0, 0).setDepth(1);

        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0).setDepth(3);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0).setDepth(3);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0).setDepth(3);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0).setDepth(3);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0).setDepth(3);

        // add Rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, 421, 'rocket', 0).setScale(0.5, 0.5).setOrigin(0, 0).setDepth(2);
        
        //add spaceships [x3]
        this.ship01 = new Spaceship(this, game.config.width + 192, 132,
        'spaceship', 0, 30, 2000).setOrigin(0, 0).setDepth(2);
    
        this.ship02 = new Spaceship(this, game.config.width + 96, 196,
        'spaceship', 0, 20, 1000).setOrigin(0, 0).setDepth(2);
    
        this.ship03 = new Spaceship(this, game.config.width, 263,
        'spaceship', 0, 10, 500).setOrigin(0, 0).setDepth(2);

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

        // Bind the score to the screen
        this.p1Score = 0;

        // Bind the remaining time to the screen
        this.timeRemain = game.settings.playTimer;

        // Score display
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
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig).setDepth(3);

        // Time Display
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#963299',
            color: '#48184A',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeRight = this.add.text(472, 54, this.timeRemain, timeConfig).setDepth(3);
        
        // Game Over flag
        this.gameOver = false;

        // Secrets~
        this.secrets = 0;

        // Play Clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.playTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5).setDepth(5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for menu', scoreConfig).setOrigin(0.5).setDepth(5);
            this.gameOver = true;
            this.sound.play('game_over');
        }, null, this);
    }

    update(time, delta) {
        
        // Secret Timer
        if (this.gameOver) {
            this.secrets += delta; 
            if (this.secrets >= 6000 && this.sound.get('easter_egg') == null) {
                this.sound.play('easter_egg');
            }
        }

        // Check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
            game.settings.playTimer = game.settings.gameTimer;
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        this.planets.tilePositionX -= .7;
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

        // Update the in-game timer
        this.timeRemain = (game.settings.playTimer - this.clock.getElapsed());
        this.timeRight.text = (this.timeRemain / 1000);
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
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0).setDepth(2);
        boom.anims.play('explode');                 // play the explosion animation
        boom.on('animationcomplete', () => {        // callback after anim completes
            ship.reset();                           // reset the ship's position
            ship.alpha = 1;                         // remove cloaking!
            boom.destroy();                         // remove the animation
        });

        // Increment the score!
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // Add time to the clock based on the ship's timeScore!

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

        // Get the time remaining on the clock
        this.timeRemain = (game.settings.playTimer - this.clock.getElapsed());

        // Set playTimer equal to the time left + the ship's timeScore
        game.settings.playTimer = this.timeRemain + ship.time;

        // Increment the time display
        this.timeRight.text = (game.settings.playTimer / 1000);

        // Put old-clock out of their misery
        this.clock.destroy();
        this.clock.remove(false);
        
        // Create a new clock with a delay equal to playTimer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.playTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5).setDepth(5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for menu', scoreConfig).setOrigin(0.5).setDepth(5);
            this.gameOver = true;
            this.sound.play('game_over');
        }, null, this);

        // Play one of four random explosion SFX
        let sfxNum = Phaser.Math.Between(1,4)
        if (sfxNum == 1) {
            this.sound.play('sfx_explosion1');
        }
        else if (sfxNum == 2) { 
            this.sound.play('sfx_explosion2');
        }
        else if (sfxNum == 3) { 
            this.sound.play('sfx_explosion3');
        }
        else if (sfxNum == 4) { 
            this.sound.play('sfx_explosion4');
        } 
    }
}