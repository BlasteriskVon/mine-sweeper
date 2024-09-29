var body = document.querySelector("body");
var row = document.querySelector(".row");
var infoRow = document.createElement("div");
infoRow.className = "col-md-2 row";
var gameRow = document.createElement("div");
gameRow.className = "col-md-10 row";
var mineParameter = 20;
var numberOfMines;
var startButton = document.querySelector("#start");
var i, j; //these are the variables used for the double array and ids
var endI = 12;
var endJ = 8;
var started = false;
var ended = false;
startButton.onclick = function(){
    setBoard();
}
function setBoard() {
    row.innerHTML = "";
    infoRow.innerHTML = "";
    gameRow.innerHTML = "";
    //setting up info board
    //reset button
    infoRow.innerText = "Remaining:";
    var remainingSpan = document.createElement("span");
    remainingSpan.className = "remaining";
    infoRow.append(remainingSpan);
    var resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.style.height = "5%";
    resetButton.onclick = function(){
        ended = false;
        started = false;
        setBoard();
    }
    infoRow.append(resetButton);
    var settingsButton = document.createElement("button");
    settingsButton.textContent = "Settings";
    settingsButton.style.height = "10%";
    infoRow.append(settingsButton);
    //remaining div
    // var remainingDiv = document.createElement("span");
    // remainingDiv.className = "col-md-12 remainder";
    // remainingDiv.textContent = "Remaining: ";
    // remainingDiv.style.height = "5%";
    // var remainingSpan = document.createElement("span");
    // remainingSpan.className = "remaining";
    // remainingDiv.append(remainingSpan);
    // infoRow.append(remainingDiv);
    /*var remainingText = document.createTextNode("Remaining: ");
    var remainingSpan = document.createElement("span");
    remainingSpan.className = "remaining";
    infoRow.appendChild(remainingText);*/
    //setting up mineboard
    for(j=0;j<endJ;j++){
        for(i = 0;i < endI;i++){
            var col = document.createElement("div");
            col.className = "col-lg-1";
            col.id = "block"+i+"-"+j;
            var button = document.createElement("button");
            button.className = "gameButton";
            button.id = "button"+i+"-"+j;
            button.onclick = function(){
                if(!ended){
                    if(!started){
                        startGame(this.id);
                    } else {
                        if(this.getAttribute("disabled") != "disabled"){
                            open(this.id);
                        }
                    }
                }
            }
            button.oncontextmenu = function(){
                if(!ended){
                    if(!started){
                        startGame();
                    }
                    if(this.getAttribute("disabled")!="disabled"){
                        if(!this.classList.contains("flaged")){
                            if(parseInt(remainingSpan.textContent) > 0){this.classList.add("flaged");
                            this.innerHTML = '<img src="assets/flag.png" width="100%" height="100%" />';
                            setRemainder(false);}
                        } else {
                            this.classList.remove("flaged");
                            this.innerHTML = "";
                            setRemainder(true);
                        }
                    }
                }
                return false;
            }
            gameRow.append(col);
            col.append(button);
        }
    }
    row.append(infoRow);
    row.append(gameRow);
    console.log("$"+document.querySelector(".gameButton"));
    document.querySelector(".remaining").textContent = document.querySelector(".gameButton").length;
}

function startGame(id) {
    started = true;
    setMines(id);
    if(id!=undefined){
        open(id);
    }
}

function getDiv(id, id2){
    if(id2!=undefined){
        return document.querySelector("#block" + id + "-" + id2);
    } else {
        return document.querySelector("#block" + getI(id) + "-" + getJ(id));
    }
}

function getButton(id, id2){
    if(id2!=undefined){
        return document.querySelector("#button"+ id + "-" + id2);
    } else {
        return document.querySelector("#button" + getI(id) + "-" + getJ(id));
    }
}

function surroundingMines(id, id2){
    var eye,jay;
    var num = 0;
    if(id2!=undefined){
        eye = parseInt(id);
        jay = parseInt(id2);
    } else {
        eye = parseInt(getI(id));
        jay = parseInt(getJ(id));
    }
    for(var y = -1;y < 2;y++){
        for(var x = -1;x < 2;x++){
            if(Math.abs(x)+Math.abs(y)!=0 && hasMine(eye + x, jay + y)){
                num++;
            }
        }
    }
    return num;
}

function openSurroundings(id, id2){
    var eye,jay;
    if(id2!=undefined){
        eye = parseInt(id);
        jay = parseInt(id2);
    } else{
        eye = parseInt(getI(id));
        jay = parseInt(getJ(id));
    }
    for(var y = -1;y < 2;y++){
        for(var x = -1;x < 2;x++){
            if(Math.abs(x)+Math.abs(y)!=0){
                if(getButton(eye+x, jay+y)){
                    if(getButton(eye+x, jay+y).getAttribute("disabled")!="disabled"){
                        console.log("checking id #button"+(eye+x)+"-"+(jay+y));
                        open(eye+x, jay+y);
                    }
                }
            }
        }
    }
}

function hasMine(id, id2){
    var button = getButton(id,id2);
    if(button){
        return button.hasAttribute("hasMine");
    } else {
        return false;
    }
}

function surroundingFlags(id, id2){
    var eye,jay;
    var num = 0;
    if(id2!=undefined){
        eye = parseInt(id);
        jay = parseInt(id2);
    } else {
        eye = parseInt(getI(id));
        jay = parseInt(getJ(id));
    }
    for(var y = -1;y < 2;y++){
        for(var x = -1;x < 2;x++){
            if(Math.abs(x)+Math.abs(y)!=0 && getButton(eye + x, jay + y)){
                if(getButton(eye + x, jay + y).classList.contains("flaged")){
                    num++;
                }
            }
        }
    }
    return num;
}

function open(id, id2){
    var button, surroundings;
    if(id2!=undefined){
        button = getButton(id,id2);
    }else{
        button = getButton(id);
    }
    if(button.getAttribute("disbled")!="disabled" && !button.classList.contains("flaged")){
        button.setAttribute("disabled","disabled");
        if(button.hasAttribute("hasMine")){
            //button.textContent = "MINE";
            button.innerHTML = '<img src="assets/mine.gif" width="100%" height="auto" />';
            lose(getI(button.id),getJ(button.id));
        } else {
            surroundings = surroundingMines(button.id);
            if(surroundings > 0){
                var newDiv = document.createElement("div");
                newDiv.style.weight = "100%";
                newDiv.style.height = "100%";
                newDiv.className = "clicked";
                newDiv.textContent = surroundingMines(button.id);
                newDiv.ondblclick = function(){
                    if(surroundingFlags(button.id) >= newDiv.textContent){
                        openSurroundings(button.id);
                    } else {
                        //alert("not enough!");
                    }
                }
                button.append(newDiv);
            } else {
                openSurroundings(button.id);
            }
        }
    }
}

function getI(id){
    // if(id.includes("_")){
    //     return id.split("_")[0];
    // }
    // if(id.includes("-")){
    //     return id.split("-")[0];
    // }
    //console.log("i:"+id.split(/block|button|-/)[1])
    return id.split(/block|button|-/)[1];
}

function getJ(id){
    // if(id.includes("_")){
    //     return id.split("_")[1];
    // }
    // if(id.includes("-")){
    //     return id.split("-")[1];
    // }
    //console.log("j:"+id.split(/block|button|-/)[2])
    return id.split(/block|button|-/)[2];
}

function setMines(id, id2){
    console.log(id + "space" + id2)
    var potentialI, potentialJ, eye, jay;
    if(id2!=undefined){
        eye = parseInt(id);
        jay = parseInt(id2);
    } else {
        if(id!=undefined){
            eye = parseInt(getI(id));
            jay = parseInt(getJ(id));
        } else {
            eye = "eve";
            jay = "jay";
        }
    }
    numberOfMines = Math.ceil(Math.random()*mineParameter);
    setRemainder();
    for(var k = 0;k < numberOfMines;k++){
        potentialI = Math.floor(Math.random()*endI);
        potentialJ = Math.floor(Math.random()*endJ);
        if(hasMine(potentialI,potentialJ) || (potentialI == eye && potentialJ == jay)){
            k--;
        } else {
            var button = getButton(potentialI,potentialJ);
            button.setAttribute("hasMine","true");
        }
    }
}

function lose(id, id2){
    ended = true;
    started = false;
    var eye, jay;
    for(jay = 0;jay < endJ;jay++){
        for(eye = 0;eye < endI;eye++){
            var button = getButton(eye, jay);
            if(button.getAttribute("hasMine")==="true" && !button.classList.contains("flaged")){
                if(!(eye==id && jay==id2)){
                    var minePic = document.createElement("img");
                    minePic.setAttribute("src","assets/mine.gif");
                    minePic.style.width = "100%";
                    minePic.style.height = "auto";
                    button.append(minePic);
                }
            }
        }
    }
}

function setRemainder(increment){
    var remainingSpan = document.querySelector(".remaining");
    if(remainingSpan.textContent.length < 1){
        remainingSpan.textContent = numberOfMines;
    } else {
        if(increment){
            remainingSpan.textContent = parseInt(remainingSpan.textContent) + 1;
        } else {
            remainingSpan.textContent = parseInt(remainingSpan.textContent) - 1;
        }
    }
}