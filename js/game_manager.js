function GameManager(size, scene) {
  this.size         = size; // Size of the grid
  this.scene        = scene; //THREE.scene
    
  
  this.zLayerShow = [true,true,true,true]; //used to hide certain layers
  
  this.grid = null;        
  
  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  //this.actuator.continue();
  for (var x = 0; x < this.size; x++) {   
    for (var y = 0; y < this.size; y++) {    
      for (var z = 0; z < this.size; z++){
        tile = this.grid.cells[x][y][z];
        if(tile){
          this.scene.remove(tile.renderCube);
          this.scene.remove(tile.renderText);
          this.scene.remove(tile.renderTile);
        }
      }
    }
  }
  this.setup();
};

// Keep playing after winning
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  //this.actuator.continue();
};

GameManager.prototype.isGameTerminated = function () {
  /*if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  } */
  return false;
};

// Set up the game
GameManager.prototype.setup = function () {
  
  
  this.zLayerShow = [true,true,true,true];
  this.grid = new Grid(this.size, this.scene, this.zLayerShow);
  this.score       = 0;
  this.over        = false;
  this.won         = false;
  this.keepPlaying = false;

  // Add the initial tiles
  this.addStartTiles();
  

  // Update the actuator
  this.actuate();
  
};

GameManager.prototype.updateGameVisibility = function(){
  
  this.grid.updateVisibility(this.zLayerShow);
  
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      for (var z = 0; z < this.size; z++){ 
        var tile = this.grid.cells[x][y][z];
        if(tile){
          tile.renderCube.material.opacity = (this.zLayerShow[z]) ? 1.0 : Constant.hiddenOpacity;
          tile.renderText.material.opacity = (this.zLayerShow[z]) ? 1.0 : Constant.hiddenOpacity;
          tile.renderTile.material.opacity = (this.zLayerShow[z]) ? 1.0 : Constant.hiddenOpacity;
        }
      }
    }
  }
  
}

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < Constant.startTiles; i++) {
    console.log("added start tile");
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var decide = Math.random();
    var value = (decide < Constant.probOfLow) ? Constant.addThisTile[0] : Constant.addThisTile[1];
    value = (decide < Constant.probOfSuck) ? Constant.suck : value; //this sucks
    //console.log(value);
    var tile = new Tile(this.grid.randomAvailableCell(), value, true, this.grid);

    this.grid.insertTile(tile);
    tile.savePosition();
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {

  
  var material = new THREE.MeshBasicMaterial({visible:false});  
  var text = new THREE.MeshBasicMaterial({color:Constant.textColor, transparent:true, opacity:Constant.fullOpacity});  
  
 
  
  //console.log(this.grid.tilePointers.length);
  
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      for (var z = 0; z < this.size; z++){ 
        var tile = this.grid.cells[x][y][z];
        if(tile && (tile.renderCube || tile.mergedFrom)){
          

          if(tile.mergedFrom){   
            //console.log("if tile merged from")
            this.scene.remove(tile.mergedFrom[0].renderCube);
            this.scene.remove(tile.mergedFrom[0].renderTile);
            this.scene.remove(tile.mergedFrom[0].renderText);            
            this.scene.remove(tile.mergedFrom[1].renderCube);
            this.scene.remove(tile.mergedFrom[1].renderTile);
            this.scene.remove(tile.mergedFrom[1].renderText);
            tile.mergedFrom = null;
            
          }
          
          if(tile.renderCube){
            //console.log("if tile.rendercube in actuate");
           /*tile.renderCube.position = this.grid.gameToRenderCoordinates({x:tile.x,y:tile.y,z:tile.z});
           tile.renderText.position = this.grid.gameToRenderCoordinates({x:tile.x,y:tile.y,z:tile.z}); */
           tile.updateRenderPosition(this.grid.gameToRenderCoordinates({x:tile.x,y:tile.y,z:tile.z}));
           //tile.renderTile.position = this.grid.gameToRenderCoordinates({x:tile.x,y:tile.y,z:tile.z});
          }
            
        }                              
          
        }
      }
    }  
    
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      for (var z = 0; z < this.size; z++){ 
        var tile = this.grid.cells[x][y][z];
        if(tile && !tile.renderCube){//if new tile
          //console.log("if new tile");
          var value = tile.value;
          
          var len = this.grid.side-1;
          var newPieceGeo = new THREE.CubeGeometry(len,len,len);
          var newPiece = new THREE.Mesh(newPieceGeo, material);
          newPiece.position = this.grid.gameToRenderCoordinates({x:x, y:y, z:z});   
          
          this.scene.add(newPiece);
          
          tile.renderCube = newPiece;
          
          var newPieceBorder = new THREE.EdgesHelper(newPiece, Constant.tileColorMap[value < 4096 ? value : 'super']);          
          newPieceBorder.material.linewidth = Constant.tileLineWidth;
          newPieceBorder.material.transparent = true;
          newPieceBorder.material.opacity = this.zLayerShow[z] ? Constant.fullOpacity : Constant.hiddenOpacity;
          
          this.scene.add(newPieceBorder);          
          
          tile.renderTile = newPieceBorder;
          
          
          
          var str = value.toString();
          var numDigits = str.length;
          if(numDigits > Constant.highStringLength || numDigits <=0) numDigits = Constant.highStringLength;
            
          var newPieceValue = new THREE.MyText(value.toString(), 
                                               {font: Constant.renderFont,
                                               size:Constant.getTextSize[numDigits], height:Constant.fontHeight},
                                               new THREE.MeshBasicMaterial({color:Constant.textColorMap[value < 4096 ? value : 'super'], transparent:true, opacity:Constant.fullOpacity})); 
                                               //text.clone());          
          
          newPieceValue.color = Constant.tileColorMap[value < 4096 ? value : 'super'];
          
          var pos = this.grid.gameToRenderCoordinates({x:x, y:y, z:z});
          newPieceValue.position.set(pos.x, pos.y, pos.z);
          this.scene.add(newPieceValue); 
          
          tile.renderText = newPieceValue;                                     
          
          
        }else{
         //box.material.opacity = Constant.fullOpacity;
        }
        
      }
    }
  } 
  this.grid.updateTilePointers();
  this.updateGameVisibility();
  //console.log(this.grid.tilePointers);
};


// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, z, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  
  this.grid.cells[tile.x][tile.y][tile.z] = null;
  this.grid.cells[cell.x][cell.y][cell.z] = tile;
  tile.savePosition();///???
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left, 4: in, 5: out

  var self = this;

  if (this.isGameTerminated()){
    window.alert("Looks like you lost! :(\n Press enter or hit OK to restart!");
    this.restart();
   return; 
  }

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  //console.log(traversals);
  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      traversals.z.forEach(function (z) {
      cell = { x: x, y: y, z: z };
      tile = self.grid.cellContent(cell);

      if (tile) {  
        //console.log(tile);
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2, false, self.grid);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);
          
          //this.grid.updateTilePointers();

          // Converge the two tiles' positions
          tile.updatePosition(positions.next); //?????
          merged.renderPosition = self.grid.gameToRenderCoordinates(positions.next);//dont use the update method because animation

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === Constant.win) self.won = true;
                           
        } else {
          //console.log(positions.farthest);
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
      });
    });
  });

  this.grid.updateTilePointers();
  //console.log(this.grid.tilePointers.length);
  if (moved) {
    
    
    /*
     * TODO: uncomment this
     */    
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    
    //this.actuate(); //now the responsibility of the caller to actuate
  }
  
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  return Constant.vectorMap[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [], z:[] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
    traversals.z.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();
  if (vector.z === 1) traversals.z = traversals.z.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y, z: previous.z + vector.z };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      for (var z = 0; z < this.size; z++) {
        tile = this.grid.cellContent({ x: x, y: y, z: z });

        if (tile) {
          for (var direction = 0; direction < Constant.numDirections; direction++) {
            var vector = self.getVector(direction);
            var cell   = { x: x + vector.x, y: y + vector.y, z: z + vector.z };

            var other  = self.grid.cellContent(cell);

            if (other && other.value === tile.value) {
              return true; // These two tiles can be merged
            }
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y && first.z === second.z;
};
