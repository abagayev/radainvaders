/*
  spaceinvaders.js

  the core logic for the space invaders game.

*/

/*  
    Game Class

    The Game class represents a Space Invaders game.
    Create an instance of it, change any of the default values
    in the settings, and call 'start' to run the game.

    Call 'initialise' before 'start' to set the canvas the game
    will draw to.

    Call 'moveShip' or 'shipFire' to control the ship.

    Listen for 'gameWon' or 'gameLost' events to handle the game
    ending.
*/

//  Creates an instance of the Game class.
function Game() {

    //  Set the initial config.
    this.config = {
        bombRate: 0.02,
        bombMinVelocity: 50,
        bombMaxVelocity: 50,
        invaderInitialVelocity: 10,
        invaderAcceleration: 0,
        invaderDropDistance: 20,
        rocketVelocity: 300,
        rocketMaxFireRate: 10,
        gameWidth: 500,
        gameHeight: 300,
        fps: 50,
        debugMode: false,
        invaderFiles: 45,
        invaderRanks: 18,
        shipSpeed: 150,
        levelDifficultyMultiplier: 1.7  ,
        pointsPerInvader: 1,

        // init map

        // 1 БЛОК ПЕТРА ПОРОШЕНКА
        // 2 НАРОДНИЙ ФРОНТ
        // 3 Позафракційні
        // 4 Опозиційний блок
        // 5 САМОПОМІЧ
        // 6 Відродження
        // 7 Радикальної партії Олега Ляшка
        // 8 Воля народу
        // 9 Батьківщина

        map: [
            [0,0,0,0,0,0,0,0,0,0,0,1,0,1,3,0,0,0,1,1,3,3,0,9,9,9,9,0,0,0,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,9,9,9,9,9,0,0,0,5,5,0,5,5,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,0,0,1,1,0,9,9,9,9,9,9,9,0,0,0,5,5,5,5,5,5,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,3,3,0,9,9,9,3,3,0,3,3,0,0,0,5,5,5,0,5,5,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,3,3,3,0,7,3,3,3,3,3,3,3,3,0,0,0,5,5,5,5,5,5,0,0,0,0],
            [0,0,1,1,1,1,1,1,0,0,0,1,1,0,1,1,0,0,1,1,1,1,0,7,7,7,7,0,0,8,8,0,6,8,0,0,0,3,3,3,3,0,3,0,7],
            [0,0,1,1,0,1,1,0,0,1,1,1,1,3,1,0,0,1,1,0,1,1,0,7,7,7,7,0,0,0,8,8,8,8,8,8,0,0,3,3,3,3,3,0,3],
            [0,0,1,1,1,0,0,0,0,1,1,1,3,7,3,0,0,0,3,0,1,1,0,7,7,7,7,7,0,0,8,8,0,8,8,8,0,0,0,0,3,3,3,0,4],
            [0,0,1,1,0,0,0,1,1,1,1,1,3,1,0,0,1,1,1,0,1,8,0,7,0,7,7,7,7,0,0,8,0,8,0,8,6,8,0,0,0,3,3,0,3],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,0,2,2,2,2,6,6,6,0,0,4,4,4,0,0,4,4,0,0,0,0,0,4],
            [1,0,0,0,3,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,0,2,2,2,2,6,6,6,6,0,0,4,4,4,0,0,4,4,4,0,0,0,4],
            [1,0,0,0,0,1,1,0,1,1,1,1,0,0,2,2,2,2,2,2,2,2,0,2,2,2,2,6,6,6,6,0,0,4,4,4,0,4,4,4,0,0,0,0,4],
            [0,0,0,0,0,1,8,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,0,2,2,2,0,6,6,6,6,6,0,0,4,4,4,4,4,4,0,0,0,0,4],
            [0,0,0,0,0,0,0,0,1,1,0,0,2,2,2,2,2,0,2,2,2,2,0,2,2,2,2,0,6,4,6,6,6,0,0,4,4,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,2,2,2,2,0,2,2,2,2,2,3,3,6,3,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,3,0,4,4,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,4,4,4,4,4,4,4,0,0,0],
        ],
        score_fractions_template: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0}
    };



    //  All state is in the variables below.
    this.lives = 100;
    this.width = 0;
    this.height = 0;
    this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.intervalId = 0;
    this.score = 0;
    this.score_fractions = this.config.score_fractions_template;
    this.level = 1;

    //  The state stack.
    this.stateStack = [];

    //  Input/output
    this.pressedKeys = {};
    this.gameCanvas =  null;

    //  All sounds.
    this.sounds = null;
}

//  Initialis the Game with a canvas.
Game.prototype.initialise = function(gameCanvas) {

    //  Set the game canvas.
    this.gameCanvas = gameCanvas;

    //  Set the game width and height.
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    //  Set the state game bounds.
    this.gameBounds = {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
};

Game.prototype.moveToState = function(state) {
   //  If we are in a state, leave it.
   if(this.currentState() && this.currentState().leave) {
     this.currentState().leave(game);
     this.stateStack.pop();
   }
   
   //  If there's an enter function for the new state, call it.
   if(state.enter) {
     state.enter(game);
   }
 
   //  Set the current state.
   this.stateStack.pop();
   this.stateStack.push(state);
 };

//  Start the Game.
Game.prototype.start = function() {

    //  Move into the 'welcome' state.
    this.moveToState(new WelcomeState());

    //  Set the game variables.
    this.lives = 100;
    this.config.debugMode = /debug=true/.test(window.location.href);

    //  Start the game loop.
    var game = this;
    this.intervalId = setInterval(function () { GameLoop(game);}, 1000 / this.config.fps);

};

//  Returns the current state.
Game.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};

//  Mutes or unmutes the game.
Game.prototype.mute = function(mute) {

    //  If we've been told to mute, mute.
    if(mute === true) {
        this.sounds.mute = true;
    } else if (mute === false) {
        this.sounds.mute = false;
    } else {
        // Toggle mute instead...
        this.sounds.mute = this.sounds.mute ? false : true;
    }
};

//  The main loop.
function GameLoop(game) {
    var currentState = game.currentState();
    if(currentState) {

        //  Delta t is the time to update/draw.
        var dt = 1 / game.config.fps;

        //  Get the drawing context.
        var ctx = this.gameCanvas.getContext("2d");
        
        //  Update if we have an update function. Also draw
        //  if we have a draw function.
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

function sklonen(n, s1, s2, s3) {
    var m = n % 10;
    var j = n % 100;
    if (m == 0 || m >= 5 || (j >= 10 && j <= 20)) return n + " " + s3;
    if (m >= 2 && m <= 4) return n + " " + s2;
    return n + " " + s1;
}

Game.prototype.pushState = function(state) {

    //  If there's an enter function for the new state, call it.
    if(state.enter) {
        state.enter(game);
    }
    //  Set the current state.
    this.stateStack.push(state);
};

Game.prototype.popState = function() {

    //  Leave and pop the state.
    if(this.currentState()) {
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }

        //  Set the current state.
        this.stateStack.pop();
    }
};

//  The stop function stops the game.
Game.prototype.stop = function Stop() {
    clearInterval(this.intervalId);
};

//  Inform the game a key is down.
Game.prototype.keyDown = function(keyCode) {
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode);
    }
};

//  Inform the game a key is up.
Game.prototype.keyUp = function(keyCode) {
    delete this.pressedKeys[keyCode];
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
    }
};

function WelcomeState() {

}

WelcomeState.prototype.enter = function(game) {

    // Create and load the sounds.
    game.sounds = new Sounds();
    game.sounds.init();
    game.sounds.loadSound('shoot', 'sounds/shoot.wav');
    game.sounds.loadSound('bang', 'sounds/bang.wav');
    game.sounds.loadSound('explosion', 'sounds/explosion.wav');
    game.sounds.loadSound('pikpikpik', 'sounds/pikpikpik.wav');
    game.sounds.loadSound('zala', 'sounds/zala.wav', function(sound) {
        // loop sound of zala
        game.sounds.playSound(sound);
        setInterval(function () { game.sounds.playSound(sound); }, 1000 * 40);
    });

    // Define deputates and on show events
    game.deputates = new Deputates(game.sounds);

    game.deputates.loadDeputat('propalo', function (deputat) {
        deputat
            .css({
                left: $(window).width() / 2,
                top: $(window).height(),
                position: 'absolute'
            })
            .animate({top: $(window).height() - deputat.height()}, {
                duration: 1000,
                specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'},
                complete: function () {
                    deputat.animate({top: $(window).height()}, {
                        duration: 1000,
                        specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'},
                        complete: function () {
                            deputat.hide();
                        }
                    });
                }
            });
    });

    game.deputates.loadDeputat('intothedeep', function (deputat) {
        deputat
            .css({left: 0, top: 0, position: 'absolute'})
            .animate({borderSpacing: -360}, { // rotate
                step: function (now, fx) {
                    deputat.css('-webkit-transform', 'rotate(' + now + 'deg)');
                    deputat.css('-moz-transform', 'rotate(' + now + 'deg)');
                    deputat.css('transform', 'rotate(' + now + 'deg)');
                },
                duration: 2000, queue: false
            }, 'linear')
            .animate({left: $(window).width(), top: $(window).height() / 2}, {
                duration: 2000,
                specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'},
                complete: function () {
                    deputat.hide();
                }
            });
    });

    game.deputates.loadDeputat('skotyniaky', function (deputat) {

        deputat
            .css({
                left: $(window).width(),
                top: $(window).height() / 2  - deputat.width() / 2,
                position: 'absolute'
            })
            .animate({left: $(window).width() - deputat.width()}, {
                duration: 500,
                //specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'},
                complete: function () {
                    deputat.animate({left: $(window).width()}, {
                        duration: 2500,
                        specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'},
                        complete: function () {
                            deputat.hide();
                        }
                    });
                }
            });
    });

    game.deputates.loadDeputat('ivseh', function (deputat) {
        deputat
            .css({
                left: $(window).width() / 2 - deputat.width() * 2,
                top: $(window).height(),
                position: 'absolute'
            })
            .animate({top: $(window).height() - deputat.height()}, {
                duration: 1500,
                specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'},
                complete: function () {
                    deputat.animate({top: $(window).height()}, {
                        duration: 1000,
                        specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'},
                        complete: function () {
                            deputat.hide();
                        }
                    });
                }
            });
    });

};

WelcomeState.prototype.update = function (game, dt) {


};

WelcomeState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Rada Invaders", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";

    ctx.fillText("Тисніть пробіл, щоб почати.", game.width / 2, game.height/2);
};

WelcomeState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32) /*space*/ {
        //  Space starts the game.
        game.level = 1;
        game.score = 0;
        game.score_fractions = game.config.score_fractions_template;
        game.lives = 100;
        game.moveToState(new LevelIntroState(game.level));
    }
};

function GameOverState() {

}

GameOverState.prototype.update = function(game, dt) {

};

GameOverState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Гру скінчено!", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";
    ctx.fillText("Ви знешкодили " + sklonen(game.score, "депутата", "депутати", "депутатів") + ", дійшовши до " + game.level + " читання", game.width / 2, game.height/2);
    ctx.font="16px Arial";
    ctx.fillText("Тисніть пробіл, щоб грати знов.", game.width / 2, game.height/2 + 40);
};

GameOverState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32) /*space*/ {
        //  Space restarts the game.
        game.lives = 100;
        game.score = 0;
        game.score_fractions = game.config.score_fractions_template;
        game.level = 1;
        game.moveToState(new LevelIntroState(1));
    }
};

//  Create a PlayState with the game config and the level you are on.
function PlayState(config, level) {
    this.config = config;
    this.level = level;

    //  Game state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastRocketTime = null;

    //  Game entities.
    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];
}

PlayState.prototype.enter = function(game) {

    //  Create the ship.
    this.ship = new Ship(game.width / 2, game.gameBounds.bottom);

    //  Setup initial state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;

    //  Set the ship speed for this level, as well as invader params.
    var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    this.shipSpeed = this.config.shipSpeed;
    this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMultiplier * this.config.invaderInitialVelocity);
    this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
    this.bombMinVelocity = this.config.bombMinVelocity + (levelMultiplier * this.config.bombMinVelocity);
    this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMultiplier * this.config.bombMaxVelocity);

    //  Create the invaders.
    var ranks = this.config.invaderRanks;
    var files = this.config.invaderFiles;
    var invaders = [];
    for(var rank = 0; rank < ranks; rank++){
        for(var file = 0; file < files; file++) {

            if (typeof this.config.map[rank] == 'undefined' ||
                typeof this.config.map[rank][file] == 'undefined' ||
                this.config.map[rank][file] == 0
            ) continue;

            invaders.push(new Invader(
                (game.width / 2) + ((file - files/2) * 400 / files),
                (game.gameBounds.top + rank * 10),
                rank, file, 'Invader',
                this.config.map[rank][file]
            ));
        }
    }
    this.invaders = invaders;
    this.invaderCurrentVelocity = this.invaderInitialVelocity;
    this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
    this.invaderNextVelocity = null;
};

PlayState.prototype.update = function(game, dt) {
    
    //  If the left or right arrow keys are pressed, move
    //  the ship. Check this on ticks rather than via a keydown
    //  event for smooth movement, otherwise the ship would move
    //  more like a text editor caret.
    if(game.pressedKeys[37]) {
        this.ship.x -= this.shipSpeed * dt;
    }
    if(game.pressedKeys[39]) {
        this.ship.x += this.shipSpeed * dt;
    }
    if(game.pressedKeys[32]) {
        this.fireRocket();
    }

    //  Keep the ship in bounds.
    if(this.ship.x < game.gameBounds.left) {
        this.ship.x = game.gameBounds.left;
    }
    if(this.ship.x > game.gameBounds.right) {
        this.ship.x = game.gameBounds.right;
    }

    //  Move each bomb.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        bomb.y += dt * bomb.velocity;

        //  If the rocket has gone off the screen remove it.
        if(bomb.y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }

    //  Move each rocket.
    for(i=0; i<this.rockets.length; i++) {
        var rocket = this.rockets[i];
        rocket.y -= dt * rocket.velocity;

        //  If the rocket has gone off the screen remove it.
        if(rocket.y < 0) {
            this.rockets.splice(i--, 1);
        }
    }

    //  Move the invaders.
    var hitLeft = false, hitRight = false, hitBottom = false;
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var newx = invader.x + this.invaderVelocity.x * dt;
        var newy = invader.y + this.invaderVelocity.y * dt;
        if(hitLeft == false && newx < game.gameBounds.left) {
            hitLeft = true;
        }
        else if(hitRight == false && newx > game.gameBounds.right) {
            hitRight = true;
        }
        else if(hitBottom == false && newy > game.gameBounds.bottom) {
            hitBottom = true;
        }

        if(!hitLeft && !hitRight && !hitBottom) {
            invader.x = newx;
            invader.y = newy;
        }
    }

    //  Update invader velocities.
    if(this.invadersAreDropping) {
        this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
        if(this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
            this.invadersAreDropping = false;
            this.invaderVelocity = this.invaderNextVelocity;
            this.invaderCurrentDropDistance = 0;
        }
    }
    //  If we've hit the left, move down then right.
    if(hitLeft) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
        this.invadersAreDropping = true;
        this.invaderNextVelocity = {x: this.invaderCurrentVelocity , y:0};
    }
    //  If we've hit the right, move down then left.
    if(hitRight) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
        this.invadersAreDropping = true;
        this.invaderNextVelocity = {x: -this.invaderCurrentVelocity , y:0};
    }
    //  If we've hit the bottom, it's game over.
    if(hitBottom) {
        this.lives = 0;
    }
    
    //  Check for rocket/invader collisions.
    var accuracy = 10;
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var bang = false;

        for(var j=0; j<this.rockets.length; j++){
            var rocket = this.rockets[j];

            if(rocket.x >= (invader.x - invader.width/2) -accuracy && rocket.x <= (invader.x + invader.width/2) +accuracy &&
                rocket.y >= (invader.y - invader.height/2) -accuracy  && rocket.y <= (invader.y + invader.height/2) +accuracy)  {
                
                //  Remove the rocket, set 'bang' so we don't process
                //  this rocket again.
                this.rockets.splice(j--, 1);
                bang = true;
                game.score += this.config.pointsPerInvader;
                ++game.score_fractions[invader.fraction_id];

                break;
            }
        }
        if (bang) {
            this.invaders.splice(i--, 1);

            if (invader.file == 34 && invader.rank == 13) {
                game.deputates.showDeputat('ivseh');
            }

            if (invader.file == 23 && invader.rank == 6) {
                game.deputates.showDeputat('skotyniaky');
            }
            else if (invader.file == 25 && invader.rank == 1) {
                game.deputates.showDeputat('propalo');
            }

            else if (invader.file == 14 && invader.rank == 5) {
                game.deputates.showDeputat('intothedeep');
            }
            else {
                game.sounds.playSound('bang');
            }
        }
    }

    //  Find all of the front rank invaders.
    var frontRankInvaders = {};
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        //  If we have no invader for game file, or the invader
        //  for game file is futher behind, set the front
        //  rank invader to game one.
        if(!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
            frontRankInvaders[invader.file] = invader;
        }
    }

    //  Give each front rank invader a chance to drop a bomb.
    for(var i=0; i<this.config.invaderFiles; i++) {
        var invader = frontRankInvaders[i];
        if(!invader) continue;
        var chance = this.bombRate * dt;
        if(chance > Math.random()) {
            //  Fire!
            this.bombs.push(new Bomb(invader.x, invader.y + invader.height / 2, 
                this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity)));
        }
    }

    //  Check for bomb/ship collisions.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        if(bomb.x >= (this.ship.x - this.ship.width/2) && bomb.x <= (this.ship.x + this.ship.width/2) &&
                bomb.y >= (this.ship.y - this.ship.height/2) && bomb.y <= (this.ship.y + this.ship.height/2)) {
            this.bombs.splice(i--, 1);
            game.lives -= Math.floor(Math.random() * 20) + 1;
            if (game.lives < 0) {
                game.lives = 0;
            }
            game.sounds.playSound('explosion');
        }
                
    }

    //  Check for invader/ship collisions.
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        if((invader.x + invader.width/2) > (this.ship.x - this.ship.width/2) && 
            (invader.x - invader.width/2) < (this.ship.x + this.ship.width/2) &&
            (invader.y + invader.height/2) > (this.ship.y - this.ship.height/2) &&
            (invader.y - invader.height/2) < (this.ship.y + this.ship.height/2)) {
            //  Dead by collision!
            game.lives = 0;
            game.sounds.playSound('explosion');
        }
    }

    //  Check for failure
    if(game.lives <= 0) {
        game.moveToState(new GameOverState());
    }

    //  Check for victory
    if(this.invaders.length === 0) {
        //game.score += this.level * 50;
        game.level += 1;
        game.moveToState(new LevelIntroState(game.level));
    }
};

PlayState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
    
    //  Draw ship.
    ctx.fillStyle = '#999999';
    ctx.fillRect(this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2), this.ship.width, this.ship.height);

    //  Draw invaders.

    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        ctx.fillStyle = invader.color;

        ctx.fillRect(invader.x - invader.width/2, invader.y - invader.height/2, invader.width, invader.height);
    }

    //  Draw bombs.
    ctx.fillStyle = '#ffff00';
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        ctx.fillRect(bomb.x - 2, bomb.y - 2, 4, 4);
    }

    //  Draw rockets.
    ctx.fillStyle = '#ff0000';
    for(var i=0; i<this.rockets.length; i++) {
        var rocket = this.rockets[i];
        ctx.fillRect(rocket.x, rocket.y - 2, 1, 4);
    }

    //  Draw info.
    var textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14/2;
    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    var info = "Здоров'я: " + game.lives + "%";
    ctx.textAlign = "left";
    ctx.fillText(info, game.gameBounds.left, textYpos);
    info = "Знешкоджено депутатів: " + game.score + ", Читання: " + game.level;
    ctx.textAlign = "right";
    ctx.fillText(info, game.gameBounds.right, textYpos);

    //  If we're in debug mode, draw bounds.
    if(this.config.debugMode) {
        ctx.strokeStyle = '#ff0000';
        ctx.strokeRect(0,0,game.width, game.height);
        ctx.strokeRect(game.gameBounds.left, game.gameBounds.top,
            game.gameBounds.right - game.gameBounds.left,
            game.gameBounds.bottom - game.gameBounds.top);
    }

};

PlayState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == 32) {
        //  Fire!
        this.fireRocket();
    }
    if(keyCode == 80) {
        //  Push the pause state.
        game.pushState(new PauseState());
    }
};

PlayState.prototype.keyUp = function(game, keyCode) {

};

PlayState.prototype.fireRocket = function() {
    //  If we have no last rocket time, or the last rocket time 
    //  is older than the max rocket rate, we can fire.
    if(this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.config.rocketMaxFireRate))
    {   
        //  Add a rocket.
        this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
        this.lastRocketTime = (new Date()).valueOf();

        //  Play the 'shoot' sound.
        game.sounds.playSound('shoot');
    }
};

function PauseState() {

}

PauseState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == 80) {
        //  Pop the pause state.
        game.popState();
    }
};

PauseState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillText("Paused", game.width / 2, game.height/2);
    return;
};

/*  
    Level Intro State

    The Level Intro state shows a 'Level X' message and
    a countdown for the level.
*/
function LevelIntroState(level) {
    this.level = level;
    this.countdownMessage = "3";
}

LevelIntroState.prototype.update = function(game, dt) {

    //game.moveToState(new PlayState(game.config, this.level));

    //  Update the countdown.
    if(this.countdown === undefined) {
        this.countdown = 3; // countdown from 3 secs
        game.sounds.playSound('pikpikpik');
    }
    this.countdown -= dt;

    if(this.countdown < 2) { 
        this.countdownMessage = "2"; 
    }
    if(this.countdown < 1) { 
        this.countdownMessage = "1"; 
    } 
    if(this.countdown <= 0) {
        //  Move to the next level, popping this state.
        game.moveToState(new PlayState(game.config, this.level));
    }

};

LevelIntroState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="36px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle"; 
    ctx.textAlign="center";

    var level_text;

    switch(this.level) {
        case 1:
            level_text = "Перше читання";
            break;
        case 2:
            level_text = "Друге читання";
            break;
        case 3:
            level_text = "Третє читання";
            break;
        case 4:
            level_text = "Четверте читання";
            break;
        default:
            level_text = "Читання " + this.level;
    }

    ctx.fillText(level_text, game.width / 2, game.height/2);
    ctx.font="24px Arial";
    ctx.fillText("Починаємо за " + this.countdownMessage, game.width / 2, game.height/2 + 36);
    return;
};


/*
 
  Ship

  The ship has a position and that's about it.

*/
function Ship(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 16;
}

/*
    Rocket

    Fired by the ship, they've got a position, velocity and state.

    */
function Rocket(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}

/*
    Bomb

    Dropped by invaders, they've got position, velocity.

*/
function Bomb(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}
 
/*
    Invader 

    Invader's have position, type, rank/file and that's about it. 
*/

function Invader(x, y, rank, file, type, fraction_id) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 8;
    this.height = 8;
    this.fraction_id = fraction_id;

    // get fraction color
    switch(fraction_id) {
        case 1:
            this.color = '#d1193b';
            break;
        case 2:
            this.color = '#f97200';
            break;
        case 3:
            this.color = '#878787';
            break;
        case 4:
            this.color = '#0000ff';
            break;
        case 5:
            this.color = '#19950b';
            break;
        case 6:
            this.color = '#1a9daa';
            break;
        case 7:
            this.color = '#e3de22';
            break;
        case 8:
            this.color = '#a1a724';
            break;
        case 9:
            this.color = '#960178';
            break;
        default:
            this.color = '#006600';
    }

}

/*
    Game State

    A Game State is simply an update and draw proc.
    When a game is in the state, the update and draw procs are
    called, with a dt value (dt is delta time, i.e. the number)
    of seconds to update or draw).

*/
function GameState(updateProc, drawProc, keyDown, keyUp, enter, leave) {
    this.updateProc = updateProc;
    this.drawProc = drawProc;
    this.keyDown = keyDown;
    this.keyUp = keyUp;
    this.enter = enter;
    this.leave = leave;
}

/*

    Sounds

    The sounds class is used to asynchronously load sounds and allow
    them to be played.

*/
function Sounds() {

    //  The audio context.
    this.audioContext = null;

    //  The actual set of loaded sounds.
    this.sounds = {};
}

Sounds.prototype.init = function() {

    //  Create the audio context, paying attention to webkit browsers.
    context = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new context();
    this.mute = false;
};

Sounds.prototype.loadSound = function(name, url, onload) {

    //  Reference to ourselves for closures.
    var self = this;

    //  Create an entry in the sounds object.
    this.sounds[name] = null;

    //  Create an asynchronous request for the sound.
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
        self.audioContext.decodeAudioData(req.response, function(buffer) {
            self.sounds[name] = {buffer: buffer};

            if (typeof onload === 'function') {
                onload(name);
            }
        });
    };
    try {
      req.send();
    } catch(e) {
      console.log("An exception occured getting sound the sound " + name + " this might be " +
         "because the page is running from the file system, not a webserver.");
      console.log(e);
    }
};

Sounds.prototype.playSound = function(name) {

    //  If we've not got the sound, don't bother playing it.
    if(this.sounds[name] === undefined || this.sounds[name] === null || this.mute === true) {
        return;
    }

    //  Create a sound source, set the buffer, connect to the speakers and
    //  play the sound.
    var source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name].buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
};

/*

 Deputates

 This class is here to preload images and sounds of deputates
 and define on load event

 */

function Deputates(sounds) {

    //  The actual set of loaded deputates
    this.collection = {};

    // Save sounds
    this.sounds = sounds;

}

Deputates.prototype.loadDeputat = function(name, onshow) {

    // load image
    var image = $('<img src="img/' + name + '.png" alt="">');
    $('body').append(image);
    image.hide();

    // load sound
    this.sounds.loadSound(name, 'sounds/' + name + '.wav');

    //  Create an entry in the deputates object.
    this.collection[name] = {
        image: image,
        onshow: onshow
    };

};

Deputates.prototype.showDeputat = function(name) {

    //  If we've not got the deputat, don't bother showing it.
    if(this.collection[name] === undefined || this.collection[name] === null) {
        return;
    }

    // add pobability
    if (Math.random() < 0.5) {
        return;
    }

    var params = this.collection[name];

    // show imagem, call on show event, play sound
    params.image.show();
    params.onshow(params.image);
    this.sounds.playSound(name);

};
