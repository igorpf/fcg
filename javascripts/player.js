//Directions enum
var Directions = {
    UP: 1,
    LEFT: 2,
    DOWN: 3,
    RIGHT: 4
};

function Player(x,y){
    this.x=x;
    this.y=y;
    this.direction = Directions.UP;
};

Player.prototype.move = function(direction){
    switch(direction){
        case Directions.DOWN:
            this.y--;
            break;
        case Directions.UP:
            this.y++;
            break;
        case Directions.LEFT:
            this.x--;
            break;
        case Directions.RIGHT:
            this.x++;
            break;
    }
};


