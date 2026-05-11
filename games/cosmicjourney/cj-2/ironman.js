stages.push(new Ironman());

ironman = 0;

function Ironman()
{
  this.name = "Iron Man";
  this.id = "ironman";
  this.img = imagesPush(cjpath+"stageiron.png");
  this.win = false;
  this.brief = ["Now the glume will be sifted from the grain.",
                "Try to go through all the past journeys en bloc."];

  this.start = function()
  {
    ironman = stage;
    stage = 0;
    stages[0].start();
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

function stageIronman()
{
}
