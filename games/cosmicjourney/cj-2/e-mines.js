function Mine()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 800;

  this.velX = 0;
  this.velY = 1;

  this.currentFrame = 0;
  this.frameWidth = 20;
  this.frameHeight = 20;  
  
  this.power = 1;
  this.hit = 0;
  
  this.distance = 0;
  
  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
    this.distance = distance;
  }
  
  this.draw = function(context2D, mspf)
  {
    try
    {  
      if(this.hit > 0 && distance-this.hit>400)
      {
        this.finish();
        return;
      }
        
      this.posX += this.velX*(mspf/30);      
      this.posY += this.velY*(mspf/30);
      this.velX /= 1+mspf/300;
      this.velY = 1+(this.velY-1)/(1+mspf/300);
      
      var frame = Math.floor(this.currentFrame);
      this.currentFrame += mspf/80;
      if(this.currentFrame>=36)
        this.currentFrame = 0;
      
      if(this.hit==0)
      {
        context2D.save();
        context2D.translate(this.posX, this.posY);
        context2D.drawImage(images[imgMine], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
        context2D.restore();
      }
      if(this.posY > canvas.height+16)
        enemyRemove(this.index);
    }
    catch(err)
    {
      alert(context2D + " " + images[imgMine] + " " + this.posX + " " + this.posY);
    }
  }
  
  this.hitUfo = function(ufo)
  {
    if(distance-this.distance < 1000)
      return false;
    if(ufo.hitCircle(this.posX, this.posY, this.hit==0 ? 10 : 40, this.power))
      return this.hitMe();
    return false;
  }  

  this.hitRect = function(x, y, w, h, power)
  {
    if(distance-this.distance < 1000)
      return false;
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, this.hit==0 ? 10 : 40))
      return this.hitMe();
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    try
    {  
    if(distance-this.distance < 1000)
      return false;
    if(hitCircleCircle(x, y, r, this.posX, this.posY, this.hit==0 ? 10 : 40))
      return this.hitMe();
    return false;
    }
    catch(err){alert(err);}
  }
  
  this.hitMe = function()
  {
    if(this.hit>0)
    {
      if(distance-this.hit>400)
        this.finish();
      return true;
    }
    else
    {
      this.hit = distance;
      this.power = 5;
      explosionsAdd(this.posX, this.posY, 40, 10);
      return true;
    }
  }
  
  this.finish = function()
  {
    ace.addScore(20);
    enemyRemove(this.index);
  }
}

function Mine2()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 800;

  this.velX = 0;
  this.velY = 1;

  this.currentFrame = 0;
  this.frameWidth = 24;
  this.frameHeight = 24;  
  
  this.power = 10;
  this.hit = 0;
  
  this.distance = 0;
  
  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
    this.distance = distance;
  }
  
  this.draw = function(context2D, mspf)
  {
    try
    {  
      if(this.hit > 0 && distance-this.hit>400)
      {
        this.finish();
        return;
      }

      this.posX += this.velX*(mspf/30);      
      this.posY += this.velY*(mspf/30);
      var fromAce = Math.sqrt((ace.posX-this.posX)*(ace.posX-this.posX)+(ace.posY-this.posY)*(ace.posY-this.posY));
      if(distance-this.distance > 2000 && ace.hull > 0 && fromAce < 400)
      {
        this.velX += 0.2*(ace.posX-this.posX)/fromAce;
        this.velY += 0.2*(ace.posY-this.posY)/fromAce;
        var norm = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
        if(norm > 3)
        {
          this.velX /= norm;
          this.velY /= norm;
          this.velX *= 3;
          this.velY *= 3;
        }
      }
      else
      {
        this.velX /= 1+mspf/600;
        this.velY = 1+(this.velY-1)/(1+mspf/600);
      }
      
      var frame = Math.floor(this.currentFrame);
      if(distance-this.distance < 2000)
        frame = 6;
      this.currentFrame += mspf/100;
      if(this.currentFrame>=7)
        this.currentFrame = 0;
      
      if(this.hit==0)
      {
        context2D.save();
        context2D.translate(this.posX, this.posY);
        context2D.drawImage(images[imgMine2], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
        context2D.restore();
      }
      if(this.posY > canvas.height+16)
        enemyRemove(this.index);
    }
    catch(err){alert(err);}
  }
  
  this.hitUfo = function(ufo)
  {
    if(distance-this.distance < 2000)
      return false;
    if(ufo.hitCircle(this.posX, this.posY, this.hit==0 ? 2 : 30, this.power))
      return this.hitMe(ufo.power/2);
    return false;
  }  

  this.hitRect = function(x, y, w, h, power)
  {
//    if(distance-this.distance < 2000)
  //    return false;
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, this.hit==0 ? 10 : 60))
      return this.hitMe(power);
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    try
    {  
//    if(distance-this.distance < 2000)
  //    return false;
    if(hitCircleCircle(x, y, r, this.posX, this.posY, this.hit==0 ? 10 : 60))
      return this.hitMe(power);
    return false;
    }
    catch(err){alert(err);}
  }
  
  this.hitMe = function(power)
  {
    if(this.hit>0)
    {
      if(distance-this.hit>400)
        this.finish();
      return true;
    }
    else
    {
      this.power -= power;
      if(this.power <= 0)
      {
        this.hit = distance;
        this.power = 4;
        explosionsAdd(this.posX, this.posY, 50, 20);
      }
      return true;
    }
  }
  
  this.finish = function()
  {
    ace.addScore(30);
    enemyRemove(this.index);
  }
}
