var timer;
var filename;
var module=new Protracker();
module.setseparation(1);

$(function(){
  module.setautostart(true);  
  $.ajax({url: "ctrl.php", success: function(fn){
        filename=fn;
        //$('#status').val("Loading "+fn);
        module.load(fn);
        
  }});

  $('#btn_play').click(function(){
    drawPattern(module,module.patterntable[module.position]);
    module.play();
  });

  $('#btn_stop').click(function(){module.stop();});
  $('#btn_back').click(function(){module.jump(-1);});
  $('#btn_frwd').click(function(){module.jump(1);});
  $('#btn_load').click(function(){
    $.ajax({url: "ctrl.php", success: function(fn){
      filename=fn;
      //$('#status').val("Loading "+fn);
      module.load(fn);
    }});
  });

  $('#btn_open').click(function(){
    module.stop();
    var url=prompt("Enter module path",filename);
    if(url){
      
      module.load(url);
      module.setautostart(true);
    }
  });

  $('#btn_favorite').click(function(){
    console.log('favorite');
  });
  /*
  $('#btn_download').click(function(){
    console.log('download '+filename);
    $.ajax({url: "ctrl.php?download", success: function(fn){
      filename=fn;
      $('#status').val("Loading "+fn);
      module.load(fn);
    }});

  });

  $("input[name='amigatype']").change(function(){
    //console.log('amigatype.click change',$(this).val());
    if($(this).val()=="PAL")module.setamigatype(true); else module.setamigatype(false);
  });
  
  $("input[name='stereo']").change(function(){
    //console.log('stereo.click',$(this).val());
    module.setseparation($(this).val());
  });
  */
  console.log('ready');  
});


function drawPattern(m,p){
  
  var pattern=[];
  var pp;
  var pd="<table id='tracks' class='table table-condensed table-hover'>";
  pd+="<thead>";
  pd+="<th>#</th>";
  for(c=0;c<m.channels;c++)pd+="<th style='text-align:center'>Chn#"+(c+1)+"</th>";
  pd+="</thead>";

  for(i=0; i<64; i++) {
    
    pp=i*4*m.channels;//pointer
    pd+="<tr id=pos"+i+">";
    pd+="<td>"+hb(i);//row
    for(c=0;c<m.channels;c++) {
      var note=m.note[p][i*m.channels+c];
      var smpl=(m.pattern[p][pp+0]&0xf0 | m.pattern[p][pp+2]>>4);
      var cmd=m.pattern[p][pp+2]&0x0f;
      var cmdval=m.pattern[p][pp+3];
      var cell=notef2(note, smpl, cmd, cmdval, m.channels);
      pd+="<td style='text-align:center'>"+cell;
      pp+=4;
    }
  }
  pd+="</table>\n";
  $("#more").html(pd);
}


//draw the pattern sequence table
function patSeqTable(){
  var htm=[];
  htm.push("<table id='patseq' class='table table-condensed table-hover'>");
  htm.push("<thead>");
  //htm.push("<th>#</th>");
  htm.push("<th>Pat.</th>");
  htm.push("</thead>");
  htm.push("<tbody>");
  for(var i=0;i<128;i++){
    if(i>0&&module.patterntable[i]<1)continue;
    htm.push("<tr id="+i+">");
    htm.push("<td>"+module.patterntable[i]);
  }
  //
  htm.push("</tbody>");
  htm.push("</table>");
  return htm.join("");
}

//compute a html sample table
function sampleTable()
{
  var htm=[];
  htm.push("<table id='samples' class='table table-condensed table-hover'>");
  htm.push("<thead>");
  htm.push("<th>#</th>");
  //htm.push("<th>Sample name</th>");
  htm.push("<th>Size</th>");
  //htm.push("<th>Finetune</th>");
  //htm.push("<th>Vol</th>");
  htm.push("<th>loop</th>");
  htm.push("<th>len</th>");
  htm.push("</thead>");
  htm.push("<tbody>");
  var totalbytes=0;
  var totalsamples=0;
  for(var i=0;i<31;i++){
    if(module.sample[i].length<1)continue;
    totalsamples++;
    totalbytes+=module.sample[i].length;
    htm.push("<tr id='smpl_"+i+"'>");
    htm.push("<td>"+(i+1));
    //htm.push("<td>"+module.sample[i].name);
    htm.push("<td style='text-align:right'>"+module.sample[i].length);
    //htm.push("<td>"+module.sample[i].finetune);
    //htm.push("<td>"+module.sample[i].volume);
    htm.push("<td style='text-align:right'>"+module.sample[i].loopstart);
    htm.push("<td style='text-align:right'>"+module.sample[i].looplength);
    
    //console.log(this.sample[i].name,this.sample[i].length,this.sample[i].finetune,this.sample[i].volume,this.sample[i].loopstart,this.sample[i].looplength);
  }
  //
  htm.push("</tbody>");
  htm.push("<tfoot>");
  htm.push("<tr>");
  htm.push("<td>");
  htm.push("<td>"+totalsamples+" sample(s)");
  //htm.push("<td style='text-align:right'><b>Total bytes :");
  htm.push("<td style='text-align:right'><b>"+totalbytes+"b");
  htm.push("<td><td>");
  htm.push("</tr>");
  htm.push("</tfoot>");
  htm.push("</table>");
  return htm.join("");
}



//stats
/*
var samples=[];
var notes=[];
var chords=[];
*/

module.onReady=function() {  
    
    //console.log(this.title);
    $('#title').html("<span title='"+filename+"'>"+this.title+"</span>");

    $("#patterns").html(patSeqTable());
    //$("#more").html("<pre>"+pdata+"</pre>");
    drawPattern(module,0);
    $("#samples").html(sampleTable());
    
    $("#patseq tr").click(function(t){
      var id=t.currentTarget.id;
      var pattern=module.patterntable[id];
      this.style.backroundColor="red";
      
      console.log("Goto position "+id, pattern);
      module.position=id;
      drawPattern(module,module.patterntable[id]);
    });

    $("#samples tr").click(function(t){
      var id=t.currentTarget.id;
      console.log("samples tr click",id);
    });
    
    //console.log("module ready");
    //console.log(json);
    //$('#status').val("module ready");
  };







// events
// events
// events

module.onTick=function(){
  //console.log('tick++');
  //$('#status').val("Pattern: "+module.position +" - Step:"+ module.row);
  //var p=module.position;
  var p=module.patterntable[module.position];
  var i=module.row;
  var pp=i*4*this.channels;

  var row=[];
  
  $('#position').html(module.position+"::"+module.patterntable[module.position]+"::"+i);
  //$('#bpm').html("Bpm:"+module.bpm);
  //$('#spd').html("Spd:"+module.speed);

  var samples=[];
  for(c=0;c<this.channels;c++) {
    var note=this.note[p][i*this.channels+c];
    var smpl=(this.pattern[p][pp+0]&0xf0 | this.pattern[p][pp+2]>>4);
    
    if(note)samples.push(smpl);
    //var cell=notef2(this.note[p][i*this.channels+c], (this.pattern[p][pp+0]&0xf0 | this.pattern[p][pp+2]>>4), this.pattern[p][pp+2]&0x0f, this.pattern[p][pp+3], this.channels);
    //row.push(cell);
    pp+=4;
  }

  //console.log("#"+i,$.unique(samples));
  /*
  $.each($.unique(samples),function(d){
    console.log("sample:"+d);
  });
  */
}

module.onLoop=function(){
  console.log("loop");
}

module.onPatternChange=function(){
  console.log("pattern change : "+module.position+"::"+module.patterntable[module.position]);
  drawPattern(module,module.patterntable[module.position]);
}

module.onStop=function(){ 
    //clearInterval(timer);
    console.log('stop');
    //$("#status").val("stopped");
}



/*
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
*/


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

//Note, Sample, Command, d?, ChannelCount
function notef2(n,s,c,d,cc)
{
  //console.log('notef2',n,s,c,d,cc);
  
  var note=(n ? (notelist[n%12]+Math.floor(1+n/12)) : ("..."));
  var smpl=(s ? (hb(s)) : (".."));
  var cmd=c.toString(16)+hb(d);
  if(cmd=='000')cmd='...';
  return note+" "+smpl+" "+cmd;
}



function hb(n)//to hex
{
  if(!n)return '00';
  var s=n.toString(16);
  if (s.length==1) s='0'+s;
  return s;
}
