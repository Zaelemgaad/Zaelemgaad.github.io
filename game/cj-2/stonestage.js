stages.push(new Stage0());

function Stage0()
{
  this.name = "Stone Stage";
  this.id = "stonestage";
  this.img = imagesPush(cjpath+"stage0.png");
  this.musicIndex = createMusic(cjpath+"omgwormhole.ogg");
  this.win = false;
  this.brief = ["Something is wrong with the asteroid belt. Too many",
                "asteroids are heading towards our planet. Find out ",
                "who is behind this attack and destroy them.        "];

  this.start = function()
  {
    asteroids = 2;
    addAsteroids();
    stage0();
    setTimeout("boxBattery()", 10000);
    audios[this.musicIndex].play();
  }

  this.drawBrief = function()
  {
    context2D.globalAlpha = 0.6;
    context2D.fillStyle = "#aaaaaa";
    context2D.font = '900 12px monospace';
    for(var i=0; i<this.brief.length; i++)
      context2D.fillText(this.brief[i], (canvas.width-context2D.measureText(this.brief[i]).width)/2, 405+i*17);
    context2D.globalAlpha = 1;
  }
}

function stage0()
{
  if(gameover)
    return;
  if(distance < 60000)
  {
    setTimeout("stage0()", 1000);
    if(Math.random() < 0.1)
    {
      enemies.push(new Miner());
      enemies[enemies.length-1].init(enemies.length-1, 10+Math.random()*780, -20, 0, 1);
    }
  }
  else
  {
    asteroids = 0.5;
    textik.text1 = "Incoming";
    textik.text2 = "Stone Storm";
    textik.time = 2000;
    setTimeout("stage02()", 5000);
  }
}

function stage02()
{
  if(gameover)
    return;
  if(distance < 110000)
  {
    var typ = Math.random();
    var y = -16;
    var x = canvas.width/2;
    if(typ < 0.25)
    {
      var x = -30;
      var y = -30+(canvas.height+60)*Math.random();
    }
    else if(typ < 0.5)
    {
      var x = canvas.width+30;
      var y = -30+(canvas.height+60)*Math.random();
    }
    else if(typ < 0.75)
    {
      var y = -30;
      var x = -30+(canvas.width+60)*Math.random();
    }
    else
    {
      var y = canvas.height+30;
      var x = -30+(canvas.width+60)*Math.random();
    }
    var velX = Math.random()*canvas.width - x;
    var velY = Math.random()*canvas.height - y;
    var norm = Math.sqrt(velX*velX+velY*velY)*(0.1+Math.random()*0.5);
    velX /= norm;
    velY /= norm;
    enemies.push(new Asteroid());
    enemies[enemies.length-1].init(enemies.length-1, x, y, velX, velY);  
    setTimeout("stage02()", 500);
  }
  else
  {
    setTimeout("stage03()", 4000);
  }
}

function stage03()
{
  asteroids = 0;
  textik.text1 = "Destroy Miner base";
  textik.text2 = "";
  textik.time = 2000;
  enemies.push(new Base());
  enemies[enemies.length-1].init(enemies.length-1);
  stage04();
}

function stage04()
{
  if(gameover)
    return;

  if(enemies.length == 0)
    gameover = true;
  else
    setTimeout("stage04()", 1000);
}
