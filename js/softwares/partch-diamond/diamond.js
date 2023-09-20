var i = 0;
var mousePressed = false;
var lastIdentityPlayer;
var playNumber  = 1;
var reduceOctave;
var soundPlayer = 'sf'; 
var Sound = null;
var marimbaSoundFount = null;
var soundIsOn = false;
var soundWarning = false;
var diamondLimit = 5;
var fundamentalPitch = 220;
var cnvSquareSize = 350;


function changeFrequency(){
    fundamentalPitch = document.getElementById("frequencyInput");

}


function turnOnAudioContext() {
    try {
        if (Sound == null) {
            Sound = new AudioContext();
        }
        if (marimbaSoundFount == null){
            marimbaSoundFount = new window.neimogSoundfont(Sound, { instrument: "celesta" });
        }
        soundIsOn = true;
        return true;
    }
    catch (e) {
        alert('Seems that this is not supported by your browser.');
        return false;
    }
}

// =================================================
function toggleAudio() {
    // id="SoundIcon"
    if  (!turnOnAudioContext()){
        return;   
    }
    
    const iconElement = document.getElementById("SoundIcon");
    if (iconElement.classList.contains("fa-volume-xmark")) {
        iconElement.classList.remove("fa-volume-xmark");
        iconElement.classList.add("fa-volume-high");
        Sound.resume();
    } 
    else {
        iconElement.classList.remove("fa-volume-high");
        iconElement.classList.add("fa-volume-xmark");
        Sound.suspend();
    }
    
}


// =================================================
function freq2midi(freq) {
    return 69 + 12 * Math.log2(freq / 440);
}

// =================================================
function midi2freq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}

// =================================================
function reduceOctaveOfRatio(nume, deno){
    var octave = nume / deno;
    if (octave > 2){
        newDeno = deno * 2;
        return reduceOctaveOfRatio(nume, newDeno);
    }
    if (octave < 1){
        newNume = nume * 2;
        return reduceOctaveOfRatio(newNume, deno);
    }
    if (octave <= 2 && octave >= 1){
        return nume + "/" + deno;
    }
}

// =================================================
function setup() {
    const canvasParent = document.querySelector("#p5jsCanvasDiamond"); // Get the parent element
    cnv = createCanvas(cnvSquareSize, cnvSquareSize).parent(canvasParent); // Create the canvas inside the parent element
}

// =================================================
function draw() {
    reduceOctave = true;
    background(255);
    stroke(0);
    strokeWeight(1);
    noFill(); 
    rect(0, 0, cnvSquareSize, cnvSquareSize, 20);
    
    reduceOctave = document.getElementById("ReduceOctavesCheck").checked;


    fundamentalPitch = document.getElementById("frequencyInput").value;
    strokeWeight(1);
    var x = cnvSquareSize / 2;
    var y = cnvSquareSize / 2;
    var w = cnvSquareSize / 1.5;
    var h = cnvSquareSize / 1.5;
    var angle = 45;
    var identities = [];

    // get limitDiamond id
    var limitDiamond = document.getElementById("limitDiamond");
    if (limitDiamond != null){
        diamondLimit = limitDiamond.value;
    }

    for(var i = 0; i <= diamondLimit; i++) {
	if (i % 2 == 1) {
	    identities.push(i);
	}
    }
    // put identities in ascendent order
    var identityPositions;
    var identityOrder = [];
    for (var i = 0; i < identities.length; i++){
        identityPositions = reduceOctaveOfRatio(identities[i], 1);
        nume = identityPositions.split("/")[0];
        deno = identityPositions.split("/")[1];
        identityOrder.push(nume / deno);
    }
    var identityOrdered = identityOrder.slice();
    identityOrdered.sort(function(a, b){return a-b});
    var sortedIdentities = [];
    for (var i = 0; i < identities.length; i++){
        var index = identityOrdered.indexOf(identityOrder[i]);
        sortedIdentities.push(identities[index]);
    }
    identities = sortedIdentities.slice();
    identities.reverse();
    push();
    translate(x, y);
    rotate(radians(angle));

    var mousePos = createVector(mouseX, mouseY);
    var rectPos = createVector(x, y);
    var mousePosTranslated = mousePos.sub(rectPos);
    var mousePosRotated = mousePosTranslated.rotate(radians(-angle));

    // all positions
    var allPositions = [];
    var allRatios = [];
    var numberOfIdenties = identities.length;
    for(var i = 0; i < numberOfIdenties; i++) {
        for(var j = 0; j < numberOfIdenties; j++) {
            fill(255, 255, 255);
            var actualPos = createVector(-w / 2 + i * w / numberOfIdenties, -h / 2 + j * h / numberOfIdenties);
            rect(actualPos.x, actualPos.y, w / numberOfIdenties, h / numberOfIdenties);
            allPositions.push(actualPos);
            fill(0, 0, 0);
            var center = createVector(actualPos.x + w / (numberOfIdenties * 2), actualPos.y + h / (numberOfIdenties * 2));
            var identityText = identities[j] + "/" + identities[i];
            push();
            translate(center.x , center.y);
            rotate(radians(-45));
            if (reduceOctave){
                identityText = reduceOctaveOfRatio(identities[j], identities[i]);
            }
            allRatios.push(identityText);
            var textWidth = identityText.length * 10;
            translate(-textWidth / 2, 5);
            text(identityText, 0, 0);
            pop();
        }
    }

    var someWasClicked = false;
    for(var i = 0; i < allPositions.length; i++) {
        if (mousePosRotated.x > allPositions[i].x &&
            mousePosRotated.x < (allPositions[i].x + w / numberOfIdenties) &&
            mousePosRotated.y > allPositions[i].y &&
            mousePosRotated.y < (allPositions[i].y + h / numberOfIdenties)) {
            
            someWasClicked = true;
            fill(238);
            rect(allPositions[i].x, allPositions[i].y, w / numberOfIdenties, h / numberOfIdenties);
            fill(0, 0, 0);
            push();
            var center = createVector(allPositions[i].x + w / (numberOfIdenties * 2), allPositions[i].y + h / (numberOfIdenties * 2));
            translate(center.x , center.y);
            rotate(radians(-45));
            var identityText = allRatios[i];
            var textWidth = identityText.length * 10;
            translate(-textWidth / 2, 5);
            textSize(20);
            text(identityText, 0, 0);
            pop();
            if (soundWarning === false && soundIsOn === false){
                alert('Turn on the sound to play the ratios.');
                soundWarning = true;
            }

            if (lastIdentityPlayer != i && soundIsOn === true && mouseIsPressed === true) {
                lastIdentityPlayer = i;
                actualRatio = allRatios[i];
                var denominator = actualRatio.split("/")[0];
                var numerator = actualRatio.split("/")[1];
                var freq = fundamentalPitch * (denominator / numerator);
                midicents = freq2midi(freq);
                midi = Math.round(midicents);
                cents = Math.round((midicents - midi) * 100);
                marimbaSoundFount.start({ note: midi, velocity: 80, detune: cents });
            }
        } 
    }
    if (someWasClicked === false) {
        lastIdentityPlayer = -1;
    }
    pop();

}

// =================================================
function mousePressed(event) {
    console.log(event);
  }

// =================================================
function changeLimit(){
    var limitDiamond = document.getElementById("limitDiamond");
    diamondLimit = limitDiamond.value;
}
