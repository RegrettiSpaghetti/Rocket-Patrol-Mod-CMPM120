// Spaceship prefab! Hells Yeah
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, timeValue) {
        super(scene, x, y, texture, frame, pointValue, timeValue);

        // Manually add our object to the scene
        scene.add.existing(this);

        //store that parameter
        this.points = pointValue;
        this.time = timeValue;
    }

    update() {
        //move spaceship left
        this.x -= game.settings.spaceshipSpeed;

        //wraparound on Left edge
        if (this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}