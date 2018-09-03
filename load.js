var loadState = { 
    preload: function () {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.width/2, 150, 'Loading...', { font: '30px Arial', fill: '#1fb18a' }); 
        loadingLabel.anchor.setTo(0.5, 0.5);
        // Display the progress bar
        var progressBarBG = game.add.sprite(game.width/2-200, 200, 'progressBarBG'); 
        var progressBar = game.add.sprite(game.width/2-200, 200, 'progressBar'); 
        progressBar.anchor.setTo(0, 0); 
        game.load.setPreloadSprite(progressBar);
        // Load all game assets

        // game.load.video('a', 'pic/IMG_3233.MP4');
        // game.load.video('B', 'pic/IMG_3233.MP4');
        // game.load.video('C', 'pic/IMG_3233.MP4');
        // game.load.video('D', 'pic/IMG_3233.MP4');
        // game.load.video('DD', 'pic/IMG_3233.MP4');
        // game.load.video('DDDD', 'pic/IMG_3233.MP4');
        // game.load.video('DSS', 'pic/IMG_3233.MP4');
        // game.load.video('DDDF', 'pic/IMG_3233.MP4');
        // game.load.video('DS', 'pic/IMG_3233.MP4');
        // game.load.video('DF', 'pic/IMG_3233.MP4');
        // game.load.video('aA', 'pic/IMG_3233.MP4');
        // game.load.video('BA', 'pic/IMG_3233.MP4');
        // game.load.video('CA', 'pic/IMG_3233.MP4');
        // game.load.video('DA', 'pic/IMG_3233.MP4');
        // game.load.video('DDA', 'pic/IMG_3233.MP4');
        // game.load.video('DDDDA', 'pic/IMG_3233.MP4');
        // game.load.video('DSSA', 'pic/IMG_3233.MP4');
        // game.load.video('DDDFA', 'pic/IMG_3233.MP4');
        // game.load.video('DSA', 'pic/IMG_3233.MP4');
        // game.load.video('DFA', 'pic/IMG_3233.MP4');
        //game.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        game.load.image('bgBlack', 'pic/backgroundBig.png');
        game.load.image('background', 'pic/background.png')
        game.load.image('score', 'pic/score.png');
        game.load.image('score2', 'pic/score2.png');
        game.load.image('bar', 'pic/healthbar.png');
        game.load.image('pixel', 'pic/pixel.png');
        game.load.spritesheet('player', 'pic/player.png', 32,32);
        game.load.spritesheet('player2', 'pic/player2.png', 32, 32);
        game.load.spritesheet('player3', 'pic/player3.png', 32, 32);
        game.load.spritesheet('player4', 'pic/player4.png', 32, 32);
        game.load.spritesheet('golden', 'pic/golden.png', 97, 50);

        game.load.bitmapFont('scoreFont', 'pic/font.png', 'pic/font.fnt');

        game.load.image('wall', 'pic/wall.png');
        game.load.spritesheet('conveyorLeft', 'pic/conveyor_left.png', 96, 16, 4);
        game.load.spritesheet('conveyorRight', 'pic/conveyor_right.png', 96, 16, 4);
        game.load.spritesheet('fake', 'pic/fake.png', 97, 36, 6);
        game.load.image('nails', 'pic/nails.png');
        game.load.image('normal', 'pic/normal.png');
        game.load.spritesheet('trampoline', 'pic/trampoline.png', 97, 22, 6);
        game.load.image('ceiling', 'pic/ceiling.png');

        game.load.audio('bgm', 'music/backgroundMusic.wav');
        game.load.audio('trampolineSound', 'music/trampolineSound.wav');
        game.load.audio('conveyorSound', 'music/conveyorSound.wav');
        game.load.audio('fakeSound', 'music/fakeSound.wav');
        game.load.audio('injuredSound', 'music/injuredSound.wav');
        game.load.audio('normalSound', 'music/normalSound.wav');
        game.load.audio('dieSound', 'music/dieSound.wav');
        // Load a new asset that we will use in the menu state
        //game.load.image('background', 'assets/background.png'); 
    },
    create: function() {
        // Go to the menu state 
        game.state.start('menu');
    }
};