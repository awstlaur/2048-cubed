function Grid(size, scene, zLayerShow) {
  this.size = size;
  this.scene = scene;
  this.cells = [];
  
  this.side = Constant.cubeSize;
  this.geometry = new THREE.CubeGeometry(this.side,this.side,this.side);
  this.material = new THREE.MeshBasicMaterial({visible:false});
  this.initCube = new THREE.Mesh(this.geometry, this.material); //lower left corner cube
  this.cubes = [];
  this.boxes = [];
  this.cubePointers = [];
  this.boxPointers = [];
  
  this.tilePointers = [];
  
  this.build();
  
  
}


Grid.prototype.updateVisibility = function(zLayerShow){
  for (var x = 0; x < this.size; x++) {   
    for (var y = 0; y < this.size; y++) {    
      for (var z = 0; z < this.size; z++){
        this.cubePointers[x][y][z].material.opacity = zLayerShow[z] ? Constant.fullOpacity : Constant.hiddenOpacity;
        this.boxPointers[x][y][z].material.opacity = zLayerShow[z] ? Constant.fullOpacity : Constant.hiddenOpacity;
      }     
    }
  } 
}

Grid.prototype.updateTilePointers = function(){
 this.tilePointers.length = 0;
 for (var x = 0; x < this.size; x++) {   
    for (var y = 0; y < this.size; y++) {    
      for (var z = 0; z < this.size; z++){
        tile = this.cells[x][y][z];
        if(tile){
         this.tilePointers.push(tile); 
        }
      }
    }
 } 
}

// Build a grid of the specified size
Grid.prototype.build = function () {
  for (var x = 0; x < this.size; x++) {
    var row = this.cells[x] = [];    
    for (var y = 0; y < this.size; y++) {
      var col = this.cells[x][y] = [];     
      for (var z = 0; z < this.size; z++){
        col.push(null); 
      }     
    }
  }

        this.initCube.position.set(Constant.globalOrigin.x,Constant.globalOrigin.y,Constant.globalOrigin.z);
        var loc = this.initCube.position;
        for(var i=0; i<this.size; i++){
            var cubeRow = this.cubePointers[i] = [];
            var boxRow = this.boxPointers[i] = [];
            for(var j=0; j<this.size; j++){
                var cubeCol = this.cubePointers[i][j] =[];
                var boxCol = this.boxPointers[i][j] = [];
                for(var k=0; k<this.size; k++){
                    var newCube = this.initCube.clone();
                    newCube.position = this.gameToRenderCoordinates({x:i, y:j, z:k});
                    cubeCol.push(newCube);
                    this.cubes.push(newCube);
                    
                    var newBox = new THREE.EdgesHelper(newCube, Constant.gridColor);
                    newBox.material.transparent = true;
                    newBox.opacity = Constant.fullOpacity;
                    boxCol.push(newBox);
                    this.boxes.push(newBox);
                    
                    scene.add(newCube);
                    scene.add(newBox);
                }
            }
        }

};


Grid.prototype.gameToRenderCoordinates = function(position){
  var loc = this.initCube.position;
  return new THREE.Vector3(loc.x + this.side*position.x, loc.y + this.side*position.y, loc.z + this.side*position.z);
}

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, z, tile) {
    if (!tile) {
      cells.push({ x: x, y: y, z: z });
    }
  });

  return cells;
};

// Call callback for every cell
// basically just map
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      for (var z = 0; z < this.size; z++){        
        callback(x, y, z, this.cells[x][y][z]);
      }
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y][cell.z];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y][tile.z] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y][tile.z]= null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size &&
         position.z >= 0 && position.z < this.size;
};
