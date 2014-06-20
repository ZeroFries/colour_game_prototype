function Block() {
    this.color_left = 'red';
    this.color_right = 'blue';
    this.size = new Size(500, 10);
    this.velocity = new Point(0, 0);

    // Paperjs Path
    this.path = new Path.Rectangle(new Point(0, 0), this.size);
    this.path.strokeColor = 'black';
    this.path.fillColor = {
        gradient: {
            stops: [this.color_left, this.color_right]
        },
        origin: [0, 0],
        destination: [500, 0]
    }
}

Block.prototype.move = function(moveVector) {
    this.path.position.x += moveVector.x;
    this.path.position.y += moveVector.y;
}

function Game() {
    this.blocks = [];
    this.started = false;
}

Game.prototype.startGame = function() {
    window.paper.setup('gameCanvas');

    var background = new Path.Rectangle([0, 0], [500, 500]);
    background.fillColor = 'lightgrey';

    this.blocks.push(new Block());
    this.started = true;
};

Game.prototype.drawFrame = function() {
    _.each(this.blocks, function(block) {
        block.move(new Point(0, 1));

        if (block.path.position.y > 510) {
            block.path.position.y = 0;
        }
    });
}

$(function() {
    window.game = new Game();
    game.startGame();
});