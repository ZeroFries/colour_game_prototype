paper.install(window);

window.onload = function() {
    view.onFrame = function(event) {
        if (window.game.started) {
            window.game.updateGame();
            window.game.render();
        }
    }
}