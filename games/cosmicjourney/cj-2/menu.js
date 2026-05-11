function Menu()
{
  this.start = 0;
  this.game = 1;
  this.gameover = 2;
  this.winstage = 3;
  this.wingame = 4;
  
  this.menu = 100;
  this.state = 0;
  this.startAlpha = 1;
  this.startAlphaD = -0.04;
  this.startDefineKeys = 0;
  this.stageSelect = 0;

  
  this.draw = function(mspf)
  {
  try
  {
    if(this.state == this.game && gameover)
    {
      this.menu = 0;
      ace.score = Math.round(ace.score);
      if(ace.hull > 0)
      {
        if(ironman > 0 && ironman-1 == stage)
          this.state = this.wingame;
        else
          this.state = this.winstage;
        if(ironman == 0)
          saveScore(ace.score, stages[stage].id, 1);
        if(ironman > 0 && ironman-1 == stage)
        {
          saveScore(ace.score, stages[ironman].id, 1);
          stages[ironman].win = true;
        }
        stages[stage].win = true;
      }
      else
      {
        this.state = this.gameover;
        if(ironman > 0)
          saveScore(ace.score, stages[ironman].id, 0);
        else
          saveScore(ace.score, stages[stage].id, 0);
      }
    }
    
    if(this.state == this.start)
    {
      context2D.globalAlpha = this.menu/100;
      context2D.drawImage(images[imgMenuCosmic], (canvas.width-688)/2, 30);
      context2D.globalAlpha = 1;
      if(this.menu < 100)  
      {  
        this.menu -= 1;      
        ace.posY = canvas.height-100 + this.menu*3; 
        if(this.menu == 0)
        {
          this.state = this.game;
          textik.text1 = stages[stage].name;
          textik.text2 = "";
          textik.time = 2000;
          stages[stage].start();
        }
      }
      if(this.menu == 100)
      {
        this.startAlpha += this.startAlphaD*(mspf/15);
        if(this.startAlpha > 1 || this.startAlpha < 0.2)
          this.startAlphaD = -this.startAlphaD;
        if(this.startAlpha > 1)
          this.startAlpha = 1;
        if(this.startAlpha < 0.2)
          this.startAlpha = 0.2;

        if(this.startDefineKeys == 0)
        {          
          if(this.stageSelect == stage)
          {
            context2D.globalAlpha = 1;
            context2D.fillStyle = "#aaaaaa";
            context2D.font = '900 12px monospace';
            context2D.fillText(stages[stage].name, (canvas.width-context2D.measureText(stages[stage].name).width)/2, 310);

            if(stage-1 >= 0 && stages[stage-1].win == false)
            {            
              context2D.globalAlpha = 1;
              context2D.fillStyle = "#aa0000";
              context2D.font = '900 12px monospace';
              context2D.fillText("LOCKED", (canvas.width-context2D.measureText("LOCKED").width)/2, 405);
            }
            else
            {
              stages[stage].drawBrief();
              context2D.globalAlpha = this.startAlpha;
              context2D.fillStyle = "#aaaaaa";
              context2D.fillRect(canvas.width/2-52, 318, 104, 71);
              context2D.globalAlpha = 1;
            }
          }
          for(var i=0; i<stages.length; i++)
          {
            if(i-1 >= 0 && stages[i-1].win == false)
              context2D.globalAlpha = 0.3;
            context2D.drawImage(images[stages[i].img], canvas.width/2-50 - 120*(this.stageSelect-i), 320);
          }
          context2D.globalAlpha = 1;
          
          if(this.stageSelect > stage)
          {
            this.stageSelect -= mspf/300;
            if(this.stageSelect < stage)
              this.stageSelect = stage;
          }
          if(this.stageSelect < stage)
          {
            this.stageSelect += mspf/300;
            if(this.stageSelect > stage)
              this.stageSelect = stage;
          }
        }
        else
        {
          context2D.fillStyle = "#aaaaaa";
          context2D.font = '600 25px monospace';
          context2D.globalAlpha = 1;
          context2D.fillText("Hit a Key for:", (canvas.width-context2D.measureText("Hit a Key for:").width)/2, canvas.height-350);
          context2D.globalAlpha = this.startAlpha;
          context2D.font = '600 50px monospace';
          if(this.startDefineKeys == 1)
            context2D.fillText("LEFT", (canvas.width-context2D.measureText("LEFT").width)/2, canvas.height-290);
          else if(this.startDefineKeys == 2)
            context2D.fillText("RIGHT", (canvas.width-context2D.measureText("RIGHT").width)/2, canvas.height-290);
          else if(this.startDefineKeys == 3)
            context2D.fillText("ACCELERATE", (canvas.width-context2D.measureText("ACCELERATE").width)/2, canvas.height-290);
          else if(this.startDefineKeys == 4)
            context2D.fillText("DECELERATE", (canvas.width-context2D.measureText("DECELERATE").width)/2, canvas.height-290);
          else if(this.startDefineKeys == 5)
            context2D.fillText("FIRE", (canvas.width-context2D.measureText("FIRE").width)/2, canvas.height-290);
          else if(this.startDefineKeys == 6)
            context2D.fillText("SHIELD OVERDRIVE", (canvas.width-context2D.measureText("SHIELD OVERDRIVE").width)/2, canvas.height-290);
          context2D.globalAlpha = 1;
        }
        
        var h = canvas.height-200;
        var pos = 1;
        for(var i=0; i<hiScore.length-2; i+=3)
        {
          if(hiScore[i+2] == stages[stage].id)
          {
            context2D.fillStyle = "#aaaaaa";
            context2D.font = '900 12px monospace';
            if(hiScore[i] == playerName)
              context2D.globalAlpha = 1;
            else
              context2D.globalAlpha = 0.5;
            context2D.fillText(pos++ +". "+hiScore[i], canvas.width/2-100, h);
            context2D.fillText(hiScore[i+1], canvas.width/2+100-context2D.measureText(hiScore[i+1]).width, h);
            h += 20;
          }
        }
        context2D.globalAlpha = 1;
      }
      return;
    }
    
    if(this.state != this.game)
    {
      this.menu++;
      if(this.menu > 100)
        this.menu = 100;
        
      context2D.globalAlpha = this.menu / 100;
      context2D.fillStyle = "#aaaaaa";
      context2D.font = '600 80px monospace';
      
      if(this.state == this.gameover)
        context2D.fillText("GAME OVER", (canvas.width-context2D.measureText("GAME OVER").width)/2, 150);
      if(this.state == this.wingame)
        context2D.fillText("YOU WIN", (canvas.width-context2D.measureText("YOU WIN").width)/2, 150);
      if(this.state == this.winstage)
        context2D.fillText("STAGE COMPLETE", (canvas.width-context2D.measureText("STAGE COMPLETE").width)/2, 150);
          
      context2D.font = '600 50px monospace';
      context2D.fillText(playerName, (canvas.width-context2D.measureText(playerName).width)/2, 300);
      context2D.fillText("SCORE", (canvas.width-context2D.measureText("SCORE").width)/2, 370);
      context2D.fillText(ace.score, (canvas.width-context2D.measureText(ace.score).width)/2, 440);

      context2D.font = '600 30px monospace';
      if (wonButtons > 0)
        context2D.fillText(wonButtons+" button"+(wonButtons == 1 ? '' : 's')+" fell out of the arcade machine", (canvas.width-context2D.measureText(wonButtons+" button"+(wonButtons == 1 ? '' : 's')+" fell out of the arcade machine").width)/2, 530);
      context2D.fillText("Press Enter to continue", (canvas.width-context2D.measureText("Press Enter to continue").width)/2, 600);
      
      context2D.globalAlpha = 1;
    }
  }catch(err){alert(err);}
  }
  
  this.mouseDown = function(mouseX, mouseY)
  {
    if(this.state == this.start)
    {
      if(mouseY < 390 && mouseY > 320)
      {
        if(mouseX > canvas.width/2-50 && mouseX < canvas.width/2+50)
        {
          if(stage-1 >= 0 && stages[stage-1].win == false)
            return true;
          explosionsAdd(canvas.width/2, canvas.height-350, 100, 20);
          if(details)
            audioExplosion.play();
          this.menu = 99;
          distance = 0;
          ace.targetX = canvas.width/2;
          ace.targetY = canvas.height - 100;
          return true;
        }
        if(mouseX <= canvas.width/2-60)
          stage += Math.floor((mouseX - (canvas.width/2-60))/120);
        if(mouseX >= canvas.width/2+60)
          stage += Math.ceil((mouseX - (canvas.width/2+60))/120);
        if(stage < 0)
          stage = 0;
        if(stage >= stages.length)
          stage = stages.length-1;
        return true;
      }
    }
  }
  
  this.keyDown = function(event)
  {
    if(this.state == this.start)
    {
      if(this.startDefineKeys == 0)
      {
        if(event.keyCode == 13)
        {
          if(stage-1 >= 0 && stages[stage-1].win == false)
            return true;
          explosionsAdd(canvas.width/2, canvas.height-350, 100, 20);
          if(details)
            audioExplosion.play();
          this.menu = 99;
          distance = 0;
          ace.targetX = canvas.width/2;
          ace.targetY = canvas.height - 100;
          return true;
        }
        if(event.keyCode == 37)
        {
          stage -= 1;
          if(stage < 0)
            stage = 0;
          return true;
        }
        if(event.keyCode == 39)
        {
          stage += 1;
          if(stage >= stages.length)
            stage = stages.length-1;
          return true;
        }
      }
      else
      {
        keys[this.startDefineKeys-1] = event.keyCode;
        this.startDefineKeys++;
        if(this.startDefineKeys > 6)
          this.startDefineKeys = 0;
        return true;
      }
    }

    if(event.keyCode == 13)
    {
      if(this.state == this.wingame)
      {             
        location.assign(location.href);
        return true;
      }
      if(this.state == this.winstage)
      {
        this.nextStage();
        return true;
      }
      if(this.state == this.gameover)
      {             
        location.assign(location.href);
        return true;
      }
    }
    return false;
  }

  this.keyUp = function(event)
  {
    if(this.state == this.start)
      return true;
    return false;
  }

  this.nextStage = function()
  {
    this.state = this.game;
    gameover = false;
    distance = 0;
    if(ironman == 0)
      ace.score = 0;
    stage += 1;
    ace.targetX = canvas.width/2;
    ace.targetY = canvas.height - 100;
    textik.text1 = stages[stage].name;
    textik.text2 = "";
    textik.time = 2000;
    stages[stage].start();
  }
}
