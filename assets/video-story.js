document.addEventListener('DOMContentLoaded',()=>{
  const overview=document.querySelector('.overview-player video');
  const chapters=[...document.querySelectorAll('[data-overview-time]')];
  for(const button of chapters)button.addEventListener('click',()=>{
    overview.currentTime=Number(button.dataset.overviewTime);
    overview.play().catch(()=>{});
    overview.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  overview.addEventListener('timeupdate',()=>{
    const current=chapters.filter(b=>Number(b.dataset.overviewTime)<=overview.currentTime).at(-1);
    chapters.forEach(b=>{b.classList.toggle('active',b===current);if(b===current)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
  });
  const response=document.querySelector('.response-player video');
  const prediction=document.querySelector('.evidence-video video');
  const predictionButtons=[...document.querySelectorAll('[data-prediction]')];
  for(const button of predictionButtons)button.addEventListener('click',()=>{
    const name=button.dataset.prediction;const wasPlaying=!prediction.paused;
    prediction.pause();prediction.poster=`media/${name}.jpg`;prediction.querySelector('source').src=`media/${name}.mp4`;prediction.querySelector('a').href=`media/${name}.mp4`;
    prediction.setAttribute('aria-label',name==='reconstruction-replay'?'Three-model reconstruction of the same recorded motion':'Measured reconstruction and prediction improvements');
    prediction.load();if(wasPlaying)prediction.play().catch(()=>{});
    predictionButtons.forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
    document.getElementById('prediction-description').textContent=name==='reconstruction-replay'?'The first common evaluation episode, replayed at 0.5× speed. Gray denotes the measured path; colored traces show posterior reconstruction. The errors shown here are episode-specific; the prediction comparison reports the fifty-episode aggregates.':'Animated results from the same fifty evaluation episodes. Curves reveal the reported 1-, 5-, 10-, and 15-step errors.';
  });
  const buttons=[...document.querySelectorAll('[data-response]')];
  for(const button of buttons)button.addEventListener('click',()=>{
    const condition=button.dataset.response;
    const label=condition[0].toUpperCase()+condition.slice(1);
    const wasPlaying=!response.paused;
    response.pause();response.poster=`media/response-${condition}.jpg`;
    response.querySelector('source').src=`media/response-${condition}.mp4`;
    response.querySelector('a').href=`media/response-${condition}.mp4`;
    response.setAttribute('aria-label',`Recorded response trajectories: ${condition} motor fault`);
    response.load();if(wasPlaying)response.play().catch(()=>{});
    buttons.forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});

  });
  // The flight comparison may play both independently timed panes together.
  // Starting any other section still pauses the comparison.
  const videos=[...document.querySelectorAll('video')];
  videos.forEach(v=>v.addEventListener('play',()=>videos.filter(x=>x!==v && !(v.dataset.playbackGroup && x.dataset.playbackGroup===v.dataset.playbackGroup)).forEach(x=>x.pause())));
});
