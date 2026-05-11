const FPS = 100;
const SECONDSBETWEENFRAMES = 1 / FPS;
var canvas = null;
var context2D = null;
var canvasWidth = 800;
var canvasHeight = 700;
var mouseX = 400;
var mouseY = 300;

var ace = new Ace();
var stars = new Array();

var textik = new Textik();

var menu = new Menu();

var keys = new Array();

var hiScore;

var stage = 1;
var stages = new Array();

var gameover = false;

//window.addEventListener("load", init, false);
window.onload = init;
window.onunload = stopMusic;
//setTimeout('playMusic(soundname,false);',200);

function init()
{
  canvas = document.getElementById('canvas');
  canvas.style.position = "relative";
  //canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.setAttribute("width", 800);//window.innerWidth);
  canvas.setAttribute("height", 700);//window.innerHeight);
  canvas.addEventListener("mousedown", canvasMouseDown, false);
  document.onkeydown = function(event)
  {           
    if(event == null)
      canvasKeyDown(window.event);      
    else
      canvasKeyDown(event);
    return false;
  }
  document.onkeyup = function(event){canvasKeyUp(event); return false;}
  document.onkeypress = function(event){canvasKeyPress(event); return false;}
  context2D = canvas.getContext('2d');
  
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  
  keys.push(0);
  keys.push(0);
  keys.push(0);
  keys.push(0);
  keys.push(0);
  keys.push(0);
  
  for(i=0; i<50; i++)
  {
    stars[i] = new OldStar();
    stars[i].init();
  }
  stars.push(new Stars());
  stars[stars.length-1].init(100, 0.2);

  ace.init(canvas.width/2, canvas.height+100);
  
  stage = stages.length-1;
  for(var i=0; i<stages.length; i++)
  {
    if(stages[i].win == false)
    {
      stage = i;
      break;
    }
  }

  setInterval(draw, SECONDSBETWEENFRAMES * 1000);
  canvas.focus();
}

// createMusic(cjpath+'omgwormhole.ogg');
// audios[audios.length-1].play();


var lastTime = -1;
var lastTime2 = -1;
var frames = 0;
var fps = 0;
var distance = 0;
var details = true;

function draw()
{
  context2D.clearRect(0, 0, canvas.width, canvas.height);
    
  context2D.save();
    
  context2D.fillStyle = "#000000";
  context2D.fillRect(0, 0, canvas.width-1, canvas.height-1);
  	
  if(!imagesLoaded)
  {
    var numLoaded = imagesComplete();
    if(numLoaded == images.length)
    {
      imagesLoaded = true;
    }
    else
    {
      context2D.fillStyle = "#ffffff";
      context2D.font = '600 40px monospace';
      context2D.fillText("LOADING", (canvas.width-context2D.measureText("LOADING").width)/2, canvas.height/2-40);  
      context2D.fillRect(0, canvas.height/2, canvas.width*(numLoaded/images.length), 40);
      return;
    }
  }

  var t = new Date().getTime();
  var mspf = 0;
  if(lastTime != -1)
    mspf = t - lastTime;
  distance += starSpeedControl ? mspf : mspf*starSpeed;
  lastTime = t;
  frames++;
  if(lastTime2 == -1)
    lastTime2 = t;
  if(t > lastTime2+1000)
  {
    fps = Math.round(frames * (t - lastTime2)/1000);    
    if(details && fps < 25)    
      details = false;
    lastTime2 = t;
    frames=0;
  }  
  if(details)
    context2D.fillStyle = "#ffffff";    
  else
    context2D.fillStyle = "#ff0000";    
  context2D.font = '10px monospace';
  context2D.globalAlpha = 0.5;
  context2D.fillText(fps+" fps", 2, 10);
  context2D.globalAlpha = 1;

  for(var i=0; i< (details ? stars.length : stars.length-1); i++)
    stars[i].draw(context2D, mspf);

  for(var i=0; i<bonus.length; i++)
    bonus[i].draw(context2D, mspf);    

  for(var e=0; e<enemies.length; e++)
    enemies[e].draw(context2D, mspf);
  
  for(var i=0; i<friends.length; i++)
    friends[i].draw(context2D, mspf);

  if(ace.hull > 0)
    ace.draw(context2D, mspf);

  for(var i=0; i<debris.length; i++)
    debris[i].draw(context2D, mspf);    

  for(i=0; i<plasma.length; i++)
    plasma[i].draw(mspf);
  for(i=0; i<plasma.length; i++)
    plasma[i].testOut();
    
  for(var i=0; i<missiles.length; i++)
    missiles[i].draw(context2D, mspf);    

  textik.draw(context2D, mspf);

  // Hit Test
  for(var s=0; s<shots.length; s++)
  {
    for(var e=0; e<enemies.length; e++)
    {
      var ePower = enemies[e].power;
      if(s<shots.length && enemies[e].hitRect(shots[s].posX-shots[s].frameWidth/2, shots[s].posY-shots[s].frameHeight/2, shots[s].frameWidth, shots[s].frameHeight, shots[s].power))
      {
        explosionAdd(shots[s].posX, shots[s].posY, 0.6);
        if(ePower < shots[s].power)
        {
          ace.addScore(ePower);
          shots[s].power -= ePower;
        }
        else
        {
          var scale = shots[s].power/20;
          if(scale > 1)
            scale = 1;
          ace.addScore(shots[s].power);
          shotRemove(shots[s].index);
        }
      }
    }
    for(var d=0; d<debris.length; d++)
    {
      var ePower = debris[d].power;
      if(debris[d].hitRect(shots[s].posX-shots[s].frameWidth/2, shots[s].posY-shots[s].frameHeight/2, shots[s].frameWidth, shots[s].frameHeight, shots[s].power))
      {
        explosionAdd(shots[s].posX, shots[s].posY, 0.6);
        if(ePower < shots[s].power)
        {
          ace.addScore(ePower);
          shots[s].power -= ePower;
        }
        else
        {
          ace.addScore(shots[s].power);
          shotRemove(shots[s].index);
        }
      }
    }
    for(var f=0; f<friends.length; f++)
    {                                    
      var ePower = friends[f].power;
      if(friends[f].hitRect(shots[s].posX-shots[s].frameWidth/2, shots[s].posY-shots[s].frameHeight/2, shots[s].frameWidth, shots[s].frameHeight, shots[s].power))
      {
        explosionAdd(shots[s].posX, shots[s].posY, 0.6);
        if(ePower < shots[s].power)
        {
          ace.addScore(-ePower);
          shots[s].power -= ePower;
        }
        else
        {
          ace.addScore(-shots[s].power);
          shotRemove(shots[s].index);
        }
      }
    }
  }
  if(ace.hull > 0)
  {
    var aceRadius=30;
    if(ace.fire2Time > 0)
       aceRadius = 32 + 304 * ace.fire2Time*ace.fire2Time/250000;
    for(var p=0; p<plasma.length; p++)
    {
      if(ace.hitCircle(plasma[p].posX, plasma[p].posY, 7.5, plasma[p].power))
        plasma[p].finish();
    }
    for(var m=0; m<missiles.length; m++)
    {
      if(ace.hitRect(missiles[m].posX-2.5, missiles[m].posY-8, 5, 24, missiles[m].power))
        missiles[m].finish();
    }                
    for(var f=0; f<friends.length; f++)
    {
      ace.hitObject(friends[f]);
    }
    for(var e=0; e<enemies.length; e++)
    {
      ace.hitObject(enemies[e]);
    }
    for(var d=0; d<debris.length; d++)
    {
      ace.hitObject(debris[d]);
    }
    for(var b=0; b<bonus.length; b++)
    {
      bonus[b].hitCircle(ace.posX, ace.posY-2, 32/*aceRadius*/);
    }
  }
  ace.scoreAdd = false;
  for(var f=0; f<friends.length; f++)
    for(var e=0; e<enemies.length; e++)    
    {      
      if(friends[f].hitUfo(enemies[e]))
        break;
    }
  for(var f=0; f<friends.length; f++)
    for(var d=0; d<debris.length; d++)
    {
      if(friends[f].hitUfo(debris[d]))
        break;
    }
  for(var f=0; f<friends.length; f++)
    for(var d=0; d<debris.length; d++)
    {
      if(friends[f].hitUfo(debris[d]))
        break;
    }
  for(var f=0; f<friends.length; f++)
    for(var p=0; p<plasma.length; p++)
    {
      if(friends[f].hitCircle(plasma[p].posX, plasma[p].posY, 7.5, plasma[p].power))
        plasma[p].finish();
    }
  for(var e1=0; e1<enemies.length; e1++)
  {                                    
    for(var e2=e1+1; e2<enemies.length; e2++)    
    {      
      if(enemies[e2].hitUfo(enemies[e1]))
      {      
        //e1--;
        break;
      }
    }
  }
  ace.scoreAdd = true;

/*    context2D.beginPath();
    context2D.moveTo(500, 100);
    context2D.lineTo(200, 100);
    context2D.lineTo(300, 300);
    context2D.quadraticCurveTo(400, 300, 500, 200);
    context2D.quadraticCurveTo(600, 500, 300, 400);
    context2D.closePath();
    context2D.fillStyle = "#888888";
    context2D.fill();*/

  menu.draw(mspf);
  
  context2D.restore();
}

function canvasMouseDown(event)
{
  var mouseX, mouseY;
  if (event.layerX || event.layerX == 0)
  { // Firefox
    mouseX = event.layerX;
    mouseY = event.layerY;
  } else if (event.offsetX || event.offsetX == 0)
  { // Opera
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  }  
  
  if(menu.mouseDown(mouseX, mouseY))
    return;
}

function canvasKeyPress(event)
{
  event.stopPropagation();
  event.preventBubble();
}

function canvasKeyDown(event)
{
  if(menu.keyDown(event))
    return;
  //alert(event.keyCode);
  if(keys[0] == 0 && (event.keyCode == 37 || event.keyCode == 65 || event.keyCode == 100) || event.keyCode == keys[0])
    ace.left = 1;                                               
  if(keys[1] == 0 && (event.keyCode == 39 || event.keyCode == 68 || event.keyCode == 102) || event.keyCode == keys[1])
    ace.right = 1;                                              
  if(keys[2] == 0 && (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 104) || event.keyCode == keys[2])
    ace.up = 1;                                                 
  if(keys[3] == 0 && (event.keyCode == 40 || event.keyCode == 83 || event.keyCode == 101) || event.keyCode == keys[3])
    ace.down = 1;
  if(keys[4] == 0 && (event.keyCode == 17 || event.keyCode == 32 || event.keyCode == 18) || event.keyCode == keys[4])
    ace.fire1 = 1;
  if(keys[5] == 0 && event.keyCode == 16 || event.keyCode == keys[5])
    ace.fire2 = 1;
}

function canvasKeyUp(event)
{
  if(menu.keyUp(event))
    return;
  
  if(keys[0] == 0 && (event.keyCode == 37 || event.keyCode == 65 || event.keyCode == 100) || event.keyCode == keys[0])
    ace.left = 0;                                               
  if(keys[1] == 0 && (event.keyCode == 39 || event.keyCode == 68 || event.keyCode == 102) || event.keyCode == keys[1])
    ace.right = 0;                                              
  if(keys[2] == 0 && (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 104) || event.keyCode == keys[2])
    ace.up = 0;                                                 
  if(keys[3] == 0 && (event.keyCode == 40 || event.keyCode == 83 || event.keyCode == 101) || event.keyCode == keys[3])
    ace.down = 0;
  if(keys[4] == 0 && (event.keyCode == 17 || event.keyCode == 32 || event.keyCode == 18) || event.keyCode == keys[4])
    ace.fire1 = 0;
  if(keys[5] == 0 && event.keyCode == 16 || event.keyCode == keys[5])
    ace.fire2 = 0;
}
