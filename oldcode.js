// Old outdated code with comments of progress. Not a part of the actual assignment at all, but I just included it anyways.

var difficulty = 5; // Number to define difficulty - make this be defined on input
var colorArray = []; // Array to store random generated colors

// First draft to create random rgb colors
for(i = 0; i < difficulty; i++){
    var numberGen1 = Math.floor(Math.random()*256);
    var numberGen2 = Math.floor(Math.random()*256);
    var numberGen3 = Math.floor(Math.random()*256);

    colorArray.push(`rgb(${numberGen1}, ${numberGen2}, ${numberGen3})`);
}

// Second draft to create random rgb colors. Does the same thing as calling for a function inside the template literal, but ugly code.
for(i = 0; i < difficulty; i++){
    colorArrayX.push(`rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`);
}

// First code to apply styles to div
for(i = 0; i < difficulty; i++){
    divOut.innerHTML += `<div id="box${[i]}"></div>`;
    document.getElementById(`box${[i]}`).style.backgroundColor = `${colorArray[i]}`;
    document.getElementById(`box${[i]}`).style.height = "100px";
    document.getElementById(`box${[i]}`).style.width = "100px";
    document.getElementById(`box${[i]}`).style.display = "inline-block";
    document.getElementById(`box${[i]}`).style.margin = "5px";
}

// test stuff

var testDiv = document.getElementsByClassName("testDivClass");
//testDiv[0].innerHTML = "Hi";
myFunction();
function myFunction(){
    var xx = document.getElementsByClassName("testDivClass");
    xx[0].innerHTML = "Hello world!";
}

var aDiv = document.getElementById("a-div");
aDiv.style.backgroundColor = "rgb(150, 200, 250)";
aDiv.onclick = showDivColor;
var colorOutputP = document.getElementById("color-output-p");
function showDivColor(){
    var backgroundColor = this.style.backgroundColor;
    colorOutputP.innerHTML = backgroundColor;
}

Click box?
function clickAlternatives(){
    var clickDiv = document.getElementsByClassName("boxAlternatives");
    for(var i = 0; i < colorArrayLength; i++){
        clickDiv[i].onclick = showDivColor;
    }
}
function showDivColor(){
    var backgroundColor = this.style.backgroundColor;
    testDiv.innerHTML = backgroundColor;
}


function removeHoverAlternatives(){
    var removeHoverDiv = document.getElementsByClassName("boxAlternatives");
    for(var i = 0, j = hoverDiv.length; i < j; i++){
        removeHoverDiv[i].removeEventListener("mouseover", function(){
            this.style.border = "2px dashed red";
            alert("x");
        });
        removeHoverDiv[i].removeEventListener("mouseout", function(){
            this.style.border = "2px dashed transparent";
        });
    }
}

function hoverAlternatives(){
    var hoverDiv = document.getElementsByClassName("boxAlternatives");
    for(var i = 0, j = hoverDiv.length; i < j; i++){
        hoverDiv[i].addEventListener("mouseover", function(){
            this.style.border = "2px dashed black";
        });
        hoverDiv[i].addEventListener("mouseout", function(){
            this.style.border = "2px dashed transparent";
        });
    }
}
var count = 20;
var counter = setInterval(timer, 100); 
function timer(){
    if (count <= 0)
    {
        clearInterval(counter);
        //reset();
     }
     count--;
     document.getElementById("timer").innerHTML=count /10+ " secs";
}

// Temp stuff for testing to see outputs
function testOutput(){
    rngDiv.innerHTML = colorArray;
    rngDiv.innerHTML += `<br>Correct box index: ${correctBox}`;
    rngDiv.innerHTML += `<br>Correct box color code: ${colorArray[correctBox]}`;
}

function clickAnswer(){
    var clickAnswer = document.getElementsByClassName("boxAlternatives");
    for(var i = 0; i < colorArrayLength; i++){
        clickAnswer[i].onclick = colorAnswered;
    }
}