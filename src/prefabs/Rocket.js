// Rocket prefab! Hells Yeah
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Manually add our object to the scene
        scene.add.existing(this);

        //create a custom property for the rocket
        this.isFiring = false;

        this.sfxRocket = scene.sound.add('sfx_rocket'); // Rocket sounds go NYEEEEEEEEEEOW
    }

    update() {
        //left right movement
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >=47) {
                this.x -= 2;
            }
            else if (keyRIGHT.isDown && this.x <= 578) {
                this.x += 2;
            }
        }

        //fire button!
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); //play Rocket sfx
        }

        //if fired, move up!
        if (this.isFiring && this.y >= 108) {
            this.y -= 2;
        }

        //reset on miss
        if (this.y <= 108) {
            this.isFiring = false;
            this.y = 431;
        }
    }

    //reset rocket to the "ground" on hit
    reset() {
        this.isFiring = false;
        this.y = 431;
    }
}