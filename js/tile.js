function Tile(position, value, hidden_value, parent) {
  this.x                = position.x; //game coordinates
  this.y                = position.y;
  this.z                = position.z;
  this.value            = value;// || Constant.addThisTile[0];
  this.hidden           = false;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
  
  this.renderCube = null;//THREE.Mesh elements
  this.renderTile = null;
  this.renderText = null;
  
  this.renderPosition = null;
  this.previousRenderPosition = null;
  
  this.parent = parent;
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y, z: this.z };
  this.previousRenderPosition = this.parent.gameToRenderCoordinates(this.previousPosition);
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
  this.z = position.z;
  this.hidden = false;
  this.updateRenderPosition(this.parent.gameToRenderCoordinates(position));
};

Tile.prototype.updateRenderPosition = function(rPosition){
 this.renderPosition = rPosition;
 this.renderCube.position = rPosition;
 this.renderText.position = rPosition;
}


