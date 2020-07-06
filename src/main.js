// create game configuration obj
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480, 
    scene: [Menu, Play]
}

// create main game object (Octopus head)
let game = new Phaser.Game(config);

// game difficulty
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
    playTimer: 60000
}

// reserve some keyboard bindings
let keyF, keyLEFT, keyRIGHT;
