
const bar=document.getElementById('bar'),barT=bar.querySelector('.t'),
      barA=bar.querySelector('.a'),barBtn=bar.querySelector('.play'),
      barImg=bar.querySelector('img'),fill=bar.querySelector('.prog i');
let audio=null,activeBtn=null;
function setBtn(b,on){if(b){b.classList.toggle('on',on);b.textContent=on?'❚❚':'▶';}}
function start(btn,url){
  if(audio){audio.pause();setBtn(activeBtn,false);}
  const {title,artist,art}=btn.dataset;
  audio=new Audio(url);activeBtn=btn;
  barT.textContent=title;barA.textContent=artist;
  barImg.src=art||'';barImg.style.visibility=art?'visible':'hidden';
  bar.classList.add('show');setBtn(btn,true);setBtn(barBtn,true);
  audio.play();
  audio.ontimeupdate=()=>{fill.style.width=(audio.currentTime/audio.duration*100||0)+'%';};
  audio.onended=()=>{setBtn(btn,false);setBtn(barBtn,false);fill.style.width='0';};
}
function toggle(){if(!audio)return;
  if(audio.paused){audio.play();setBtn(activeBtn,true);setBtn(barBtn,true);}
  else{audio.pause();setBtn(activeBtn,false);setBtn(barBtn,false);}}
barBtn.addEventListener('click',toggle);
window._dz={};
document.querySelectorAll('.play[data-dz],.play[data-url]').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    if(btn===activeBtn&&audio){toggle();return;}
    const dz=btn.dataset.dz,url=btn.dataset.url;
    if(dz){ // stored Deezer preview URLs expire; fetch a fresh one at click time
      const cb='c'+dz;
      window._dz[cb]=d=>{if(d&&d.preview)start(btn,d.preview);
                         else{btn.textContent='✕';btn.title='Preview unavailable';}};
      const s=document.createElement('script');
      s.src=`https://api.deezer.com/track/${dz}?output=jsonp&callback=_dz.${cb}`;
      document.body.appendChild(s);
    }else if(url){start(btn,url);}
  });
});
