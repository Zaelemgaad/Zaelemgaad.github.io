var debris = new Array();
function debrisAdd(posX, posY, velX, velY, radius, count)
{
  var m = (fps-20)/20;
  if(m < 0.2) m = 0.2;
  if(m > 2) m = 2;
  count *= m;
  for(var i=0; i<count; i++)
  {
    debris.push(new Debris1());
    var r = (Math.random()*2-1)*radius;
    var a = Math.random()*2*pi;
    var x = Math.sin(a)*r;
    var y = Math.cos(a)*r;
    if(radius < 0)
      radius = -radius;
    debris[debris.length-1].init(debris.length-1, posX+x, posY+y, velX/2+4*x/radius, velY/2+4*y/radius);
  }
}
function stonesAdd(posX, posY, velX, velY, radius, count)
{
  var m = (fps-20)/20;
  if(m < 0.2) m = 0.2;
  if(m > 1) m = 1;
  count *= m;
  for(var i=0; i<count; i++)
  {
    debris.push(new Stone1());
    var r = (Math.random()*2-1)*radius;
    var a = Math.random()*2*pi;
    var x = Math.sin(a)*r;
    var y = Math.cos(a)*r;
    if(radius < 0)
      radius = -radius;
    debris[debris.length-1].init(debris.length-1, posX+x, posY+y, velX/2+2*x/radius, velY/2+2*y/radius);
  }
}
function explosionsAdd(posX, posY, radius, count)
{
  var m = (fps-20)/20;
  if(m < 0.2) m = 0.2;
  if(m > 2) m = 2;
  count *= m;
  for(var i=0; i<count; i++)
  {
    debris.push(new Explosion1());
    if(radius > 0)
    {
      var r = (Math.random()*2-1)*radius;
      var a = Math.random()*2*pi;
      var x = Math.sin(a)*r;
      var y = Math.cos(a)*r;
      debris[debris.length-1].init(debris.length-1, posX+x, posY+y, -1000*Math.random(), Math.random()*0.3+0.7);
    }
    else
      debris[debris.length-1].init(debris.length-1, posX, posY, 0, Math.random()*0.3+0.7);
  }
}
function explosions2Add(posX, posY, radius, count)
{
  var m = (fps-20)/20;
  if(m < 0.2) m = 0.2;
  if(m > 2) m = 2;
  count *= m;
  for(var i=0; i<count; i++)
  {
    debris.push(new Explosion1());
    if(radius > 0)
    {
      var r = (Math.random()*2-1)*radius;
      var a = Math.random()*2*pi;
      var x = Math.sin(a)*r;
      var y = Math.cos(a)*r;
      debris[debris.length-1].init(debris.length-1, posX+x, posY+y, -1000*Math.random(), Math.random()*0.3+0.7);
      debris[debris.length-1].img = imgExplosion2;
    }
    else
    {
      debris[debris.length-1].init(debris.length-1, posX, posY, 0, Math.random()*0.3+0.7);
      debris[debris.length-1].img = imgExplosion2;
    }
  }
}
function explosionAdd(posX, posY, scale)
{
  debris.push(new Explosion1());
  debris[debris.length-1].init(debris.length-1, posX, posY, 0, scale);
}

function debrisRemove(index)
{
  if(debris.length <= index)
  {
    alert("debrisRemove");
    return;
  }
  debris.splice(index, 1);
  for(var i=index; i<debris.length; i++)
    debris[i].index -= 1;
}

function Debris1()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 300;

  this.velX = -3;
  this.velY = 1;
  
  this.currentFrame = 0;
  this.rot = 1;
  this.frameWidth = 16;
  this.frameHeight = 16;
  
  this.power = 1;
  
  this.scale = 1;

  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.scale = Math.random()*0.8+0.2;
    this.velX = velX;///2+Math.random()*2-1;
    this.velY = velY;///2+Math.random()*2-1;
    this.currentFrame = Math.round(Math.random()*11);
    this.rot = Math.random()+0.5;
    this.power = this.scale*4;
  }
  
  this.draw = function(context2D, mspf)
  {
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);
    
    if(this.power <= 0 ||
       this.posX < this.frameWidth/2 || this.posX > canvasWidth+this.frameWidth/2 ||
       this.posY < this.frameHeight/2 || this.posY > canvasHeight+this.frameHeight/2)
    {
      debrisRemove(this.index);
      return;
    }
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += this.rot*(mspf/30);
    if(this.currentFrame>=12)
      this.currentFrame = 0;
    
    context2D.save();
    context2D.scale(this.scale, this.scale);
    context2D.drawImage(images[imgDebris1], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX/this.scale-this.frameWidth/2, this.posY/this.scale-this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.restore();
  }
  
  this.hitRect = function(x, y, w, h, power)
  {
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, this.frameWidth/2))
    {
      this.power -= power;
      if(this.power < 0)
      {
        debrisRemove(this.index);
        this.power = 0;
      }
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(hitCircleCircle(x, y, r, this.posX, this.posY, this.frameWidth/2))
    {
      this.power -= power;
      if(this.power < 0)
      {
        debrisRemove(this.index);
        this.power = 0;
      }
      return true;
    }
    return false;
  }
}

function Explosion1()
{
  this.posX = 400;
  this.posY = 300;

  this.power = 0;
  
  this.scale = 0;
  this.scaleMax = 1;
  this.delay = 0

  this.img = imgExplosion1;

  this.init = function(index, posX, posY, delay, scaleMax)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.delay = delay;
    this.scaleMax = scaleMax;
  }
  
  this.draw = function(context2D, mspf)
  {
    this.delay+=mspf;
    if(this.delay > this.scaleMax*500)
    {
      debrisRemove(this.index);
      return;
    }
    
    if(this.delay <= 0)
      return;

    this.scale = this.scaleMax * this.delay/500;
    
    context2D.save();
    context2D.scale(this.scale, this.scale);
    context2D.globalAlpha = 1.1-(this.delay / (this.scaleMax*500));
    context2D.drawImage(images[this.img], this.posX/this.scale-images[imgExplosion1].width/2, this.posY/this.scale-images[imgExplosion1].height/2);
    context2D.globalAlpha = 1;
    context2D.restore();
  }
  
  this.hitRect = function(x, y, w, h, power)
  {
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    return false;
  }
}

function Stone1()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 300;

  this.velX = -3;
  this.velY = 1;
  
  this.currentFrame = 0;
  this.rot = 1;
  this.frameWidth = 16;
  this.frameHeight = 16;
  
  this.power = 10;
  
  this.scale = 1;

  this.init = function(index, posX, posY, velX, velY)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.scale = Math.random()*0.6+0.4;
    this.velX = velX;///2+Math.random()*2-1;
    this.velY = velY;///2+Math.random()*2-1;
    this.currentFrame = Math.round(Math.random()*11);
    this.rot = Math.random()+0.5;
    this.power = this.scale*6;
  }
  
  this.draw = function(context2D, mspf)
  {
    this.posX += this.velX*(mspf/30);
    this.posY += this.velY*(mspf/30);
    
    if(this.power <= 0 ||
       this.posX < this.frameWidth/2 || this.posX > canvasWidth+this.frameWidth/2 ||
       this.posY < this.frameHeight/2 || this.posY > canvasHeight+this.frameHeight/2)
    {
      debrisRemove(this.index);
      return;
    }
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += this.rot*(mspf/30);
    if(this.currentFrame>=36)
      this.currentFrame = 0;
    
    context2D.save();
    context2D.scale(this.scale, this.scale);
    context2D.drawImage(images[imgStone1], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX/this.scale-this.frameWidth/2, this.posY/this.scale-this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.restore();
  }
  
  this.hitRect = function(x, y, w, h, power)
  {
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, this.frameWidth/2))
    {
      this.power -= power;
      if(this.power < 0)
      {
        debrisRemove(this.index);
        this.power = 0;
      }
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r, power)
  {
    if(hitCircleCircle(x, y, r, this.posX, this.posY, this.frameWidth/2))
    {
      this.power -= power;
      if(this.power < 0)
      {
        debrisRemove(this.index);
        this.power = 0;
      }
      return true;
    }
    return false;
  }
}
