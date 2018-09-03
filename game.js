

var game = new Phaser.Game(634, 436, Phaser.AUTO, 'canvas'); 
//game.state.add('play', playState);
//game.state.start('play');


game.global = { score: 0 };

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('choose', choosePlayer);
game.state.add('choose1', choosePlayer1);
game.state.add('choose2', choosePlayer2);
game.state.add('play2', playState2);
game.state.add('gameover', gameoverState);

game.state.start('boot');