function Transport()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = -100;
  
  this.velX = 0;
  this.velY = 1;
  this.targetX = 400;
  this.targetY = 500;
  this.target = -1000;

  this.frameWidth = 62;
  this.frameHeight4 = 200;
  this.frameHeight3 = 155;
  this.frameHeight2 = 112;
  this.frameHeight1 = 71;

  this.currentFlameR = 2;
  this.currentFlameL = 2;
  this.flameWidth = 18;
  this.flameHeight = 40;
  this.flameD = 0;
  this.flameDd = 0.1;

  this.power = 800;

  this.init = function(index)
  {
    this.index = index;
  }
  
  this.draw = function(context2D, mspf)
  {
try{
    this.target += mspf;
    if(this.target > 0)
    {
      this.target = -1000;
      var tX = 0;
      var tY = 0;
      for(var e=0; e<enemies.length; e++)
      {
        tX += enemies[e].posX;
        tY += enemies[e].posY;
      }
      if(enemies.length>0)
      {
        tX /= enemies.length;
        tY /= enemies.length;
        tX -= 400;
        tY -= 500;
        var l = Math.sqrt(tX*tX+tY*tY);
        tX /= -l;
        tY /= -l;
      }
      this.targetX = 400 + tX * 300;
      if(this.targetY >= 0)
        this.targetY = 500 + tY * 150;
    }
    if(this.targetX < this.posX)
      this.velX -= 0.01*(mspf/30);
    if(this.targetX > this.posX)
      this.velX += 0.01*(mspf/30);
    if(this.targetY < this.posY)
      this.velY -= 0.01*(mspf/30);
    if(this.targetY > this.posY)
      this.velY += 0.01*(mspf/30);
    var v = Math.sqrt((this.targetX-this.posX)*(this.targetX-this.posX)+(this.targetY-this.posY)*(this.targetY-this.posY));
    v /= 100;
    if(v > 1) v=1;
    if(this.velX > v) this.velX = v;
    if(this.velX < -v) this.velX = -v;
    if(this.velY > v) this.velY = v;
    if(this.velY < -v) this.velY = -v;
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);

    this.flameD += this.flameDd*(mspf/30);
    if(this.flameD >= 0.2)
    {
      this.flameD = 0.2;
      this.flameDd = -this.flameDd;
    }
    if(this.flameD <= -0.2)
    {
      this.flameD = -0.2;
      this.flameDd = -this.flameDd;
    }

    this.currentFlameR = 0.5 - this.velY*0.5 - this.velX*0.5;
    this.currentFlameL = 0.5 - this.velY*0.5 + this.velX*0.5;
    if(this.currentFlameR < 0.2) this.currentFlameR = 0.2;
    if(this.currentFlameR > 0.8) this.currentFlameR = 0.8;
    if(this.currentFlameL < 0.2) this.currentFlameL = 0.2;
    if(this.currentFlameL > 0.8) this.currentFlameL = 0.8;
      
    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.rotate(this.velX*0.05);
    if(this.power > 600)
      context2D.drawImage(images[imgTransport4], -this.frameWidth/2, -this.frameHeight4+10);
    else if(this.power > 400)
      context2D.drawImage(images[imgTransport3], -this.frameWidth/2, -this.frameHeight3+10);
    else if(this.power > 200)
      context2D.drawImage(images[imgTransport2], -this.frameWidth/2, -this.frameHeight2+10);
    else
      context2D.drawImage(images[imgTransport1], -this.frameWidth/2, -this.frameHeight1+10);
    context2D.translate(13, 10);
    context2D.globalAlpha = this.currentFlameR+this.flameD*this.currentFlameR;
    context2D.drawImage(images[imgFlame], 0, 0);
    context2D.translate(-46, 0);
    context2D.globalAlpha = this.currentFlameL+this.flameD*this.currentFlameL;
    context2D.drawImage(images[imgFlame], 0, 0);
    context2D.globalAlpha = 1;
    context2D.restore();
}catch(err){alert(err);}
  }
    
  this.hitUfo = function(ufo)
  {
    var dy=71;
    if(this.power > 600)
      dy=200;
    else if(this.power > 400)
      dy=155;
    else if(this.power > 200)
      dy=112;
      
    var ePower = ufo.power;
    if(ufo.hitRect(this.posX-25, this.posY-dy+10, 50, dy-1, this.power))
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
    var dy=71;
    if(this.power > 600)
      dy=200;
    else if(this.power > 400)
      dy=155;
    else if(this.power > 200)
      dy=112;
      
    if(hitRectRect(x, y, w, h, this.posX-25, this.posY-dy+10, 50, dy-1))
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
    var dy=71;
    if(this.power > 600)
      dy=200;
    else if(this.power > 400)
      dy=155;
    else if(this.power > 200)
      dy=112;
      
    if(hitRectCircle(this.posX-25, this.posY-dy+10, 50, dy-1, x, y, r))
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
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 60, 30);
    explosionsAdd(this.posX, this.posY-30, 40, 20);
    friendRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
