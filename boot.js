var bootState = { 
    preload: function () {
        // Load the progress bar image.
        game.load.image('progressBar', 'pic/progress.png'); 
        game.load.image('progressBarBG', 'pic/progressbg.png');
    },
    create: function() {
        // Set some game settings. 
        game.stage.backgroundColor = 'cdebe3'; 
        game.physics.startSystem(Phaser.Physics.ARCADE); 
        game.renderer.renderSession.roundPixels = true;
        // Start the load state.
        game.state.start('load');
    }
};