var starSpeed = 1;
var starSpeedControl = false;

function OldStar()
{
  this.img = 0;
  
  this.posX = 400;
  this.posY = -50;

  this.scale = 1;
  
  this.init = function()
  {
    this.img = Math.round(Math.random()*7-0.5);

    this.scale = Math.random();
    this.scale *= this.scale;
    this.scale *= this.scale;
    this.scale *= 0.7;
    this.scale += 0.3;
    this.scale = Math.round(this.scale*5)/5;
    this.posX = (Math.random()*canvas.width-8)/*/this.scale*/;
    this.posY = (Math.random()*canvas.height-8)/*/this.scale*/;
  }
  
  this.draw = function(context2D, mspf)
  {
    context2D.save();
    this.posY += starSpeed*mspf/60*this.scale;
    if(this.posY > canvasHeight/*/this.scale*/)
      this.posY = -images[this.img].height/**this.scale*/;
    context2D.scale(this.scale, this.scale);
    context2D.translate(this.posX/this.scale, this.posY/this.scale);
    if(starSpeed > 1)
      context2D.scale(1-starSpeed/20, 1+(starSpeed-1)/3);
    context2D.globalAlpha = 1 - (starSpeed - 1)/15;
    context2D.drawImage(images[this.img], 0,0/*this.posX, this.posY*/);
    context2D.globalAlpha = 1;
    context2D.restore();
  }
}

function Star(imgIndex, posX, posY)
{
  this.img = imgIndex;
  this.posX = posX;
  this.posY = posY;
}

function Stars()
{
  this.stars = new Array();
  
  this.scale = 1;
  
  this.init = function(starsCount, scale)
  {
    this.scale = scale;
    for(var i=0; i<starsCount; i++)
    {
      var s=Math.round(Math.random()*7-0.5);
      var x = (Math.random()*canvasWidth-8)/*/this.scale*/;
      var y = (Math.random()*canvasHeight-8)/*/this.scale*/;
      this.stars.push(new Star(s, x, y));
    }
  }
  
  this.draw = function(context2D, mspf)
  {
    //context2D.save();
    //context2D.scale(this.scale, this.scale);

    context2D.globalAlpha = 1 - (starSpeed - 1)/15;
    context2D.fillStyle = "#aaaaaa";
    for(var i=0; i<this.stars.length; i++)
    {
      this.stars[i].posY += starSpeed*mspf/60*this.scale;
      if(this.stars[i].posY > canvasHeight/*/this.scale*/)
        this.stars[i].posY = -images[this.stars[i].img].height/**this.scale*/;
      context2D.fillRect(this.stars[i].posX, this.stars[i].posY, 1, starSpeed/2);
      //context2D.drawImage(images[this.stars[i].img], this.stars[i].posX, this.stars[i].posY);
    }
    context2D.globalAlpha = 1;

    //context2D.restore();
  }
}

function Textik()
{
  this.time = 0;
  this.text1 = " ";  
  this.text2 = " ";  

  this.draw = function(context2D, mspf)
  {
    if(this.time > 0)
    {
      context2D.fillStyle = "#aaaaaa";
      context2D.font = '600 40px monospace';
      context2D.globalAlpha = this.time/1300 > 0.7 ? 0.7 : this.time/1300;
      context2D.fillText(this.text1, (canvas.width-context2D.measureText(this.text1).width)/2, canvas.height/2);
      context2D.fillText(this.text2, (canvas.width-context2D.measureText(this.text2).width)/2, canvas.height/2+50);
      context2D.globalAlpha = 1;
      this.time -= mspf;
    }
  }
}
