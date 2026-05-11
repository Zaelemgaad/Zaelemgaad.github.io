function Miner()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 300;

  this.velX = 1;
  this.velY = 1;

  this.dirX = 0.1;
  this.dirY = 0.1;
  
  this.currentFrame = 0;
  this.frameD = 1;
  this.frameWidth = 30;
  this.frameHeight = 42;

  this.spoonTyp = 1;
  this.spoonImg = imgMinerSpoon1;
  this.spoonFrame = 0;
  this.spoonD = 1;
  this.spoonWidth = 32;
  this.spoonHeight = 26;

  this.power = 30;

  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
    var r = Math.random();
    if(r > 0.75)
    {
      this.spoonTyp = 3;
      this.spoonImg = imgMinerSpoon3;
      this.spoonWidth = 30;
      this.spoonHeight = 24;
    }
  }
  
  this.draw = function(context2D, mspf)
  {
    var aX = ace.posX - this.posX;
    var aY = ace.posY - this.posY;
    var norm = Math.sqrt(aX*aX+aY*aY)*mspf;
	if (norm > 0.001)
	{
		aX /= norm;
		aY /= norm;
		this.velX += aX;
		this.velY += aY;
	}
    norm = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
    if(norm > 7)
    {
      this.velX /= norm;
      this.velY /= norm;
      this.velX *= 7;
      this.velY *= 7;
    }
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);
    
    var dx = -this.velX;
    var dy = this.velY;
    norm = Math.sqrt(dx*dx+dy*dy);
    this.dirX = this.velX / norm;
    this.dirY = this.velY / norm;
    var rot = -Math.atan2(this.velX, this.velY);
      
    var frame = Math.floor(this.currentFrame);
    if(frame < 0) frame = 0;
    else if(frame > 2) frame = 2;
    this.currentFrame += this.frameD*mspf/30;
    if(this.currentFrame>=3)
    {
      this.currentFrame = 3;
      this.frameD = -this.frameD;
    }
    if(this.currentFrame<=0)
    {
      this.currentFrame = 0;
      this.frameD = -this.frameD;
    }

    var spoonFrame = Math.floor(this.spoonFrame);
    if(spoonFrame < 0) spoonFrame = 0;
    if(this.spoonTyp == 1)
    {
      if(spoonFrame > 10) spoonFrame = 10;
      this.spoonFrame += this.spoonD*mspf/30;
      if(this.spoonFrame>=11) this.spoonD = -3;
      if(this.spoonFrame<=0) this.spoonD = 1;
    }
    else if(this.spoonTyp == 3)
    {
      if(spoonFrame > 5) spoonFrame = 5;
      this.spoonFrame += mspf/30;
      if(this.spoonFrame>=6)
        this.spoonFrame = 0;
    }

    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.rotate(rot);
    context2D.drawImage(images[imgMiner], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.translate(0, 32);
    context2D.drawImage(images[this.spoonImg], spoonFrame * this.spoonWidth, 0, this.spoonWidth, this.spoonHeight, -this.spoonWidth/2, -this.spoonHeight/2, this.spoonWidth, this.spoonHeight);
    context2D.restore();
  }
    
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX+this.dirX*10, this.posY+this.dirX*10, 18, this.power))
    {
      var dx = ufo.posX-this.posX;
      var dy = ufo.posY-this.posY;
      norm = Math.sqrt(dx*dx+dy*dy);
      dx /= norm;
      dy /= norm;
      var dist=0.5*Math.sqrt((dx-this.dirX)*(dx-this.dirX)+(dy-this.dirY)*(dy-this.dirY));
      this.power -= ePower*dist;
      if(this.power <= 0)      
        this.finish();
      return true;
    }
    return false;
  }  

  this.hitRect = function(x, y, w, h, power)
  {
    if(hitRectCircle(x, y, w, h, this.posX+this.dirX*10, this.posY+this.dirX*10, 18))
    {
      var normVel = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
//      var dx = x+w/2-this.posX;
//      var dy = y+h/2-this.posY-10;
      var dx = ace.posX-this.posX;
      var dy = ace.posY-this.posY;
      norm = Math.sqrt(dx*dx+dy*dy);
      dx /= norm;
      dy /= norm;
      var dist=0.5*Math.sqrt((dx-this.dirX)*(dx-this.dirX)+(dy-this.dirY)*(dy-this.dirY));
      if(dist > 0.5)
      {
        this.power -= power;
        if(this.power <= 0)
          this.finish();
      }
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(hitCircleCircle(x, y, r, this.posX+this.dirX*10, this.posY+this.dirX*10, 18))
    {
      var normVel = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
      var dx = x-this.posX;
      var dy = y-this.posY;
      norm = Math.sqrt(dx*dx+dy*dy);
      dx /= norm;
      dy /= norm;
      var dist=0.5*Math.sqrt((dx-this.dirX)*(dx-this.dirX)+(dy-this.dirY)*(dy-this.dirY));
      if(dist > 0.5)
      {
        this.power -= power;
        if(this.power <= 0)
          this.finish();
      }
      return true;
    }
    return false;
  }
  this.finish = function()
  {
    stonesAdd(this.posX, this.posY, this.velX, this.velY, 16, 6);
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 16, 6);
    explosionsAdd(this.posX, this.posY, 16, 8);    
    ace.addScore(200);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
