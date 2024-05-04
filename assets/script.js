var body = document.querySelector("body");
var row = document.querySelector(".row");
var numberOfMines = 20;
var startButton = document.querySelector("#start");
var i, j; //these are the variables used for the double array and ids
var started = false;
startButton.onclick = function(){
    setBoard();
}
function setBoard() {
    row.innerHTML = "";
    for(j=0;j<8;j++){
        for(i = 0;i < 12;i++){
            var col = document.createElement("div");
            col.className = "col-lg-1";
            col.id = "block"+i+"-"+j;
            var button = document.createElement("button");
            button.className = "gameButton";
            button.id = "button"+i+"-"+j;
            button.onclick = function(){
                if(!started){
                    startGame(this.id);
                    setMines(this.id);
                    open(this.id);
                } else {
                    open(this.id);
                }
            }
            row.append(col);
            col.append(button);
        }
    }
}

function startGame(id) {
    started = true;
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
        for(var x = -1;x < 1;x++){
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

function open(id, id2){
    var button, surroundings;
    if(id2!=undefined){
        button = getButton(id,id2);
    }else{
        button = getButton(id);
    }
    if(button.getAttribute("disbled")!="disabled"){
        button.setAttribute("disabled","disabled"); 
        if(button.hasAttribute("hasMine")){
            button.textContent = "MINE";
        } else {
            surroundings = surroundingMines(button.id);
            if(surroundings > 0){
                button.textContent = surroundingMines(button.id);
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
    var num, potentialI, potentialJ, eye, jay;
    if(id2!=undefined){
        eye = parseInt(id);
        jay = parseInt(id2);
    } else {
        eye = parseInt(getI(id));
        jay = parseInt(getJ(id));
    }
    num = Math.ceil(Math.random()*numberOfMines);
    for(var k = 0;k < num;k++){
        potentialI = Math.floor(Math.random()*i);
        potentialJ = Math.floor(Math.random()*j);
        if(hasMine(potentialI,potentialJ) || (potentialI == eye && potentialJ == jay)){
            k--;
        } else {
            var button = getButton(potentialI,potentialJ);
            button.setAttribute("hasMine","true");
        }
    }
}