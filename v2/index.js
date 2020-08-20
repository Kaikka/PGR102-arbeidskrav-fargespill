var alternativesDiv = document.getElementById("alternativesDiv");
var infoTextDiv = document.getElementById("infoTextDiv");
var correctAnswersOut = document.getElementById("correctAnswers");
var wrongAnswersOut = document.getElementById("wrongAnswers");
var difficultyOut = document.getElementById("difficultyOutput");
var difficultyIn = document.getElementById("difficultyInput");
var attemptsLeftOut = document.getElementById("attemptsLeft");
var nextColorBarOut = document.getElementById("nextColorBar");

var difficulty = 5; // Number to define difficulty. Default is 5. Can be changed
var colorArray = []; // Array to store random generated colors
var colorArrayLength; // Store length of array in a number
var correctBox; // Index number of colorArray defining which box is correct
var correctAnswerCount = 0; // Start at 0, duh :)
var wrongAnswerCount = 0; // Same as above
var attemptsLeft = 20;
var intervalActivation = 1; // Activator for cooldown interval.
var interval; // Minor error if interval isnt declared at start, since there are functions calling for it before it's made with nextColorBar();

init(); // Get stuff going!

// Generate a random number and use it to create %difficulty RGB codes depending on difficulty
function RNG(){
    var RNG = Math.floor(Math.random()*256);
    return RNG;
}
function createColorArray(){
    for(i = 0; i < difficulty; i++){
        colorArray.push(`rgb(${RNG()}, ${RNG()}, ${RNG()})`);
    }
    colorArrayLength = colorArray.length; // Storing the number in a var is better than calling for colorArray.length every time you need it, especially when used in loops
}

// Print an updated difficulty. Could just put the innerHTML line in init(), but this way it allows for easily building more onto the function
function setDifficulty(){
    difficultyOut.innerHTML = difficulty;
}

// Make input enable when clicking 'enter' (keyCode 13)
difficultyIn.addEventListener("keyup", function(enter){
    if (enter.keyCode === 13) {
        enter.preventDefault();
        document.getElementById("changeDifficultyBtn").click();
    }
});

// Change the difficulty with if-else to prevent abuse
function changeDifficulty(){
    var difficultyInput = parseInt(document.getElementById("difficultyInput").value);
    var difficultyErrorOut = document.getElementById("difficultyError");
    if (isNaN(difficultyInput)){
        difficultyErrorOut.innerHTML = "Fill in a number!";
    } else if (difficultyInput <= 0){
        difficultyErrorOut.innerHTML = "No no no, sir!";
    } else if (difficultyInput == 1){
        difficultyErrorOut.innerHTML = "Want the easy way out, do you?";
    } else if (difficultyInput >= 1000){
        difficultyErrorOut.innerHTML = "Lets not break things.";
    } else {
        difficulty = difficultyInput;
        difficultyErrorOut.innerHTML = "";
        document.getElementById("difficultyInput").value = "";
        defaultReset();
    }
}

// Create the alternatives
function createAlternatives(){
    for(i = 0; i < colorArrayLength; i++){
        alternativesDiv.innerHTML += `<div id="box${[i]}" class="boxAlternatives"></div>`;
        document.getElementById(`box${[i]}`).style.cssText = `
        background-color: ${colorArray[i]};
        border: 3px solid transparent;
        height: 100px;
        width: 100px;
        box-sizing: border-box;
        display: inline-block;
        margin: 2px`;
    }
}

// Decide by rng what answer will be correct
function getCorrectBox(){
    correctBox = Math.floor(Math.random()*`${colorArrayLength}`);
}

// Create the correct box based on getCorrectBox()
function correctBoxDiv(){
    document.getElementById("correctBoxDiv").style.cssText = `
    background-color: ${colorArray[correctBox]};
    width: 150px;
    height: 150px;
    display: inline-block;
    margin: 2px`;
}

// Function to make elements interactive with mouseover, mouseout and click. Border is always there, but transparent, to not fuck with element sizing/how much space it takes. Also function to remove it.
function addInteractiveEvents(){
    var addInteractive = document.getElementsByClassName("boxAlternatives");
    for(var i = 0; i < colorArrayLength; i++){
        addInteractive[i].addEventListener("mouseover", mouseOver);
        addInteractive[i].addEventListener("mouseout", mouseOut);
        addInteractive[i].addEventListener("click", addOnclick);
    }
}
function removeInteractiveEvents(){
    var removeInteractive = document.getElementsByClassName("boxAlternatives");
    for(var i = 0; i < colorArrayLength; i++){
        removeInteractive[i].removeEventListener("mouseover", mouseOver);
        removeInteractive[i].removeEventListener("mouseout", mouseOut);
    }
}
function mouseOver(){
    this.style.border = "3px dashed black";
}
function mouseOut(){
    this.style.border = "3px dashed transparent";
}
function addOnclick(){
    colorAnswered(this);
}

// I tried doing this is 2 different ways; removeEventListener("click"), but I found that to be tedious, mainly in nextColorBar() when the timer ran out. I had to run both removeEventListener click *and* mouseover/mouseout, on top of having to clear the mouseover-border of the active element you hovered when time expired, as it wouldn't disappear due to removing the mouseOut event. pointerEvents is an easy workaround that just makes the elements non-interactable with mouse instead. 
function clickThrough(){
    var clickThroughDiv = document.getElementsByClassName("boxAlternatives");
    for(var i = 0, l = clickThroughDiv.length; i < l; i++){
        document.getElementById(`box${[i]}`).style.pointerEvents = "none"; 
    }
}

// The function to call for when clicking a box. If correct, remove interactive events, give the answer a border and make it bigger, then end the game or keep going depending on amounts of attempts left. If wrong, give red border to the wrong alternative and possibly end the game if amounts of attempts equals zero
function colorAnswered(elem){
    var colorAnswered = elem.style.backgroundColor
    if (colorAnswered == colorArray[correctBox]){
        infoTextDiv.innerHTML = "<br/>Correct!";
        correctAnswerCount++;
        attemptsLeft--;
        correctAnswersOut.innerHTML = correctAnswerCount;
        attemptsLeftOut.innerHTML = attemptsLeft;
        removeInteractiveEvents();
        clickThrough();
        document.getElementById(`box${correctBox}`).style.cssText += `
        border: 2px solid black;
        border-radius: 10px;
        box-shadow: 0px 0px 8px black;
        transform: scale(1.1);
        transition: all 0.2s;
        z-index: 10;
        `;
        if (attemptsLeft == 0) {
            attemptsEnded();
        } else {
            delayedReset();
            clearInterval(interval);
            intervalActivation = 1;
        }
    } else {
        infoTextDiv.innerHTML = "<br/>Wrong!";
        wrongAnswerCount++;
        attemptsLeft--;
        wrongAnswersOut.innerHTML = wrongAnswerCount;
        attemptsLeftOut.innerHTML = attemptsLeft;
        elem.style.border = "3px solid red";
        elem.removeEventListener("mouseover", mouseOver);
        elem.removeEventListener("mouseout", mouseOut);
        if (attemptsLeft == 0) {
            attemptsEnded();
        }
    }
}

// Stops the game and prints some info including a button to play more
function attemptsEnded(){
    clickThrough();
    clearInterval(interval);
    var correctPercentage = correctAnswerCount/20*100;
    alternativesDiv.innerHTML = `<img src="images/pogchamp.png" height="100px"><span>You won!</span>`;
    infoTextDiv.innerHTML = `${goodJob()}<br/>
    ${correctAnswerCount} correct and ${wrongAnswerCount} wrong answers gives a ${correctPercentage}% accuracy!<br/>
    <input type="button" value="Lets play some more!" onclick="defaultReset()">`;
}

// Just some outputs depending on how many correct answers
function goodJob(){
    var c = correctAnswerCount;
    var w = wrongAnswerCount;
    var t = c + w;
    if (c/t*100 >= 80 && t >= 10) {
        var goodJobText = "Amazing! Rolando is proud :3";
    } else if (c/t*100 <= 30) {
        var goodJobText = "Are you colorblind?!";
    } else {
        var goodJobText = "Good job!";
    }
    return goodJobText;
}

// Empty the time-left indication bar, but keep height to not move elements below
function emptyNextColorBar(){
    nextColorBarOut.style.cssText = `
    width: 0px;
    height: 30px;
    `;
}

// Bar to indicate time left to answer. Includes stopping the game if you run out on time
function nextColorBar(){
    nextColorBarOut.style.cssText = `
    width: 500px;
    height: 30px;
    background-color: ${colorArray[correctBox]};
    `;
    if (intervalActivation == 1){
        intervalActivation = 0;
        var answerTimer = nextColorBarOut;
        var width = 600;
        interval = setInterval(frame, 5);
        function frame() {
            if (width <= 0){
                clearInterval(interval);
                intervalActivation = 1;
                infoTextDiv.innerHTML = `<strong>You're too slow!</strong> Have you considered <a href="https://www.specsavers.no/">specsavers.no</a>?<br/>
                                        Remember you can turn down the difficulty!<br/>
                                        <input type="button" value="I want to try again..." onclick="defaultReset()">`;
                answerTimer.innerHTML = "";
                document.getElementById("nextColorBarTimer").innerHTML = "&nbsp;";
                alternativesDiv.style.opacity = 0.5;
                answerTimer.style.cssText = `
                height: 30px;
                font-size: 20;
                `;
                clickThrough();
            } else {
                width--;
                answerTimer.style.width = width + "px";
                var timeLeft = Math.ceil(width/200);
                document.getElementById("nextColorBarTimer").innerHTML = `${timeLeft} sec left`;
            }
        }
    }
}

// Put everything back to default values and run init
function defaultReset(){
    alternativesDiv.innerHTML = "";
    colorArray = [];
    nextColorBarOut.style.width = 0;
    nextColorBarOut.innerHTML = "";
    document.getElementById("nextColorBarTimer").innerHTML = "&nbsp;";
    infoTextDiv.innerHTML = "<br/>Click the box that matches the color above!";
    alternativesDiv.style.opacity = 1;
    correctAnswerCount = 0;
    wrongAnswerCount = 0;
    attemptsLeft = 20;
    correctAnswersOut.innerHTML = correctAnswerCount;
    wrongAnswersOut.innerHTML = wrongAnswerCount;
    attemptsLeftOut.innerHTML = attemptsLeft;
    init();
}

// Clear generated divs/array and run init to get a new set of boxes
function reset(){
    alternativesDiv.innerHTML = "";
    colorArray = [];
    infoTextDiv.innerHTML = "<br/>Keep going!";
    init();
    nextColorBar();
}

// Just delaying resetting to new game, to get animation when answering correct
function delayedReset(){
    setTimeout(function(){reset();}, 1000);
}

// init for startup and to do multiple games
function init(){
    createColorArray();
    createAlternatives();
    getCorrectBox();
    setDifficulty();
    correctBoxDiv();
    addInteractiveEvents();
    emptyNextColorBar();
}