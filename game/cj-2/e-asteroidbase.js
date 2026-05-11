function Base()
{
  this.index = 0;
                    
  this.posX = 200;
  this.posY = -500;

  this.velY = 1;

  this.frameWidth = 600;
  this.frameHeight = 422;

  this.siloWidth = 121;
  this.siloHeight = 71;

  this.cannonFrame = 0;
  this.cannonD = 1;
  this.cannonWidth = 96;
  this.cannonHeight = 68;
  this.cannonFire = 2000;
  
  this.lights = false;
  this.lightsFrame = 0;
  this.silo = -5000;
  this.siloOpen = 1;
  this.shield = 0;

  this.powerSilo = 300;
  this.power = 50;

  this.leaks = 0;
  this.leaksNumber = 200;

  this.init = function(index)
  {        
    this.index = index;
    starSpeedControl = true;
  }
  
  this.draw = function(context2D, mspf)
  {
try{
    this.leaks -= mspf;
    if(this.leaks < 0 && this.powerSilo == 0)
    {
      //audioExplosion.play();
      debris.push(new Explosion1());
      var r = 400*Math.random();
      var a = Math.random()*0.5*pi;
      var x = Math.cos(a)*r;
      var y = Math.sin(a)*r;
      debris[debris.length-1].init(debris.length-1, this.posX+440-x, this.posY+y, 0, Math.random()*0.4+0.6);
      this.leaks = this.leaksNumber/2;
      this.leaksNumber--;
      if(this.leaksNumber<=0)
        this.finish();
    }
    if(this.posY < 0)
    {
      this.velY = 1 - (500+this.posY)/500;
      starSpeed = 0.25+this.velY*0.75;
      this.posY += this.velY*(mspf/30);
    }
    else
    {
      this.posY = 0;
      this.velY = 0;
    }
    
    context2D.drawImage(images[imgAsteroidBase], this.posX, this.posY);

    if(this.powerSilo > 0)
    {
      this.silo += mspf*this.siloOpen;
      var frame = Math.floor(this.silo/100);
      if(frame < 0)
        frame = 0
      if(frame > 6)
        frame = 6
      if(this.silo >= 0 && this.siloOpen==1)
        this.lights = true;
      if(this.silo > 3000 && this.siloOpen==1)
      {
        this.lights = false;
        this.siloOpen=-1;
        enemies.push(new Miner());
        enemies[enemies.length-1].init(enemies.length-1, this.posX+234, this.posY+90, -1, 2);
      }
      if(this.silo < -2000 && this.siloOpen==-1)
        this.siloOpen=1;

      if(this.lightsFrame > 0 || this.lights)
        this.lightsFrame += mspf/100;
      if(this.lightsFrame>=8)
        this.lightsFrame = 0;
    }

    if(this.powerSilo > 0)
    {
      context2D.drawImage(images[imgSilo], frame * this.siloWidth, 0, this.siloWidth, this.siloHeight, this.posX+200, this.posY+50, this.siloWidth, this.siloHeight);
      context2D.drawImage(images[imgSilo+1+Math.floor(this.lightsFrame)], this.posX+110, this.posY+70);
    }
    else
      context2D.drawImage(images[imgSiloVrak], this.posX+190, this.posY+45);

    if(this.shield > 0)
    {
      if(this.shield > 1000)
        this.shield = 1000;
      context2D.globalAlpha = this.shield/1000;
      context2D.save();
      context2D.translate(this.posX+174, this.posY+25);
      context2D.scale(2, 2);
      context2D.drawImage(images[imgShield], 0, 0);
      context2D.restore();
      context2D.globalAlpha = 1;
      this.shield -= mspf;
    }

/*    var cannonFrame = Math.floor(this.cannonFrame);
    if(cannonFrame < 0) cannonFrame = 0;
    if(cannonFrame > 6) cannonFrame = 6;
    this.cannonFrame += this.cannonD*mspf/300;
    if(this.cannonFrame>=7) this.cannonD = -1;
    if(this.cannonFrame<=0) this.cannonD = 1;*/

    if(this.powerSilo > 0)
      this.cannonFire += mspf;
    if(this.cannonFire > -200 && this.cannonFire - mspf <= -200)
    {
      this.cannonFrame += this.cannonD;
      if(this.cannonFrame>=6) this.cannonD = -1;
      if(this.cannonFrame<=0) this.cannonD = 1;
    }
    if(this.cannonFire >= 0)
    {
      this.cannonFire = -200 - Math.random()*1300;
      enemies.push(new Asteroid());
      var vX = Math.cos(this.cannonFrame*pi/8);
      var vY = Math.sin(this.cannonFrame*pi/8);
      enemies[enemies.length-1].init(enemies.length-1, this.posX+400-vX*30, this.posY+220+vY*30, -vX*6, vY*6);
      enemies[enemies.length-1].img = imgAsteroid1;
      enemies[enemies.length-1].frameWidth = 24;
      enemies[enemies.length-1].frameHeight = 24;
      enemies[enemies.length-1].radius = 10;
      enemies[enemies.length-1].power = 40;
      enemies[enemies.length-1].score = 30;
    }
    context2D.drawImage(images[imgCannon1], this.cannonFrame * this.cannonWidth, 0, this.cannonWidth, this.cannonHeight, this.posX+363, this.posY+180, this.cannonWidth, this.cannonHeight);
}catch(err){alert(err);}
  }
  
  this.hitUfo = function(ufo)
  {
    return false;
  }  

  this.hitRect = function(x, y, w, h, power)
  {
    var hitCannon = hitRectCircle(x, y, w, h, this.posX+392, this.posY+209, 29);
    if(this.lights)
    {
      if(this.powerSilo > 0 && hitRectCircle(x, y, w, h, this.posX+235, this.posY+85, 45))
      {
        this.powerSilo -= power;
        if(this.powerSilo <= 0)
        {
          debrisAdd(this.posX+235, this.posY+85, 0, 0, 40, 20);
          explosionsAdd(this.posX+235, this.posY+85, 60, 40);    
          this.lights = false;
          this.powerSilo = 0;
        }
        return true;
      }
    }
    else if(this.powerSilo > 0 && hitRectCircle(x, y, w, h, this.posX+235, this.posY+85, 60))
    {
      this.shield+=power*50;
      return true;
    }
    return hitCannon;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
/*    if(this.lights)
    {
      if(this.power > 0 && hitCircleCircle(x, y, r, this.posX+235, this.posY+85, 45))
      {
        this.power -= power;
        if(this.power <= 0)
        {
          debrisAdd(this.posX+235, this.posY+85, 0, 0, 45, 20);
          explosionsAdd(this.posX+235, this.posY+85, 45, 20);    
          this.lights = false;
          this.power = 0;
        }
        return true;
      }
    }
    else if(this.power > 0 && hitCircleCircle(x, y, r, this.posX+235, this.posY+85, 60))
    {
      this.shield+=power*50;
      return true;
    }*/
    return false;
  }

  this.finish = function()
  {
    starSpeedControl = false;
    ace.addScore(1000);
    stonesAdd(this.posX+300, this.posY+150, 0, 0, 250, 200);
    explosionsAdd(this.posX+300, this.posY+150, 250, 200);    
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
