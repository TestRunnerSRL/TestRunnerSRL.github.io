var activeRow = '';

function SetHover(i) {
  hex = document.getElementById("hex" + i);
  hex.childNodes[0].style.backgroundColor = "rgba(255,255,255,0.3)";

  if (activeRow) {
    return;
  }

  var lightlist = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for (var key in rowList) {
    if (rowList.hasOwnProperty(key)) {
      for (r = 0; r < rowList[key].length; r++) {
        if (rowList[key][r] == i) {
          for (j = 0; j < rowList[key].length; j++) {
            lightlist[rowList[key][j]] = 1;
          }
        }
      }
    }
  }
    
  for (i = 1; i <= 19; i++) {
    if (lightlist[i] == 0) {
      hex = document.getElementById("hex" + i);
      hex.childNodes[0].style.backgroundColor = "rgba(0,0,0,.5)";
    }
  }
}

function RowHover(row, override) {
  if (activeRow && !override) {
    return;
  }

  if (activeRow != row) {
    document.getElementById("hexheader" + row).style.backgroundColor = 'blue';    
  }

  var lightlist = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for (r = 0; r < rowList[row].length; r++) {
    lightlist[rowList[row][r]] = 1;
  }
  
  for (i = 1; i <= 19; i++) {
    if (lightlist[i] == 0) {
      hex = document.getElementById("hex" + i);
      hex.childNodes[0].style.backgroundColor = "rgba(0,0,0,.5)";
    }
  }
}

function ClearHover() {
  for (var key in rowList) {
    if (rowList.hasOwnProperty(key)) {
      if (key != activeRow) {
        document.getElementById("hexheader" + key).style.backgroundColor = '';    
      }
    }
  }
  CheckBadRow();

  for (i = 1; i <= 19; i++) {
    hex = document.getElementById("hex" + i);
    hex.childNodes[0].style.backgroundColor = "";
  }
  if (activeRow) {
    RowHover(activeRow, true);
  }

}

function RowClick(row) {
  if (row == activeRow) {
    document.getElementById("hexheader" + row).style.backgroundColor = '';
    activeRow = '';
    ClearHover();
    return;
  }

  if (activeRow) {
    document.getElementById("hexheader" + activeRow).style.backgroundColor = '';    
  }

  activeRow = row;
  document.getElementById("hexheader" + row).style.backgroundColor = 'green';
  ClearHover();
}

function hexLClick(hex) {
  if (hex.style.backgroundColor != 'darkgreen') {
    hex.style.backgroundColor = 'darkgreen';
  } else {
    hex.style.backgroundColor = '';
  }
  CheckBadRow();
}
function hexRClick(hex) {
  if (hex.style.backgroundColor != 'darkred') {
    hex.style.backgroundColor = 'darkred';
  } else {
    hex.style.backgroundColor = '';
  }
  CheckBadRow();
  return false;
}

function CheckBadRow() { 
  for (var key in rowList) {
    if (rowList.hasOwnProperty(key)) {
      var rowheader = document.getElementById("hexheader" + key);
      if (rowheader.style.backgroundColor == 'darkred' || rowheader.style.backgroundColor == '') {
        rowheader.style.backgroundColor = '';
        var done = true;
        for (r = 0; r < rowList[key].length; r++) {
          hex = document.getElementById("hex" + rowList[key][r])
          if (hex.style.backgroundColor != 'darkgreen') {
            done = false;
          }
          if (hex.style.backgroundColor == 'darkred') {
            rowheader.style.backgroundColor = 'darkred';
            break;
          }
        }
        if (done) {
            rowheader.style.backgroundColor = 'gold';          
        }
      }
    }
  }
}

magicHex = 
  [3, 17, 18, 
   19, 7, 1, 11, 
  16, 2, 5, 6, 9, 
   12, 4, 8, 14, 
    10, 13, 15];

rotateHex = 
  [8, 4, 1,
   13, 9, 5, 2,
 17, 14, 10, 6, 3,
  18, 15, 11, 7,
    19,16, 12];

flipHex = 
  [3, 2, 1,
   7, 6, 5, 4,
 12, 11, 10, 9, 8,
  16, 15, 14, 13,
    19, 18, 17];


function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function LoadPage() {
  var parts = window.location.search.substr(1).split("&");
  var $_GET = {};
  for (var i = 0; i < parts.length; i++) {
      var temp = parts[i].split("=");
      $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
  }

  var seed = $_GET.seed;
  if (seed == undefined) {
    seed = '';
  }
  document.getElementById("rngseed").value = seed;

  var game = $_GET.game;
  if (game == undefined || game == "") {
    game = 'oot';
  }
  game += '.js';
  document.getElementById("bingogame").value = game;
  LoadGoalListJS(game, GenerateBoard);
}

function LoadGoalListJS(file, callback) {
  var options = document.getElementById("bingogame");
  var file = options.value;
  if (file == 'URL') {
    file = prompt("Enter URL to bingo goal list JavaScript file");
    var x = document.getElementById("bingogame");
    var option = document.createElement("option");
    option.text = file;
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    options.add(option);
    options.selected = option;
  } else if (file == 'JSON') {
    bingoList = JSON.parse(prompt("Paste JSON object of the bingo goal list"));
    return;
  } else {
    file = "goallist/" + file;
  }

  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = file; 

  if (callback) {
    script.onload = callback;
  }

  document.getElementsByTagName("head")[0].appendChild(script);
}

var bingoBoard = []; //the board itself stored as an array first
function GenerateBoard() {
  if (bingoList['normal']) {
    bingoList = bingoList['normal'];
  }

  for (i = 1; i <= 19; i++) {
    hex = document.getElementById("hex" + i);
    hex.style.backgroundColor = '';
  }
  for (var key in rowList) {
    if (rowList.hasOwnProperty(key)) {
      if (key != activeRow) {
        document.getElementById("hexheader" + key).style.backgroundColor = '';    
      }
    }
  }

  
  txtRNG = document.getElementById("rngseed");
  rngseed = txtRNG.value
  if (rngseed == undefined) {
    rngseed = '';//Math.floor(Math.random() * 1000000);
  }
  txtRNG.value = rngseed;


  window.history.replaceState(null, null,  
    "?seed=" + rngseed + 
    "&game=" + document.getElementById("bingogame").value.split('.')[0]);


  Math.seedrandom(rngseed);
  
  newhex = JSON.parse(JSON.stringify(magicHex));

  rotate = Math.floor(Math.random() * 6);
    for (; rotate > 0; rotate--) {
      copyhex = JSON.parse(JSON.stringify(newhex));
        flip = Math.floor(Math.random() * 2);
      for (i = 0; i < 19; i++) {
          if (flip) {
            newhex[i] = copyhex[rotateHex[flipHex[i] - 1] - 1];
            } else {            
            newhex[i] = copyhex[rotateHex[i] - 1];
            }
        }
    }

  var maxdiff = 0;
  var diffmap = [];
  for (i = 1; i <= 19; i++) {
      do {
      newdiff = clamp(Math.floor((i - 1) * 25.1 / 19) +
          (Math.floor(Math.random() * 3) - 1),
            1, 25);
        } while (newdiff <= maxdiff);
        diffmap[i] = newdiff;
        maxdiff = newdiff;
    }
    
  for (i = 0; i < 19; i++) {
        newhex[i] = diffmap[newhex[i]];
  }
  
  for (var i=1;i<=19;i++) {
    bingoBoard[i] = {difficulty: newhex[i - 1]};
  }
  
  //populate the bingo board in the array
  for (var i=1; i<=19; i++) {
    var getDifficulty = bingoBoard[i].difficulty; // difficulty of current square
        
    var RNG = Math.floor(bingoList[getDifficulty].length * Math.random());
    if (RNG == bingoList[getDifficulty].length) { RNG--; }; //fix a miracle
    var j = 0, synergy = 0, currentObj = null, minSynObj = null;
    
    do {
      currentObj = bingoList[getDifficulty][(j+RNG)%bingoList[getDifficulty].length];
      synergy = checkLine(i, currentObj.types);
      if (minSynObj == null || synergy < minSynObj.synergy) {
        minSynObj = { synergy: synergy, value: currentObj };
      }
      j++;
    } while ((synergy != 0) && (j<bingoList[getDifficulty].length));
    
    bingoBoard[i].types = minSynObj.value.types;
    bingoBoard[i].name = minSynObj.value.name;
    bingoBoard[i].synergy = minSynObj.synergy;
  }

  for (i = 1; i <= 19; i++) {
       document.getElementById("hex" + i).childNodes[1].innerText = 
        bingoBoard[i].name;
    }
}


window.onload = LoadPage;

function checkLine (i, typesA) {
  var synergy = 0;  
  for (var key in rowList) {
    if (rowList.hasOwnProperty(key)) {
      for (r = 0; r < rowList[key].length; r++) {
        if (rowList[key][r] == i) {
      for (j = 0; j < rowList[key].length; j++) {
            if (i != j) {
              var typesB = bingoBoard[rowList[key][j]].types;
              if (typeof typesB != 'undefined') {
                for (var k=0; k < typesA.length; k++) {
                  for (var l=0; l < typesB.length; l++) {
                    if (typesA[k] == typesB[l]) {
                      synergy++; // if match increase
                      if (k==0) { synergy++ }; // if main type increase
                      if (l==0) { synergy++ }; // if main type increase
                    }
                  }
                }
              }
            }
          }
          continue;
        }
      }
    }
  }
    
  return synergy;
}
  
/*
     1  2 3
   4  5  6  7
 8  9  10 11 12
  13 14 15 16
    17 18 19
  */
  
    rowList = [];
    rowList['RO'] = [1, 2, 3];
    rowList['RY'] = [2, 6, 11, 16];
    rowList['RG'] = [1, 5, 10, 15, 19];
    rowList['RB'] = [2, 5, 9, 13];
    rowList['RP'] = [1, 4, 8];
    rowList['OY'] = [3, 7, 12];
    rowList['OG'] = [7, 11, 15, 18];
    rowList['OB'] = [3, 6, 10, 14, 17];
    rowList['OP'] = [4, 5, 6, 7];
    rowList['YG'] = [12, 16, 19];
    rowList['YB'] = [13, 14, 15, 16];
    rowList['YP'] = [8, 9, 10, 11, 12];
    rowList['GB'] = [17, 18, 19];
    rowList['GP'] = [4, 9, 14, 18];
    rowList['BP'] = [8, 13, 17];
