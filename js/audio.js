/* Optional, gesture-gated WebAudio feedback. */
(function(){
  var ctx=null, enabled=true;
  function init(){ if(!enabled||ctx)return; try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){enabled=false;} }
  function beep(freq,duration,type){ if(!enabled)return; init(); if(!ctx)return; var o=ctx.createOscillator(),g=ctx.createGain(); o.type=type||'sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.06,ctx.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration+.02); }
  window.AudioFX={toggle:function(){enabled=!enabled;return enabled;},enabled:function(){return enabled;},unlock:init,select:function(){beep(520,.08,'triangle');},complete:function(){beep(660,.1);setTimeout(function(){beep(880,.16);},90);},move:function(){beep(180,.025,'square');}};
})();