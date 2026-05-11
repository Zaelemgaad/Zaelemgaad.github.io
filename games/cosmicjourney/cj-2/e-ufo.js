function Ufo()
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
  this.frameWidth = 46;
  this.frameHeight = 46;
  
  this.power = 20;

  this.plasma = 5000;
    
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
    this.plasma = 1000+Math.random()*5000*(20000/distance);
  }
  
  this.draw = function(context2D, mspf)
  {
    this.plasma -= mspf;
    if(this.plasma < 0)
    {
      this.plasma = 500+Math.random()*5000*(20000/distance);
      plasma.push(new Plasma());
      var velX = ace.posX - this.posX;
      var velY = ace.posY - this.posY;
      var norm = Math.sqrt(velX*velX+velY*velY);
      velX /= norm;
      velY /= norm;
      var speed = 4+Math.random()*4;
      velX *= speed;
      velY *= speed;
      plasma[plasma.length-1].init(plasma.length-1, this.posX, this.posY, velX, velY);
    }
    
    if(this.per == 0)
    {
      var aX = ace.posX - this.posX;
      var aY = ace.posY - this.posY;
      var norm = Math.sqrt(aX*aX+aY*aY)*10;
      aX /= norm;
      aY /= norm;
      this.velX += aX;
      this.velY += aY;
      norm = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
      if(norm > 6)
      {
        this.velX /= norm;
        this.velY /= norm;
        this.velX *= 6;
        this.velY *= 6;
      }
      this.posX += this.velX*(mspf/30);
      this.posY += this.velY*(mspf/30);
    }
    else
    {
      this.posY += this.velY*(mspf/30);
      this.velX = this.posX;
      this.posX = this.origX + Math.sin(6.28*(this.posY)/this.per)*this.amp;
      this.velX = (this.posX - this.velX);
      if(this.posY-this.frameHeight > canvasHeight)
      {
        nUfosLost++;
        enemyRemove(this.index);
      }
    }
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/20;
    if(this.currentFrame>=12)
      this.currentFrame = 0;
    
    context2D.drawImage(images[imgUfo], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
  }
  
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY, this.frameWidth/2, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, this.frameWidth/2))
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
    if(hitCircleCircle(x, y, r, this.posX, this.posY, this.frameWidth/2))
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
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 20, Math.round((2+Math.random()*3)));
    explosionsAdd(this.posX, this.posY, 20, Math.round((5+Math.random()*5)));    
    ace.addScore(100);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}

function Ufo2()
{
  this.index = 0;
                    
  this.posX = 400;
  this.posY = 300;

  this.velX = 0;
  this.velY = 1;
  
  this.currentFrame = 0;
  this.frameWidth = 128;
  this.frameHeight = 128;
  
  this.power = 1000;

  this.plasma = 1000;
  this.launcher = 0;
  this.plasmaTyp = 0;
  this.birthSide = false;

  this.leaks = 0;
    
  this.init = function(index, posX, posY)
  {        
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.plasmaTyp = Math.random()*7;
  }
  
  this.draw = function(context2D, mspf)
  {
    this.leaks -= mspf;
    if(this.leaks < 0 && this.power < 1000)
    {
      debris.push(new Explosion1());
      var r = (Math.random()*2-1)*48;
      var a = Math.random()*2*pi;
      var x = Math.sin(a)*r;
      var y = Math.cos(a)*r;
      debris[debris.length-1].init(debris.length-1, this.posX+x, this.posY+y, 0, Math.random()*0.4+0.4);
      this.leaks = this.power+Math.random()*this.power;
    }
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/60;
    if(this.currentFrame>=12)
      this.currentFrame = 0;

    this.plasma -= mspf;
    if(this.plasma < 0)
    {
      if(distance > 120000)
        this.plasma = 100;
      else if(distance > 90000)
        this.plasma = Math.random()*2000;
      else
        this.plasma = Math.random()*5000;
      var r = 37;
      
      if(this.plasmaTyp <= 1)
      {
        var velX = ace.posX - this.posX;
        var velY = ace.posY - this.posY;
        var norm = Math.sqrt(velX*velX+velY*velY);
        velX /= norm;
        velY /= norm;
        velX *= 10;
        velY *= 10;

        for(var l=0; l<6; l++)
        {
          var a = pi*(l*60+frame*10)/180;
          var y = -Math.sin(a)*r;
          var x = Math.cos(a)*r;
          plasma.push(new Plasma());
          plasma[plasma.length-1].init(plasma.length-1, this.posX+x, this.posY+y, velX+x/r-0.5+Math.random(), velY+y/r-0.5+Math.random());
        }
        this.plasmaTyp = Math.random()*7;
      }
      else if(this.plasmaTyp <= 2)
      {
        var velX = ace.posX - this.posX;
        var velY = ace.posY - this.posY;
        var norm = Math.sqrt(velX*velX+velY*velY);
        velX /= norm;
        velY /= norm;
        velX *= 10;
        velY *= 10;

        var a = pi*(this.launcher*60+frame*10)/180;
        var y = -Math.sin(a)*r;
        var x = Math.cos(a)*r;
        plasma.push(new Plasma());
        plasma[plasma.length-1].init(plasma.length-1, this.posX+x, this.posY+y, velX, velY);
          
        this.launcher++;
        if(this.launcher > 20)
        {
          this.launcher = 0;
          this.plasmaTyp = Math.random()*7;
        }
        else
          this.plasma = 100;
      }
      else if(this.plasmaTyp <= 3)
      {
        for(var l=0; l<6; l++)
        {
          var a = pi*(l*60+frame*10)/180;
          var y = -Math.sin(a)*r;
          var x = Math.cos(a)*r;
          plasma.push(new Plasma());
          var velX = 12*x/r;
          var velY = 12*y/r;
          plasma[plasma.length-1].init(plasma.length-1, this.posX+x, this.posY+y, velX, velY);
        }
        this.plasmaTyp = Math.random()*7;
      }
      else if(this.plasmaTyp <= 4)
      {
        for(var l=0; l<6; l++)
        {
          var a = pi*(l*60+frame*10)/180;
          var y = -Math.sin(a)*r;
          var x = Math.cos(a)*r;
          plasma.push(new Plasma());
          var velX = 5*x/r;
          var velY = 5*y/r;
          plasma[plasma.length-1].init(plasma.length-1, this.posX+x, this.posY+y, velX, velY);
        }
        this.launcher++;
        if(this.launcher > 5)
        {
          this.launcher = 0;
          this.plasmaTyp = Math.random()*7;
        }
        else
          this.plasma = 100;
      }
      else if(this.plasmaTyp <= 5)
      {
        for(var l=0; l<6; l++)
        {
          var a = pi*(l*60+frame*10)/180;
          var y = -Math.sin(a)*r;
          var x = Math.cos(a)*r;
          var velX = ace.posX - (this.posX+x);
          var velY = ace.posY - (this.posY+y);
          var norm = Math.sqrt(velX*velX+velY*velY);
          velX /= norm;
          velY /= norm;
          velX *= 10;
          velY *= 10;
          plasma.push(new Plasma());
          plasma[plasma.length-1].init(plasma.length-1, this.posX+x, this.posY+y, velX-0.5+Math.random(), velY-0.5+Math.random());
        }
        this.plasmaTyp = Math.random()*7;
      }
      else if(this.plasmaTyp <= 7)
      {
        for(var i=0; i<enemies.length; i++)
          enemies[i].index++;
        enemies.splice(0, 0, new Ufo());
        enemies[0].init(0, this.posX, this.posY, 4, 0, 0);
        if(this.birthSide)
        {
          enemies[0].velX = -this.velY;
          enemies[0].velY = this.velX;
        }
        else
        {
          enemies[0].velX = this.velY;
          enemies[0].velY = -this.velX;
        }
        if(this.launcher > Math.random()*15)
        {
          this.launcher = 0;
          this.plasmaTyp = Math.random()*6;
          this.birthSide = !this.birthSide;
        }
        else
        {
          this.launcher++;
          this.plasma = 1500;
        }
      }
    }
    
    var aX = ace.posX - this.posX;
    var aY = ace.posY - this.posY;
    var norm = Math.sqrt(aX*aX+aY*aY)* (distance > 140000 ? 10 : 20);
    aX /= norm;
    aY /= norm;
    this.velX += aX;
    this.velY += aY;
    norm = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
    if(norm > (distance > 120000 ? 4 : 2))
    {
      this.velX /= norm;
      this.velY /= norm;
      this.velX *= (distance > 120000 ? 4 : 2);
      this.velY *= (distance > 120000 ? 4 : 2);
    }
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);
    
    context2D.drawImage(images[imgUfo2], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
  }
  
  this.hitUfo = function(ufo)
  {
    return false;
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY, this.frameWidth/2-4, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, this.frameWidth/2-14))
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
    if(hitCircleCircle(x, y, r, this.posX, this.posY, this.frameWidth/2-14))
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
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 57, 20);
    explosionsAdd(this.posX, this.posY, 57, 20);    
    ace.addScore(1000);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
