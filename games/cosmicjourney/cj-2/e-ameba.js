var maxX = 400;
var minX = 400;
function Ameba()
{
  this.index = 0;
                    
  this.posX = 400;
  this.posY = 300;
  this.oX = 400;
  this.oY = 300;

  this.velX = 0;
  this.velY = 0;
  
  this.img = imgAmeba1;
  this.currentFrame = 0;
  this.frames = 13;
  this.frameWidth = 48;
  this.frameHeight = 36;
  this.hitRadius = 14;
  this.hitY = -7;
  
  this.power = 25;

  this.eye1 = 0;
  this.eye1d = 0.01;
  this.eye1x = 3;
  this.eye1y = 0;
  this.eye2 = 0;
  this.eye2d = 0.1;
  this.eye2x = -3;
  this.eye2y = 0;
  this.eye3 = 0;
  this.eye3d = 0.1;
  this.eye3x = 0;
  this.eye3y = 3;

  this.fire = false;
    
  this.init = function(index, ofsetX, ofsetY, typ)
  {        
    this.index = index;
    this.oX = ofsetX;
    this.oY = ofsetY;
    this.posX = queen.posX + this.oX;
    this.posY = queen.posY + this.oY;
    if(typ == 2)
    {
      this.img = imgAmeba2;
      this.frames = 15;
      this.frameWidth = 48;
      this.frameHeight = 29;
      this.hitRadius = 14;
      this.hitY = -7;
    }
    else if(typ == 3)
    {
      this.img = imgAmeba3;
      this.frames = 15;
      this.frameWidth = 40;
      this.frameHeight = 30;
      this.hitRadius = 11;
      this.hitY = -4;
    }
    this.currentFrame = Math.random()*(this.frames-1);
  }
  
  this.draw = function(context2D, mspf)
  {
try{
    if(this.fire)
    {
      plasma.push(new Plasma());
      plasma[plasma.length-1].init(plasma.length-1, this.posX, this.posY, queen.velX, 6+Math.random()*6);
      this.fire = false;
    }
    this.posX = queen.posX + this.oX;
    this.posY = queen.posY + this.oY;
    var rot = queen.velX/20;
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += (Math.abs(queen.velX*0.5)+1)*mspf/100;
    if(this.currentFrame>=this.frames)
      this.currentFrame = 0;

    this.eye1 += this.eye1d*(mspf/30);
    if(this.eye1d > 0 && this.eye1 >= 1)
    {
      this.eye1d = -this.eye1d;
      this.eye1 = 1;
    }
    else if(this.eye1d < 0 && this.eye1 <= 0)
    {
      this.eye1d = 0.05+Math.random()*0.05;
      this.eye1 = 0;
      this.eye1x = -3 + Math.random()*6;
      this.eye1y = -3 + Math.random()*6;
    }
    this.eye2 += this.eye2d*(mspf/30);
    if(this.eye2d > 0 && this.eye2 >= 1)
    {
      this.eye2d = -this.eye2d;
      this.eye2 = 1;
    }
    else if(this.eye2d < 0 && this.eye2 <= 0)
    {
      this.eye2d = 0.05+Math.random()*0.05;
      this.eye2 = 0;
      this.eye2x = -3 + Math.random()*6;
      this.eye2y = -3 + Math.random()*6;
    }
    this.eye3 += this.eye3d*(mspf/30);
    if(this.eye3d > 0 && this.eye3 >= 1)
    {
      this.eye3d = -this.eye3d;
      this.eye3 = 1;
    }
    else if(this.eye3d < 0 && this.eye3 <= 0)
    {
      this.eye3d = 0.05+Math.random()*0.05;
      this.eye3 = 0;
      this.eye3x = -3 + Math.random()*6;
      this.eye3y = -3 + Math.random()*6;
    }

    if(this.posX > maxX) maxX = this.posX;
    if(this.posX < minX) minX = this.posX;
    
    context2D.save();
    var dy = frame < 7 ? frame/2 : (12-frame)/2;
    context2D.translate(this.posX, this.posY+dy);
    context2D.rotate(rot);
    context2D.drawImage(images[this.img], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.globalAlpha = this.eye1;
    var dye = frame < 7 ? frame*0.8 : (12-frame)*0.8;
    context2D.drawImage(images[imgAmebaEye], -5+this.eye1x, -8+this.eye1y - dye);
    context2D.globalAlpha = this.eye2;
    context2D.drawImage(images[imgAmebaEye], -5+this.eye2x, -8+this.eye2y - dye);
    context2D.globalAlpha = this.eye3;
    context2D.drawImage(images[imgAmebaEye], -5+this.eye3x, -8+this.eye3y - dye);
    context2D.globalAlpha = 1;
    context2D.restore();
}catch(err){alert(err);}
  }
  
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY+this.hitY, this.hitRadius, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX, this.posY+this.hitY, this.hitRadius))
    {
      var pm = power*1.3*(queen.velX+queen.velY-0.5);
      if(pm > 0)
        this.power -= pm;
      if(this.power <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(hitCircleCircle(x, y, r, this.posX, this.posY+this.hitY, this.hitRadius))
    {
      var pm = power*1.3*(queen.velX+queen.velY-0.5);
      if(pm > 0)
        this.power -= pm;
      if(this.power <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  this.finish = function()
  {
    explosions2Add(this.posX, this.posY+this.hitY, this.hitRadius, 10);    
    ace.addScore(100);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}

function Queen()
{
  this.index = 0;
                    
  this.posX = 400;
  this.posY = 300;
  this.targetX = 400;
  this.targetY = 50;

  this.velX = 0;
  this.velY = 0;
  
  this.currentFrame = 0;
  this.frameWidth = 80;
  this.frameHeight = 80;
  
  this.power = 100;

  this.eye1 = 0;
  this.eye1d = 0.06;
  this.eye1x = 5;
  this.eye1y = 0;
  this.eye2x = -5;
  this.eye2y = 0;
  this.eye3 = 0;
  this.eye3d = 0.05;
  this.eye3x = 0;
  this.eye3y = -5;
  this.eye4x = 0;
  this.eye4y = 5;

  this.plasma = 1000;
  this.fire = false;
    
  this.init = function(index, posX, posY)
  {        
    this.index = index;
    this.posX = posX;
    this.posY = posY;
  }
  
  this.draw = function(context2D, mspf)
  {
    if(this.fire)
    {
      plasma.push(new Plasma());
      plasma[plasma.length-1].init(plasma.length-1, this.posX, this.posY, 0, 6+Math.random()*6);
      this.fire = false;
    }
    this.plasma -= mspf*(800-ace.posY)/200;
    if(this.plasma < 0 && enemies.length > 1)
    {
      enemies[1+Math.round(Math.random()*(enemies.length-2))].fire = true;
      this.plasma = Math.random()*1000*(60000/distance);
    }
    var speed = this.posY / 100;
    if(speed < 0.5) speed=0.5;
    if(speed > 6) speed=6;

    this.velX = this.targetX - this.posX;
    this.velY = this.targetY - this.posY;
    norm = Math.sqrt(this.velX*this.velX+this.velY*this.velY);
    
    if(norm > 0.1)
    {
      this.velX /= norm;
      this.velY /= norm;
      this.velX *= speed;
      this.velY *= speed;
    }
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);
    var rot = this.velX/20;

    if(this.posX+10 > maxX) maxX = this.posX+10;
    if(this.posX-10 < minX) minX = this.posX-10;

    if(maxX > 770 && this.targetX == 800)
    {
      this.targetX = this.posX - maxX + 770;
      this.targetY += 20;
      maxX = 400;
      minX = 400;
    }
    if(minX < 30 && this.targetX == 0)
    {
      this.targetX = this.posX - minX + 30;
      this.targetY += 20;
      maxX = 400;
      minX = 400;
    }
    if(norm<10 && this.targetX != 0 && this.targetX != 800)
    {
      maxX = 400;
      minX = 400;
      if(this.targetX > 400)
        this.targetX = 0;
      else
        this.targetX = 800;
    }
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/60;
    if(this.currentFrame>=16)
      this.currentFrame = 0;

    this.eye1 += this.eye1d*(mspf/30);
    if(this.eye1d > 0 && this.eye1 >= 1)
    {
      this.eye1d = -this.eye1d;
      this.eye1 = 1;
      this.eye2x = -12 + Math.random()*24;
      this.eye2y = -10 + Math.random()*20;
    }
    else if(this.eye1d < 0 && this.eye1 <= 0)
    {
      this.eye1d = 0.05+Math.random()*0.05;
      this.eye1 = 0;
      this.eye1x = -12 + Math.random()*24;
      this.eye1y = -10 + Math.random()*20;
    }
    this.eye3 += this.eye3d*(mspf/30);
    if(this.eye3d > 0 && this.eye3 >= 1)
    {
      this.eye3d = -this.eye3d;
      this.eye3 = 1;
      this.eye4x = -12 + Math.random()*24;
      this.eye4y = -10 + Math.random()*20;
    }
    else if(this.eye3d < 0 && this.eye3 <= 0)
    {
      this.eye3d = 0.05+Math.random()*0.05;
      this.eye3 = 0;
      this.eye3x = -12 + Math.random()*24;
      this.eye3y = -10 + Math.random()*20;
    }
    
    context2D.save();
    context2D.translate(this.posX, this.posY);
    context2D.rotate(rot);
    context2D.drawImage(images[imgAmeba4], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.globalAlpha = this.eye1;
    context2D.drawImage(images[imgAmeba1Eye], -4+this.eye1x, -25+this.eye1y);
    context2D.globalAlpha = 1-this.eye1;
    context2D.drawImage(images[imgAmeba2Eye], -4+this.eye2x, -25+this.eye2y);
    context2D.globalAlpha = this.eye3;
    context2D.drawImage(images[imgAmeba1Eye], -4+this.eye3x, -25+this.eye3y);
    context2D.globalAlpha = 1-this.eye3;
    context2D.drawImage(images[imgAmeba2Eye], -4+this.eye4x, -25+this.eye4y);
    context2D.globalAlpha = 1;
    context2D.restore();

    if(ace.hull > 0 && this.posY < 600 && ace.posY < this.posY+(800-this.posY)/2)
    {
      context2D.strokeStyle = "#eef";
      context2D.lineWidth = 0.5;
      context2D.beginPath();

      context2D.moveTo(this.posX-10+Math.random()*20, this.posY-30+Math.random()*20);
      var dx = ace.posX-this.posX;
      var dy = ace.posY-this.posY;
      var px = this.posX + dx/4 + Math.random() * dx/3 - dx/6;
      var py = this.posY + dy/4 + Math.random() * dy/3 - dy/6 - 20;
      context2D.lineTo(px, py);
      dx = ace.posX-px;
      dy = ace.posY-py;
      px += dx/3 + Math.random() * dx/3 - dx/6;
      py += dy/3 + Math.random() * dy/3 - dy/8;
      context2D.lineTo(px, py);
      dx = ace.posX-px;
      dy = ace.posY-py;
      px += dx/2 + Math.random() * dx/3 - dx/6;
      py += dy/2 + Math.random() * dy/3 - dy/6;
      context2D.lineTo(px, py);
      context2D.lineTo(ace.posX, ace.posY);

      context2D.moveTo(this.posX-10+Math.random()*20, this.posY-30+Math.random()*20);
      dx = ace.posX-this.posX;
      dy = ace.posY-this.posY;
      px = this.posX + dx/4 + Math.random() * dx/3 - dx/6;
      py = this.posY + dy/4 + Math.random() * dy/3 - dy/6 - 20;
      context2D.lineTo(px, py);
      dx = ace.posX-px;
      dy = ace.posY-py;
      px += dx/3 + Math.random() * dx/3 - dx/6;
      py += dy/3 + Math.random() * dy/3 - dy/6;
      context2D.lineTo(px, py);
      dx = ace.posX-px;
      dy = ace.posY-py;
      px += dx/2 + Math.random() * dx/3 - dx/6;
      py += dy/2 + Math.random() * dy/3 - dy/6;
      context2D.lineTo(px, py);
      context2D.lineTo(ace.posX, ace.posY);

      context2D.moveTo(this.posX-10+Math.random()*20, this.posY-30+Math.random()*20);
      dx = ace.posX-this.posX;
      dy = ace.posY-this.posY;
      px = this.posX + dx/4 + Math.random() * dx/3 - dx/6;
      py = this.posY + dy/4 + Math.random() * dy/3 - dy/6 - 20;
      context2D.lineTo(px, py);
      dx = ace.posX-px;
      dy = ace.posY-py;
      px += dx/3 + Math.random() * dx/3 - dx/6;
      py += dy/3 + Math.random() * dy/3 - dy/6;
      context2D.lineTo(px, py);
      dx = ace.posX-px;
      dy = ace.posY-py;
      px += dx/2 + Math.random() * dx/3 - dx/6;
      py += dy/2 + Math.random() * dy/3 - dy/6;
      context2D.lineTo(px, py);
      context2D.lineTo(ace.posX, ace.posY);

      context2D.stroke();
      context2D.closePath();

      ace.hit(mspf/15);
    }
  }
  
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY, 38, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, 38))
    {
      if(enemies.length == 1)
        this.power -= power;
      if(this.power <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(hitCircleCircle(x, y, r, this.posX, this.posY, 38))
    {
      if(enemies.length == 1)
        this.power -= power;
      if(this.power <= 0)
        this.finish();
      return true;
    }
    return false;
  }
  this.finish = function()
  {
    explosionsAdd(this.posX, this.posY, 40, 10);    
    ace.addScore(1000);
    enemyRemove(this.index);
    if(details)    
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
