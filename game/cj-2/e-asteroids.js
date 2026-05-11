function Asteroid()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = -32;

  this.velX = 0;
  this.velY = 0;
  
  this.img = imgAsteroid4;
  this.currentFrame = 0;
  this.rotace = 1;
  this.frameWidth = 64;
  this.frameHeight = 64;
  this.radius = 28;
  
  this.power = 80;
  this.score = 50;

  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
    this.rotace = (-0.5+Math.random())*3;
    switch(Math.round(Math.random()*3))
    {
    case 0:
      this.img = imgAsteroid1;
      this.frameWidth = 24;
      this.frameHeight = 24;
      this.radius = 10;
      this.power = 30;
      this.score = 30;
      this.rotace *= 4;
      break;
    case 1:
      this.img = imgAsteroid2;
      this.frameWidth = 32;
      this.frameHeight = 32;
      this.radius = 14;
      this.power = 50;
      this.score = 40;
      this.rotace *= 2;
      break;
    case 2:
      this.img = imgAsteroid3;
      break;
    default:
    }
  }
  
  this.draw = function(context2D, mspf)
  {

try{
    this.posX += this.velX*(mspf/30);
    this.posY += (starSpeed+this.velY)*(mspf/30);
    
    if(this.posY-this.frameHeight > canvasHeight && this.velY > 0 ||
       this.posY+this.frameHeight < 0 && this.velY < 0 ||
       this.posX-this.frameWidth > canvasWidth && this.velX > 0 ||
       this.posX+this.frameWidth < 0 && this.velX < 0)
    {
      enemyRemove(this.index);
      return;
    }
    
    var frame = Math.round(this.currentFrame);
    if(frame < 0)
      frame = 35+frame;
    this.currentFrame += this.rotace*mspf/100;
    if(this.currentFrame>35 || this.currentFrame<-35)
      this.currentFrame = 0;
      
    context2D.drawImage(images[this.img], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
}catch(err)
{
alert(err);
}
  }
    
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY, this.radius, this.power))
    {                            
      this.power -= ePower;
      if(this.power <= 0)      
        this.finish();
      return true;
    }
    return false;
  }  

  this.hitRect = function(x, y, w, h, power)
  {
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, this.radius))
    {
      this.power -= power;
      if(this.power <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(hitCircleCircle(x, y, r, this.posX, this.posY, this.radius))
    {
      this.power -= power;
      if(this.power <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  this.finish = function()
  {
    if(ace.scoreAdd && Math.random() < this.radius/64)
      bonusAdd(this.posX, this.posY, this.velX, this.velY);
    stonesAdd(this.posX, this.posY, this.velX, this.velY, this.radius, Math.round(this.radius));
    ace.addScore(this.score);
    enemyRemove(this.index);    
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
