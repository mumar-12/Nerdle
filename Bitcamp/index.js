
const ROWS = 7;
const COLS = 8;
const RED_TIME = 10;
const BIG_NUM = 5;
let currentRow;
let currentCol;
let guesses;
let grid = document.getElementById("grid");
let time = 60;
let timerID;
let answer;

newGame();

//Listen for key press
window.addEventListener("keydown", (e) => {
    let value = e.key;
    e.preventDefault();

    //Onyl display digits +, -, *, /, =
    if(!isNaN(value) || value === "+" || value === "-" || value === "*" || value === "/" || value === "=") { 
        display(value);
    } else if(value === "Backspace") { //Delete the value in the previous column (since we are on the next free column)
        backspace();
    } else if(value == "ArrowRight") { //Move current col to right
       moveRight();
    } else if(value == "ArrowLeft") { //Move current col to left
        moveLeft();
    } else if(value == "Enter") { //process row and move on
        enter();
    } 
});

function decrementTimer() {
    if(time > 0) {
        time --;

        let timer = document.getElementById("timer");
        timer.innerHTML = time;
        if (time <= BIG_NUM) {
            document.getElementById("left").innerHTML = time;
            document.getElementById("right").innerHTML = time;
        } 
        if(time <= RED_TIME) {
            timer.setAttribute("class", "red-text");
        }
        
        if(time == 0) {
            nextTry();
        } 
    }
}

function resetTimers() {
    time = 60;
    document.getElementById("timer").innerHTML = time;
    document.getElementById("left").innerHTML = "";
    document.getElementById("right").innerHTML = "";
    document.getElementById("timer").setAttribute("class", "");
}

//Initialize the 2D array of guesses with empty string in each box
function createArray() {
    let arr = [];
    for (let i = 0; i < ROWS; i++) {
        arr[i] = new Array(COLS);
        for(let j = 0; j < COLS; j++) {
            arr[i][j] = "";
        }
    }
    return arr;
}

function display(value) {
    if(currentCol < COLS && currentRow < ROWS - 1) { //Don't display beyond the last column and second to last row
        displayInGrid(value);
        guesses[currentRow][currentCol] = value;
        currentCol++;
        if(currentCol < COLS) { //When we are on the last col in a row, don't style beyond it.
            styleCurrentBox();
        }
    }
}

function backspace() {
    if(currentCol > 0) {
        currentCol--;
        styleCurrentBox();
        guesses[currentRow][currentCol] = "";
        removeFromGrid();
    }
}

function moveRight() {
    if(currentCol < COLS-1) {
        currentCol++;
        styleCurrentBox();
    }
}

function moveLeft() {
    if(currentCol > 0) {
        currentCol--;
        styleCurrentBox();
    }
}

function enter() {
    let moveOn = processRow();
    if(moveOn) {
        colorGrid();
        colorKeys();
        let guess = guesses[currentRow];
        let correct = isCorrect(boxColors(guess));
        if(correct) {
            clearInterval(timerID);
            document.getElementById("left").innerHTML=`<h1>You</h1>`;
            document.getElementById("right").innerHTML=`<h1>Win</h1>`
            document.getElementById("timer").innerHTML = `<input type="button" value="New Game" onclick="newGame()">`;
        } else {
            nextTry();
        }   
    } 
}

function isCorrect(colors) {
    for(let i = 0; i < COLS; i++) {
        if(intToColor(colors[i]) !== "green") {
            return false;
        }
    }

    return true;
}

function colorGrid() {
    let guess = guesses[currentRow];
    let colors = boxColors(guess);
    //color in keyboard based on int values
    // 0: black, 1: yellow, 2: green
    colors.forEach((element, index) => colorBoxByID(element, index));
}

//Colors the keys based on the current guess. Assumes the grid has been colored
function colorKeys() {
    for(let col = 0; col < COLS; col++) {
        let box = document.getElementById(`grid-box-${currentRow}-${col}`);
        let innerBox = box.childNodes[0];
        let cls = innerBox.getAttribute("class");
        let keyText = innerBox.textContent;
        let key = document.getElementById(`key${keyText}`);
        let oldKeyClass = key.getAttribute("class");

        if(cls.includes("black") && !(oldKeyClass.includes("green") && oldKeyClass.includes("yellow"))) {
            key.setAttribute("class", "keyboard black");
        } else if(cls.includes("green")) {
            key.setAttribute("class", "keyboard green");
        } else if(cls.includes("yellow") && !oldKeyClass.includes("green")) {
            key.setAttribute("class", "keyboard yellow");
        }
    }
}

/* This function colors each of the boxes on the current row and displays the text of green boxes
in the last row, corresponding column index */
function colorBoxByID(color, index) {
    let box = document.getElementById(`grid-box-${currentRow}-${index}`);
    let colorClass = intToColor(color);
    let innerBox = box.childNodes[0];
    let currClass = innerBox.getAttribute("class");
    innerBox.setAttribute("class", currClass + " " + colorClass);

    if(colorClass === "green") {
        //Display the text content of green boxes in the last row, same column
        let correctBox = document.getElementById(`grid-box-${ROWS-1}-${index}`);
        let correctBoxInnerBox = correctBox.childNodes[0];
        correctBoxInnerBox.setAttribute("class", "result-inner-box");
        correctBoxInnerBox.textContent = box.textContent;
    }
}

function intToColor(colorCode) {
    switch (colorCode) {
        case 0:
            return "black";
        case 1:
            return "yellow";
        case 2: 
            return "green";
    }
}

function nextTry() {
    currentRow++;
    currentCol = 0;
    resetTimers();

    if(currentRow >= ROWS - 1) {
        error(`Game over, correct answer ${answer}`);
        clearInterval(timerID);
        document.getElementById("timer").innerHTML = "";
        createNewGameButton();
    } else { //Move on to the next row
        styleCurrentBox();
    }
}

function createNewGameButton() {
    let str = `<input type="button" value="New Game" onclick="newGame()">`;
    document.getElementById("timer").innerHTML = str;
}

function newGame() {
    currentRow = 0;
    currentCol = 0;
    guesses = createArray();
    populateGrid();
    populateKeyboard();
    timerID = window.setInterval(() => {
    decrementTimer();
    }, 1000);
    resetTimers();
    answer = generateAnswer();
}

/* This method populates the grid with ROWS X COLS boxes */
function populateGrid() {
    grid.innerHTML = "";
    for(let i = 0; i < ROWS; i++) {
        for(let j = 0; j < COLS; j++) {
            if(i == ROWS - 1) {
                addBoxToGrid(i, j, "result-box");
            } else {
                addBoxToGrid(i,j, "grid-box");
            }
        }
    }

    //style the current box
    styleCurrentBox();
}

function populateKeyboard() {
    document.getElementById("keys").innerHTML = generateKeys();
}

/* This function sets the style for the current active box */
function styleCurrentBox() {
    //Initially, there is not prev current box. After the first styling, there should always be one
    let prevCurrents = document.getElementsByClassName("current-box");
    if(prevCurrents.length != 0) {
        let oldCls = prevCurrents[0].getAttribute("class");
        prevCurrents[0].setAttribute("class", oldCls.split(" ")[0]);
    }

    let box = document.getElementById(`grid-box-${currentRow}-${currentCol}`);
    let cls = box.getAttribute("class");
    box.setAttribute("class", cls + " " + "current-box");
}

/* This method modifies the DOM by adding a new div element to #grid-box */
function addBoxToGrid(row, col, cls) {
    let box = document.createElement("div");
    box.setAttribute("class", cls);
    box.setAttribute("id", `grid-box-${row}-${col}`);

    if(cls === "result-box") {
        let innerBox = document.createElement("div");
        innerBox.setAttribute("class", "result-inner-box");
        innerBox.textContent = "?";
        box.appendChild(innerBox);
    }

    grid.appendChild(box);
}

/* This function displays the given value in the current row and the current column of the grid. 
Assumes the current row and col are within bounds */
function displayInGrid(value) {
    let box = document.getElementById(`grid-box-${currentRow}-${currentCol}`);
    //If there is something in the box, remove it before adding another
    if(box.childNodes.length != 0) {
        for(let childNode of box.childNodes) {
            box.removeChild(childNode);
        }
    }
    let innerBox = document.createElement("div");
    innerBox.setAttribute("class", "grid-inner-box");
    innerBox.textContent = value;
    box.appendChild(innerBox);
}

/* This function removes the last value in the current row from the grid. Assumes the current row
and col are within bounds */
function removeFromGrid() {
    let box = document.getElementById(`grid-box-${currentRow}-${currentCol}`);

    if(box.childNodes.length != 0) {
        for(let childNode of box.childNodes) {
            box.removeChild(childNode);
        }
    }
} 

/* This function processes the current row */
function processRow() {
    let guess = guesses[currentRow];
    if(noCellEmpty(guess)) {
        let check = checkValidity(guess);
        let msg = getErrorMessage(check);
        if(msg == "") {
            return true;
        } else {
            error(msg);
            return false;
        }
    } else {
        error("One or more cells are empty");
        return false;
    }
}

function getErrorMessage(val) {
    let str = "Error: ";
    switch (val) {
        case 1: 
            return "";
        case 0: 
            return str + "Invalid Equation";
        case -1: 
            return str + "Equation must start with a digit";
        case -2:
            return str + "Equation has more than one equals";
        case -3:
            return str + "Equation has operator after equals";
        case -4: 
            return str + "Equation must contain at least one operator";
        case -5:
            return str + "Equation has two operators in a row";
        case -6:
            return str + "Equation must have =";
    }
}

function noCellEmpty(guess) {
    for(let c of guess) {
        console.log(c==="");
        if(c === "") {
            return false;
        }
    }

    return true;
}

function error(msg) {
    window.alert(msg);
}


/* This method adds a virtual keyboard to the DOM */
function generateKeys() {
    let str = "";
    for (let id = 0; id < 10; id++) {
        str += createButton(id);
    }
    str += `<br>`;

    ["+", "-", "*", "/", "=", "Enter", "Delete"].forEach(element => {
        str += createButton(element)
    });
    return str;
}

function press(val) {
    if (val == 'Enter') {
        enter();
    } else if (val == 'Delete') {
        backspace();
    } else {
        display(val);
    }
}

function createButton(id) {
    return `<input type="button" id="key${id}" class="keyboard" value="${id}" onclick="press('${id}')">`
}


