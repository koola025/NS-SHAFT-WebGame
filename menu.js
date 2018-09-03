var displayText;
var menuState = { create: function() {
    // Add a background image game.add.image(0, 0, 'background');
    // Display the name of the game
    // var nameLabel = game.add.text(game.width/2, 80, 'NS-SHAFT', { font: '50px Arial', fill: '#1fb18a' }); 
    game.stage.backgroundColor = 'cdebe3'; 
    var nameLabel = game.add.text(game.width/2, 80,'NS-SHAFT',{ font: '50px monospace', fill: '#1fb18a' }); 
    nameLabel.anchor.setTo(0.5, 0.5);

    var loadingLabel = game.add.text(game.width/2, game.height/2, 'Loading...', { font: '30px monospace', fill: '#1fb18a' }); 
    loadingLabel.anchor.setTo(0.5, 0.5);

    var ref = firebase.database().ref('score/').orderByChild("score").limitToLast(5);
    ref.once('value', function(snapshot){
        var display = "";
        snapshot.forEach(function(childSnapshot) {
            var newLine = childSnapshot.val().name + " " + childSnapshot.val().score + "\n";
            display = newLine + display;
            
        });
        displayText = game.add.text(game.width/2, 130,display,{ font: '25px monospace', fill: '#1fb18a' });
        displayText.anchor.setTo(0.5, 0);
        loadingLabel.kill();
        
    });

    //var scoreLabel = game.add.text(game.width/2, game.height/2, 'score: ' + game.global.score, { font: '25px Arial', fill: '#ffffff' }); 
    //scoreLabel.anchor.setTo(0.5, 0.5);
    
    var oneLabel = game.add.text(game.width/2-130, 350,'1 player',{ font: '40px monospace', fill: '#1fb18a' }); 
    oneLabel.inputEnabled = true;
    oneLabel.anchor.setTo(0.5,0.5);
    oneLabel.events.onInputUp.add(this.start, this);

    var twoLabel = game.add.text(game.width/2+130, 350,'2 player',{ font: '40px monospace', fill: '#1fb18a' }); 
    twoLabel.inputEnabled = true;
    twoLabel.anchor.setTo(0.5,0.5);
    twoLabel.events.onInputUp.add(this.start2, this);

    // Explain how to start the game
    /*var startLabel = game.add.text(game.width/2, game.height-80, 'press the up arrow key to start', { font: '25px Arial', fill: '#1fb18a' }); 
    startLabel.anchor.setTo(0.5, 0.5);
    

    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.start, this); */

    },
    start: function() {
        displayText.kill();
        game.state.start('choose');
        
    }, 
    start2: function() {
        displayText.kill();
        game.state.start('choose1');
        
    }
};