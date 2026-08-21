/* Canvas-text sprite labels keep the world asset-free. */
(function(){
 function label(text,color){var c=document.createElement('canvas');c.width=512;c.height=128;var x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.font='700 48px sans-serif';x.textAlign='center';x.textBaseline='middle';x.shadowColor=color;x.shadowBlur=22;x.fillStyle=color;x.fillText(text,256,64);var t=new THREE.CanvasTexture(c);var m=new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false});var s=new THREE.Sprite(m);s.scale.set(8,2,1);return s;}
 window.Text3D={label:label};
})();