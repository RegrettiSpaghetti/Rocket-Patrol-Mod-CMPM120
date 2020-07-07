//ROCKET PATROL MOD
//Sorry that there isn't a super cohesive overall theme, if I had more time it would be bangin'
//
//  Mods Added:
//  Randomized Explosion SFX:                                 15 Points
//  Time added to clock when ships are destroyed:             25 Points
//  Timer displayed in UI:                                    15 Points
//  Parallax added to BG:                                     15 Points
//  Rocket Manuverability added after firing:                 10 Points
//  New Animated Spaceship Sprite                             15 Points
//  New art assets for Rocket, BG, Spaceship                  ?? Points
//  Not-so-secret Easter Egg added after Game-Over            FACADE TIER
//  
//  Staying on the game-over menu for a certain amount of time plays a certain song by Eminem...
//  While the original implementation was really elegant, it didn't work. Current implementation works, but could be sexier
//  Worth somewhere between 5-10 points?

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
