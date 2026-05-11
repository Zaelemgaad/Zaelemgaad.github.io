function Type1()
{
  this.index = 0;
  
  this.origX = 400;
  this.posX = 400;
  this.origY = 300;
  this.posY = 300;

  this.velX = 1;
  this.velY = 1;
  this.amp = 100;
  this.per = 100;
  
  this.currentFrame = 0;
  this.frameWidth = 30;
  this.frameHeight = 48;
  
  this.power = 20;

  this.missileL = 0.25;
  this.missileR = 0.75;
  
  this.smartFire = true;
    
  this.init = function(index, posX, posY, velY, amp, per)
  {
    this.index = index;
    this.posX = posX;
    this.origX = posX;
    this.posY = posY;
    this.origY = posY;
    this.amp = amp;
    this.velY = velY;
    this.per = per;
    this.missileL *= per;
    this.missileR *= per;
  }
  
  this.draw = function(context2D, mspf)
  {
    var oldY = this.posY;
    this.posY += this.velY*(mspf/30);
    this.velX = this.posX;
    this.posX = this.origX + Math.sin(6.28*(this.posY)/this.per)*this.amp;
    this.velX = (this.posX - this.velX);

    if(this.smartFire)
    {
      //Vystrelime pri preletu nad Ace
      if(this.posY > 16 &&
         this.missileL > 0 &&
         this.posY < ace.posY && 
         this.posX > ace.posX - 28 + 15 &&
         this.posX < ace.posX + 28 + 15)
      {
        this.missileL = 0;
        missiles.push(new Missile());
        missiles[missiles.length-1].init(missiles.length-1, this.posX-15, this.posY, this.velX-4, this.velY);
      }
      if(this.posY > 16 &&
         this.missileR > 0 &&
         this.posY < ace.posY && 
         this.posX > ace.posX - 28 - 15 &&
         this.posX < ace.posX + 28 - 15)
      {
        this.missileR = 0;
        missiles.push(new Missile());
        missiles[missiles.length-1].init(missiles.length-1, this.posX+15, this.posY, this.velX+4, this.velY);
      }
    }
    else
    {
      //Budeme strilet v kazde periode podle this.missile...
      var perY = Math.floor(this.posY / this.per)*this.per;
      if(oldY < perY + this.missileL && this.posY > perY + this.missileL)
      {                     
        //audioFireL.play();
        missiles.push(new Missile());
        missiles[missiles.length-1].init(missiles.length-1, this.posX+15, oldY, this.velX+4, this.velY);
      }
      if(oldY < perY + this.missileR && this.posY > perY + this.missileR)
      {
        //audioFireR.play();
        missiles.push(new Missile());
        missiles[missiles.length-1].init(missiles.length-1, this.posX-15, this.posY, this.velX-4, this.velY);
      }
    }
    
    if(this.posY-this.frameHeight > canvasHeight)
      enemyRemove(this.index);
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/40;
    if(this.currentFrame>=2)
      this.currentFrame = 0;
      
    if(this.velX > 0.5)
      frame += 6;
    if(this.velX > 0.7)
      frame += 2;
    if(this.velX < -0.5)
      frame += 2;
    if(this.velX < -0.7)
      frame += 2;
    
    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.rotate(-this.velX/50);
    context2D.drawImage(images[imgType1], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.restore();
    //context2D.drawImage(images[imgType1], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
  }
    
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY+8, 16, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX, this.posY+8, 16))
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
    if(hitCircleCircle(x, y, r, this.posX, this.posY+8, 16))
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
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 10, Math.round((2+Math.random()*3)));
    explosionsAdd(this.posX, this.posY, 10, Math.round((3+Math.random()*3)));    
    ace.addScore(150);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
