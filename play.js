var leftWall;
var rightWall;
var ceiling;
var superman = 0;
var playerChoose = 1;


var groundVelocity = 0;
var dead = 0;
var dead2 = 0;

var playState = { 
    preload: function() {}, 
    create: function() {
        
        game.global.score = 0;
        this.cursor = game.input.keyboard.createCursorKeys();
        game.stage.backgroundColor = '#cdebe3'; 
        game.physics.startSystem(Phaser.Physics.ARCADE); 
        game.renderer.renderSession.roundPixels = true;
        
        
        this.addSound();
        this.newPlatform();
        this.initPlatform();
        
        game.time.events.loop(600, this.addPlatform, this);
        game.time.events.loop(2700, this.addScore, this);
        this.createPlayer();
        this.createWall();
        this.addEmitter();

        
        
        var pauseLabel = game.add.text(510, 270,'a',{ font: '85px Arial', fill: '#1fb18a' }); 
        pauseLabel.inputEnabled = true;
        pauseLabel.events.onInputUp.add(this.pauseUp, this);

        var abortLabel = game.add.text(510, 330,'a',{ font: '85px Arial', fill: '#1fb18a' }); 
        abortLabel.inputEnabled = true;
        abortLabel.events.onInputUp.add(this.abortUp, this);
        
        game.add.sprite(0, 0, 'bgBlack');
        game.add.sprite(22, 18, 'score');
        this.bar = game.add.sprite(22, 34, 'bar');

        
        this.bgm.loop = true;
        this.bgm.play();
        //this.bgm.fadeIn(0.1);
        superman = 0;
        

    },
    update: function() {
        //this.updatePlatforms();
        //this.createPlatform();
        //this.checkTouchCeiling(this.player);
        //game.physics.arcade.collide(this.player, platforms, this.effect);
        game.physics.arcade.collide(this.player, [leftWall, rightWall]);
        game.physics.arcade.collide(this.player, ceiling, this.touchCeiling);
        
        game.physics.arcade.collide(this.player, this.normals, this.effect);
        game.physics.arcade.collide(this.player, this.nails, this.effect);
        game.physics.arcade.collide(this.player, this.conveyorLefts, this.effect);
        game.physics.arcade.collide(this.player, this.conveyorRights, this.effect);
        game.physics.arcade.collide(this.player, this.trampolines, this.effect);
        game.physics.arcade.collide(this.player, this.fakes, this.effect);
        game.physics.arcade.collide(this.player, this.goldens, this.effect);
        this.movePlayer();
        if (this.player.life >= 0)
        cropRect = new Phaser.Rectangle(0, 0, this.player.life * 8, this.bar.height);
        else cropRect = new Phaser.Rectangle(0, 0, 0, this.bar.height);
        
        this.bar.crop(cropRect);
        if (this.player.y > 420) {

            if(this.player.alive)
            this.dieSound.play();
            this.player.kill();
            this.player.life = 0;

            
        }
        if (this.player.life <= 0) {
            this.player.kill();
            this.emitterEffect(this.player);
            this.bgm.pause();
            game.time.events.add(
                1500, 
                function() {game.state.start('gameover');}
            ); 
            
        }
        
        if (superman) game.camera.flash(0xfff58a, 150);
       
    },
    addEmitter: function() {
        this.emitter = game.add.emitter(0, 0, 15); 
        this.emitter.makeParticles('pixel'); 
        this.emitter.setYSpeed(-150, 150); 
        this.emitter.setXSpeed(-150, 150);
        this.emitter.setScale(2, 0, 2, 0, 800);
        this.emitter.gravity = 0;
    },
    emitterEffect: function(player){
        this.emitter.x = player.x; 
        this.emitter.y = player.y; 
        this.emitter.start(true, 1500, null, 15); 
    },
    pauseUp: function() {
        if (!game.paused){
            game.paused = true;
        }
        else {
            game.paused = false;
            
        }
    },
    abortUp: function() {
        game.state.start('menu');
        this.bgm.pause();
    },
    addSound: function() {
        this.bgm = game.add.audio('bgm');
        this.trampolineSound = game.add.audio('trampolineSound');
        this.conveyorSound = game.add.audio('conveyorSound');
        this.fakeSound = game.add.audio('fakeSound');
        this.injuredSound = game.add.audio('injuredSound');
        this.normalSound = game.add.audio('normalSound');
        this.dieSound = game.add.audio('dieSound');
        
    },
    newPlatform: function() {
        this.normals = game.add.group(); 
        this.normals.enableBody = true;
        this.normals.createMultiple(10, 'normal');
        this.nails = game.add.group(); 
        this.nails.enableBody = true;
        this.nails.createMultiple(10, 'nails');
        this.conveyorLefts = game.add.group(); 
        this.conveyorLefts.enableBody = true;
        this.conveyorLefts.createMultiple(10, 'conveyorLeft');
        this.conveyorRights = game.add.group(); 
        this.conveyorRights.enableBody = true;
        this.conveyorRights.createMultiple(10, 'conveyorRight');
        this.trampolines = game.add.group(); 
        this.trampolines.enableBody = true;
        this.trampolines.createMultiple(10, 'trampoline');
        this.fakes = game.add.group(); 
        this.fakes.enableBody = true;
        this.fakes.createMultiple(10, 'fake');
        this.goldens = game.add.group(); 
        this.goldens.enableBody = true;
        this.goldens.createMultiple(10, 'golden');
        
        
    },
    initPlatform: function() {
        var i;
        for(i = 0; i < 6; i++) {
            var x = Math.random()*(400 - 96 - 40) + 44;
            var y = 460 - 70 * (5-i);
            var rand = Math.random() * 100;
            var platform;
            if (i == 4) {
                platform = this.normals.getFirstDead();
                x = 235 - 48;
                //platform.anchor.setTo(0.5, 0); 
            }
            else if(rand < 20) {
                platform = this.normals.getFirstDead();
            } else if (rand < 40) {
                platform = this.nails.getFirstDead();
                game.physics.arcade.enable(platform);
                platform.body.setSize(96, 15, 0, 15);
            } else if (rand < 50) {
                platform = this.conveyorLefts.getFirstDead();
                platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
                platform.play('scroll');
            } else if (rand < 60) {
                platform = this.conveyorRights.getFirstDead();
                platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
                platform.play('scroll');
            } else if (rand < 80) {
                platform = this.trampolines.getFirstDead();
                platform.animations.add('jump', [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
                platform.frame = 3;
                game.physics.arcade.enable(platform);
                platform.body.setSize(96,16, 0,6);
                
            } else {
                platform = this.fakes.getFirstDead();
                platform.animations.add('turn', [0, 1, 2, 3, 4, 5, 0], 14);
                game.physics.arcade.enable(platform);
                platform.body.setSize(96,16,0,10);
            }

            if (!platform) { return;}
            platform.reset(x, y);
            
            platform.checkWorldBounds = true; 
            platform.outOfBoundsKill = true;

            game.physics.arcade.enable(platform);
            platform.body.velocity.y = -100;
            platform.body.immovable = true;
        
            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
        }
    },
    addPlatform: function() {
        var x = Math.random()*(386-97) + 36;
        var y = 420;
        var rand = Math.random() * 100;
        var platform;
        console.log("x = " + x);
        if(rand < 20) {
            platform = this.normals.getFirstDead();
        } else if (rand < 23) {
            platform = this.goldens.getFirstDead();
            platform.animations.add('shine', [0, 1, 2], 16, true);
            platform.play('shine');
            //platform.frame = 3;
            game.physics.arcade.enable(platform);
            platform.body.setSize(97,16, 0,17);
        } else if (rand < 40) {
            platform = this.nails.getFirstDead();
            game.physics.arcade.enable(platform);
            platform.body.setSize(96, 15, 0, 15);
        } else if (rand < 50) {
            platform = this.conveyorLefts.getFirstDead();
            platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
            platform.play('scroll');
        } else if (rand < 60) {
            platform = this.conveyorRights.getFirstDead();
            platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
            platform.play('scroll');
        } else if (rand < 80) {
            platform = this.trampolines.getFirstDead();
            platform.animations.add('jump', [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
            platform.frame = 3;
            game.physics.arcade.enable(platform);
            platform.body.setSize(96,16, 0,6);
            
        } else {
            platform = this.fakes.getFirstDead();
            platform.body.checkCollision.up = true;
            platform.animations.add('turn', [0, 1, 2, 3, 4, 5, 0], 14);
            game.physics.arcade.enable(platform);
            platform.body.setSize(96,16,0,10);
        }

        if (!platform) { return;}
        platform.reset(x, y);
        
        platform.checkWorldBounds = true; 
        platform.outOfBoundsKill = true;

        game.physics.arcade.enable(platform);
        platform.body.velocity.y = -100;
        platform.body.immovable = true;
    
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
    },
    addScore: function() {
        game.global.score++;
        var show;
        if (game.global.score < 10) show = "00";
        else if (game.global.score < 100) show = "0";
        else show = "";
        text = game.add.bitmapText(268, 54.5, 'scoreFont', show + game.global.score, 32);
        text.angle += 180;
        text.scale.setTo(0.94,0.94);
        text.anchor.setTo(1, 1);
        
        
    },
    createPlayer: function() {
        if (playerChoose == 2) this.player = game.add.sprite(32,32,'player2');
        else if (playerChoose == 3) this.player = game.add.sprite(32,32,'player3');
        else if (playerChoose == 4) this.player = game.add.sprite(32,32,'player4');
        else this.player = game.add.sprite(32,32,'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.y = 360;
        this.player.x = 250;
        //this.player.scale.setTo(0.2, 0.2);
        game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.enableBody = true; 
        this.player.body.gravity.y = 1100;
        this.player.unbeatableTime = 0;
        this.player.touchOn = undefined;
        //this.player.animations.add('walk', [8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15], 4, true);
        this.player.life = 12;
        //this.player.play('walk');
        //this.player.body.setSize(132,162,71,39);
        this.player.animations.add('left', [0, 1, 2, 3], 24);
        this.player.animations.add('left_injured', [4, 5, 6, 7], 24);
        this.player.animations.add('right', [9, 10, 11, 12], 24);
        this.player.animations.add('right_injured', [13, 14, 15, 16], 24);
        this.player.animations.add('flyLeft', [18, 19, 20, 21], 24);
        this.player.animations.add('left_fly_injured', [22, 23, 24, 25], 24);
        this.player.animations.add('flyRight', [27, 28, 29, 30], 24);
        this.player.animations.add('right_fly_injured', [31, 32, 33, 34], 24);
        this.player.animations.add('fly', [36, 37, 38, 39], 24);
        this.player.animations.add('fly_injured', [40, 41, 42, 43], 24);
        this.player.animations.add('idle', [8], 1, false);
        this.player.animations.add('idle_injured', [8, 17], 24, true);
    },
    movePlayer: function() {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200 + groundVelocity;
            // if (this.player.scale.x == -0.2)
            // this.player.scale.x *= -1;
            this.player.animations.play('left');
            
        }   
        else if(this.cursor.right.isDown) {
            this.player.body.velocity.x = 200 + groundVelocity;
            // if (this.player.scale.x == 0.2)
            // this.player.scale.x *= -1;
            this.player.animations.play('right');
        }  
        else {
            this.player.body.velocity.x = 0 + groundVelocity;
            if(this.player.body.onFloor() || this.player.body.touching.down){
                this.player.animations.play('idle');
            }else{
                this.player.animations.play('fly');
            }
        }
            
        if (!this.player.body.touching.down) {
            groundVelocity = 0;
            this.player.touchOn = undefined;
        }
    },
    createWall: function() {
        ceiling = game.add.sprite(25, 64, 'ceiling');
        game.physics.arcade.enable(ceiling, Phaser.Physics.ARCADE);
        // ceiling.enableBody = true; 
        ceiling.body.immovable = true;

        leftWall = game.add.sprite(24, 64, 'wall');
        game.physics.arcade.enable(leftWall, Phaser.Physics.ARCADE);
        // leftWall.enableBody = true; 
        leftWall.body.immovable = true;

        rightWall = game.add.sprite(423, 64, 'wall');
        game.physics.arcade.enable(rightWall, Phaser.Physics.ARCADE);
        // rightWall.enableBody = true; 
        rightWall.body.immovable = true;

        
        
    },
    /*createPlatform: function() {
        if(game.time.now > lastTime + 800) {
            lastTime = game.time.now;
            this.createOnePlatform();
            distance += 1;
        }
    },
    createOnePlatform: function () {
        var platform;
        var x = Math.random()*(400 - 96 - 40) + 44;
        var y = 400;
        var rand = Math.random() * 100;
        
    
        if(rand < 20) {
            platform = game.add.sprite(x, y, 'normal');
        } else if (rand < 40) {
            platform = game.add.sprite(x, y, 'nails');
            game.physics.arcade.enable(platform);
            platform.body.setSize(96, 15, 0, 15);
        } else if (rand < 50) {
            platform = game.add.sprite(x, y, 'conveyorLeft');
            platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
            platform.play('scroll');
        } else if (rand < 60) {
            platform = game.add.sprite(x, y, 'conveyorRight');
            platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
            platform.play('scroll');
        } else if (rand < 80) {
            platform = game.add.sprite(x, y, 'trampoline');
            platform.animations.add('jump', [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
            platform.frame = 3;
            game.physics.arcade.enable(platform);
            platform.body.setSize(96,16, 0,6);
            
        } else {
            platform = game.add.sprite(x, y, 'fake');
            platform.animations.add('turn', [0, 1, 2, 3, 4, 5, 0], 14);
            game.physics.arcade.enable(platform);
            platform.body.setSize(96,16,0,10);
        }
    
        game.physics.arcade.enable(platform);
        platform.body.immovable = true;
        platforms.push(platform);
    
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
    },
    updatePlatforms: function() {
        for(var i=0; i<platforms.length; i++) {
            var platform = platforms[i];
            platform.body.position.y -= 2;
            if(platform.body.position.y <= -20) {
                platform.destroy();
                platforms.splice(i, 1);
            }
        }
    },*/
    effect: function(player, platform) {
        if(!player.body.touching.down)return;
        if(platform.key == 'nails') {
            playState.nailsEffect(player, platform);
        }else{
            
        }
        if(platform.key == 'conveyorRight') {
            playState.conveyorRightEffect(player, platform);
        }
        if(platform.key == 'conveyorLeft') {
            playState.conveyorLeftEffect(player, platform);
        }
        if(platform.key == 'trampoline') {
            playState.trampolineEffect(player, platform);
        }
        if(platform.key == 'normal') {
            playState.basicEffect(player, platform);
        }
        if(platform.key == 'fake') {
            playState.fakeEffect(player, platform);
        }
        if(platform.key == 'golden') {
            playState.goldenEffect(player, platform);
        }
    },
    conveyorRightEffect: function(player, platform) {
        groundVelocity = 100;
        if (player.touchOn !== platform) { 
            this.conveyorSound.play();
            player.touchOn = platform;
            if (player.life < 12) player.life++;
        }
    },
    conveyorLeftEffect: function(player, platform) {
        groundVelocity = -100;
        
        if (player.touchOn !== platform) { 
            this.conveyorSound.play();
            player.touchOn = platform;
            if (player.life < 12) player.life++;
        }
    },
    trampolineEffect: function(player, platform) {
        platform.animations.play('jump');
        player.body.velocity.y = -350;
        this.trampolineSound.play();
        if (player.life < 12) player.life++;
    },
    nailsEffect: function(player, platform) {
        if (player.touchOn !== platform && !superman) {
            player.life -= 3;
            player.touchOn = platform;
            game.camera.flash(0xff0000, 100);
            this.injuredSound.play();
        }else if (player.touchOn !== platform && superman) {
            this.normalSound.play();
            player.touchOn = platform;
        }
    },
    basicEffect: function(player, platform) {
        if (player.touchOn !== platform) {
            player.touchOn = platform;
            this.normalSound.play();
            if (player.life < 12) player.life++;
        }
    },
    fakeEffect: function(player, platform) {
        if(player.touchOn !== platform) {
            platform.animations.play('turn');
            setTimeout(function() {
                platform.body.checkCollision.up = false;
            }, 100);
            player.touchOn = platform;
            this.fakeSound.play();
            if (player.life < 12) player.life++;
            
        }

    },
    goldenEffect: function(player, platform) {
        if(player.touchOn !== platform) {
            superman = 1;
            game.time.events.add(
                5000, 
                function() {superman = 0;}
            ); 
            player.touchOn = platform;
            this.normalSound.play();
            if (player.life < 12) player.life = 12;
            
        }

    },
    touchCeiling: function(player, ceiling) {
        player.y += 10;
        if(game.time.now > player.unbeatableTime && !superman) {
            playState.injuredSound.play();
            player.life -= 3;
            game.camera.flash(0xff0000, 100);
            player.unbeatableTime = game.time.now + 200;
            
        }
        

    }
    /*checkTouchCeiling: function(player) {
        if(player.body.y < 40) {
            player.y += 10;
            if(player.body.velocity.y < 0) {
                player.body.velocity.y = 0;
            }
            if(game.time.now > player.unbeatableTime) {
                player.life -= 3;
                game.camera.flash(0xff0000, 100);
                player.unbeatableTime = game.time.now + 2000;
            }
        }
    }*/
};

var gameoverState = { 
    preload: function () {
        // Load the progress bar image.
        game.load.image('button', 'pic/tryagain.png');
    },
    create: function() {
        // Set some game settings. 
        var nameLabel = game.add.text(game.width/2, 100,'GAME OVER',{ font: '50px monospace', fill: '#1fb18a' }); 
        nameLabel.anchor.setTo(0.5, 0.5);

        var scoreLabel = game.add.text(game.width/2, 170, 'score: ' + game.global.score, { font: '25px monospace', fill: '#1fb18a' }); 
        scoreLabel.anchor.setTo(0.5,0.5);

        var person = prompt("Please enter your name", "Name...");
        if (person != null) {
            var nameData = {  
                name: person,
                score: game.global.score
            }; 
            
            var newKey = firebase.database().ref("score/").push().key; 
            
            var updates = {};  
            updates["score/" +newKey] = nameData;  
            
            firebase.database().ref().update(updates);  
            person = "";
                
        }   

        game.stage.backgroundColor = 'cdebe3'; 
        button = game.add.button(game.world.centerX - 150, 220, 'button', this.actionOnClick, this, 2, 1, 0);
        
    },
    actionOnClick: function() {
        game.state.start('menu');
    }
};

var aa = 0;
var bb = 0;
var cc = 0;
var dd = 0;

var choosePlayer = {
    preload: function () {
        
    },
    create: function() {
        aa = 0;
        bb = 0;
        cc = 0; 
        dd = 0;
        var nameLabel = game.add.text(game.width/2, 80,'Choose Player',{ font: '50px monospace', fill: '#1fb18a' }); 
        nameLabel.anchor.setTo(0.5, 0.5);

        this.p1 = game.add.sprite(32,32,'player');
        this.p1.x = game.width/2 - 150;
        this.p1.events.onInputDown.add(this.p1change, this);
        this.set(this.p1);


        this.p2 = game.add.sprite(32,32,'player2');
        this.p2.x = game.width/2 - 50;
        this.p2.events.onInputDown.add(this.p2change, this);
        this.set(this.p2);



        this.p3 = game.add.sprite(32,32,'player3');
        this.p3.x = game.width/2 + 50;
        this.p3.events.onInputDown.add(this.p3change, this);
        this.set(this.p3);

        this.p4 = game.add.sprite(32,32,'player4');
        this.p4.x = game.width/2 + 150;
        this.p4.events.onInputDown.add(this.p4change, this);
        this.set(this.p4);


        
    },
    update: function() {
        this.p1.animations.play('fly');
        this.p2.animations.play('fly');
        this.p3.animations.play('fly');
        this.p4.animations.play('fly');
        if (this.p1.input.pointerOver() && aa == 0) {
            aa = 1;
            this.tween(this.p1);
            game.time.events.add(500, function() {aa = 0}); 
        }
        if (this.p2.input.pointerOver() && bb == 0) {
            bb = 1;
            this.tween(this.p2);
            game.time.events.add(500, function() {bb = 0}); 
        }
        if (this.p3.input.pointerOver() && cc == 0) {
            cc = 1;
            this.tween(this.p3);
            game.time.events.add(500, function() {cc = 0}); 
        }
        if (this.p4.input.pointerOver() && dd == 0) {
            dd = 1;
            this.tween(this.p4);
            game.time.events.add(500, function() {dd = 0}); 
        }
    },
    p1change: function() {
        playerChoose = 1;
        game.state.start('play');
    },
    p2change: function() {
        playerChoose = 2;
        game.state.start('play');
    },
    p3change: function() {
        playerChoose = 3;
        game.state.start('play');
    },
    p4change: function() {
        playerChoose = 4;
        game.state.start('play');
    },
    tween: function(player) {
        var X = player.x;
        var Y = player.y;
        game.add.tween(player).to({y: Y - 35}, 150).yoyo(true).start();

    },
    set: function(player) {
        player.scale.setTo(1.5,1.5);
        player.y = 250;
        player.anchor.setTo(0.5, 0.5);
        player.inputEnabled = true;
        player.animations.add('fly', [36, 37, 38, 39], 24);
        
    }
}