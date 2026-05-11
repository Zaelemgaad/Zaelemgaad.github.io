function WingReverse()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 300;

  this.velX = 1;
  this.velY = 1;
  this.velYMain = -6;
  
  this.currentFrame = 0;
  this.frameWidth = 32;
  this.frameHeight = 56;

  this.fire = 0;
  this.firePos = 5;
  
  this.power = 20;

  this.init = function(index, posX, posY, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velYMain = velY;
  }
  
  this.draw = function(context2D, mspf)
  {
    this.velY = this.velYMain+hole.velY/2;
    this.posX += this.velX*(mspf/30);
    if(this.posX > canvas.width)
      this.posX = canvas.width;
    if(this.posX < 0)
      this.posX = 0;
    this.posY += this.velY*(mspf/30);

    var i=Math.round((hole.posY-this.posY)/40)+5;
    if(i<0) i=0;
    if(i>=hole.posX.length) i=hole.posX.length-1;
    if(hole.posX[i] < this.posX)
      this.velX -= 20/mspf;
    else
      this.velX += 20/mspf;
    if(this.velX > 10)
      this.velX = 10;
    else if(this.velX < -10)
      this.velX = -10;
    //var xFrom = hole.posX[i] - 100 * hole.scale[i];
      
    this.fire -= mspf;
    if(this.fire < 0 &&
       this.posY > ace.posY && 
       this.posX > ace.posX - 70 &&
       this.posX < ace.posX + 70)
    {
      missiles.push(new Missile2());
      missiles[missiles.length-1].init(missiles.length-1, this.posX+this.firePos, this.posY-16, this.velX/2, -this.velY-5);
      this.firePos = -this.firePos;
      this.fire = 500;
    }
    
    if(this.posY+this.frameHeight+50 < 0 || this.posY-50 > canvasHeight)
      enemyRemove(this.index);
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/30;
    if(this.currentFrame>=2)
      this.currentFrame = 0;
      
    if(this.velX > 2)
      frame += 4;
    if(this.velX < -2)
      frame += 2;
    
    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.rotate(this.velX/50);
    context2D.drawImage(images[imgWing2], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    //context2D.drawImage(images[imgWing], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.restore();
  }
    
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY, 16, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, 16))
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
    if(hitCircleCircle(x, y, r, this.posX, this.posY, 16))
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
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 20, 6);
    explosionsAdd(this.posX, this.posY, 20, 6);    
    ace.addScore(200);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}

function Wing()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 300;

  this.velX = 1;
  this.velY = 1;
  
  this.currentFrame = 0;
  this.frameWidth = 32;
  this.frameHeight = 56;

  this.fire = 0;
  this.firePos = 5;
  
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
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);

    if(this.posY < ace.posY)
    {
      if(ace.posX < this.posX)
        this.velX -= 2/mspf;
      else
        this.velX += 2/mspf;
      if(this.velX > 5)
        this.velX = 5;
      else if(this.velX < -5)
        this.velX = -5;
    }
    else
      this.velX /= 1+mspf/1000;
      
    this.velY = Math.sqrt(49-(this.velX*this.velX));
      
    this.fire -= mspf;
    if(this.fire < 0 &&
       this.posY < ace.posY && 
       this.posX > ace.posX - 100 &&
       this.posX < ace.posX + 100)
    {
      missiles.push(new Missile2());
      missiles[missiles.length-1].init(missiles.length-1, this.posX+this.firePos, this.posY+16, this.velX/2, this.velY+5);
      this.firePos = -this.firePos;
      this.fire = 500;
      //enemies.push(new Mine2());
      //enemies[enemies.length-1].init(enemies.length-1, this.posX, this.posY, this.velX, this.velY);
//      this.fire = 200+Math.random()*800;
    }
    
    if(this.posY-30 > canvasHeight)
      enemyRemove(this.index);
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/30;
    if(this.currentFrame>=2)
      this.currentFrame = 0;
      
    if(this.velX > 2)
      frame += 2;
    if(this.velX < -2)
      frame += 4;
    
    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.rotate(-this.velX/70);
    context2D.drawImage(images[imgWing1], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.restore();
  }
    
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY, 16, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, 16))
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
    if(hitCircleCircle(x, y, r, this.posX, this.posY, 16))
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
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 20, 6);
    explosionsAdd(this.posX, this.posY, 20, 6);    
    ace.addScore(200);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
