var shots = new Array();

function shotRemove(index)
{
  if(shots.length <= index)
  {
    alert("shotRemove");
    return;
  }
  shots.splice(index, 1);
  for(var i=index; i<shots.length; i++)
    shots[i].index -= 1;
}

var plasma = new Array();

function plasmaRemove(index)
{
  if(plasma.length <= index)
  {
    alert("plasmaRemove");
    return;
  }
  plasma.splice(index, 1);
  for(var i=index; i<plasma.length; i++)
    plasma[i].index -= 1;
}

var missiles = new Array();

function missileRemove(index)
{
  if(missiles.length <= index)
  {
    alert("missileRemove");
    return;
  }
  missiles.splice(index, 1);
  for(var i=index; i<missiles.length; i++)
    missiles[i].index -= 1;
}

function Shot()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 800;

  this.velX = 0;
  this.velY = -8;

  this.power = 10;
  
  this.currentFrame = 0;
  this.frameWidth = 5;
  this.frameHeight = 22;
  
  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
  }
  
  this.draw = function(context2D, mspf)
  {
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/40;
    if(this.currentFrame>=2)
      this.currentFrame = 0;
    
    context2D.drawImage(images[imgShot1], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
    
//    context2D.globalAlpha = 0.5;
//    context2D.fillStyle='#ff0000';
//    context2D.fillRect(this.posX-1.5, this.posY-10, 3, 20);
//    context2D.globalAlpha = 1;

    if(this.posY < -10)
      shotRemove(this.index);
  }
}

function Plasma()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 800;

  this.velX = 0;
  this.velY = 2;
  
  this.scale = 1;
  this.scaleD = -0.05;

  this.power = 20;
  
  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
  }
  
  this.draw = function(mspf)
  {
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);
    
    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.scale(this.scale, this.scale);
    context2D.globalAlpha = this.scale;
    context2D.drawImage(images[imgPlasma], -7.5, -7.5);
    context2D.globalAlpha = 1;
    context2D.restore();
    
    this.scale += this.scaleD;
    if(this.scale >= 1 || this.scale <= 0.8)
      this.scaleD = -this.scaleD;
  }

  this.testOut = function()
  {
    if(this.posX < -7.5 && this.velX <= 0 ||
       this.posY > canvas.height+7.5 && this.velY >= 0 ||
       this.posX > canvas.width+7.5 && this.velX >= 0 ||
       this.posY < -7.5 && this.velY <= 0)
      plasmaRemove(this.index);
  }

  this.finish = function()
  {
    explosionAdd(this.posX, this.posY, 0.5);
    plasmaRemove(this.index);
  }
}

function Missile()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 800;

  this.velX = 0;
  this.velY = 6;

  this.currentFrame = 0;
  this.frameWidth = 5;
  this.frameHeight = 32;  
  
  this.power = 20;
  
  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
  }
  
  this.draw = function(context2D, mspf)
  {
    try
    {  
      this.posX += this.velX*(mspf/30);      
      this.posY += this.velY*(mspf/30);      
      this.velX /= 1+mspf/400;
      this.velY += mspf/200;
      
      var frame = Math.floor(this.currentFrame);
      this.currentFrame += mspf/40;
      if(this.currentFrame>=6)
        this.currentFrame = 0;
      
      context2D.drawImage(images[imgMissile1], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
      if(this.posY > canvas.height+16)
        missileRemove(this.index);
    }
    catch(err)
    {
      alert(context2D + " " + images[imgPlasma] + " " + this.posX + " " + this.posY);
    }
  }
  
  this.finish = function()
  {
    explosionAdd(this.posX, this.posY, 0.8);
    missileRemove(this.index);
  }
}

function Missile2()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 800;

  this.velX = 0;
  this.velY = 6;

  this.currentFrame = 0;
  this.frameWidth = 5;
  this.frameHeight = 32;  
  
  this.power = 10;
  
  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
  }
  
  this.draw = function(context2D, mspf)
  {
    try
    {  
      this.posX += this.velX*(mspf/30);      
      this.posY += this.velY*(mspf/30);      
      
      var frame = Math.floor(this.currentFrame);
      this.currentFrame += mspf/40;
      if(this.currentFrame>=6)
        this.currentFrame = 0;
      
      if(this.velY > 0)
        context2D.drawImage(images[imgMissile2], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
      else
        context2D.drawImage(images[imgMissile3], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
      if(this.posY > canvas.height+16 || this.posY < -16)
        missileRemove(this.index);
    }
    catch(err){alert(err);}
  }
  
  this.finish = function()
  {
    explosionAdd(this.posX, this.posY, 0.5);
    missileRemove(this.index);
  }
}
