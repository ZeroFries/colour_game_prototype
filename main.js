window.gameConstants = {
    colourIncrement: 2,
    colourIncrementSpeed: 10 // in ms
};

function Block() {
    this.color_left = 'red';
    this.color_right = 'blue';
    this.size = new Size(500, 20);
    this.velocity = new Point(0, 1); // y increases downward

    // Paperjs Path
    this.path = new Path.Rectangle(new Point(0, 0), this.size);
    this.path.fillColor = {
        gradient: {
            stops: [this.color_left, this.color_right]
        },
        origin: [0, 0],
        destination: [500, 0]
    }
}

Block.prototype.move = function() {
    this.path.position.x += this.velocity.x;
    this.path.position.y += this.velocity.y;
}

function Game() {
    this.blocks = [];
    this.mainColour = [128, 128, 128];
    this.started = false;
    this.background = null;
}

Game.prototype.startGame = function() {
    window.paper.setup('gameCanvas');

    this.background = new Path.Rectangle([0, 0], [500, 500]);
    this.background.fillColor = 'lightgrey';
    this.blocks.push(new Block());

    this.bindColorControlEvents();
    this.started = true;
};

Game.prototype.drawFrame = function() {
    _.each(this.blocks, function(block) {
        block.move();

        if (block.path.position.y > 510) {
            block.path.position.y = 0;
        }
    });

    this.background.fillColor = new Color(this.mainColour[0] / 255, this.mainColour[1] / 255, this.mainColour[2] / 255);
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
    game.startGame();

    $('.circle').bind('contextmenu', function(evt) {
        evt.preventDefault();
    }, false);
});