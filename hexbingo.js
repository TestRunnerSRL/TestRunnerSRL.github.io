/* HTML button interaction scripts */

var activeRow = [];

function SetHover(i) {
  hex = document.getElementById("hex" + i);
  hex.childNodes[0].style.backgroundColor = "rgba(255,255,255,0.3)";

  if (activeRow.length > 0) {
    return;
  }

  var lightlist = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for (var key in INDICES_PER_ROW) {
    if (INDICES_PER_ROW.hasOwnProperty(key)) {
      for (r = 0; r < INDICES_PER_ROW[key].length; r++) {
        if (INDICES_PER_ROW[key][r] == i) {
          for (j = 0; j < INDICES_PER_ROW[key].length; j++) {
            lightlist[INDICES_PER_ROW[key][j]] = 1;
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

function SetRowHover(i) {
  hex = document.getElementById("row" + i);
  hex.childNodes[0].style.backgroundColor = "rgba(255,255,255,0.3)";
}

function ClearRowHover() {
  for (i = 1; i <= 5; i++) {
    hex = document.getElementById("row" + i);
    hex.childNodes[0].style.backgroundColor = "";
  }
}

function RowHover(row) {
  var lightlist = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


  if (!row && activeRow.length == 0) {
    return;
  }

  if (row) {
    if (activeRow.indexOf(row) == -1) {
      document.getElementById("hexheader" + row).style.backgroundColor = 'blue';    
    }

    for (var r = 0; r < INDICES_PER_ROW[row].length; r++) {
      lightlist[INDICES_PER_ROW[row][r]] = 1;
    } 
  }

  for (var aRow = 0; aRow < activeRow.length; aRow++) {
    for (var r = 0; r < INDICES_PER_ROW[activeRow[aRow]].length; r++) {
      lightlist[INDICES_PER_ROW[activeRow[aRow]][r]] = 1;
    }    
  }

  for (i = 1; i <= 19; i++) {
      hex = document.getElementById("hex" + i);
    if (lightlist[i] == 0) {
      hex.childNodes[0].style.backgroundColor = "rgba(0,0,0,.5)";
    } else {
      hex.childNodes[0].style.backgroundColor = "";      
    }
  }
}

function ClearHover() {
  for (var key in INDICES_PER_ROW) {
    if (INDICES_PER_ROW.hasOwnProperty(key)) {
      if (activeRow.indexOf(key) == -1) {
        document.getElementById("hexheader" + key).style.backgroundColor = '';    
      }
    }
  }
  CheckBadRow();

  for (i = 1; i <= 19; i++) {
    hex = document.getElementById("hex" + i);
    hex.childNodes[0].style.backgroundColor = "";
  }

  RowHover();
}

function RowClick(row) {
  if (activeRow.indexOf(row) != -1) {
    document.getElementById("hexheader" + row).style.backgroundColor = '';
    activeRow.splice(activeRow.indexOf(row), 1);
    ClearHover();
    return;
  }

  activeRow.push(row);
  document.getElementById("hexheader" + row).style.backgroundColor = 'green';
  ClearHover();
}

function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

function hexLClick(hex, next) {
  if (!hasClass(hex, 'SelectedGreenHex')) {
    addClass(hex, 'SelectedGreenHex');

    if (next) {
      $("#row" + next).show();   
      fitToParent(".rowspan")
    }
  } else {
    removeClass(hex, 'SelectedGreenHex');
  }
  removeClass(hex, 'SelectedRedHex');
  CheckBadRow();
}
function hexRClick(hex) {
  if (!hasClass(hex, 'SelectedRedHex')) {
    addClass(hex, 'SelectedRedHex');
  } else {
    removeClass(hex, 'SelectedRedHex');
  }
  removeClass(hex, 'SelectedGreenHex');
  CheckBadRow();
  return false;
}

function CheckBadRow() { 
  for (var key in INDICES_PER_ROW) {
    if (INDICES_PER_ROW.hasOwnProperty(key)) {
      var rowheader = document.getElementById("hexheader" + key);
      if (rowheader.style.backgroundColor == 'darkred' || rowheader.style.backgroundColor == '') {
        rowheader.style.backgroundColor = '';
        var done = true;
        for (r = 0; r < INDICES_PER_ROW[key].length; r++) {
          hex = document.getElementById("hex" + INDICES_PER_ROW[key][r])
          if (!hasClass(hex, 'SelectedGreenHex')) {
            done = false;
          }
          if (hasClass(hex, 'SelectedRedHex')) {
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

  
/* Bingo gneration scripts */

/*
     1  2 3
   4  5  6  7
 8  9  10 11 12
  13 14 15 16
    17 18 19
  */
  
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

// This function checks if the specified event is supported by the browser.
// Source: http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
function isEventSupported(eventName) {
  var el = document.createElement('div');
  eventName = 'on' + eventName;
  var isSupported = (eventName in el);
  if (!isSupported) {
    el.setAttribute(eventName, 'return;');
    isSupported = typeof el[eventName] == 'function';
  }
  el = null;
  return isSupported;
}

function isFraction(num) {
  if (!isNaN(num)) {
    return true;
  }

  var part = num.split("/");
  return ((part.length == 2) && (!isNaN(part[0])) && (!isNaN(part[1])));
}

function incFraction(num) {
  if (!isNaN(num)) {
    return "1/" + num;
  }

  var part = num.split("/");
  if (part.length != 2) {
    return "NaF";
  }

  if (part[0] - part[1] < 0) {
    part[0]++;
  }

  return part.join("/");
}

function decFraction(num) {
  if (!isNaN(num)) {
    return num;
  }

  var part = num.split("/");
  if (part.length != 2) {
    return "NaF";
  }

  if (part[0] > 1) {
    part[0]--;
    return part.join("/");
  }
  else {
    return part[1];
  }
}

function isWhole(num) {
  if (!isNaN(num)) {
    return false;
  }

  var part = num.split("/");
  if (part.length != 2) {
    return false;
  }

  return part[0] == part[1];
}

window.onload = LoadPage;
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

  var type = $_GET.type;
  if (type == undefined || type == "") {
    type = 'hex';
  }
  document.getElementById("bingotype").value = type;

  LoadGoalListJS(game, GenerateBoard);

  $(".hexheaderIn").on( {
    'mouseleave':function() { ClearHover(); }
  });


  // Check which wheel event is supported. Don't use both as it would fire each event 
  // in browsers where both events are supported.
  var wheelEvent = isEventSupported('mousewheel') ? 'mousewheel' : 'wheel';

  // Now bind the event to the desired element
  $('.hexIn').on(wheelEvent, function(e) {
    var oEvent = e.originalEvent;
    var delta = -oEvent.deltaY || oEvent.wheelDelta;

    var goal = this.childNodes[1].innerText.split(' ');
    var counter = false;
    if (delta > 0) {
      // Scrolled up
      if (hasClass(this, 'SelectedRedHex')) {
        removeClass(this, 'SelectedRedHex');
        CheckBadRow();
        return;
      }

      for (var i = 0; i < goal.length; i++) {
        if (isFraction(goal[i])) {
          var num = incFraction(goal[i]);
          if (num != "NaF" && num != goal[i]) {
            goal[i] = num;
            counter = true;

            if (isWhole(num)) {
              addClass(this, 'SelectedGreenHex');
            } else {
              removeClass(this, 'SelectedGreenHex');
            }
            removeClass(this, 'SelectedRedHex');
            CheckBadRow();
          }
        }
      }
      if (!counter) {
        addClass(this, 'SelectedGreenHex');
        removeClass(this, 'SelectedRedHex');
        CheckBadRow();
      }
    } else {
      // Scrolled down
      for (var i = 0; i < goal.length; i++) {
        if (isNaN(goal[i]) && isFraction(goal[i])) {
          var num = decFraction(goal[i]);
          if (num != "NaF" && num != goal[i]) {
            goal[i] = num;
            counter = true;
            removeClass(this, 'SelectedGreenHex');
            removeClass(this, 'SelectedRedHex');
            CheckBadRow();
          }
        }
      }
      if (!counter) {
        if (hasClass(this, 'SelectedGreenHex')) {
          removeClass(this, 'SelectedGreenHex');
        } else {
          addClass(this, 'SelectedRedHex');
        }
        CheckBadRow();
      }
    }
    this.childNodes[1].innerText = goal.join(' ');  
  });
  // Now bind the event to the desired element
  $('.rowcell').on(wheelEvent, function(e) {
    var oEvent = e.originalEvent;
    var delta = -oEvent.deltaY || oEvent.wheelDelta;

    var goal = this.childNodes[0].innerText.split(' ');
    var counter = false;
    if (delta > 0) {
      // Scrolled up
      if (hasClass(this, 'SelectedRedHex')) {
        removeClass(this, 'SelectedRedHex');
        CheckBadRow();
        return;
      }

      for (var i = 0; i < goal.length; i++) {
        if (isFraction(goal[i])) {
          var num = incFraction(goal[i]);
          if (num != "NaF" && num != goal[i]) {
            goal[i] = num;
            counter = true;

            if (isWhole(num)) {
              $("#row" + (parseInt(this.id[3]) + 1)).show(); 
              fitToParent(".rowspan")
            } else {
              removeClass(this, 'SelectedGreenHex');
            }
            removeClass(this, 'SelectedRedHex');
            CheckBadRow();
          }
        }
      }
      if (!counter) {
        addClass(this, 'SelectedGreenHex');
        $("#row" + (parseInt(this.id[3]) + 1)).show(); 
        fitToParent(".rowspan")
        removeClass(this, 'SelectedRedHex');
        CheckBadRow();
      }
    } else {
      // Scrolled down
      for (var i = 0; i < goal.length; i++) {
        if (isNaN(goal[i]) && isFraction(goal[i])) {
          var num = decFraction(goal[i]);
          if (num != "NaF" && num != goal[i]) {
            goal[i] = num;
            counter = true;
            removeClass(this, 'SelectedGreenHex');
            removeClass(this, 'SelectedRedHex');
            CheckBadRow();
          }
        }
      }
      if (!counter) {
        if (hasClass(this, 'SelectedGreenHex')) {
          removeClass(this, 'SelectedGreenHex');
        } else {
          addClass(this, 'SelectedRedHex');
        }
        CheckBadRow();
      }
    }
    this.childNodes[0].innerText = goal.join(' ');  
  });
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


/**
 * Fit all elements matching a given CSS selector to their parent elements'
 * width and height, by adjusting the font-size attribute to be as large as
 * possible. Uses binary search.
 */
var fitToParent = function(selector) {
    var numIter = 5;  // Number of binary search iterations
    var regexp = /\d+(\.\d+)?/;
    var fontSize = function(elem) {
        var match = elem.css('font-size').match(regexp);
        var size = match == null ? 16 : parseFloat(match[0]);
        return isNaN(size) ? 16 : size;
    }

    var sizes = [];
    $(selector).each(function() {
        var elem = $(this);
        var parentWidth = elem.parent().outerWidth();
        var parentHeight = elem.parent().height();
        //if (elem.outerWidth() > parentWidth || elem.outerHeight() > parentHeight) {
            var maxSize = 50, minSize = 0.1;
            var currSize = (minSize + maxSize) / 2;
            elem.css('overflow-wrap', 'break-word');
            for (var i = 0; i < numIter; i++) {
                currSize = (minSize + maxSize) / 2;
                elem.css('font-size', currSize);
                if ((elem.outerHeight() > parentHeight)) {
                    maxSize = currSize;
                } else {
                    minSize = currSize;
                }
            }
            //minSize = .1;
            elem.css('right', 'auto');
            elem.css('overflow-wrap', 'normal');
            do {
                if (elem.outerWidth() > parentWidth) {
                  currSize--;
                  elem.css('font-size', currSize);
                  minSize = currSize;
                } else {
                  break;
                }
            } while (true);
            elem.css('right', '');
            elem.css('font-size', minSize);
        //}

        sizes.push(Number(elem.css('font-size').slice(0, -2)));
    });

    stats = CalculateStatistic(sizes);
    var maxSize = stats.mean - stats.std;

    $(selector).each(function(i, elem) {
      if (sizes[i] > maxSize) {
        $(this).css('font-size', maxSize);
      }
    });
};

function CalculateStatistic(arr) {
  if (!arr || !arr.length) {
    return false;
  }

  var min = Math.min.apply(Math, arr);
  var max = Math.max.apply(Math, arr);

  var sum = arr.reduce(function(a, b) { return a + b; });
  var mean = sum / arr.length;

  var squarediffs = arr.map(function(x) {
    return Math.pow(x - mean, 2);
  });
  var std = Math.sqrt(squarediffs.reduce(function(a, b) { return a + b; }) 
    / (squarediffs.length - 1));


  return {
    sum: sum,
    mean: mean,
    std: std,
    min: min,
    max: max
  };
}



var bingoBoard = []; //the board itself stored as an array first
function GenerateBoard() {
  for (i = 1; i <= 19; i++) {
    hex = document.getElementById("hex" + i);    
    removeClass(hex, 'SelectedGreenHex');
    removeClass(hex, 'SelectedRedHex');
  }
  for (i = 1; i <= 5; i++) {
    hex = document.getElementById("row" + i);    
    removeClass(hex, 'SelectedGreenHex');
    removeClass(hex, 'SelectedRedHex');
  }

  activeRow = [];
  ClearHover();

  if (bingoList['rules']) {
    $("#rulesbutton").show();
    var xmlString = bingoList['rules']
      , parser = new DOMParser()
      , doc = parser.parseFromString(xmlString, "text/html");
    document.getElementById("rules").replaceChild(doc.firstChild, document.getElementById("rules").childNodes[1]);
  } else {
    $("#rulesbutton").hide();
  }

  if (bingoList['tips']) {
    $("#tipsbutton").show(); 
    var xmlString = bingoList['tips']
      , parser = new DOMParser()
      , doc = parser.parseFromString(xmlString, "text/html");
    document.getElementById("tips").replaceChild(doc.firstChild, document.getElementById("tips").childNodes[1]);
  } else {
    $("#tipsbutton").hide();
  }

  txtRNG = document.getElementById("rngseed");
  rngseed = txtRNG.value
  if (rngseed == undefined || rngseed == '') {
    Math.seedrandom();
    rngseed = Math.floor(Math.random() * 1000000).toString();
  }
  txtRNG.value = '';
  document.getElementById("seeddisplay").innerText = rngseed;

  var bingotype = document.getElementById("bingotype").value;

  window.history.replaceState(null, null,  
    "?seed=" + rngseed + 
    "&game=" + document.getElementById("bingogame").value.split('.')[0] +
    "&type=" + bingotype);

  Math.seedrandom(rngseed);

  if (bingotype == "hex") {
    $("#rowContainer").hide();
    $("#hexContainer").show();
  }
  else if (bingotype == "mission") {
    $("#rowContainer").show();
    $("#hexContainer").hide();
  }

  var bingoGenerator = new BingoGenerator(bingoList, 
    {
      "mode": "normal",
      "seed": rngseed
    });

  var card = false;
  var iterations = 0;
  while (!card && iterations < 10) {
    if (bingotype == "hex"){
      card = bingoGenerator.makeCard();
    } 
    else if (bingotype == "mission") {
      card = bingoGenerator.makeMissions();
    }
    iterations++;
  }
  card["meta"] = {
    iterations: iterations
  };


  var populationOrder = [1, 5, 10, 15, 19]

  if (bingotype == "hex") {
    for (i = 1; i <= 19; i++) {
        document.getElementById("hex" + i).childNodes[1].innerText = 
          card[i].name;
    }
    fitToParent('.hexspan');
  }
  else if (bingotype == "mission") {
    var elem;
    document.getElementById("row1").childNodes[0].innerText = card[1].name;
    document.getElementById("row2").childNodes[0].innerText = card[5].name;
    document.getElementById("row3").childNodes[0].innerText = card[10].name;
    document.getElementById("row4").childNodes[0].innerText = card[15].name;
    document.getElementById("row5").childNodes[0].innerText = card[19].name;
    $("#row2").hide();
    $("#row3").hide();
    $("#row4").hide();
    $("#row5").hide();

    fitToParent('.rowspan');
  }
}



/* From SRL OoT Bingo Generator */
/* Modified for hexbingo and non-oot goal lists */

var TOO_MUCH_SYNERGY = 100;
var SQUARES_PER_ROW = 5;
var DEFAULT_PROFILE = {
  defaultMinimumSynergy: -3,
  defaultMaximumSynergy: 7,
  defaultMaximumIndividualSynergy: 4.5,
  defaultMaximumSpill: 2,
  defaultInitialOffset: 0.1,
  defaultMaximumOffset: 2,
  baselineTime: 28.25,
  timePerDifficulty: 0.75
};
var NORMAL_PROFILE = {
  defaultMinimumSynergy: DEFAULT_PROFILE.defaultMinimumSynergy,
  defaultMaximumSynergy: DEFAULT_PROFILE.defaultMaximumSynergy,
  defaultMaximumIndividualSynergy: DEFAULT_PROFILE.defaultMaximumIndividualSynergy,
  defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
  defaultInitialOffset: DEFAULT_PROFILE.defaultInitialOffset,
  defaultMaximumOffset: DEFAULT_PROFILE.defaultMaximumOffset,
  baselineTime: DEFAULT_PROFILE.baselineTime,
  timePerDifficulty: DEFAULT_PROFILE.timePerDifficulty
};
var SHORT_PROFILE = {
  defaultMinimumSynergy: DEFAULT_PROFILE.defaultMinimumSynergy,
  defaultMaximumSynergy: 3,
  defaultMaximumIndividualSynergy: DEFAULT_PROFILE.defaultMaximumIndividualSynergy,
  defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
  defaultInitialOffset: DEFAULT_PROFILE.defaultInitialOffset,
  defaultMaximumOffset: DEFAULT_PROFILE.defaultMaximumOffset,
  baselineTime: 12,
  timePerDifficulty: 0.5
};
var BLACKOUT_PROFILE = {
  defaultMinimumSynergy: -10,
  defaultMaximumSynergy: 10,
  defaultMaximumIndividualSynergy: DEFAULT_PROFILE.defaultMaximumIndividualSynergy,
  defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
  defaultInitialOffset: 2,
  defaultMaximumOffset: 6,
  baselineTime: DEFAULT_PROFILE.baselineTime,
  timePerDifficulty: DEFAULT_PROFILE.timePerDifficulty
};
var SHORTBLACKOUT_PROFILE = {
  defaultMinimumSynergy: -4,
  defaultMaximumSynergy: 4,
  defaultMaximumIndividualSynergy: DEFAULT_PROFILE.defaultMaximumIndividualSynergy,
  defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
  defaultInitialOffset: 2,
  defaultMaximumOffset: 6,
  baselineTime: 12,
  timePerDifficulty: 0.5
};

Array.prototype.sortNumerically = function() {
  return this.stableSort(function(a, b) {
    return a - b;
  });
};

Array.prototype.stableSort = function(compare) {
  if (this.length == 0) {
    return [];
  }

  if (!compare) {
    compare = function(a, b) {
      return a - b;
    }
  }
  var sorted = [this[0]];
  for (var i = 1; i < this.length; i++) {
    var x = this[i];
    var j = sorted.length - 1;
    while ((j >= 0) && (compare(sorted[j], x) > 0)) {
      sorted[j + 1] = sorted[j];
      j = j - 1;
    }
    sorted[j + 1] = x;
  }

  return sorted;
}

Array.prototype.shuffled = function() {
  var toShuffle = this.slice();
  for (var i = 0; i < toShuffle.length; i++) {
    var randElement = Math.floor(Math.random() * (i + 1));
    var temp = toShuffle[i];
    toShuffle[i] = toShuffle[randElement];
    toShuffle[randElement] = temp;
  }
  return toShuffle;
};

function hasDuplicateStrings(array) {
  var seen = {};
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (el in seen) {
      return true;
    }
    seen[el] = true;
  }
  return false;
};

var INDICES_PER_ROW = {
  'RO': [1, 2, 3],
  'RY': [2, 6, 11, 16],
  'RG': [1, 5, 10, 15, 19],
  'RB': [2, 5, 9, 13],
  'RP': [1, 4, 8],
  'OY': [3, 7, 12],
  'OG': [7, 11, 15, 18],
  'OB': [3, 6, 10, 14, 17],
  'OP': [4, 5, 6, 7],
  'YG': [12, 16, 19],
  'YB': [13, 14, 15, 16],
  'YP': [8, 9, 10, 11, 12],
  'GB': [17, 18, 19],
  'GP': [4, 9, 14, 18],
  'BP': [8, 13, 17]
};

function invertObject(obj) {
  var ret = {};
  Object.keys(obj).forEach(function(key) {
    obj[key].forEach(function(item) {
      if (!ret[item]) ret[item] = [];
      ret[item].push(key);
    });
  });
  return ret;
}

var ROWS_PER_INDEX = invertObject(INDICES_PER_ROW);
var BingoGenerator = function(bingoList, options) {
  if (!options) {
    options = {};
  }
  this.language = options.lang || 'name';
  this.mode = options.mode || 'normal';
  this.seed = options.seed || Math.ceil(999999 * Math.random()).toString();

  if (bingoList.info && bingoList.info.combined === 'true') {
    if (bingoList[this.mode]) {
      bingoList = bingoList[this.mode];
    }
    else if (bingoList["normal"]) {
      bingoList = bingoList["normal"];
    }
  }

  this.profile = NORMAL_PROFILE;
  if (this.mode === 'short') {
    this.profile = SHORT_PROFILE;
  }
  else if (this.mode === 'blackout') {
    this.profile = BLACKOUT_PROFILE;
  }

  this.baselineTime = options.baselineTime || this.profile.baselineTime;
  this.timePerDifficulty = options.timePerDifficulty || this.profile.timePerDifficulty;
  this.minimumSynergy = options.minimumSynergy || this.profile.defaultMinimumSynergy;
  this.maximumSynergy = options.maximumSynergy || this.profile.defaultMaximumSynergy;
  this.maximumIndividualSynergy = options.maximumIndividualSynergy || this.profile.defaultMaximumIndividualSynergy;
  this.maximumSpill = options.maximumSpill || this.profile.defaultMaximumSpill;
  this.initialOffset = options.initialOffset || this.profile.defaultInitialOffset;
  this.maximumOffset = options.maximumOffset || this.profile.defaultMaximumOffset;

  this.goalsByDifficulty = bingoList;
  this.rowtypeTimeSave = bingoList.rowtypes;
  this.synergyFilters = bingoList.synfilters || {};
  this.goalsList = [];

  for (var i = 1; i <= 25; i++) {
    for (var g in bingoList[i]) {
      var goal = bingoList[i][g];
      if (!goal.difficulty) {
        goal.difficulty = i;
      }

      if (!goal.time) {
        goal.time = goal.difficulty * this.timePerDifficulty;          
      }

      if (!goal.id) {
        goal.id = goal.name;
      }

      if (!goal.types) {
        goal.types = {};
      } else if (Array.isArray(goal.types)) {
        var objTypes = {};
        for (var t = 0; t < goal.types.length; t++) {
          objTypes[goal.types[t]] = 1;
        }
        goal.types = objTypes;
      }
    }
  }

  for (var i = 1; i <= 25; i++) {
    this.goalsList = this.goalsList.concat(bingoList[i]);
  }

  this.goalsList = this.goalsList.stableSort(function(a, b) {
    var timeDiff = a.time - b.time;
    if (timeDiff !== 0) {
        return timeDiff;
    }
    if(a.id > b.id) {
        return 1;
    }
    else if (a.id < b.id) {
        return -1;
    }
    else {
        return 0;
    }
  });

  this.goalsByName = {};
  for (var i = 0; i < this.goalsList.length; i++) {
    var goal = this.goalsList[i];
    this.goalsByName[goal.name] = goal;
  }

  Math.seedrandom(this.seed);
};

BingoGenerator.prototype.makeMissions = function() {

  var populationOrder = [1, 5, 10, 15, 19];
  this.bingoBoard = [];
  for (var i = 1; i <= 5; i++) {
    var difficulty = 1 + ((i - 1) * 5) + Math.floor(Math.random() * 5);
    this.bingoBoard[populationOrder[i - 1]] = {
      difficulty: difficulty,
      desiredTime: difficulty * this.timePerDifficulty
    };
  }

  for (var i = 1; i <= 5; i++) {
    var position = populationOrder[i - 1];

    result = false;
    var desiredDifficulty = this.bingoBoard[position].difficulty;
    var desiredTime = desiredDifficulty * this.timePerDifficulty;
    for (var offset = this.initialOffset; offset <= this.maximumOffset; offset++) {
      var minTime = desiredTime - offset;
      var maxTime = desiredTime + offset;
      var goalsAtTime = this.getGoalsInTimeRange(minTime, maxTime).shuffled();

      for (var j = 0; j < goalsAtTime.length; j++) {
        var goal = goalsAtTime[j];
        if (this.hasGoalOnBoard(goal)) {
          continue;
        }

        result = {
          goal: goal,
        };
        offset = this.maximumOffset + 1;
        break;
      }
    }

    if (!result || !result.goal) {
      return false;
    }

    this.bingoBoard[position].types = result.goal.types;
    this.bingoBoard[position].subtypes = result.goal.subtypes;
    this.bingoBoard[position].rowtypes = result.goal.rowtypes;
    this.bingoBoard[position].name = result.goal[this.language] || result.goal.name;
    this.bingoBoard[position].id = result.goal.id;
    this.bingoBoard[position].time = result.goal.time;
    this.bingoBoard[position].goal = result.goal;
    this.bingoBoard[position].synergy = result.synergy;
  }

  return this.bingoBoard;  
};

BingoGenerator.prototype.makeCard = function() {
  this.bingoBoard = this.generateMagicSquare();
  var populationOrder = this.generatePopulationOrder();
  for (var i = 1; i <= 19; i++) {
    var nextPosition = populationOrder[i - 1];
    var result = this.chooseGoalForPosition(nextPosition);
    if (result.goal) {
      this.bingoBoard[nextPosition].types = result.goal.types;
      this.bingoBoard[nextPosition].subtypes = result.goal.subtypes;
      this.bingoBoard[nextPosition].rowtypes = result.goal.rowtypes;
      this.bingoBoard[nextPosition].name = result.goal[this.language] || result.goal.name;
      this.bingoBoard[nextPosition].id = result.goal.id;
      this.bingoBoard[nextPosition].time = result.goal.time;
      this.bingoBoard[nextPosition].goal = result.goal;
      this.bingoBoard[nextPosition].synergy = result.synergy;
    }
    else {
      return false;
    }
  }
  return this.bingoBoard;
};

BingoGenerator.prototype.generateMagicSquare = function() {
  var newhex = JSON.parse(JSON.stringify(magicHex));
  var copyhex = [];

  var flip = Math.floor(Math.random() * 2);
  if (flip) {
    copyhex = JSON.parse(JSON.stringify(newhex));
    for (i = 0; i < 19; i++) {
      newhex[i] = copyhex[flipHex[i] - 1];
    }
  }

  var rotate = Math.floor(Math.random() * 6);
  for (; rotate > 0; rotate--) {
    copyhex = JSON.parse(JSON.stringify(newhex));
    for (i = 0; i < 19; i++) {
      newhex[i] = copyhex[rotateHex[i] - 1];
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
  
  var magicSquare = [];
  for (var i = 1; i <= 19; i++) {
    var difficulty = newhex[i - 1];
    magicSquare[i] = {
      difficulty: difficulty,
      desiredTime: difficulty * this.timePerDifficulty
    };
  }
 return magicSquare;
};

BingoGenerator.prototype.chooseGoalForPosition = function(position) {
  var desiredDifficulty = this.bingoBoard[position].difficulty;
  var desiredTime = desiredDifficulty * this.timePerDifficulty;
  var bestGoals = [];
  for (var offset = this.initialOffset; offset <= this.maximumOffset; offset++) {
    var minTime = desiredTime - offset;
    var maxTime = desiredTime + offset;
    var goalsAtTime = this.getGoalsInTimeRange(minTime, maxTime);

    for (var j = 0; j < goalsAtTime.length; j++) {
      var goal = goalsAtTime[j];
      if (this.hasGoalOnBoard(goal)) {
        continue;
      }

      if(this.mode === 'blackout') {
        if (this.hasConflictsOnBoard(goal)) {
          continue;
        }
      }

      var synergies = this.checkLine(position, goal);
      synergies.weightedSynergy += offset;
      if (this.maximumSynergy >= synergies.maxSynergy && synergies.minSynergy >= this.minimumSynergy) {
        bestGoals.push({
          goal: goal,
          synergy: synergies.weightedSynergy
        });
      }
    }
  }

  if (bestGoals.length == 0) {
    return false;
  }

  var cutoff = 0.1 + Math.min.apply(Math, bestGoals.map(function(x) { 
    return x.synergy
  }));
  bestGoals = bestGoals.filter(function(goal) {
    return goal.synergy < cutoff;
  }).shuffled();

  return bestGoals[0] || false;
};

BingoGenerator.prototype.generatePopulationOrder = function() {
  return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].shuffled();
};

BingoGenerator.prototype.getGoalsInTimeRange = function(minTime, maxTime) {
  return this.goalsList.filter(function(goal) {
    return minTime <= goal.time && goal.time <= maxTime;
  });
};

BingoGenerator.prototype.hasGoalOnBoard = function(goal) {
  for (var i = 1; i <= 19; i++) {
    if (this.bingoBoard[i] && this.bingoBoard[i].id === goal.id) {
      return true;
    }
  }
  return false;
};

BingoGenerator.prototype.hasConflictsOnBoard = function(goal) {
  for (var i = 1; i <= 19; i++) {
    var square = this.bingoBoard[i];
    if (square.goal) {
      var squares = [goal, square.goal];
      var synergy = this.evaluateSquares(squares);
      if (synergy >= TOO_MUCH_SYNERGY) {
        return true;
      }
    }
  }
  return false;
};

BingoGenerator.prototype.getOtherSquares = function(row, position) {
  var rowIndices = INDICES_PER_ROW[row].filter(function(index) {
    return index != position;
  });
  var board = this;
  return rowIndices.map(function(index) {
    return board.bingoBoard[index];
  });
};

BingoGenerator.prototype.checkLine = function(position, potentialGoal) {
  var rows = ROWS_PER_INDEX[position];
  var maxSynergy = 0;
  var minSynergy = TOO_MUCH_SYNERGY;
  var weightedSynergy = 0;

  for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    var row = rows[rowIndex];
    var potentialSquare = JSON.parse(JSON.stringify(potentialGoal));
    potentialSquare.desiredTime = this.bingoBoard[position].desiredTime;
    var potentialRow = this.getOtherSquares(row, position);
    potentialRow.push(potentialSquare);
    var effectiveRowSynergy = this.evaluateSquares(potentialRow, row);
    maxSynergy = Math.max(maxSynergy, effectiveRowSynergy);
    minSynergy = Math.min(minSynergy, effectiveRowSynergy);
    weightedSynergy += Math.pow(effectiveRowSynergy, 2);
  }

  return {
    minSynergy: minSynergy,
    maxSynergy: maxSynergy,
    weightedSynergy: Math.sqrt(weightedSynergy)
  };
};

BingoGenerator.prototype.evaluateSquares = function(squares, row) {
  var ids = squares.map(function(el) {
    return el.id;
  }).filter(function(el) {
    return el;
  });
  if (hasDuplicateStrings(ids)) {
    return TOO_MUCH_SYNERGY;
  }

  var synergiesForSquares = this.calculateSynergiesForSquares(squares);
  return this.calculateEffectiveSynergyForSquares(synergiesForSquares, row);
};

BingoGenerator.prototype.calculateSynergiesForSquares = function(squares) {
  var typeSynergies = {};
  var subtypeSynergies = {};
  var rowtypeSynergies = {};
  var timeDifferences = [];

  for (var m = 0; m < squares.length; m++) {
    var square = squares[m];
    this.mergeTypeSynergies(typeSynergies, square.types);
    this.mergeTypeSynergies(subtypeSynergies, square.subtypes);
    this.mergeTypeSynergies(rowtypeSynergies, square.rowtypes);
    if (square.time !== undefined && square.desiredTime !== undefined) {
      timeDifferences.push(square.desiredTime - square.time);
    }
  }

  return {
    typeSynergies: typeSynergies,
    subtypeSynergies: subtypeSynergies,
    rowtypeSynergies: rowtypeSynergies,
    goals: squares,
    timeDifferences: timeDifferences
  };
};

BingoGenerator.prototype.mergeTypeSynergies = function(typeSynergies, newTypeSynergies) {
  for (var type in newTypeSynergies) {
    if (!typeSynergies[type]) {
      typeSynergies[type] = [];
    }
    typeSynergies[type].push(newTypeSynergies[type]);
  }
};

BingoGenerator.prototype.calculateCombinedTypeSynergies = function(synergiesForSquares) {
  var typeSynergies = synergiesForSquares.typeSynergies;
  var subtypeSynergies = synergiesForSquares.subtypeSynergies;
  var combinedTypeSynergies = {};
  for (var type in typeSynergies) {
    if (type in subtypeSynergies) {
      combinedTypeSynergies[type] = typeSynergies[type].concat(subtypeSynergies[type]);
    }
    else {
      combinedTypeSynergies[type] = typeSynergies[type];
    }
  }
  return combinedTypeSynergies;
};

BingoGenerator.prototype.filterRowtypeSynergies = function(synergiesForSquares, row) {
  var rowtypeSynergies = {};
  for (var rowtype in synergiesForSquares.rowtypeSynergies) {
    var rowtypeSynergy = synergiesForSquares.rowtypeSynergies[rowtype];
    if (!row || rowtypeSynergy.length < INDICES_PER_ROW[row]) {
      continue;
    }
    var rowtypeCost = 0;
    for (var i = 0; i < rowtypeSynergy.length; i++) {
      rowtypeCost += rowtypeSynergy[i];
    }
    if(this.rowtypeTimeSave[rowtype] > rowtypeCost) {
      rowtypeSynergies[rowtype] = this.rowtypeTimeSave[rowtype] - rowtypeCost;
    }
  }
  return rowtypeSynergies;
};

BingoGenerator.prototype.calculateEffectiveTypeSynergies = function(typeSynergies) {
  var effectiveTypeSynergies = {};
  for (var type in typeSynergies) {
    var synergies = typeSynergies[type];
    var effectiveSynergies = this.filterSynergyValuesForType(type, synergies);
    if (effectiveSynergies.length > 0) {
      effectiveTypeSynergies[type] = effectiveSynergies;
    }
  }
  return effectiveTypeSynergies;
};

BingoGenerator.prototype.filterSynergyValuesForType = function(type, synergies) {
  synergies = synergies.sortNumerically();
  var filter = this.synergyFilters[type] || "";
  if (/^min/.test(filter)) {
    var count = Number(filter.split(" ")[1]);
    return synergies.slice(0, count);
  }
  else if (/^max/.test(filter)) {
    var count = Number(filter.split(" ")[1]);
    synergies.reverse();
    return synergies.slice(0, count);
  }
  else {
    return synergies.slice(0, -1);
  }
};

BingoGenerator.prototype.calculateEffectiveSynergyForSquares = function(synergiesForSquares, row) {
  var typeSynergies = this.calculateCombinedTypeSynergies(synergiesForSquares);
  var rowtypeSynergies = this.filterRowtypeSynergies(synergiesForSquares, row);
  var effectiveTypeSynergies = this.calculateEffectiveTypeSynergies(typeSynergies);


  var rowSynergy = 0;
  for (var type in effectiveTypeSynergies) {
    var synergies = effectiveTypeSynergies[type];
    for (var i = 0; i < synergies.length; i++) {
      if (synergies[i] > this.maximumIndividualSynergy) {
        return TOO_MUCH_SYNERGY;
      }
      rowSynergy += synergies[i];
    }
  }

  for(var rowtype in rowtypeSynergies) {
    rowSynergy += rowtypeSynergies[rowtype];
  }

  var timeDifferences = synergiesForSquares.timeDifferences;
  for (var i = 0; i < timeDifferences.length; i++) {
    var timeDifference = timeDifferences[i];
    rowSynergy += timeDifference;
  }

  return rowSynergy;
};
