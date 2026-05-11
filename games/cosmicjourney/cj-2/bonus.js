var bonus = new Array();

function bonusAdd(posX, posY, velX, velY)
{
  bonus.push(new Bonus2());
  bonus[bonus.length-1].init(bonus.length-1, posX, posY, velX, velY, -1);
}

function boxRandom()
{
  if(gameover) return;
  enemies.push(new Box());
  enemies[enemies.length-1].init(enemies.length-1, 50+Math.random()*700, -24, Math.floor(Math.random()*4.99));
}
function boxBattery()
{
  if(gameover) return;
  enemies.push(new Box());
  enemies[enemies.length-1].init(enemies.length-1, 50+Math.random()*700, -24, 0);  
}
function boxShield()
{
  if(gameover) return;
  enemies.push(new Box());
  enemies[enemies.length-1].init(enemies.length-1, 50+Math.random()*700, -24, 1);  
}
function boxWrench()
{
  if(gameover) return;
  enemies.push(new Box());
  enemies[enemies.length-1].init(enemies.length-1, 50+Math.random()*700, -24, 2);  
}
function boxGun()
{
  if(gameover) return;
  enemies.push(new Box());
  enemies[enemies.length-1].init(enemies.length-1, 50+Math.random()*700, -24, 3);  
}
function boxShuriken()
{
  if(gameover) return;
  enemies.push(new Box());
  enemies[enemies.length-1].init(enemies.length-1, 50+Math.random()*700, -24, 4);  
}

function bonusRemove(index)
{
  if(bonus.length <= index)
  {
    alert("bonusRemove");
    return;
  }
  bonus.splice(index, 1);
  for(var i=index; i<bonus.length; i++)
    bonus[i].index -= 1;
}

function Bonus2()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = 300;

  this.velX = 0;
  this.velY = 0;
  
  this.currentFrame = 0;
  this.frameWidth = 48;
  this.frameHeight = 48;
  
  this.currentFrame2 = 0;
  this.frames2 = 9;
  this.frameWidth2 = 24;
  this.frameHeight2 = 24;
  this.typ = 0;
  this.imgBonus = imgBonusBat;
  
  this.scale = 0;
  this.hit = false;

  this.init = function(index, posX, posY, velX, velY, b)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
    if(b<0) b=Math.random()*5;
    if(b < 1)
      this.imgBonus = imgBonusBat;
    else if(b < 2)
    {
      this.imgBonus = imgBonusShield;
      this.frames2 = 6;
    }
    else if(b < 3)
      this.imgBonus = imgBonusWrench;
    else if(b < 4)
    {
      this.imgBonus = imgBonusGun1;
      this.frames2 = 9;
    }
    else if(b < 5)
    {
      this.imgBonus = imgBonusShuriken;
      this.frames2 = 9;
    }
  }
  
  this.draw = function(context2D, mspf)
  {
    this.posX += this.velX*(mspf/30);
    this.posY += (starSpeed+this.velY)*(mspf/30);
    this.velX /= 1+mspf/600;
    this.velY /= 1+mspf/600;
    
    if(this.posX < this.frameWidth/2 || this.posX > canvasWidth+this.frameWidth/2 ||
       this.posY < this.frameHeight/2 || this.posY > canvasHeight+this.frameHeight/2)
    {
      bonusRemove(this.index);
      return;
    }
    
    if(this.hit)
    {
      this.scale -= mspf/300;
      if(this.scale <= 0)
      {
        bonusRemove(this.index);
        return;
      }
    }
    else if(this.scale < 1)
    {
      this.scale += mspf/300;
      if(this.scale > 1)
        this.scale = 1;
    }
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/90;
    if(this.currentFrame>=5)
      this.currentFrame = 0;
      
    var frame2 = Math.floor(this.currentFrame2);
    this.currentFrame2 += mspf/(this.frames2*10);
    if(this.currentFrame2>=this.frames2)
      this.currentFrame2 = 0;
      
    context2D.save();
    context2D.scale(this.scale, this.scale);
    if(this.hit)
      context2D.globalAlpha = this.scale;
    context2D.drawImage(images[this.imgBonus], frame2 * this.frameWidth2, 0, this.frameWidth2, this.frameHeight2, this.posX/this.scale-this.frameWidth2/2, this.posY/this.scale-this.frameHeight2/2, this.frameWidth2, this.frameHeight2);
    context2D.drawImage(images[imgBonus48], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX/this.scale-this.frameWidth/2, this.posY/this.scale-this.frameHeight/2, this.frameWidth, this.frameHeight);
    context2D.globalAlpha = 1;
    context2D.restore();
  }
  
  this.addBonus = function()
  {
    if(this.hit)
      return;
    if(this.imgBonus == imgBonusBat)
    {
      ace.core += 50;
      if(ace.core > 100)
        ace.core = 100;
    }
    else if(this.imgBonus == imgBonusShield)
    {
      ace.shield = 100;
    }
    else if(this.imgBonus == imgBonusWrench)
    {
      ace.hull += 50;
      if(ace.hull > 100)
        ace.hull = 100;
    }
    else if(this.imgBonus == imgBonusGun1)
    {
      ace.gun = new Gun1();
    }
    else if(this.imgBonus == imgBonusShuriken)
    {
      ace.gun = new Shuriken();
    }
  }
  
  this.hitRect = function(x, y, w, h)
  {
    if(this.scale < 1)
      return false;
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, this.frameWidth/2))
    {
      this.addBonus();
      this.hit = true;
      return true;
    }
    return false;
  }
  
  this.hitCircle = function(x, y, r)
  {
    if(this.scale < 1)
      return false;
    if(hitCircleCircle(x, y, r, this.posX, this.posY, this.frameWidth/2))
    {
      this.addBonus();
      this.hit = true;
      return true;
    }
    return false;
  }
}

function Box()
{
  this.index = 0;
  
  this.posX = 400;
  this.posY = -24;

  this.velX = 0;
  this.velY = 0.4;
  
  this.currentFrame = 0;
  this.frameWidth = 48;
  this.frameHeight = 48;
  
  this.power = 50;

  this.typ = 0;

  this.init = function(index, posX, posY, typ)
  {
    this.index = index;
    this.posX = posX;
    this.posY = posY;
    this.typ = typ;
  }
  
  this.draw = function(context2D, mspf)
  {
try{
    this.posX += this.velX*(mspf/30);
    this.posY += (starSpeed+this.velY)*(mspf/30);
    
    if(this.posY-this.frameHeight > canvasHeight && this.velY > 0 ||
       this.posY+this.frameHeight < 0 && this.velY < 0 ||
       this.posX-this.frameWidth > canvasWidth && this.velX > 0 ||
       this.posX+this.frameWidth < 0 && this.velX < 0)
    {
      enemyRemove(this.index);
      return;
    }
    
    var frame = Math.floor(this.currentFrame);
    this.currentFrame += mspf/100;
    if(this.currentFrame>=36)
      this.currentFrame = 0;
      
    context2D.drawImage(images[imgBox], frame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.posX-this.frameWidth/2, this.posY-this.frameHeight/2, this.frameWidth, this.frameHeight);
}catch(err){alert(err);}
  }
    
  this.hitUfo = function(ufo)
  {                    
    var ePower = ufo.power;
    if(ufo.hitCircle(this.posX, this.posY, 22, this.power))
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
    if(hitRectCircle(x, y, w, h, this.posX, this.posY, 22))
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
    if(hitCircleCircle(x, y, r, this.posX, this.posY, 22))
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
    bonus.push(new Bonus2());
    bonus[bonus.length-1].init(bonus.length-1, this.posX, this.posY, this.velX, this.velY, this.typ);
    debrisAdd(this.posX, this.posY, this.velX, this.velY, 22, 10);
    enemyRemove(this.index);    
    if(details)
    {
      var audio = new Audio(cjpath+'explode.wav');
      audio.play();      
    }
  }
}
