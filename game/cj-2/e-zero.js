function Zero()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 300;

  this.vel = 1;
  
  this.angle = 0;
  this.velAngle = 0;

  this.frameWidth = 40;
  this.frameHeight = 37;

  this.currentFlameR = 2;
  this.currentFlameL = 2;
  this.flameWidth = 9;
  this.flameHeight = 20;
  this.flameD = 0;
  this.flameDd = 0.1;

  this.fire = 0;
  this.firePos = 15;
  
  this.onTarget = -2000;
  
  this.power = 80;
  this.hit = 0;

  this.init = function(index, posX, posY, vel, target)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.vel = vel;
    this.onTarget = -target;
  }
  
  this.draw = function(context2D, mspf)
  {
    var t=mspf/30;

    if(this.onTarget < -100 && this.onTarget + mspf >= -100)
    {
      var velX = ace.posX - this.posX;
      var velY = ace.posY - this.posY;
      var norm = Math.sqrt(velX*velX+velY*velY);
      velX /= norm;
      velY /= norm;
      var speed = 4+Math.random()*4;
      velX *= speed;
      velY *= speed;
      var sinA = Math.sin(this.angle);
      var cosA = Math.cos(this.angle);
      var px = cosA * 12 + sinA * -10;
      var py = sinA * 12 - cosA * -10;
      plasma.push(new Plasma());
      plasma[plasma.length-1].init(plasma.length-1, this.posX+px, this.posY+py, velX, velY);
      px = cosA * -12 + sinA * -10;
      py = sinA * -12 - cosA * -10;
      plasma.push(new Plasma());
      plasma[plasma.length-1].init(plasma.length-1, this.posX+px, this.posY+py, velX, velY);
    }
    
    this.onTarget += mspf;
    if(this.onTarget > 0 && friends.length > 0)
    {
      var angleTarget = getAngle(friends[0].posX - this.posX, friends[0].posY - this.posY);
      //var angleTarget = getAngle(ace.posX - this.posX, ace.posY - this.posY);
      var angleD = angleDist(this.angle+pi*0.5, angleTarget);
      this.velAngle = 0.1*t*angleD/pi;
    }
    this.angle += this.velAngle*(mspf/30);
    
    this.posX += -Math.sin(this.angle)*this.vel*t;
    this.posY += Math.cos(this.angle)*this.vel*t;

    this.flameD += this.flameDd*t;
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
    
    this.currentFlameR += this.velAngle*10;
    if(this.currentFlameR < 0.2) this.currentFlameR = 0.3;
    if(this.currentFlameR > 0.8) this.currentFlameR = 0.8;
    this.currentFlameL -= this.velAngle*10;
    if(this.currentFlameL < 0.2) this.currentFlameL = 0.3;
    if(this.currentFlameL > 0.8) this.currentFlameL = 0.8;
    
    var a = this.angle%(2*pi);
    if(a < 0) a += 2*pi;
    a /= pi/2;
    var frame = Math.floor(a);

    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.rotate(this.angle);
    context2D.drawImage(images[imgZero], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.globalAlpha = a - frame;
    context2D.drawImage(images[imgZero], (frame == 3 ? 0 : frame+1) * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.translate(6.5, -16);
    context2D.globalAlpha = this.currentFlameR+this.flameD*this.currentFlameR;
    context2D.drawImage(images[imgFlame2], -this.flameWidth*0.5, -this.flameHeight);
    context2D.translate(-13, 0);
    context2D.globalAlpha = this.currentFlameL+this.flameD*this.currentFlameL;
    context2D.drawImage(images[imgFlame2], -this.flameWidth*0.5, -this.flameHeight);
    context2D.globalAlpha = 1;
    context2D.restore();
    
    if(this.hit > 0)
    {
      explosionAdd(this.posX-15+Math.random()*30, this.posY-15+Math.random()*30, 0.5);
      if(distance - this.hit > 2000)
        this.finish();
    }
  }
    
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY, 18, this.power))
    {                  
      if(this.hit == 0)
        this.hit = distance;
      this.power -= ePower*3;
      if(this.power <= 0)      
        this.finish();
      return true;
    }
    return false;
  }  

  this.hitRect = function(x, y, w, h, power)
  {
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, 18))
    {
      this.onTarget = 1;
      if(this.hit == 0)
        this.hit = distance;
      this.power -= power*3;
      if(this.power <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(hitCircleCircle(x, y, r, this.posX, this.posY, 18))
    {
      this.onTarget = 1;
      if(this.hit == 0)
        this.hit = distance;
      this.power -= power*3;
      if(this.power <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  this.finish = function()
  {
    explosionsAdd(this.posX, this.posY, 60, 20);    
    ace.addScore(50);
    enemyRemove(this.index);
    if(details)
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();
    }
  }
}
