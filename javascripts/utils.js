/* global mapScale */

var Color = function(r,g,b){
    this.r=r;
    this.g=g;
    this.b=b;
    this.colors = function(){
        return {
            empty: new Color(0, 255, 255), //ciano (azul fraco)
            block: new Color(38,255,81), //verde
            crack: new Color(187, 128, 0), //marrom fraco
            hole: new Color(107, 73, 0), //marrom forte
            enemy: new Color(255, 0, 0), //vermelho
            player: new Color(0,0,255) // azul 
        };
    };
    this.equals = function(color){
        return (this.r===color.r && 
                this.g===color.g &&
                this.b===color.b);
    };
};

function renderMap(map){
    for(var i=0;i<map.length;++i)
        for(var j=0;j<map.length;++j)
            renderElement(map[i][j]);
}
function renderElement(e){
    switch(e){
        case 'empty':
            break;
        case 'block':
            break;
        case 'crack':
            break;
        case 'hole':
            break;
        case 'enemy':
            break;
        case 'player':
            break;
        default:
            throw new Exception("Element not existent");
            break;
    }
}
/** Returns a int 2D point indicating in which part of the map the object is present, 
 *  according to the map scale.
 *  Eg.: Given map scale = 10 and a point (10.5, 5), this should return (1,0)
 * @param {float 3D point} position position 
 * @returns map 
 */
function worldToMapCoordinates(position){
    var point = {};
    point.x = Math.floor(position.x/mapScale);
    point.z = Math.floor(position.z/mapScale);
    return point;
}
function floodFill(x, y){
	if(alreadyFilled(x, y)) return;
	fill(x, y);

	floodFill(x,   y-1);
	floodFill(x+1, y  );
	floodFill(x,   y+1);
	floodFill(x-1, y  );
}
//TODO: implement funcions
function fill(x, y){
	// this function will actually change the color of our box
}

function alreadyFilled(x, y){
	// this functions checks to see if our square has been filled already
}
