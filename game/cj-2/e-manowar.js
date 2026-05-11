function Manowar()
{
  this.index = 0;
  
  this.posX = 950;
  this.posY = 300;
  
  this.velX = 1;
  this.velY = 0;

  this.dX = 1;
  this.dY = 0;
  
  this.angle = 0;
  this.velAngle = 0;
  
  this.frameWidth = 227;
  this.frameHeight = 104;

  this.currentFlameR = 2;
  this.currentFlameL = 2;
  this.flameWidth = 80;
  this.flameHeight = 35;
  this.flameD = 0;
  this.flameDd = 0.1;

  this.plasma = 1000;

  this.mine = 4000;
  
  this.power = 2000;

  this.init = function(index, posX, posY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
  }
  
  this.draw = function(context2D, mspf)
  {
try{
    var angleAce = getAngle(ace.posX - this.posX, ace.posY - this.posY);
    var angleD = angleDist(this.angle, angleAce);
    var distAce = Math.sqrt((ace.posX - this.posX)*(ace.posX - this.posX)+(ace.posY - this.posY)*(ace.posY - this.posY));
    if(distAce < 400)
    {
      var m=Math.abs(angleD)/pi;
      if(angleD > 0 && angleD < 1.2 || angleD < 0 && angleD < -1.2)
        m=-m;
      this.velAngle += (mspf/10000)*m;
    }
    else
    {
      this.velAngle += (mspf/10000)*angleD/pi;
    }

    if(this.velAngle > 0.01) this.velAngle = 0.01;
    if(this.velAngle < -0.01) this.velAngle = -0.01;
    this.angle += this.velAngle*(mspf/30);

    this.dX = Math.cos(this.angle);
    this.dY = Math.sin(this.angle);
    this.velX += this.dX*(mspf/300);
    this.velY += this.dY*(mspf/300);
    norm = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
    if(norm > 2)
    {
      this.velX /= norm;
      this.velY /= norm;
      this.velX *= 2;
      this.velY *= 2;
    }
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);
    
    this.mine -= mspf;
    if(this.mine < 0)
    {
      this.mine = 2000+Math.random()*6000;
      enemies.push(new Mine2());
      enemies[enemies.length-1].init(enemies.length-1, this.posX-this.dX*110, this.posY-this.dY*110, -this.velX*3, -this.velY*3);
    }
    this.plasma -= mspf;
    if(this.plasma < 0 && (angleD > pi/4 && angleD < 3*pi/4 || angleD < -pi/4 && angleD > -3*pi/4))
    {
      var typ=Math.random()*12;
      if(typ < 1) //DIE
      {
        if(angleD < 0)
        {
      this.fire(true, 0);
      this.fire(true, 1);
      this.fire(true, 2);
      setTimeout("manowar.fire(true, 0)", 100);
      setTimeout("manowar.fire(true, 3)", 100);
      setTimeout("manowar.fire(true, 0)", 200);
      setTimeout("manowar.fire(true, 3)", 200);
      setTimeout("manowar.fire(true, 0)", 300);
      setTimeout("manowar.fire(true, 3)", 300);
      setTimeout("manowar.fire(true, 0)", 400);
      setTimeout("manowar.fire(true, 1)", 400);
      setTimeout("manowar.fire(true, 2)", 400);

      setTimeout("manowar.fire(true, 1)", 700);
      setTimeout("manowar.fire(true, 1)", 800);
      setTimeout("manowar.fire(true, 1)", 900);
      setTimeout("manowar.fire(true, 1)", 1000);
      setTimeout("manowar.fire(true, 1)", 1100);

      setTimeout("manowar.fire(true, 0)", 1400);
      setTimeout("manowar.fire(true, 1)", 1400);
      setTimeout("manowar.fire(true, 2)", 1400);
      setTimeout("manowar.fire(true, 3)", 1400);
      setTimeout("manowar.fire(true, 0)", 1500);
      setTimeout("manowar.fire(true, 0)", 1600);
      setTimeout("manowar.fire(true, 1)", 1600);
      setTimeout("manowar.fire(true, 2)", 1600);
      setTimeout("manowar.fire(true, 0)", 1700);
      setTimeout("manowar.fire(true, 0)", 1800);
      setTimeout("manowar.fire(true, 1)", 1800);
      setTimeout("manowar.fire(true, 2)", 1800);
      setTimeout("manowar.fire(true, 3)", 1800);

        }
        else
        {
      this.fire(false, 3);
      this.fire(false, 2);
      this.fire(false, 1);
      setTimeout("manowar.fire(false, 0)", 100);
      setTimeout("manowar.fire(false, 3)", 100);
      setTimeout("manowar.fire(false, 0)", 200);
      setTimeout("manowar.fire(false, 3)", 200);
      setTimeout("manowar.fire(false, 0)", 300);
      setTimeout("manowar.fire(false, 3)", 300);
      setTimeout("manowar.fire(false, 3)", 400);
      setTimeout("manowar.fire(false, 2)", 400);
      setTimeout("manowar.fire(false, 1)", 400);

      setTimeout("manowar.fire(false, 2)", 700);
      setTimeout("manowar.fire(false, 2)", 800);
      setTimeout("manowar.fire(false, 2)", 900);
      setTimeout("manowar.fire(false, 2)", 1000);
      setTimeout("manowar.fire(false, 2)", 1100);

      setTimeout("manowar.fire(false, 0)", 1400);
      setTimeout("manowar.fire(false, 1)", 1400);
      setTimeout("manowar.fire(false, 2)", 1400);
      setTimeout("manowar.fire(false, 3)", 1400);
      setTimeout("manowar.fire(false, 3)", 1500);
      setTimeout("manowar.fire(false, 3)", 1600);
      setTimeout("manowar.fire(false, 2)", 1600);
      setTimeout("manowar.fire(false, 1)", 1600);
      setTimeout("manowar.fire(false, 3)", 1700);
      setTimeout("manowar.fire(false, 0)", 1800);
      setTimeout("manowar.fire(false, 1)", 1800);
      setTimeout("manowar.fire(false, 2)", 1800);
      setTimeout("manowar.fire(false, 3)", 1800);
        }
        this.plasma = 3000;
      }
      else if(typ < 4)
      {
        var left = "true";
        if(angleD > 0)
          left = "false";
        this.fire(angleD < 0, 0);
        setTimeout("manowar.fire("+left+", 1)", 100);
        setTimeout("manowar.fire("+left+", 2)", 200);
        setTimeout("manowar.fire("+left+", 3)", 300);
        setTimeout("manowar.fire("+left+", 2)", 400);
        setTimeout("manowar.fire("+left+", 1)", 500);
        setTimeout("manowar.fire("+left+", 0)", 600);
        setTimeout("manowar.fire("+left+", 1)", 700);
        setTimeout("manowar.fire("+left+", 2)", 800);
        setTimeout("manowar.fire("+left+", 3)", 900);
        setTimeout("manowar.fire("+left+", 2)", 1000);
        setTimeout("manowar.fire("+left+", 1)", 1100);
        setTimeout("manowar.fire("+left+", 0)", 1200);
        setTimeout("manowar.fire("+left+", 1)", 1300);
        setTimeout("manowar.fire("+left+", 2)", 1400);
        setTimeout("manowar.fire("+left+", 3)", 1500);
        this.plasma = 3000;
      }
      else if(typ < 8)
      {
        var left = "true";
        if(angleD > 0)
          left = "false";
        this.fire(angleD < 0, 0);
        setTimeout("manowar.fire("+left+", 1)", 100);
        setTimeout("manowar.fire("+left+", 2)", 200);
        setTimeout("manowar.fire("+left+", 3)", 300);
        setTimeout("manowar.fire("+left+", 0)", 300);
        setTimeout("manowar.fire("+left+", 1)", 400);
        setTimeout("manowar.fire("+left+", 2)", 500);
        setTimeout("manowar.fire("+left+", 3)", 600);
        setTimeout("manowar.fire("+left+", 0)", 600);
        setTimeout("manowar.fire("+left+", 1)", 700);
        setTimeout("manowar.fire("+left+", 2)", 800);
        setTimeout("manowar.fire("+left+", 3)", 900);
        setTimeout("manowar.fire("+left+", 0)", 900);
        setTimeout("manowar.fire("+left+", 1)", 1000);
        setTimeout("manowar.fire("+left+", 2)", 1100);
        setTimeout("manowar.fire("+left+", 3)", 1200);
        this.plasma = 2500;
      }
      else if(typ < 10)
      {
        this.fire(angleD < 0, 0);
        this.fire(angleD < 0, 0);
        this.fire(angleD < 0, 0);
        this.fire(angleD < 0, 1);
        this.fire(angleD < 0, 1);
        this.fire(angleD < 0, 1);
        this.fire(angleD < 0, 2);
        this.fire(angleD < 0, 2);
        this.fire(angleD < 0, 2);
        this.fire(angleD < 0, 3);
        this.fire(angleD < 0, 3);
        this.fire(angleD < 0, 3);
        this.plasma = 1000;
      }
      else if(typ < 12)
      {
        var left = "true";
        if(angleD > 0)
          left = "false";
        this.fire(angleD < 0, 0);
        this.fire(angleD < 0, 3);
        setTimeout("manowar.fire("+left+", 0)", 100);
        setTimeout("manowar.fire("+left+", 3)", 100);
        setTimeout("manowar.fire("+left+", 0)", 200);
        setTimeout("manowar.fire("+left+", 3)", 200);
        setTimeout("manowar.fire("+left+", 0)", 300);
        setTimeout("manowar.fire("+left+", 3)", 300);
        setTimeout("manowar.fire("+left+", 0)", 400);
        setTimeout("manowar.fire("+left+", 3)", 400);
        setTimeout("manowar.fire("+left+", 0)", 500);
        setTimeout("manowar.fire("+left+", 3)", 500);
        setTimeout("manowar.fire("+left+", 0)", 600);
        setTimeout("manowar.fire("+left+", 1)", 600);
        setTimeout("manowar.fire("+left+", 2)", 600);
        setTimeout("manowar.fire("+left+", 3)", 600);
        setTimeout("manowar.fire("+left+", 0)", 650);
        setTimeout("manowar.fire("+left+", 1)", 650);
        setTimeout("manowar.fire("+left+", 2)", 650);
        setTimeout("manowar.fire("+left+", 3)", 650);
        setTimeout("manowar.fire("+left+", 0)", 700);
        setTimeout("manowar.fire("+left+", 1)", 700);
        setTimeout("manowar.fire("+left+", 2)", 700);
        setTimeout("manowar.fire("+left+", 3)", 700);
        this.plasma = 1500;
      }

    }

    var a = this.angle%(2*pi);
    if(a < 0) a += 2*pi;
    a /= pi/4;
    var frame = Math.floor(a);
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

    this.currentFlameR -= this.velAngle*10;
    if(this.currentFlameR < 0.2) this.currentFlameR = 0.2;
    if(this.currentFlameR > 0.8) this.currentFlameR = 0.8;
    this.currentFlameL += this.velAngle*10;
    if(this.currentFlameL < 0.2) this.currentFlameL = 0.2;
    if(this.currentFlameL > 0.8) this.currentFlameL = 0.8;
      
    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.rotate(this.angle);
    context2D.drawImage(images[imgManowar], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.globalAlpha = a - frame;
    context2D.drawImage(images[imgManowar], (frame == 7 ? 0 : frame+1) * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.translate(-184, 14);
    context2D.globalAlpha = this.currentFlameR+this.flameD*this.currentFlameR;
    context2D.drawImage(images[imgManowarFlame], 0, 0);
    context2D.translate(0, -64);
    context2D.globalAlpha = this.currentFlameL+this.flameD*this.currentFlameL;
    context2D.drawImage(images[imgManowarFlame], Math.floor(this.currentFlameL+this.flameD) * this.flameWidth*0, 0, this.flameWidth, this.flameHeight, 0, 0, this.flameWidth, this.flameHeight);
    context2D.globalAlpha = 1;
    context2D.restore();
}catch(err){alert(err);}
  }
    
  this.fire = function(left, cannon)
  {
    if(this.power <= 0) return;
    var tx = -15+cannon*25;
    var ty = 50;
    if(cannon == 1) ty = 52;
    else if(cannon == 2) ty = 53;
    else if(cannon == 3) ty = 51;
    if(left == false) ty=-ty;
    var px = this.dX * tx + this.dY * ty;
    var py = this.dY * tx - this.dX * ty;

    var plasmaAngle = this.angle;
    if(left) plasmaAngle-=pi/2+0.2-cannon*0.2;
    else plasmaAngle+=pi/2+0.2-cannon*0.2;
    var sinA = Math.sin(plasmaAngle);
    var cosA = Math.cos(plasmaAngle);

    plasma.push(new Plasma());
    plasma[plasma.length-1].init(plasma.length-1, this.posX+px, this.posY+py, this.velX/2+cosA*7, this.velY/2+sinA*7);
    explosionAdd(this.posX+px, this.posY+py, 0.6);
  }

  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX-this.dX*50, this.posY-this.dY*50, 50, this.power) || ufo.hitCircle(this.posX+this.dX*50, this.posY+this.dY*50, 50, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX-this.dX*50, this.posY-this.dY*50, 50) || hitRectCircle(x, y, w, h, this.posX+this.dX*50, this.posY+this.dY*50, 50))
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
    if(hitCircleCircle(this.posX-this.dX*50, this.posY-this.dY*50, 50, x, y, r) || hitCircleCircle(this.posX+this.dX*50, this.posY+this.dY*50, 50, x, y, r))
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
    explosionsAdd(this.posX, this.posY, 80, 40);    
    ace.addScore(1000);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
