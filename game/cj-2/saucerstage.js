stages.push(new Stage1());

function Stage1()
{
  this.name = "Saucer Stage";
  this.id = "saucerstage";
  this.img = imagesPush(cjpath+"stage1.png");
  this.musicIndex = createMusic(cjpath+"omgsaucers.ogg");
  this.win = false;
  this.brief = ["We are hiring you to stop the flying saucers invading our planet.",
                "Do not let them breach the defenses! You have to destroy at least",
                "75% of them. There will be an extra reward if less get through.  "];

  this.start = function()
  {
    stage1();
    setTimeout("boxBattery()", 30000);
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

var nUfos = 0;
var nUfosLost = 0;

function stage1()
{
  var audio = new Audio(cjpath+'omgsaucers.ogg');
  audio.play();
  //audioMusic1.play();
  asteroids = 1;
  addAsteroids();
  setTimeout("addUfos()", 3000);
  setTimeout("stage11()", 60000);
}
function stage11()
{
  if(gameover)
    return;
  textik.text1 = "Incoming";
  textik.text2 = "Mothership";
  textik.time = 2000;
  ufos = false;
  setTimeout("stage12()", 5000);
}
function stage12()
{
  if(gameover)
    return;
  asteroids = 0;
  enemies.push(new Ufo2());
  enemies[enemies.length-1].init(enemies.length-1, 400, -100);
  setTimeout("stage13()", 500);
}
function stage13()
{
  if(gameover)
    return;
  if(enemies.length == 0 && plasma.length == 0 && missiles.length == 0)
  {
    if(nUfosLost > 0.25*nUfos)
    {
      ace.shield = 0;
      ace.hull = 0;
    }
    else
    {
      ace.score *= 1+(nUfos*0.25 - nUfosLost)/(nUfos*0.25);
    }
    gameover = true;
  }
  else
    setTimeout("stage13()", 500);
}
