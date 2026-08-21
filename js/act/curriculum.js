/* Generic lesson renderer used while a chapter-specific visual lab is not active. */
(function(){
 function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 window.ActivityCurriculum=function(root,lesson){
   root.innerHTML='<h2>'+esc(lesson.title)+' · '+esc(lesson.zh)+'</h2><p class="stage-sub">'+esc(lesson.chapterTitle)+'</p><div class="stage-label">Concept</div><p>'+esc(lesson.body)+'</p><div class="stage-label">Interactive model</div><div class="stage-box" id="lesson-model">Select a parameter to see the security trade-off.</div><div class="stage-row"><button class="btn2 primary" id="lesson-a">Small / weak</button><button class="btn2" id="lesson-b">Large / strong</button><button class="btn2" id="lesson-reset">Reset</button></div><div class="stage-label">Takeaway</div><div class="stage-result ok" id="lesson-result">Security is a property of the construction, the parameters, and the protocol—not the name of the algorithm.</div><p class="hint2">This lesson is based on the <a href="'+esc(lesson.source)+'" target="_blank" rel="noopener">corresponding blog post</a>. Toy values are for learning only.</p>';
   var model=root.querySelector('#lesson-model'),result=root.querySelector('#lesson-result');
   root.querySelector('#lesson-a').onclick=function(){model.textContent='Weak setting: the pattern, key space, nonce, authentication, or mathematical assumption is exposed.';result.textContent='Observe the failure mode before increasing the parameter.';};
   root.querySelector('#lesson-b').onclick=function(){model.textContent='Stronger setting: the construction hides structure, increases the search cost, or authenticates the transcript.';result.textContent='Stronger parameters help only when the underlying construction is sound.';};
   root.querySelector('#lesson-reset').onclick=function(){model.textContent='Select a parameter to see the security trade-off.';result.textContent='Security is a property of the construction, the parameters, and the protocol—not the name of the algorithm.';};
   return function(){};
 };
})();