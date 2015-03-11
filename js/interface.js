var timer;
var module=new Protracker();

$(function(){
  module.load('mods/andy-tak.mod');
  module.setautostart(true);
  //module.load('mods/nao-chip_n_gabbe.mod');
  
  
  /*
  var loadInterval=setInterval(function(){
      if (!module.delayload) {
         clearInterval(loadInterval);
      }
    }, 200);
    
  
  setTimeout('play()',500);
  */
  console.log('ready');  
});

module.onReady=function() {  
    
    console.log(this.title);
     
    for(i=0;i<31;i++)
      console.log(this.sample[i].name);
    
    console.log(this.signature);
    
    /*
    for(p=0;p<this.patterns;p++) {
      var pp, pd="<div class=\"patterndata\" id=\"pattern"+hb(p)+"\">";
      for(i=0; i<12; i++) pd+="\n";
      for(i=0; i<64; i++) {
        pp=i*4*this.channels;
        pd+="<span class=\"patternrow\" id=\"pattern"+hb(p)+"_row"+hb(i)+"\">"+hb(i)+"|";
        for(c=0;c<this.channels;c++) {
          pd+=notef(this.note[p][i*this.channels+c], (this.pattern[p][pp+0]&0xf0 | this.pattern[p][pp+2]>>4), this.pattern[p][pp+2]&0x0f, this.pattern[p][pp+3], this.channels);
          pp+=4;
        }
        pd+="</span>\n";
      }
      for(i=0; i<24; i++) pd+="\n";
      pdata+=pd+"</div>";
    }
    $("#modpattern").html(pdata);
    */
    console.log("module ready");
  };

  module.onPlay=function() {
    var oldpos=-1, oldrow=-1;
    console.log('playing');
    
    timer=setInterval(function(){
      var i,c;
      var mod=module;
      if (mod.paused) return;
      console.log(mod.speed, mod.bpm, mod.position, mod.row);
      /*
      if (oldpos != mod.position) {
        if (oldpos>=0) $("#pattern"+hb(mod.patterntable[oldpos])).removeClass("currentpattern");
        $("#pattern"+hb(mod.patterntable[mod.position])).addClass("currentpattern");
      }
      if (oldrow != mod.row) {
        $("#modtimer").replaceWith("<span id=\"modtimer\">"+
          "pos <span class=\"hl\">"+hb(mod.position)+"</span>/<span class=\"hl\">"+hb(mod.songlen)+"</span> "+
          "row <span class=\"hl\">"+hb(mod.row)+"</span>/<span class=\"hl\">3f</span> "+
          "speed <span class=\"hl\">"+mod.speed+"</span> "+
          "bpm <span class=\"hl\">"+mod.bpm+"</span> "+
          "filter <span class=\"hl\">"+(mod.filter ? "on" : "off")+"</span>"+
          "</span>");

        $("#modsamples").children().removeClass("activesample");      
        for(c=0;c<mod.channels;c++)
          if (mod.channel[c].noteon) $("#sample"+hb(mod.channel[c].sample+1)).addClass("activesample");
          
        if (oldpos>=0 && oldrow>=0) $("#pattern"+hb(mod.patterntable[oldpos])+"_row"+hb(oldrow)).removeClass("currentrow");
        $("#pattern"+hb(mod.patterntable[mod.position])+"_row"+hb(mod.row)).addClass("currentrow");
        $("#pattern"+hb(mod.patterntable[mod.position])).scrollTop(mod.row*16);
      }
      oldpos=mod.position;        
      oldrow=mod.row;
      */
    }, 80.0); // half display update speed for iOS
  };

module.onStop=function(){ 
    clearInterval(timer);
    console.log('stopped');
    $("#modtimer").html("stopped");
}



function play(){
  console.log(module.signature);
  console.log('module.sample',module.sample);
  console.log('module.patterns',module.patterns,module.pattern);
  
  for(var i=0;i<31;i++){
    console.log(module.sample[i].name);
  }
  module.setseparation(0);//0,1,2
  module.play();
}



function showPatterns(){
  var txt='';
  console.log('module.patterns',module.patterns,module.pattern);
  var pdata="";
  
  for(p=0;p<module.patterns;p++) {
    var pp, pd="<div class=\"patterndata\" id=\"pattern"+hb(p)+"\">";
    for(i=0; i<12; i++) pd+="\n";
    for(i=0; i<64; i++) {
      pp=i*4*module.channels;
      pd+="<span class=\"patternrow\" id=\"pattern"+hb(p)+"_row"+hb(i)+"\">"+hb(i)+"|";
      for(c=0;c<module.channels;c++) {
        pd+=notef(module.note[p][i*module.channels+c], (module.pattern[p][pp+0]&0xf0 | module.pattern[p][pp+2]>>4), module.pattern[p][pp+2]&0x0f, module.pattern[p][pp+3], module.channels);
        pp+=4;
      }
      pd+="</span>\n";
    }
    for(i=0; i<24; i++) pd+="\n";
    pdata+=pd+"</div>";
  }
  return pdata;
}


var notelist=new Array("C-", "C#", "D-", "D#", "E-", "F-", "F#", "G-", "G#", "A-", "A#", "B-");

function notef(n,s,c,d,cc)
{
  if (cc<8)
    return (n ? ("<span class=\"note\">"+notelist[n%12]+Math.floor(1+n/12)+" </span>") : ("... "))+
      (s ? ("<span class=\"sample\">"+hb(s)+"</span> ") : (".. "))+
      "<span class=\"command\">"+c.toString(16)+hb(d)+"</span>|";
  if (cc<12)
    return (n ? ("<span class=\"note\">"+notelist[n%12]+Math.floor(1+n/12)+"</span>") : ("..."))+
      (s ? ("<span class=\"sample\">"+hb(s)+"</span>") : (".."))+
      "<span class=\"command\">"+c.toString(16)+hb(d)+"</span>|";
  return (n ? ("<span class=\"note\">"+notelist[n%12]+Math.floor(1+n/12)+"</span>") : 
                (s ? (".<span class=\"sample\">"+hb(s)+"</span>") :
                (c&d ? ("<span class=\"command\">"+c.toString(16)+hb(d)+"</span>"):("...")))
         );
}

function hb(n)
{
  var s=n.toString(16);
  if (s.length==1) s='0'+s;
  return s;
}
