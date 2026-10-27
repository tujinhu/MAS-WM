document.addEventListener('DOMContentLoaded',()=>{
  const video=document.querySelector('.flight-explained-player video');
  const camera=document.querySelector('.flight-camera-panel video');
  const buttons=[...document.querySelectorAll('[data-flight-case]')];
  const eventButtons=[...document.querySelectorAll('[data-log-event]')];
  let activeCase=buttons.find(b=>b.classList.contains('selected')).dataset.flightCase;
  let chapters={};
  const chaptersReady=fetch('assets/flight-locked-logs.json').then(r=>{
    if(!r.ok)throw new Error('Flight chapter metadata unavailable');
    return r.json();
  }).then(data=>{chapters=data;eventButtons.forEach(b=>b.disabled=false);});
  chaptersReady.catch(()=>{});
  for(const button of eventButtons)button.addEventListener('click',async()=>{
    await chaptersReady;
    const selected=activeCase;
    if(video.readyState===0)await new Promise(resolve=>video.addEventListener('loadedmetadata',resolve,{once:true}));
    if(selected!==activeCase)return;
    const event=button.dataset.logEvent;
    video.currentTime=event==='lock_start' ? (Math.ceil(chapters[selected][event]*24)+1)/24 : Math.max(0,chapters[selected][event]-1);
    video.play().catch(()=>{});
  });
  for(const button of buttons)button.addEventListener('click',()=>{
    const name=button.dataset.flightCase, wasPlaying=!video.paused, cameraPlaying=!camera.paused;
    activeCase=name;
    video.pause();video.poster=`media/${name}-locked-log.jpg`;
    video.querySelector('source').src=`media/${name}-locked-log.mp4`;
    video.querySelector('a').href=`media/${name}-locked-log.mp4`;
    video.setAttribute('aria-label',`Flight log and locked action: ${button.textContent}`);
    video.load();if(wasPlaying)video.play().catch(()=>{});
    camera.pause();camera.poster=`media/${name}.jpg`;
    camera.querySelector('source').src=`media/${name}.mp4`;
    camera.querySelector('a').href=`media/${name}.mp4`;
    camera.setAttribute('aria-label',`Physical recording: ${button.textContent}`);
    camera.load();if(cameraPlaying)camera.play().catch(()=>{});
    buttons.forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
  });
});
