stages.push(new Stage2());

function Stage2()
{
  this.name = "Wormhole";
  this.id = "wormhole";
  this.img = imagesPush(cjpath+"stage2.png");
  this.musicIndex = createMusic(cjpath+"omgasteroidsloop.ogg");
  this.win = false;
  this.brief = ["Our ships were lost on the way through a nearby wormhole.       ",
                "Find out what happened to them and make the wormhole safe again."];

  this.start = function()
  {
    stage2();
    audios[this.musicIndex].play();
  }

  this.drawBrief = function()
  {
    context2D.globalAlpha = 0.6;
    context2D.fillStyle = "#aaaaaa";
    context2D.font = '900 12px monospace';
    for(var i=0; i<this.brief.length; i++)
      context2D.fillText(this.brief[i], (canvas.width-context2D.measureText(this.brief[i]).width)/2, 405+i*17);
    context2D.globalAlpha = 1;
  }
}

var hole = new Hole();

function stage2()
{
  asteroids = 1;
  addAsteroids();
  setTimeout("addWings()", 3000);
  setTimeout("stage21()", 40000);
}
function stage21()
{
  wings = false;
  asteroids = 0;
  if(gameover)
    return;
  textik.text1 = "Entering";
  textik.text2 = "Worm Hole";
  textik.time = 2000;
  enemies.push(hole);
  enemies[enemies.length-1].init(enemies.length-1);
  stage22();
}
function stage22()
{
  if(gameover)
  {
    hole.acc = -0.2;
    return;
  }
  if(distance > 100000)
  {
    hole.acc = -0.2;
    for(var a=0; a<=12; a++)
    {
      enemies.push(new Mine2());
      enemies[enemies.length-1].init(enemies.length-1, canvas.width/2+300*Math.cos(a*pi/12), -16-300*Math.sin(a*pi/12), 0, 10);
      enemies[enemies.length-1].currentFrame = a/2;
    }
    stage23();
  }
  else
  {
    enemies.push(new WingReverse());
    if(hole.velY != 20 || Math.random() < 0.8)
      enemies[enemies.length-1].init(enemies.length-1, hole.posX[hole.posX.length-1], -30, -6);
    else
      enemies[enemies.length-1].init(enemies.length-1, hole.posX[0], canvas.height+30, -11);
    setTimeout("stage22()", 1000+Math.random()*4000);
  }
}
function stage23()
{
  if(gameover)
    return;
  if(enemies.length == 0 && plasma.length == 0 && missiles.length == 0)
    gameover = true;
  else
    setTimeout("stage23()", 500);
}

var wings = true;
function addWings()
{
  if(gameover || !wings)
    return;
  var y = -32;
  var x = 32+Math.random()*(canvas.width-64);
  enemies.push(new Wing());
  enemies[enemies.length-1].init(enemies.length-1, x, y, 0, 3);
  if(Math.random() < 0.15)
  {
    var amp = 30+Math.random()*100;
    var y = -32;
    var x = amp+24 + Math.random()*(canvas.width-2*amp-48);
    var per =  300+Math.random()*500;
    for(var i=0; i<3; i++)
    {
      enemies.push(new Ufo());
      enemies[enemies.length-1].init(enemies.length-1, x, y, 4, amp, per);
      y -= 100;
    }
  }
  setTimeout("addWings()", Math.random()*3000);
}

function Hole()
{
  this.index = 0;
                    
  this.posX = new Array();
  this.posY = -68;
  this.scale = new Array();

  this.velY = 2;
  this.acc = 0.1;

  this.frameWidth = 400;
  this.frameHeight = 68;

  this.power = 3;

  this.targetX = 500;
  this.targetScale = 0.5;
  this.velX = 0;
  this.velScale = 0;
    
  this.init = function(index)
  {        
    this.index = index;
    for(var i=0; i<18; i++)
    {
      this.posX.push(canvas.width/2);
      this.scale.push(1.3-0.02*i);
    }
    this.targetX = 100+Math.random()*(canvas.width-200);
    starSpeedControl = true;
  }
  
  this.draw = function(context2D, mspf)
  {
    if(debris.length > 0)
      debris[0].power = 0;
    this.velY += this.acc*(mspf/30)
    if(this.velY > 20)
      this.velY = 20;
    if(this.velY < 0)
    {
      enemyRemove(this.index);
      starSpeedControl = false;
      starSpeed = 1;
      return;
    }
/*    if(this.posY < 700)
      this.velY = 5 + 15*(this.posY/700)*(this.posY/700);
    else
      this.velY = 20;*/
    starSpeed = 1+(this.velY-2)/2;
    if(starSpeed < 1)
      starSpeed = 1;
    this.posY += this.velY*(mspf/30);
    this.power = starSpeed/3;
    
    if(this.posY > canvas.height)
    {
      this.posY -= 40;
      this.posX.splice(0, 1);
      this.scale.splice(0, 1);
      
      this.velScale += this.scale[this.scale.length-1] < this.targetScale ? 0.008 : -0.008;
      if(this.velScale > 0.03)
        this.velScale = 0.03;
      if(this.velScale < -0.03)
        this.velScale = -0.03;
      this.scale.push(this.scale[this.scale.length-1]+this.velScale);
      if(this.scale[this.scale.length-1] > this.targetScale && this.scale[this.scale.length-2] <= this.targetScale ||
         this.scale[this.scale.length-1] <= this.targetScale && this.scale[this.scale.length-2] > this.targetScale)
        this.targetScale = 0.4 + Math.random()*0.6;

      var acc = 2;
      if(this.posX[this.posX.length-1] + this.scale[this.scale.length-1]*this.frameWidth/2 > canvas.width - 100)
        acc += (this.posX[this.posX.length-1] + this.scale[this.scale.length-1]*this.frameWidth/2 - (canvas.width - 100)) / 50;
      if(this.posX[this.posX.length-1] - this.scale[this.scale.length-1]*this.frameWidth/2 < 100)
        acc += (100 - (this.posX[this.posX.length-1] - this.scale[this.scale.length-1]*this.frameWidth/2)) / 50;
      this.velX += this.posX[this.posX.length-1] < this.targetX ? acc : -acc;
      if(this.velX > 15)
        this.velX = 15;
      if(this.velX < -15)
        this.velX = -15;
      this.posX.push(this.posX[this.posX.length-1]+this.velX);
      if(this.posX[this.posX.length-1] > this.targetX && this.posX[this.posX.length-2] <= this.targetX ||
              this.posX[this.posX.length-1] <= this.targetX && this.posX[this.posX.length-2] > this.targetX)
        this.targetX = 100+Math.random()*(canvas.width-200);
    }
    
try
{
    context2D.beginPath();
    context2D.moveTo(0, this.posY+40);
    context2D.lineTo(this.posX[0]-this.scale[0]*this.frameWidth/2, this.posY+40);
    for(var i=0; i<this.posX.length-1; i+=2)
    {
      context2D.quadraticCurveTo(this.posX[i]-this.scale[i]*this.frameWidth/2, this.posY-i*40, this.posX[i+1]-this.scale[i+1]*this.frameWidth/2, this.posY-(i+1)*40)
//      context2D.save();
//      context2D.scale(this.scale[i], 1);
//      context2D.drawImage(images[imgHole], this.posX[i]/this.scale[i]-this.frameWidth/2, this.posY-i*40);
//      context2D.restore();
    }
    context2D.lineTo(0, 0);
    context2D.closePath();
    context2D.globalAlpha = this.velY / 30;
    context2D.fillStyle = "#330044";
    context2D.fill();

    context2D.beginPath();
    context2D.moveTo(canvas.width, this.posY+40);
    context2D.lineTo(this.posX[0]+this.scale[0]*this.frameWidth/2, this.posY+40);
    for(var i=0; i<this.posX.length-1; i+=2)
    {
      context2D.quadraticCurveTo(this.posX[i]+this.scale[i]*this.frameWidth/2, this.posY-i*40, this.posX[i+1]+this.scale[i+1]*this.frameWidth/2, this.posY-(i+1)*40)
    }
    context2D.lineTo(canvas.width, 0);
    context2D.closePath();
    context2D.globalAlpha = this.velY / 40;
    context2D.fillStyle = "#330044";
    context2D.fill();
    context2D.globalAlpha = 1;
}
catch(err) {alert(err);}
  }
  
  this.hitUfo = function(ufo)
  {
    if(this.acc < 0)
      return false;
    ufo.hitUfo(this);
    return false;
  }  

  this.hitRect = function(x, y, w, h, power)
  {
    var i=Math.round((this.posY-(y+h/2))/40);
    if(i<0 || i>=this.posX.length)
      return false;
    if((x < this.posX[i] - this.scale[i]*this.frameWidth/2) ||
       (x+w > this.posX[i] + this.scale[i]*this.frameWidth/2))
      return true;
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    var i=Math.round((this.posY-y)/40);
    if(i<0 || i>=this.posX.length)
      return false;
    if((x-r < this.posX[i] - this.scale[i]*this.frameWidth/2) ||
       (x+r > this.posX[i] + this.scale[i]*this.frameWidth/2))
      return true;
    return false;
  }

  this.finish = function()
  {
  }
}
