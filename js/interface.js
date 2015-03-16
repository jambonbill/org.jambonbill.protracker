var timer;
var filename;
var module=new Protracker();


$(function(){
  //module.setautostart(true);  
  $.ajax({url: "ctrl.php", success: function(fn){
        filename=fn;
        $('#status').val("Loading "+fn);
        module.load(fn);
        
  }});

  $('#btn_play').click(function(){module.play();});
  $('#btn_stop').click(function(){module.stop();});
  $('#btn_back').click(function(){module.jump(-1);});
  $('#btn_frwd').click(function(){module.jump(1);});
  $('#btn_load').click(function(){
    $.ajax({url: "ctrl.php", success: function(fn){
      filename=fn;
      $('#status').val("Loading "+fn);
      module.load(fn);
    }});
  });

  $('#btn_favorite').click(function(){
    console.log('favorite');
  });

  $('#btn_download').click(function(){
    console.log('download '+filename);
    /*
    $.ajax({url: "ctrl.php?download", success: function(fn){
      filename=fn;
      $('#status').val("Loading "+fn);
      module.load(fn);
    }});
  */
  });

  $("input[name='amigatype']").change(function(){
    //console.log('amigatype.click change',$(this).val());
    if($(this).val()=="PAL")module.setamigatype(true); else module.setamigatype(false);
  });
  
  $("input[name='stereo']").change(function(){
    //console.log('stereo.click',$(this).val());
    module.setseparation($(this).val());
  });

  console.log('ready');  
});



//compute a html sample table
function sampleTable()
{
  var htm=[];
  htm.push("<table class='table table-condensed'>");
  htm.push("<thead>");
  htm.push("<th>#</th>");
  htm.push("<th>Sample name</th>");
  htm.push("<th>Len</th>");
  //htm.push("<th>Finetune</th>");
  //htm.push("<th>Vol</th>");
  //htm.push("<th>Loopstart</th>");
  //htm.push("<th>Looplen</th>");
  htm.push("</thead>");
  htm.push("<tbody>");
  
  for(var i=0;i<31;i++){
    if(module.sample[i].length<1)continue;
    htm.push("<tr>");
    htm.push("<td>"+i);
    htm.push("<td>"+module.sample[i].name);
    htm.push("<td>"+module.sample[i].length);
    //htm.push("<td>"+module.sample[i].finetune);
    //htm.push("<td>"+module.sample[i].volume);
    //htm.push("<td>"+module.sample[i].loopstart);
    //htm.push("<td>"+module.sample[i].looplength);
    
    //console.log(this.sample[i].name,this.sample[i].length,this.sample[i].finetune,this.sample[i].volume,this.sample[i].loopstart,this.sample[i].looplength);
  }
  //
  htm.push("</tbody>");
  htm.push("</table>");
  return htm.join("");
}


/*
function patternData(mod){
    
    var patterns=[];//patterns as json array
    
    for(p=0;p<mod.patterns;p++) {
      var pattern=[];
      var pp;//, pd="<div class=\"patterndata\" id=\"pattern"+hb(p)+"\">";
      //for(i=0; i<12; i++) pd+="\n";
      for(i=0; i<64; i++) {
        var row=[];
        pp=i*4*mod.channels;
        //pd+="<span class=\"patternrow\" id=\"pattern"+hb(p)+"_row"+hb(i)+"\">"+hb(i)+"|";
        for(c=0;c<mod.channels;c++) {
          //pd+=notef(mod.note[p][i*mod.channels+c], (mod.pattern[p][pp+0]&0xf0 | mod.pattern[p][pp+2]>>4), mod.pattern[p][pp+2]&0x0f, mod.pattern[p][pp+3], mod.channels);
          pp+=4;
          //row[c]=notef(mod.note[p][i*mod.channels+c], (mod.pattern[p][pp+0]&0xf0 | mod.pattern[p][pp+2]>>4), mod.pattern[p][pp+2]&0x0f, mod.pattern[p][pp+3], mod.channels);
          row.push(notef(mod.note[p][i*mod.channels+c], (mod.pattern[p][pp+0]&0xf0 | mod.pattern[p][pp+2]>>4), mod.pattern[p][pp+2]&0x0f, mod.pattern[p][pp+3], mod.channels));//notef(mod.note[p][i*mod.channels+c], (mod.pattern[p][pp+0]&0xf0 | mod.pattern[p][pp+2]>>4), mod.pattern[p][pp+2]&0x0f, mod.pattern[p][pp+3], mod.channels);
        }
        //pd+="</span>\n";
        //console.log("row:"+row);
        pattern.push(row);
      }
      //for(i=0; i<24; i++) pd+="\n";
      //pdata+=pd+"</div>";
      patterns.push(pattern);
    }
    //$("#more").html(pdata);
    return patterns;
    
}
*/
module.onReady=function() {  
    
    console.log(this.title);
    $('#title').html(this.title+" <small>"+filename+"</small>");
    
    for(i=0;i<31;i++){
      //console.log(this.sample[i].name,this.sample[i].length,this.sample[i].finetune,this.sample[i].volume,this.sample[i].loopstart,this.sample[i].looplength);
    }
    
    //console.log(this.signature);//M.K.
    
    //todo :: compute module stats (notes/sample/chords)

    var json=[];
    var pdata='';
    for(p=0;p<this.patterns;p++) {
      var pattern=[];
      var pp, pd="<div class=\"patterndata\" id=\"pattern"+hb(p)+"\">";
      //for(i=0; i<12; i++) pd+="\n";
      for(i=0; i<64; i++) {
        var row=[];
        pp=i*4*this.channels;
        pd+="<span class=\"patternrow\" id=\"pattern"+hb(p)+"_row"+hb(i)+"\">"+hb(i)+"|";
        for(c=0;c<this.channels;c++) {
          var note=this.note[p][i*this.channels+c];
          var cell=notef(this.note[p][i*this.channels+c], (this.pattern[p][pp+0]&0xf0 | this.pattern[p][pp+2]>>4), this.pattern[p][pp+2]&0x0f, this.pattern[p][pp+3], this.channels);
          
          pd+=cell;
          pp+=4;
          row.push(note);
        }
        pd+="</span>\n";
        pattern.push(row);
      }
      json[p]=pattern;
      //for(i=0; i<24; i++) pd+="\n";
      pd+="-----------------------------------------------\n";
      pdata+=pd+"</div>";
    }
    
    //$("#more").html(pdata);
    $("#more").html(sampleTable());
    
    //console.log("module ready");
    //console.log(json);
    //$('#status').val("module ready");
  };



module.onTick=function(){
  //console.log('tick++');
  //$('#status').val("Pattern: "+module.position +" - Step:"+ module.row);
  var p=module.position;
  var i=module.row;
  var row=[];
  
  pp=i*4*this.channels;
    
  for(c=0;c<this.channels;c++) {
    if(!this.note[p])continue;
    var note=this.note[p][i*this.channels+c];
    var cell=notef2(this.note[p][i*this.channels+c], (this.pattern[p][pp+0]&0xf0 | this.pattern[p][pp+2]>>4), this.pattern[p][pp+2]&0x0f, this.pattern[p][pp+3], this.channels);
    row.push(cell);
  }

  $('#status').val(module.row+"|"+row.join('|'));
}

module.onStop=function(){ 
    clearInterval(timer);
    console.log('stopped');
    $("#status").val("stopped");
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

function notef2(n,s,c,d,cc)
{
  if (cc<8)
    return (n ? (notelist[n%12]+Math.floor(1+n/12)) : ("... "))+
      (s ? (hb(s)) : (".. "))+
      c.toString(16)+hb(d);
  if (cc<12)
    return (n ? (notelist[n%12]+Math.floor(1+n/12)) : ("..."))+
      (s ? (hb(s)) : (".."))+
      c.toString(16)+hb(d);
  return (n ? (notelist[n%12]+Math.floor(1+n/12)) : 
                (s ? (hb(s)) :
                (c&d ? (c.toString(16)+hb(d)):("...")))
         );
}



function hb(n)//to hex
{
  if(!n)return '00';
  var s=n.toString(16);
  if (s.length==1) s='0'+s;
  return s;
}
