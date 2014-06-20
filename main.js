window.gameConstants = {
    colourIncrement: 2,
    colourIncrementSpeed: 10 // in ms
};

function Block(size, velocity, position, fillColor) {
    this.velocity = velocity; // y increases downward
    this.path = new Path.Rectangle(position, size);
    this.path.fillColor = fillColor;
}

Block.prototype.move = function() {
    this.path.position.x += this.velocity.x;
    this.path.position.y += this.velocity.y;
}

// To be replaced with factory
Block.generateBlock = function() {
    var new_block = new Block(new Size(500, 20), new Point(0, 1), new Point(0, 0), null);
    new_block.color_left = new Color(1, 0, 0);
    new_block.color_right = new Color(0, 0, 1);
    new_block.path.fillColor = {
        gradient: {
            stops: [new_block.color_left, new_block.color_right]
        },
        origin: [0, 0],
        destination: [500, 0]
    }

    return new_block;
}

function Game() {
    this.blocks = [];
    this.mainColour = [128, 128, 128];
    this.started = false;
    this.background = null;
    this.playerBlock = null;
}

Game.prototype.initializeBackground = function() {
    this.background = new Path.Rectangle([0, 0], [500, 500]);
    this.background.fillColor = new Color(0.9, 0.9, 0.9);
}

Game.prototype.initializeBlocks = function() {
    this.blocks.push(Block.generateBlock());
}

Game.prototype.initializePlayer = function() {
    this.playerBlock = new Block(new Size(20, 20), new Point(0, 0), new Point(240, 480), 'green');
    this.bindColorControlEvents();
}

Game.prototype.startGame = function() {
    window.paper.setup('gameCanvas');

    this.initializeBackground();
    this.initializeBlocks();
    this.initializePlayer();

    this.started = true;
};

Game.prototype.updateBlocks = function() {
    _.each(this.blocks, function(block) {
        block.move();

        if (block.path.position.y > 510) {
            block.path.position.y = 0;
        }
    });
}

Game.prototype.updatePlayerBlock = function() {
    if (this.playerBlock) {
        this.playerBlock.path.fillColor = new Color(this.mainColour[0] / 255, this.mainColour[1] / 255, this.mainColour[2] / 255);
    }
}

Game.prototype.updateGame = function() {
    this.updateBlocks();
    this.updatePlayerBlock();
}

Game.prototype.render = function() {
    // Placeholder for rendering calls made after Game objects are updated (effects?)
}

Game.prototype.bindColorControlEvents = function() {
    var controlColourPosition = {
        "red-control": 0,
        "green-control": 1,
        "blue-control": 2
    };
    var incrementMainColour;
    var game = this;
    var $colourControls = $('#red-control').add('#green-control').add('#blue-control');

    $colourControls.on("mousedown", function(e) {
        var $colourControl = $(this);
        e.preventDefault();
        clearInterval(incrementMainColour);

        var colourPosition = controlColourPosition[$(this).attr('id')];
        incrementMainColour = setInterval(function() {
            if (e.which == 1 && game.mainColour[colourPosition] < 256) {
                game.mainColour[colourPosition] += gameConstants.colourIncrement;
                // console.log(game.mainColour);
                $colourControl.css('background-color', colourControlRGB(colourPosition, game.mainColour));
            } else if (e.which == 3 && game.mainColour[colourPosition] > 0) {
                game.mainColour[colourPosition] -= gameConstants.colourIncrement;
                // console.log(game.mainColour);
                $colourControl.css('background-color', colourControlRGB(colourPosition, game.mainColour));
            }
        }, gameConstants.colourIncrementSpeed);
    });

    $colourControls.on("mouseup", function(e) {
        clearInterval(incrementMainColour);
    });
}

function colourControlRGB(colourPosition, colourArray) {
    var rgb = [0, 0, 0]
    rgb[colourPosition] = colourArray[colourPosition];
    return "rgb(" + rgb.join() + ")";
};

$(function() {
    window.game = new Game();
    window.game.startGame();

    $('.circle').bind('contextmenu', function(evt) {
        evt.preventDefault();
    }, false);
});