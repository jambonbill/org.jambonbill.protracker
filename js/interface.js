var module=new Protracker();
module.setseparation(1);


$(function(){
  
  if(typeof(Storage) !== "undefined"){
    try{
      var favs=JSON.parse(localStorage["favorites"]);
      console.log("favorites",favs);
    }
    catch(e){
      console.log("localStorage favorites init");
      localStorage["favorites"]=JSON.stringify([]);
      favs=[];
    }
  }

  module.setautostart(true);   
  $('#btn_play').click(function(){
    if(module.playing){
      module.stop();
    }else{
      drawPattern(module,module.patterntable[module.position]);
      module.play();
    }
  });

  $('#btn_stop').click(function(){module.stop();});
  $('#btn_back').click(function(){module.jump(-1);});
  $('#btn_frwd').click(function(){module.jump(1);});
  $('#btn_load').click(function(){load_random_module();});
  $('#btn_open').click(function(){
    var r=$.ajax({
        type: "POST",
        url: "ctrl.php",
        dataType: "json",
        data: {'do':'list'}
    });

    r.done(function(o){
        var htm=[];
        htm.push("<table id='files' class='table table-condensed table-hover'>");
        htm.push("<thead>");
        htm.push("<th>Filename</th>");
        htm.push("</thead>");
        htm.push("<tbody>");
        $.each(o,function(k,f){
          //console.log(f);
          htm.push("<tr title='"+f+"'><td>"+f);
        });
        htm.push("</tbody>");
        htm.push("</table>");
        $('#tracks').html(htm.join(''));
        $('#files tr').click(function(t){
          console.log(t.currentTarget.title);
          module.load("mods/"+t.currentTarget.title);
        });
    });

    r.fail(function(a,b,c){
        console.log("Error",a,b,c);
    });
  });

  $('#btn_favorite').click(function(){
    console.log('favorite ',module.url);
    if(typeof(Storage) !== "undefined"){
      var favs=JSON.parse(localStorage["favorites"]);
      $.each(favs,function(i,file){
        if(file==module.url)return false;//alreadey in
      });
      favs.push(module.url);
      localStorage["favorites"]=JSON.stringify(favs);
    }else{
      console.log("localStorage error");
    }
  });
  console.log('ready');
  load_random_module();
});


function load_random_module(){
  var r=$.ajax({
        type: "POST",
        url: "ctrl.php",
        dataType: "json",
        data: {'do':'randmod'}
    });
    r.done(function(o){
        filename=o.filename;
        module.load(o.filename);
    });
    r.fail(function(a,b,c){
        console.log("Error",a,b,c);
    });
}


//draw the given pattern (module,pattern_number)
function drawPattern(m,p){
  
  var pattern=[];
  var pp;
  var pd="<table id='tracks' class='table table-condensed table-hover'>";
  pd+="<thead>";
  pd+="<th>#</th>";
  for(c=0;c<m.channels;c++){
    if(m.channel[c]&&m.channel[c].muted)pd+="<th style='text-align:center' id="+c+" class='text-muted'>Chn#"+(c+1)+"</th>";
    else pd+="<th style='text-align:center' id="+c+">Chn#"+(c+1)+"</th>";
  }
  pd+="</thead>";

  for(i=0; i<64; i++) {
    pp=i*4*m.channels;//pointer
    pd+="<tr id=pos_"+i+">";
    pd+="<td>"+hb(i);//row
    for(c=0;c<m.channels;c++) {
      var note=m.note[p][i*m.channels+c];
      var smpl=(m.pattern[p][pp+0]&0xf0 | m.pattern[p][pp+2]>>4);
      var cmd=m.pattern[p][pp+2]&0x0f;
      var cmdval=m.pattern[p][pp+3];
      var cell=notef2(note, smpl, cmd, cmdval, m.channels);
      //console.log(m.channel[c]);
      if(m.channel[c] && m.channel[c].muted==true)pd+="<td style='text-align:center' class='text-muted'>"+cell;
      else pd+="<td style='text-align:center'>"+cell;
      //pd+="<td style='text-align:center'>"+cell;
      pp+=4;
    }
  }
  pd+="</table>\n";
  
  $("#tracks").html(pd);

  // mute/unmute track
  $("#tracks th").click(function(t){
    ch=t.currentTarget.id;
    //console.log("mute channel #"+ch);
    module.channel[ch].muted=!module.channel[ch].muted;//toggle mute
    drawPattern(module,module.position); 
  });
}


//draw the pattern sequence table
function patSeqTable(){
  var htm=[];
  htm.push("<table id='patseq' class='table table-condensed table-hover'>");
  htm.push("<thead>");
  htm.push("<th>#</th>");
  htm.push("<th>Pat.</th>");
  htm.push("</thead>");
  htm.push("<tbody>");
  for(var i=0;i<module.songlen;i++){//todo, find the end of the module...
    //if(i>1&&module.patterntable[i]==0)continue;
    htm.push("<tr id=patseq_"+i+">");
    htm.push("<td>"+i);
    htm.push("<td>"+module.patterntable[i]);
  }
  //
  htm.push("</tbody>");
  htm.push("</table>");
  return htm.join("");
}

//compute a html sample table
function sampleTable(){
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
    //if(module.sample[i].length<1)continue;
    totalsamples++;
    totalbytes+=module.sample[i].length;
    htm.push("<tr id='smpl_"+i+"'>");
    htm.push("<td>"+hb(i+1));
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
  htm.push("<td></td>");
  htm.push("</tr>");
  htm.push("</tfoot>");
  htm.push("</table>");
  return htm.join("");
}



// events
// events
// events
module.onLoad=function(){
    $('#title').html("Loading...");
      $('#position').html(this.filename);

    $("#patterns").html("");
    $("#tracks").html("please wait");
    $("#samples").html("gnn...");
}

module.onReady=function() {  
    
    document.title=this.title;
    $('#title').html("<span title='"+filename+"'>"+this.title+"</span>");
    $("#patterns").html(patSeqTable());
    
    //mark as selected the drawn patten
    $("#patseq tr").removeClass("selected");
    $("#patseq_"+this.position).addClass("selected");

    drawPattern(module,0);
    $("#samples").html(sampleTable());
    $("#patseq tr").click(function(t){
      //var id=t.currentTarget.id;
      //var pattern=module.patterntable[(t.currentTarget.rowIndex-1)];
      $('#patseq tr').removeClass("selected");
      $(t.currentTarget).addClass("selected");//ok?     
      //console.log("Goto position "+id, "PATTERN:"+pattern,t.currentTarget.rowIndex);
      module.position=(t.currentTarget.rowIndex-1);
      drawPattern(module,module.patterntable[module.position]);
    });

    $("#samples tr").click(function(t){
      var id=t.currentTarget.id;
      console.log("samples tr click",id);
      $("#samples tr").removeClass("selected"); 
      $("#"+id).addClass("selected");
    });
};

module.onTick=function(){
  //console.log('onTick',module.row);
  //$('#status').val("Pattern: "+module.position +" - Step:"+ module.row);
  //var p=module.position;
  var p=this.patterntable[this.position];
  var i=this.row;
  if(i==64)i==0;
  var pp=i*4*this.channels;

  var row=[];
  
  $('#position').html(this.position+"::"+this.patterntable[this.position]+"::"+i);
  $('#tracks tr').removeClass("selected");
  $('#pos_'+this.row).addClass("selected");
 
  $('#samples tr').removeClass("selected");
  
  var samples=[];
  for(c=0;c<this.channels;c++) {
    //var note=this.note[p][i*this.channels+c];
    var smpl=(this.pattern[p][pp+0]&0xf0 | this.pattern[p][pp+2]>>4); 
    $("#smpl_"+(smpl-1)).addClass("selected");
    pp+=4;
  }
}

module.onLoop=function(){
  console.log("loop at "+this.position);
    //mark as selected the drawn patten
  $("#patseq tr").removeClass("selected");
  $("#patseq_"+this.position).addClass("selected");
}

module.onPatternChange=function(){
  //console.log("newposition : "+newposition);
  //console.log("pattern change : "+module.position+"::"+module.patterntable[module.position],this.row);
  drawPattern(module,module.patterntable[module.position]);
  //select the correct pattern
  //mark as selected the drawn patten
  $("#patseq tr").removeClass("selected");
  $("#patseq_"+module.position).addClass("selected");
}

module.onStop=function(){ 
    //clearInterval(timer);
    console.log('stop');
    //$("#status").val("stopped");
}



//show the list of favorite tracks in the modal window
function showFavorites(){
  var htm=[];
  if(typeof(Storage) !== "undefined"){
      var favs=JSON.parse(localStorage["favorites"]);
      htm.push("<table class='table table-condensed table-hover'>");
      htm.push("<thead></thead>");
      $.each(favs,function(i,file){
        htm.push("<tr>");
        htm.push("<td>"+file);
      });
      htm.push("</table>");
  } else {
    console.log("ben la jean claude t'es dans la merde");
  }
  
  $('#modalwindow .modal-title').html("Favorites");
  $('#modalwindow .modal-body').html(htm.join(''));
  $('#modalwindow').modal(true);

}

var notelist=["C-", "C#", "D-", "D#", "E-", "F-", "F#", "G-", "G#", "A-", "A#", "B-"];
//Note, Sample, Command, d?, ChannelCount
function notef2(n,s,c,d,cc)
{
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
