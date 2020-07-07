// Creates a menu scene
// Use a constructor of the parent scene to create the curr obj.
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/Beep_sfx1.mp3');
        this.load.audio('sfx_explosion1', './assets/explosion_sfx1.mp3');
        this.load.audio('sfx_explosion2', './assets/Kaboom1.mp3');
        this.load.audio('sfx_explosion3', './assets/skin_melt1.mp3');
        this.load.audio('sfx_explosion4', './assets/guy_ded1.mp3');
        this.load.audio('sfx_rocket', './assets/Rahket_sfx1.mp3');     
        this.load.audio('game_over', './assets/game_over_sfx.mp3');
        this.load.audio('easter_egg', './assets/lovetheway_sfx1.mp3');
    }

    create() {
        //menu Display
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY - textSpacer, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        this.add.text(centerX, centerY, 'Use <--> arrows to move & (F) to Fire', menuConfig).setOrigin(0.5);
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + textSpacer, 'Press ← for easy and → for Hard', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000,
                playTimer: 60000
            }

            // play the beep SFX
            this.sound.play('sfx_select'); 

            // play the scene
            this.scene.start("playScene");
        }

        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000,
                playTimer: 45000
            }

            this.sound.play('sfx_select'); 

            this.scene.start("playScene");
        }
    }
}