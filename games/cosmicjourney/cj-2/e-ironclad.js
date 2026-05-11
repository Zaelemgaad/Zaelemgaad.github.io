function IroncladR()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 300;
  
  this.targetX = -100;
  this.targetY = 400;

  this.velX = 0;
  this.velY = 0;
  
  this.currentFrame = 0;
  this.frameWidth = 96;
  this.frameHeight = 42;

  this.plasma = Math.random()*1000;
  this.plasmaInterval = 1000+Math.random()*2000;

  this.mine = 2000;
  this.mineInterval = 2000;
  
  this.power = 300;

  this.init = function(index, posX, posY, targetX, targetY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.targetX = targetX;
    this.targetY = targetY;
  }
  
  this.draw = function(context2D, mspf)
  {
    var dx = this.targetX - this.posX;
    var dy = this.targetY - this.posY;
    var norm = Math.sqrt(dx*dx+dy*dy);
    dx /= norm;
    dy /= norm;
    var hull = -Math.asin(dy);
    
    this.posX += dx+this.velX*(mspf/30);
    this.posY += dy+this.velY*(mspf/30);
    this.velX /= 1+mspf/200;
    this.velY /= 1+mspf/200;
        
    this.mine -= mspf;
    if(this.mine < 0)
    {
      this.mine = this.mineInterval;
      enemies.push(new Mine());
      enemies[enemies.length-1].init(enemies.length-1, this.posX-this.velX, this.posY-this.velY, -dx*10, -dy*10);
    }

    if(this.posY+this.frameHeight+50 < 0 || this.posY-50 > canvas.height ||
       this.posX+this.frameHeight < 0 || this.posX-this.frameHeight > canvas.width)
      enemyRemove(this.index);
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/60;
    if(this.currentFrame>=4)
      this.currentFrame = 0;
      
    dx = ace.posX - this.posX;
    dy = ace.posY - this.posY;
    norm = Math.sqrt(dx*dx+dy*dy);
    dx /= norm;
    dy /= norm;
    var turret = Math.asin(dy);
    if(dx < 0)
      turret = pi - turret;
    if(turret < 0)
      turret += 2*pi;
    
    this.plasma -= mspf;
    if(this.plasma < 0)
    {
      this.plasma = this.plasmaInterval;
      plasma.push(new Plasma());
      plasma[plasma.length-1].init(plasma.length-1, this.posX+dx*45, this.posY+dy*45, dx*6, dy*6);
      explosionAdd(this.posX+dx*55, this.posY+dy*55, 0.6);
      this.velX += -dx;
      this.velY += -dy;
    }
    
    context2D.save();
      context2D.translate(this.posX, this.posY);
      context2D.save();
        context2D.rotate(hull);
        context2D.drawImage(images[imgIroncladR], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
      context2D.restore();
      context2D.rotate(turret);
      context2D.drawImage(images[imgIroncladTurret], 0, 0, 96, 20, -48, -10, 96, 20);
    context2D.restore();
  }
    
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitRect(this.posX-45, this.posY-12, 75, 24, this.power))
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
    if(hitRectRect(x, y, w, h, this.posX-45, this.posY-12, 75, 24))
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
    if(hitRectCircle(this.posX-45, this.posY-12, 75, 24, x, y, r))
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
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 30, 10);
    explosionsAdd(this.posX, this.posY, 40, 10);    
    ace.addScore(200);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
