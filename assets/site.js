document.addEventListener('DOMContentLoaded',()=>{
  const sections=[...document.querySelectorAll('.nav-anchor')];
  const links=[...document.querySelectorAll('.nav-link')];
  function activate(){let id='';for(const a of sections){const s=a.parentElement;if(window.scrollY+138>=s.offsetTop&&window.scrollY+138<s.offsetTop+s.offsetHeight)id=a.id;}for(const a of links){const active=a.hash==='#'+id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
  window.addEventListener('scroll',activate,{passive:true});activate();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer=new IntersectionObserver(entries=>{for(const e of entries){const v=e.target;if(e.isIntersecting&&!reduced&&!v.dataset.userPaused)v.play().catch(()=>{});else v.pause();}},{threshold:0.25});
  for(const v of document.querySelectorAll('video[autoplay]')){observer.observe(v);v.addEventListener('pointerdown',()=>{v.dataset.userPaused=v.paused?'':'1';});}
});
