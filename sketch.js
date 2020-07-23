var database;

var drawing = [];
var currentPath = [];
var isDrawing = false;

var bgColor = 0;

function setup() {
  canvas = createCanvas(displayWidth-200,displayHeight-225);

  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);

  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);

  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);

  var yellowButton = select('#yellowButton');
  yellowButton.position(displayWidth-150,500);
  yellowButton.mousePressed(yellowColor);

  var redButton = select('#redButton');
  redButton.position(displayWidth-150,525);
  redButton.mousePressed(redColor);

  var greenButton = select('#greenButton');
  greenButton.position(displayWidth-150,550);
  greenButton.mousePressed(greenColor);

  var blueButton = select('#blueButton');
  blueButton.position(displayWidth-150,575);
  greenButton.mousePressed(blueColor);
 
  var purpleButton = select('#purpleButton');
  purpleButton.position(displayWidth-150,600);
  purpleButton.mousePressed(purpleColor);

  var violetButton = select('#violetButton');
  violetButton.position(displayWidth-150,625);
  violetButton.mousePressed(violetColor);


  //set canvas color
  var canvasWhiteButton = select('#canvasWhiteButton');
  canvasWhiteButton.position(displayWidth-150,400);
  canvasWhiteButton.mousePressed(whiteButton);

  var canvasBlackButton = select('#canvasBlackButton');
  canvasBlackButton.position(displayWidth-150,450);
  canvasBlackButton.mousePressed(blackButton);

  database = firebase.database();


  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
  background(bgColor);

  if (isDrawing) {
    var point = {
      x: mouseX,
      y: mouseY
    };
    currentPath.push(point);
  }

  //stroke(255);
  strokeWeight(4);
  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
}

function saveDrawing() {
  var ref = database.ref('drawings');
  var data = {
    drawing: drawing
  };
  var result = ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status) {
    console.log(status);
  }
}

function yellowColor() {
  stroke("yellow");  
}

function redColor() {
  stroke("red");
}

function greenColor() {
  stroke("green");
}

function blueColor() {
  stroke("blue");
}

function purpleColor() {
  stroke("purple");
}

function violetColor() {
  stroke("violet");
}

function whiteButton() {
  bgColor =  255;
}

function blackButton() {
  bgColor = 0;
}

function gotData(data) {
  // clear the listing
  var elts = selectAll('.listing');
  for (var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    //console.log(key);
    var li = createElement('li', '');
    li.class('listing');
    var ahref = createA('#', key);
    ahref.mousePressed(showDrawing);
    ahref.parent(li);



    li.parent('drawinglist');
  }
}

function errData(err) {
  console.log(err);
}

function showDrawing(key) {

    key = this.html();

  var ref = database.ref('drawings/' + key);
  ref.once('value', oneDrawing, errData);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
    //console.log(drawing);
  }
}

function clearDrawing() {
  drawing = [];
}
