function leaks()
{
  if(ace.hull > 0)
  {
    debris.push(new Explosion1());
    var r = (Math.random()*2-1)*30;
    var a = Math.random()*360;
    var x = Math.sin(a)*r;
    var y = Math.cos(a)*r;
    debris[debris.length-1].init(debris.length-1, ace.posX+x, ace.posY+y, 0, Math.random()*0.4+0.4);
    setTimeout("leaks()", 50+Math.random()*ace.hull*50);
  }
}

function Ace()
{
  this.img = 0;
  this.imgShield320 = 0;

  this.posX = 400;
  this.posY = 300;
  
  this.targetX = 0;
  this.targetY = 0;

  this.velX = 0;
  this.velY = 0;
  
  this.currentFrame = 0;
  this.frameWidth = 64;
  this.frameHeight = 64;
  
  this.left = 0;
  this.up = 0;
  this.right = 0;
  this.down = 0;
  this.fire1 = 0;
  this.fire2 = 0;
  this.fire1Time = 0;
  this.fire2Time = 0;
  this.fire1Left = -16;

  this.hull = 100;
  this.shield = 100;
  this.core = 50;
  this.shieldHit = 0;
  
  this.score = 0;    
  this.scoreAdd = true;
  
  this.gun = null;
  
  this.init = function(posX, posY)
  {
    this.img = imagesPush(cjpath+"ace.png")
    this.imgShield320 = imagesPush(cjpath+"ace-shield320.png")
    this.posX = posX;
    this.posY = posY;
    //this.frameWidth = this.img.width/12;
    //this.frameHeight = this.img.height;
  }
  
  this.draw = function(context2D, mspf)
  {
    if(menu.state != menu.game)
    {
      this.left = 0;
      this.right = 0;
      this.up = 0;
      this.down = 0;
      this.fire1 = 0;
      this.fire2 = 0;
    }
    
    if(menu.state == menu.game)
    {
      this.shield += (this.core/100)*mspf/200;
      if(this.shield > 100)
        this.shield = 100;
      this.core += mspf/350;
      if(this.core > 100)
        this.core = 100;
      this.fire1Time += mspf;
    }
    
    if(this.fire1)
    {
      if(this.fire1Time > 150 && this.core > 0)
      {
        shots.push(new Shot());
        shots[shots.length-1].init(shots.length-1, this.posX+this.fire1Left, this.posY, this.velX, this.velY-20);
        this.core -= 1;
        this.fire1Left = -this.fire1Left;
        this.fire1Time = 0;        
        if(details)        
        {
          if(this.fire1Left > 0)
            audioFireL.play();
          else
            audioFireR.play();          
        }
      }
    }
    if(this.fire2Time < 0)    
    {
      this.fire2Time += mspf;      
      if(this.fire2Time > 0)      
        this.fire2Time = 0;
    }
    if(this.fire2 && this.fire2Time == 0 && this.shield > 0)
    {                  
      //this.shield -= 30;
      this.fire2Time = 1;
    }
    
    if(this.left)
      this.velX -= mspf/20;
    if(this.right)
      this.velX += mspf/20;
    if(!this.left && !this.right && this.velX<0)
      this.velX /= 1+mspf/300;
    if(!this.left && !this.right && this.velX>0)
      this.velX /= 1+mspf/300;

    if(this.up)
      this.velY -= mspf/20;
    if(this.down)
      this.velY += mspf/40;
    if(!this.up && !this.down && this.velY<0)
      this.velY /= 1+mspf/300;
    if(!this.up && !this.down && this.velY>0)
      this.velY /= 1+mspf/300;

    if(this.velX > 10)
      this.velX = 10;
    if(this.velX < -10)
      this.velX = -10;
    if(this.velY > 5)
      this.velY = 5;
    if(this.velY < -10)
      this.velY = -10;
    
    if(starSpeedControl == false)
      starSpeed = this.posY < 200 ? 1+(200-this.posY)/40 : 1;
    this.posX += this.velX*(mspf/30);
    this.posY += (mspf/30)* (this.posY >= 200 || starSpeedControl ? this.velY : this.velY + (starSpeed-1)*2.5);
    
    if(this.posX < this.frameWidth/2-4)
    {
      this.posX = this.frameWidth/2-4;
      this.velX = 0;
    }
    if(this.posX > canvasWidth-(this.frameWidth/2-4))
    {
      this.posX = canvasWidth-(this.frameWidth/2-4);
      this.velX = 0;
    }
    if(this.posY < this.frameHeight/2)
    {
      this.posY = this.frameHeight/2;
      this.velY = 0;
    }
    if(this.posY > canvas.height-10 && menu.state == menu.game)
    {
      this.posY = canvas.height-10;
      this.velY = 0;
    }
    
    if(this.targetX != 0)
    {
      var dx = this.targetX - this.posX;
      var dy = this.targetY - this.posY;
      var norm = Math.sqrt(dx*dx+dy*dy);
      if(norm < 10*mspf/30)
      {
        this.posX = this.targetX;
        this.targetX = 0;
        this.posY = this.targetY;
        this.targetY = 0;
      }
      else
      {
        dx /= norm;
        dy /= norm;
        this.posX += dx * 10*mspf/30;
        this.posY += dy * 10*mspf/30;
      }
    }
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf / 50;
    if(this.currentFrame >= 2)
      this.currentFrame = 0;
    if(this.up)
      frame += 2;

    if(this.left)
    {
      if(this.velX < -3)
        frame += 4;
      if(this.velX < -6)
        frame += 4;
      if(this.velX < -9)
        frame += 4;
    }
    else if(this.right)
    {
      if(this.velX > 3)
        frame += 16;
      if(this.velX > 6)
        frame += 4;
      if(this.velX > 9)
        frame += 4;
    }

    
    if(menu.state == menu.game || menu.state == menu.winstage || menu.state == menu.wingame)
    {
      context2D.globalAlpha = 0.2;
      context2D.fillStyle = "#ffffff";
      context2D.strokeStyle = "#ffffff";
      context2D.fillRect(10, canvasHeight-10-this.hull, 10, this.hull);
      context2D.strokeRect(10.5, canvasHeight-109.5, 9, 99);
      context2D.fillStyle = "#5555ff";
      context2D.strokeStyle = "#5555ff";
      context2D.fillRect(23, canvasHeight-10-this.shield, 10, this.shield);
      context2D.strokeRect(23.5, canvasHeight-109.5, 9, 99);
      context2D.fillStyle = "#ff5555";
      context2D.strokeStyle = "#ff5555";
      context2D.fillRect(36, canvasHeight-10-this.core, 10, this.core);
      context2D.strokeRect(36.5, canvasHeight-109.5, 9, 99);
      
      context2D.globalAlpha = 0.5;
      context2D.fillStyle = "#ffffff";
      context2D.font = '12px monospace';
      context2D.fillText("score: "+this.score, 55, canvas.height-10);  
      context2D.restore();
      context2D.globalAlpha = 1;      
    }

    for(var s=0; s<shots.length; s++)
    {
      shots[s].draw(context2D, mspf);
    }

    context2D.drawImage(images[this.img], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);

    if(this.gun)
      this.gun.draw(context2D, mspf);

    if(this.fire2Time > 0)
    {
      context2D.save();
      var scale= 0.2 + 1.8 * this.fire2Time*this.fire2Time/250000;
      context2D.scale(scale, scale);
      context2D.globalAlpha = 1-this.fire2Time*this.fire2Time*this.fire2Time/125000000;
      context2D.drawImage(images[this.imgShield320], this.posX/scale-160, this.posY/scale-165);
      context2D.globalAlpha = 1;
      context2D.restore();
      this.fire2Time += mspf;
      if(this.fire2Time > 500)
        this.fire2Time = 0;
    }
    else if(this.shieldHit > 0)
    {
      if(this.shieldHit > 1000)
        this.shieldHit = 1000;
      context2D.globalAlpha = this.shieldHit/1000;
      context2D.drawImage(images[imgShield], this.posX-this.frameWidth/2, this.posY-37);
      context2D.globalAlpha = 1;
      this.shieldHit -= mspf;
    }
  }

  this.addScore = function(score)  
  {
try{
    if(this.scoreAdd && !gameover)    
    {
      this.score += score;    
      this.score = Math.round(this.score);      
    }
}catch(err){alert(err);}
  }

  this.getRadius = function()
  {
    if(this.fire2Time > 0 && this.shield > 0)
       return(32 + 304 * this.fire2Time*this.fire2Time/250000);
    return(30);
  }

  this.hitObject = function(object)
  {
    try
    {
      var ePower = object.power;
      if(!gameover && object.hitCircle(this.posX, this.posY-2, this.getRadius(), this.hull + this.shield))
      {
        this.hit(ePower);
        return true;
      }
      if(this.gun && this.gun.hitObject(object))
        return true;
    }
    catch(err) {alert(err);}
    return false;
  }

  this.hitRect = function(x, y, w, h, power)
  {
    try
    {
      if(!gameover && hitRectCircle(x, y, w, h, this.posX, this.posY-2, this.getRadius()))
      {
        this.hit(power);
        return true;
      }
      if(this.gun && this.gun.hitRect(x, y, w, h, power))
        return true;
    }
    catch(err) {alert(err);}
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    try
    {
      if(!gameover && hitCircleCircle(x, y, r, this.posX, this.posY-2, this.getRadius()))
      {
        this.hit(power);
        return true;
      }
      if(this.gun && this.gun.hitCircle(x, y, r, power))
        return true;
    }
    catch(err) {alert(err);}
    return false;
  }
  
  this.hit = function(power)
  {
    if(gameover)
      return;
    if(this.fire2Time > 0)
    {          
      this.shield -= power/3;      
      if(this.shield < 0)      
      {      
        this.shield = 0;        
        this.fire2Time = -4000;
      }      
      if(details)
        audioShield.play();
      return;      
    }
    if(this.hull > 0)
    {
      if(this.shield < power)
      {
        if(this.shield > 0)
          this.shieldHit = this.shield * 100;
        this.shield = 0;
        if(this.hull == 100)
          leaks();
        this.hull -= power;
        if(this.hull <= 0)
        {
          this.hull = 0;
          gameover = true;
          debrisAdd(this.posX, this.posY, this.velX, this.velY, 30, 30);
          explosionsAdd(this.posX, this.posY, 50, 50);    
        }        
        if(details)
          audioHull.play();
      }
      else
      {
        this.shieldHit = power * 100;
        this.shield -= power;
        if(details)
          audioShield.play();
      }
    }
  }
}

function Gun1()
{
  this.img = imgGun1;

  this.posX = 400;
  this.posX2 = 400;
  this.posY = 800;

  this.velX = 0;
  this.velY = 0;
  
  this.currentFrame = 0;
  this.frameWidth = 19;
  this.frameHeight = 32;

  this.fireTime = 0;

  this.power = 5;
  this.hull = 200;

  this.init = function()
  {
  }
  
  this.draw = function(context2D, mspf)
  {
    try
    {
      this.fireTime += mspf;
      if(ace.fire1)
      {
        if(this.fireTime > 400 && ace.core > 0)
        {
          shots.push(new Shot());
          shots[shots.length-1].init(shots.length-1, this.posX, this.posY, this.velX, this.velY-20);
          shots.push(new Shot());
          shots[shots.length-1].init(shots.length-1, this.posX2, this.posY, this.velX, this.velY-20);
          //ace.core -= 1;
          this.fireTime = 0;
          this.currentFrame = 0.1;
        }
      }
      
      /*this.velX = (ace.posX+80 - this.posX)/4;
      this.velY = (ace.posY - this.posY)/4;
      if(this.velX < 0)
        this.velX *= 0.6;
      var norm = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
      if(norm > 12)
      {
        this.velX /= norm;
        this.velY /= norm;
        this.velX *= 12;
        this.velY *= 12;
      }
      this.posX += this.velX*(mspf/30);
      this.posY += this.velY*(mspf/30);*/
      
      this.posY = ace.posY - ace.velY*3;
      this.posX = ace.posX - ace.velX*2 + 80 - 2*Math.abs(ace.velY);
      this.posX2 = ace.posX - ace.velX*2 - 80 + 2*Math.abs(ace.velY);

      var frame = Math.floor(this.currentFrame);
      if(this.currentFrame > 0)
        this.currentFrame += mspf/50;
      if(this.currentFrame >= 8)
        this.currentFrame = 0;
      
      context2D.drawImage(images[this.img], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
      context2D.drawImage(images[this.img], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX2-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
    }
    catch(err){alert(err);}
  }

  this.hitObject = function(object)
  {
    var ePower = object.power;
    if(!gameover && object.hitCircle(this.posX, this.posY-6, 8, this.power))
    {
      explosionAdd(this.posX-8+Math.random()*16, this.posY-8+Math.random()*16, 0.5);
      this.hull -= ePower;
      if(this.hull <= 0)
        this.finish();
      return true;
    }
    if(!gameover && object.hitCircle(this.posX2, this.posY-6, 8, this.power))
    {
      explosionAdd(this.posX2-8+Math.random()*16, this.posY-8+Math.random()*16, 0.5);
      this.hull -= ePower;
      if(this.hull <= 0)
        this.finish();
      return true;
    }
    return false;
  }

  this.hitRect = function(x, y, w, h, power)
  {
    
    if(!gameover && (hitRectCircle(x, y, w, h, this.posX, this.posY-6, 8) || hitRectCircle(x, y, w, h, this.posX2, this.posY-6, 8)))
    {
      this.hull -= power;
      if(this.hull <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(!gameover && (hitCircleCircle(x, y, r, this.posX, this.posY-6, 8) || hitCircleCircle(x, y, r, this.posX2, this.posY-6, 8)))
    {
      this.hull -= power;
      if(this.hull <= 0)
        this.finish();
      return true;
    }
    return false;
  }

  this.finish = function()
  {
    debrisAdd(this.posX, this.posY, ace.velX, ace.velY, 8, 5);
    debrisAdd(this.posX2, this.posY, ace.velX, ace.velY, 8, 5);
    explosionsAdd(this.posX, this.posY, 10, 5);    
    explosionsAdd(this.posX2, this.posY, 10, 5);    
    ace.gun = null;
  }
}

function Shuriken()
{
  this.img = imgShuriken;

  this.posX = 400;
  this.posY = 800;
  this.angle = 0;

  this.velX = 0;
  this.velY = 0;
  
  this.currentFrame = 0;
  this.frameWidth = 32;
  this.frameHeight = 32;

  this.fireTime = 0;

  this.power = 20;
  this.hull = 1000;

  this.init = function()
  {
  }
  
  this.draw = function(context2D, mspf)
  {
    try
    {
      this.angle += mspf/250;
      if(this.angle > 2*pi)
        this.angle -= 2*pi;
      this.posX = ace.posX + Math.cos(this.angle)*90 - ace.velX*2;
      this.posY = ace.posY + Math.sin(this.angle)*90 - ace.velY*2;

      var frame = Math.floor(this.currentFrame);
      this.currentFrame += mspf/30;
      if(this.currentFrame >= 9)
        this.currentFrame = 0;
      
      context2D.drawImage(images[this.img], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
    }
    catch(err){alert(err);}
  }

  this.hitObject = function(object)
  {
    var ePower = object.power;
    if(!gameover && object.hitCircle(this.posX, this.posY, 15, this.power))
    {
      explosionAdd(this.posX-15+Math.random()*30, this.posY-15+Math.random()*30, 0.5);
      this.hull -= ePower;
      if(this.hull <= 0)
        this.finish();
      return true;
    }
    return false;
  }

  this.hitRect = function(x, y, w, h, power)
  {
    
    if(!gameover && hitRectCircle(x, y, w, h, this.posX, this.posY, 15))
    {
      this.hull -= power;
      if(this.hull <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(!gameover && hitCircleCircle(x, y, r, this.posX, this.posY, 15))
    {
      this.hull -= power;
      if(this.hull <= 0)
        this.finish();
      return true;
    }
    return false;
  }

  this.finish = function()
  {
    debrisAdd(this.posX, this.posY, ace.velX, ace.velY, 15, 10);
    explosionsAdd(this.posX, this.posY, 15, 5);
    ace.gun = null;
  }
}
