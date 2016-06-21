var Color = function(r,g,b){
    this.r=r;
    this.g=g;
    this.b=b;
    this.colors = function(){
        return {
            empty: new Color(0, 255, 255), //verde
            block: new Color(38,255,81), //ciano (azul fraco)
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

