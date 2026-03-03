import { useState, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// v22 코랩 군집 분석 결과 데이터
// feature_core = [danceability, energy, valence, tempo, acousticness, instrumentalness]
// KMeans k=3, random_state=42, n_init=20, StandardScaler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MOOD_DATA = {
  chill: {
    total: 724, sil: 0.226,
    clusters: [
      { id:0, n:358, sil:0.216, label:"업비트 칠팝", desc:"에너지 있는 밝고 여유로운 칠",
        tags_up:["danceability","energy","valence","tempo"], tags_dn:["acousticness"],
        top3:[["NVMD","Denise Julia",79],["Next Up","JBee",77],["At My Worst","Pink Sweat$",76]],
        means:{danceability:0.7238,energy:0.5542,valence:0.5584,tempo:119.7,acousticness:0.3043,instrumentalness:0.0438} },
      { id:1, n:108, sil:0.246, label:"앰비언트 기악", desc:"가사 없는 로파이·앰비언트",
        tags_up:["instrumentalness"], tags_dn:["tempo"],
        top3:[["Eternal Youth","RŮDE",71],["i'm closing my eyes","potsu",69],["Controlla","Idealism",67]],
        means:{danceability:0.633,energy:0.3194,valence:0.2655,tempo:109.4,acousticness:0.69,instrumentalness:0.8406} },
      { id:2, n:258, sil:0.233, label:"감성 어쿠스틱", desc:"조용하고 차분한 보컬 중심",
        tags_up:[], tags_dn:["danceability"],
        top3:[["Another Love","Tom Odell",93],["double take","dhruv",83],["Happier Than Ever","ASTN",76]],
        means:{danceability:0.5754,energy:0.3755,valence:0.288,tempo:112.9,acousticness:0.6514,instrumentalness:0.024} },
    ]
  },
  happy: {
    total: 972, sil: 0.211,
    clusters: [
      { id:0, n:469, sil:0.313, label:"유로댄스 해피", desc:"고에너지·고템포 유로팝",
        tags_up:["tempo"], tags_dn:["danceability"],
        top3:[["Us Against The World","Darren Styles",62],["The Logical Song","Scooter",62],["Nessaja","Scooter",61]],
        means:{danceability:0.486,energy:0.9426,valence:0.2524,tempo:161.1,acousticness:0.0534,instrumentalness:0.0871} },
      { id:1, n:239, sil:0.115, label:"따뜻한 해피팝", desc:"어쿠스틱하고 긍정적인 분위기",
        tags_up:["danceability","valence","acousticness"], tags_dn:["tempo"],
        top3:[["Wanna Play?","The Prophet",65],["Dreams (Will Come Alive)","2 Brothers",65],["How Much Is The Fish?","Scooter",60]],
        means:{danceability:0.6502,energy:0.9197,valence:0.5413,tempo:135.8,acousticness:0.0931,instrumentalness:0.0845} },
      { id:2, n:264, sil:0.118, label:"기악 해피", desc:"가사 없는 해피 배경음",
        tags_up:["instrumentalness"], tags_dn:["energy","acousticness"],
        top3:[["DLMD","Darren Styles",59],["Switch","Darren Styles",56],["This Moment","Party Animals",50]],
        means:{danceability:0.586,energy:0.8491,valence:0.2784,tempo:153.7,acousticness:0.0362,instrumentalness:0.7201} },
    ]
  },
  romance: {
    total: 890, sil: 0.287,
    clusters: [
      { id:0, n:520, sil:0.369, label:"서정 로맨스", desc:"조용하고 감성적인 사랑 노래",
        tags_up:[], tags_dn:["energy"],
        top3:[["Чистые пруды","Igor Talkov",34],["Kalinka, Kalinka","Ivan Rebroff",33],["Kuchalara","Rashid Beibutov",33]],
        means:{danceability:0.3785,energy:0.2237,valence:0.2702,tempo:105.8,acousticness:0.9379,instrumentalness:0.0185} },
      { id:1, n:304, sil:0.163, label:"댄서블 로맨스", desc:"빠르고 역동적인 러브송",
        tags_up:["danceability","energy","valence","tempo"], tags_dn:["acousticness"],
        top3:[["Эти глаза напротив","Valery Obodzinsky",35],["Katyusha","Georgi Vinogradov",34],["Я тебя подожду","Maya Kristalinskaya",31]],
        means:{danceability:0.539,energy:0.4291,valence:0.6239,tempo:118.2,acousticness:0.7323,instrumentalness:0.0137} },
      { id:2, n:66, sil:0.217, label:"기악 로맨스", desc:"발라이카·클래식 기반 서정",
        tags_up:["instrumentalness"], tags_dn:[],
        top3:[["Katyusha","Ivan Rebroff",25],["До завтра","Vladimir Troshin",24],["Les bateliers","Ivan Rebroff",15]],
        means:{danceability:0.3608,energy:0.2923,valence:0.3514,tempo:103.6,acousticness:0.9203,instrumentalness:0.5026} },
    ]
  },
  sad: {
    total: 726, sil: 0.220,
    clusters: [
      { id:0, n:47, sil:0.328, label:"앰비언트 슬픔", desc:"가장 순수하게 슬픈 기악곡",
        tags_up:["instrumentalness"], tags_dn:["danceability","energy","valence"],
        top3:[["I'm Only a Fool for You","Dybbukk",70],["Nobody Cares","Kina",65],["U're Mine","Kina",64]],
        means:{danceability:0.6573,energy:0.3227,valence:0.309,tempo:123.3,acousticness:0.6291,instrumentalness:0.7342} },
      { id:1, n:383, sil:0.236, label:"격정적 슬픔", desc:"이모·트랩 에너지 있는 슬픔",
        tags_up:["danceability","energy","valence"], tags_dn:["acousticness"],
        top3:[["By the Sword","iamjakehill",75],["NUMB","Chri$tian Gate$",73],["MARCELINE","Lil God Dan",73]],
        means:{danceability:0.7147,energy:0.6105,valence:0.4907,tempo:125.1,acousticness:0.1818,instrumentalness:0.0079} },
      { id:2, n:296, sil:0.182, label:"인디팝 슬픔", desc:"느리고 감성적인 대중적 슬픔",
        tags_up:[], tags_dn:["tempo"],
        top3:[["death bed","Powfu;beabadoobee",83],["Living Life, In The Night","Cheriimoya",83],["Get You The Moon","Kina;Snøw",80]],
        means:{danceability:0.678,energy:0.3972,valence:0.4034,tempo:114.6,acousticness:0.6497,instrumentalness:0.0115} },
    ]
  },
  sleep: {
    total: 827, sil: 0.299,
    clusters: [
      { id:0, n:386, sil:0.450, label:"조용한 수면", desc:"가장 부드러운 대중적 수면음악",
        tags_up:[], tags_dn:["tempo"],
        top3:[["Brown Sleep Noise","Sleep Miracle",80],["Herinneringen","Sohn Aelia",74],["Ons","Huma",71]],
        means:{danceability:0.1537,energy:0.1156,valence:0.0541,tempo:92.2,acousticness:0.9173,instrumentalness:0.8383} },
      { id:1, n:317, sil:0.175, label:"백색소음", desc:"전자 노이즈·핑크소음 계열",
        tags_up:["energy"], tags_dn:["acousticness"],
        top3:[["Weißes Rauschen","Weißes Rauschen HD",67],["Shhhh Baby Shusher","Baby Sleep",66],["Womb Heartbeat","Silent Knights",57]],
        means:{danceability:0.1898,energy:0.757,valence:0.0185,tempo:99.8,acousticness:0.3328,instrumentalness:0.7417} },
      { id:2, n:124, sil:0.145, label:"리드미컬 수면", desc:"음악에 가까운 수면 사운드",
        tags_up:["danceability","valence","tempo"], tags_dn:["instrumentalness"],
        top3:[["Endless Sky","Nils August Valentin",61],["Shhhh 1","Silent Knights",60],["Delta Sinus Noise Pad","Wiser Noise",60]],
        means:{danceability:0.3449,energy:0.1899,valence:0.2434,tempo:111.5,acousticness:0.9141,instrumentalness:0.4064} },
    ]
  },
  study: {
    total: 998, sil: 0.210,
    clusters: [
      { id:0, n:361, sil:0.175, label:"업비트 BGM", desc:"활기찬 작업·집중 배경음악",
        tags_up:["energy","valence","tempo"], tags_dn:["acousticness"],
        top3:[["Ritual","Talented Mr Tipsy",53],["r u kiddin me?","Wibke Komi",51],["Elastic","4to28",50]],
        means:{danceability:0.7068,energy:0.5288,valence:0.5228,tempo:117.5,acousticness:0.2693,instrumentalness:0.8456} },
      { id:1, n:534, sil:0.235, label:"로파이 재즈", desc:"전형적인 공부할 때 듣는 음악",
        tags_up:["acousticness"], tags_dn:["danceability","energy","valence"],
        top3:[["Distractions","Timothy Infinite",55],["Shoreditch","Clint Is Quinn",55],["Skin Tone","Timothy Infinite",54]],
        means:{danceability:0.6672,energy:0.3236,valence:0.3097,tempo:108.7,acousticness:0.7219,instrumentalness:0.8585} },
      { id:2, n:103, sil:0.206, label:"보컬 스터디", desc:"가사 있는 집중 음악 소수 계열",
        tags_up:[], tags_dn:["instrumentalness"],
        top3:[["Latex","Sail & Weep",50],["Morning Stretch","Timothy Infinite",50],["The Sun's Out","Sarah, the Illstrumentalist",46]],
        means:{danceability:0.7032,energy:0.451,valence:0.4625,tempo:108.0,acousticness:0.4543,instrumentalness:0.2351} },
    ]
  },
  party: {
    total: 988, sil: 0.270,
    clusters: [
      { id:0, n:692, sil:0.352, label:"테크노 댄스홀", desc:"고에너지 유러피안 파티",
        tags_up:["energy","tempo"], tags_dn:["danceability","valence"],
        top3:[["Olivia","Die Zipfelbuben;DJ Cashi",74],["Layla","DJ Robin;Schürze",74],["Dicht im Flieger","Julian Sommer",72]],
        means:{danceability:0.6359,energy:0.9199,valence:0.655,tempo:136.1,acousticness:0.0531,instrumentalness:0.0011} },
      { id:1, n:1, sil:0.0, label:"아웃라이어", desc:"KMeans 수렴 결과 단독 군집",
        tags_up:["danceability","valence","instrumentalness"], tags_dn:["acousticness"],
        top3:[["I Like To Move It","The Party Cats",37]],
        means:{danceability:0.817,energy:0.864,valence:0.826,tempo:130.0,acousticness:0.0,instrumentalness:0.49} },
      { id:2, n:295, sil:0.079, label:"어쿠스틱 파티", desc:"분위기 전환용 슬로우 파티",
        tags_up:["acousticness"], tags_dn:["energy","tempo"],
        top3:[["LEBENSLANG - HBz Remix","Tream;HBz",73],["Easy Peasy","FiNCH;Leony;VIZE",65],["Partyanimal","Micha von der Rampe",64]],
        means:{danceability:0.741,energy:0.758,valence:0.7393,tempo:120.4,acousticness:0.1828,instrumentalness:0.0014} },
    ]
  },
};

const MOOD_META = {
  chill:   { emoji:"🌊", color:"#1ED760", accent:"#14B8A6", bg:"from-teal-950 via-slate-950", desc:"여유롭고 편안한 분위기" },
  happy:   { emoji:"☀️", color:"#FFD700", accent:"#F59E0B", bg:"from-yellow-950 via-slate-950", desc:"밝고 에너지 넘치는 기분" },
  romance: { emoji:"🌹", color:"#FF6B9D", accent:"#EC4899", bg:"from-pink-950 via-slate-950", desc:"설레고 감성적인 순간" },
  sad:     { emoji:"🌧️", color:"#60A5FA", accent:"#3B82F6", bg:"from-blue-950 via-slate-950", desc:"감정에 솔직한 시간" },
  sleep:   { emoji:"🌙", color:"#A78BFA", accent:"#7C3AED", bg:"from-violet-950 via-slate-950", desc:"깊고 편안한 휴식" },
  study:   { emoji:"📚", color:"#1ED760", accent:"#1DB954", bg:"from-green-950 via-slate-950", desc:"집중력 최대로 끌어올리기" },
  party:   { emoji:"🎉", color:"#FF6B6B", accent:"#EF4444", bg:"from-red-950 via-slate-950", desc:"텐션 폭발하는 파티 타임" },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 피처가 6개인데 왜 바 차트에 5개만 보이나?
// → tempo는 0~250 BPM 스케일이라 0~1 정규화 없이 표시하면 항상 100% 차 보임
//   시각적으로 의미없어서 바 차트에서 제외하고, 따로 BPM 숫자로 표시
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BAR_FEATURES = ["danceability","energy","valence","acousticness","instrumentalness"];
const FEATURE_LABEL = {
  danceability:"댄서블", energy:"에너지", valence:"긍정감",
  acousticness:"어쿠스틱", instrumentalness:"기악성", tempo:"템포",
};
const FEATURE_DESC = {
  danceability:"리듬감·춤추기 좋은 정도",
  energy:"강도·활력 수준",
  valence:"긍정적·행복한 정도",
  acousticness:"어쿠스틱 악기 비율",
  instrumentalness:"가사 없는 기악 비율",
  tempo:"분당 비트(BPM)",
};

// z-score 취향 질문 — 군집 내 세분화
const ZSCORE_Q = {
  chill:   [{feat:"instrumentalness",hi:"🎹 기악 중심",lo:"🎤 보컬 중심"},{feat:"energy",hi:"⚡ 에너지 있게",lo:"🍃 조용하게"}],
  happy:   [{feat:"energy",hi:"🔥 강렬하게",lo:"😊 부드럽게"},{feat:"acousticness",hi:"🎸 어쿠스틱",lo:"🎛️ 전자음"}],
  romance: [{feat:"energy",hi:"💃 역동적으로",lo:"🕯️ 잔잔하게"},{feat:"instrumentalness",hi:"🎻 기악 중심",lo:"🎤 보컬 중심"}],
  sad:     [{feat:"energy",hi:"😤 격정적으로",lo:"💧 잔잔하게"},{feat:"instrumentalness",hi:"🎹 음악으로 위로",lo:"💬 가사로 공감"}],
  sleep:   [{feat:"energy",hi:"📻 백색소음",lo:"🌿 자연스럽게"},{feat:"tempo",hi:"🎵 리드미컬하게",lo:"😴 느리게"}],
  study:   [{feat:"acousticness",hi:"☕ 어쿠스틱 로파이",lo:"🎛️ 전자음 BGM"},{feat:"energy",hi:"⚡ 활기찬 집중",lo:"🧘 차분한 집중"}],
  party:   [{feat:"energy",hi:"🔊 고에너지",lo:"🎊 적당한 분위기"},{feat:"valence",hi:"😁 밝고 흥겨운",lo:"💪 강렬하고 파워풀"}],
};

// TSP 그리디 플리 정렬
function tspSort(songs) {
  if (songs.length <= 1) return songs;
  const feats = ["danceability","energy","valence","tempo","acousticness","instrumentalness"];
  const dist = (a,b) => {
    const va=feats.map(f=>a[f]||0), vb=feats.map(f=>b[f]||0);
    const dot=va.reduce((s,v,i)=>s+v*vb[i],0);
    const ma=Math.sqrt(va.reduce((s,v)=>s+v*v,0)), mb=Math.sqrt(vb.reduce((s,v)=>s+v*v,0));
    return 1-(ma&&mb?dot/(ma*mb):0);
  };
  const rem=[...songs.slice(1)], res=[songs[0]];
  while(rem.length){
    const last=res[res.length-1];
    let bi=0,bd=Infinity;
    rem.forEach((s,i)=>{const d=dist(last,s);if(d<bd){bd=d;bi=i;}});
    res.push(rem.splice(bi,1)[0]);
  }
  return res;
}

function buildPlaylist(mood, clusterId, zPrefs) {
  const cl = MOOD_DATA[mood].clusters[clusterId];
  const seed = { track_name:cl.top3[0][0], artists:cl.top3[0][1], popularity:cl.top3[0][2], ...cl.means };
  const qs = ZSCORE_Q[mood]||[];
  qs.forEach(q=>{
    if(zPrefs[q.feat]==="hi") seed[q.feat]=Math.min(1,seed[q.feat]*1.3);
    if(zPrefs[q.feat]==="lo") seed[q.feat]=Math.max(0,seed[q.feat]*0.7);
  });
  const pool = MOOD_DATA[mood].clusters.flatMap(c=>
    c.top3.map(t=>({track_name:t[0],artists:t[1],popularity:t[2],...c.means}))
  );
  // 코사인 유사도 기반 후보 선택
  const feats=["danceability","energy","valence","tempo","acousticness","instrumentalness"];
  const sv=feats.map(f=>seed[f]||0), sm=Math.sqrt(sv.reduce((s,v)=>s+v*v,0));
  const scored=pool.map(s=>{
    const av=feats.map(f=>s[f]||0), am=Math.sqrt(av.reduce((s,v)=>s+v*v,0));
    const dot=sv.reduce((s,v,i)=>s+v*av[i],0);
    return{...s,sim:sm&&am?dot/(sm*am):0};
  }).sort((a,b)=>b.sim-a.sim);
  const artistCount={}, result=[];
  for(const s of scored){
    if(result.length>=20) break;
    if((artistCount[s.artists]||0)>=2) continue;
    artistCount[s.artists]=(artistCount[s.artists]||0)+1;
    result.push(s);
  }
  return tspSort([seed,...result.slice(0,19)]);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UI 컴포넌트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:28,height:28}}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

// 진행 스텝 바
function StepBar({ step, color }) {
  const steps = ["무드 선택","군집 카드","취향 세분화","플리 생성"];
  return (
    <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:40}}>
      {steps.map((label,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",flex: i<3?1:"none"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <div style={{
              width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:11,fontWeight:700,transition:"all 0.4s",
              background: step>i?"#1ED760": step===i?(color||"#1ED760"):"#282828",
              color: step>=i?"#000":"#535353",
              boxShadow: step===i?`0 0 0 3px ${color||"#1ED760"}33`:"none",
            }}>
              {step>i?"✓":i+1}
            </div>
            <span style={{fontSize:10,color:step>=i?"#B3B3B3":"#535353",whiteSpace:"nowrap",transition:"color 0.3s"}}>
              {label}
            </span>
          </div>
          {i<3 && (
            <div style={{flex:1,height:2,background: step>i?"#1ED760":"#282828",
              margin:"0 8px",marginBottom:20,transition:"background 0.4s"}}/>
          )}
        </div>
      ))}
    </div>
  );
}

// 피처 바 + 설명 툴팁
function FeatureBar({ feat, value, color, maxVal=1 }) {
  const [hover, setHover] = useState(false);
  const pct = Math.min(100, (value/maxVal)*100);
  return (
    <div style={{marginBottom:6}}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
        <span style={{fontSize:10,color:"#B3B3B3",fontWeight:500}}>{FEATURE_LABEL[feat]}</span>
        <span style={{fontSize:10,color:"#535353"}}>
          {feat==="tempo"?`${Math.round(value)} BPM`:`${Math.round(pct)}%`}
        </span>
      </div>
      <div style={{background:"#282828",borderRadius:3,height:3,overflow:"visible",position:"relative"}}>
        <div style={{
          width:`${pct}%`,height:"100%",borderRadius:3,
          background:`linear-gradient(90deg,${color}99,${color})`,
          transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)"
        }}/>
      </div>
      {hover && (
        <div style={{
          position:"absolute",background:"#282828",border:"1px solid #333",
          borderRadius:6,padding:"6px 10px",fontSize:10,color:"#B3B3B3",
          marginTop:4,zIndex:100,whiteSpace:"nowrap",pointerEvents:"none",
          boxShadow:"0 8px 24px #00000080"
        }}>
          {FEATURE_DESC[feat]}
        </div>
      )}
    </div>
  );
}

// 실루엣 배지
function SilBadge({ sil }) {
  const col = sil>=0.35?"#1ED760":sil>=0.20?"#F59E0B":"#EF4444";
  return (
    <span style={{
      background:`${col}22`,color:col,
      padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,
      border:`1px solid ${col}44`
    }}>
      sil {sil.toFixed(3)}
    </span>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인 앱
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function SpotifyMoodApp() {
  const [step, setStep]       = useState(0);
  const [mood, setMood]       = useState(null);
  const [clusterId, setCId]   = useState(null);
  const [zPrefs, setZPrefs]   = useState({});
  const [playlist, setPlaylist] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(0);
  const [fade, setFade]       = useState(true);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  const meta    = mood ? MOOD_META[mood] : null;
  const mData   = mood ? MOOD_DATA[mood] : null;
  const clData  = (mood&&clusterId!==null) ? MOOD_DATA[mood].clusters[clusterId] : null;
  const color   = meta?.accent || "#1ED760";

  // 애니메이션 전환
  const goTo = (s) => {
    setFade(false);
    setTimeout(()=>{ setStep(s); setFade(true); }, 220);
  };

  // 재생 진행 시뮬레이션
  useEffect(()=>{
    if(step===4 && playing){
      timerRef.current = setInterval(()=>{
        setProgress(p=>{
          if(p>=100){
            setNowPlaying(n=>(n+1)%Math.max(1,playlist.length));
            return 0;
          }
          return p+0.5;
        });
      },100);
    } else {
      clearInterval(timerRef.current);
      if(step!==4) setProgress(0);
    }
    return ()=>clearInterval(timerRef.current);
  },[step,playing,playlist.length]);

  const handleMood = (m) => {
    setMood(m); setZPrefs({}); setCId(null);
    goTo(1);
  };
  const handleCluster = (id) => {
    setCId(id); goTo(2);
  };
  const handleBuild = () => {
    const pl = buildPlaylist(mood, clusterId, zPrefs);
    setPlaylist(pl); setNowPlaying(0); setProgress(0); setPlaying(true);
    goTo(4);
  };
  const handleZPref = (feat, val) => {
    setZPrefs(p=>({...p,[feat]:p[feat]===val?null:val}));
  };
  const reset = () => {
    setMood(null); setCId(null); setZPrefs({});
    setPlaying(false); setProgress(0);
    goTo(0);
  };

  // ── 동적 배경 (스포티파이 스타일: 상단 색상 번짐)
  const bgGradient = meta
    ? `linear-gradient(180deg, ${meta.accent}44 0%, ${meta.accent}11 30%, #121212 60%)`
    : "linear-gradient(180deg, #1a1a2e 0%, #121212 40%)";

  return (
    <div style={{
      minHeight:"100vh", background:"#121212", color:"#FFFFFF",
      fontFamily:"'Circular', 'DM Sans', 'Helvetica Neue', sans-serif",
      position:"relative", overflowX:"hidden",
    }}>
      {/* 스포티파이 스타일 상단 배경 번짐 */}
      <div style={{
        position:"fixed", top:0, left:0, right:0, height:"60vh",
        background: bgGradient,
        transition:"background 0.8s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents:"none", zIndex:0,
      }}/>
      {/* 노이즈 텍스처 오버레이 */}
      <div style={{
        position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:0.03,
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}/>

      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"0 24px 80px"}}>

        {/* ── 헤더 ── */}
        <div style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"24px 0 32px",
          borderBottom:"1px solid #ffffff0a",
          marginBottom:8,
        }}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{color:"#1ED760"}}><SpotifyLogo/></div>
            <div>
              <div style={{fontSize:11,color:"#B3B3B3",letterSpacing:4,textTransform:"uppercase",fontWeight:700}}>
                Ensemble Project
              </div>
              <div style={{fontSize:20,fontWeight:900,letterSpacing:-0.5,lineHeight:1.1}}>
                무드 플리 생성 시스템
              </div>
            </div>
          </div>
          {step>0 && (
            <button onClick={reset} style={{
              background:"transparent",border:"1px solid #535353",color:"#B3B3B3",
              padding:"8px 18px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,
              transition:"all 0.2s",letterSpacing:0.5,
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#FFF";e.currentTarget.style.color="#FFF";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#535353";e.currentTarget.style.color="#B3B3B3";}}>
              처음으로
            </button>
          )}
        </div>

        {/* 스텝 표시 */}
        {step<4 && <div style={{paddingTop:32}}><StepBar step={step} color={color}/></div>}

        {/* ── 콘텐츠 영역 (페이드) ── */}
        <div style={{opacity:fade?1:0, transition:"opacity 0.22s ease", minHeight:400}}>

          {/* ═══════════════════════════════════════
              STEP 0: 무드 선택
          ═══════════════════════════════════════ */}
          {step===0 && (
            <div>
              <div style={{marginBottom:40}}>
                <h1 style={{fontSize:32,fontWeight:900,letterSpacing:-1.5,marginBottom:8,lineHeight:1.1}}>
                  지금 어떤 기분이야?
                </h1>
                <p style={{fontSize:14,color:"#B3B3B3",maxWidth:480}}>
                  무드를 선택하면 KMeans 군집화 결과로 3가지 음악적 결을 찾아줄게
                </p>
              </div>

              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",
                gap:12,
              }}>
                {Object.entries(MOOD_META).map(([m, mt])=>(
                  <button key={m} onClick={()=>handleMood(m)} style={{
                    background:"#181818",
                    border:"1px solid #282828",
                    borderRadius:8,padding:"20px",cursor:"pointer",
                    textAlign:"left",color:"#FFF",
                    transition:"all 0.2s",position:"relative",overflow:"hidden",
                  }}
                    onMouseEnter={e=>{
                      e.currentTarget.style.background="#282828";
                      e.currentTarget.style.transform="translateY(-2px)";
                      e.currentTarget.style.boxShadow=`0 8px 32px ${mt.accent}33`;
                    }}
                    onMouseLeave={e=>{
                      e.currentTarget.style.background="#181818";
                      e.currentTarget.style.transform="translateY(0)";
                      e.currentTarget.style.boxShadow="none";
                    }}>
                    {/* 색상 줄 */}
                    <div style={{
                      position:"absolute",top:0,left:0,right:0,height:3,
                      background:`linear-gradient(90deg,${mt.accent},${mt.color})`,
                      borderRadius:"8px 8px 0 0",
                    }}/>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginTop:6}}>
                      <div>
                        <div style={{fontSize:28,marginBottom:10}}>{mt.emoji}</div>
                        <div style={{fontSize:18,fontWeight:800,textTransform:"capitalize",
                          color:mt.color,marginBottom:4,letterSpacing:-0.5}}>
                          {m}
                        </div>
                        <div style={{fontSize:12,color:"#B3B3B3",marginBottom:12}}>{mt.desc}</div>
                      </div>
                    </div>
                    <div style={{
                      display:"flex",gap:8,alignItems:"center",
                      borderTop:"1px solid #282828",paddingTop:12,
                    }}>
                      <span style={{fontSize:11,color:"#535353"}}>
                        {MOOD_DATA[m].total.toLocaleString()}곡
                      </span>
                      <span style={{color:"#282828"}}>·</span>
                      <SilBadge sil={MOOD_DATA[m].sil}/>
                    </div>
                  </button>
                ))}
              </div>

              {/* 분석 설명 박스 */}
              <div style={{
                marginTop:32,background:"#181818",border:"1px solid #282828",
                borderRadius:8,padding:"16px 20px",
              }}>
                <div style={{fontSize:11,color:"#535353",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>
                  분석 방법론
                </div>
                <div style={{fontSize:12,color:"#B3B3B3",lineHeight:1.7}}>
                  Spotify Tracks Dataset → 7가지 무드 필터링 → 이상치 제거(tempo=0, duration 50s~400s)
                  → KMeans k=3 군집화 (feature_core: danceability · energy · valence · tempo · acousticness · instrumentalness)
                  → 실루엣 계수 기반 군집 평가 → z-score 취향 반영 플리 생성
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              STEP 1: 군집 카드
          ═══════════════════════════════════════ */}
          {step===1 && mood && (
            <div>
              <div style={{marginBottom:32}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <span style={{fontSize:28}}>{meta.emoji}</span>
                  <h2 style={{fontSize:28,fontWeight:900,color:color,textTransform:"capitalize",
                    letterSpacing:-1,margin:0}}>
                    {mood}
                  </h2>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginLeft:4}}>
                    <span style={{fontSize:12,color:"#535353"}}>{mData.total.toLocaleString()}곡</span>
                    <SilBadge sil={mData.sil}/>
                  </div>
                </div>
                <p style={{fontSize:14,color:"#B3B3B3",margin:0}}>
                  KMeans k=3으로 나뉜 3가지 결 중 취향에 맞는 걸 골라봐
                </p>
              </div>

              {/* 실루엣 계수 설명 */}
              <div style={{
                background:"#181818",border:"1px solid #282828",borderRadius:8,
                padding:"12px 16px",marginBottom:24,
                display:"flex",alignItems:"center",gap:10,
              }}>
                <div style={{fontSize:16}}>📊</div>
                <div style={{fontSize:12,color:"#535353"}}>
                  <strong style={{color:"#B3B3B3"}}>실루엣 계수</strong>란 군집이 얼마나 잘 분리됐는지 나타내는 지표야.
                  0.3 이상이면 <span style={{color:"#1ED760"}}>명확</span>,
                  0.2~0.3은 <span style={{color:"#F59E0B"}}>보통</span>,
                  0.2 미만은 <span style={{color:"#EF4444"}}>모호</span>한 편이야.
                </div>
              </div>

              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(3, 1fr)",
                gap:12,
              }}>
                {mData.clusters.map(cl=>(
                  <button key={cl.id} onClick={()=>handleCluster(cl.id)} style={{
                    background:"#181818",border:"1px solid #282828",
                    borderRadius:8,padding:"20px",cursor:"pointer",
                    textAlign:"left",color:"#FFF",transition:"all 0.2s",
                  }}
                    onMouseEnter={e=>{
                      e.currentTarget.style.background="#1A1A1A";
                      e.currentTarget.style.borderColor=color;
                      e.currentTarget.style.transform="translateY(-2px)";
                      e.currentTarget.style.boxShadow=`0 8px 32px ${color}22`;
                    }}
                    onMouseLeave={e=>{
                      e.currentTarget.style.background="#181818";
                      e.currentTarget.style.borderColor="#282828";
                      e.currentTarget.style.transform="translateY(0)";
                      e.currentTarget.style.boxShadow="none";
                    }}>

                    {/* 헤더 */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div style={{
                        width:36,height:36,borderRadius:8,
                        background:`${color}22`,color:color,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontWeight:900,fontSize:16,
                      }}>C{cl.id}</div>
                      <div style={{textAlign:"right"}}>
                        <SilBadge sil={cl.sil}/>
                        <div style={{fontSize:10,color:"#535353",marginTop:3}}>{cl.n.toLocaleString()}곡</div>
                      </div>
                    </div>

                    {/* 라벨·설명 */}
                    <div style={{fontSize:15,fontWeight:800,color:color,marginBottom:4,letterSpacing:-0.3}}>
                      {cl.label}
                    </div>
                    <div style={{fontSize:12,color:"#B3B3B3",marginBottom:16,lineHeight:1.5}}>
                      {cl.desc}
                    </div>

                    {/* 특성 태그 */}
                    {(cl.tags_up.length>0||cl.tags_dn.length>0) && (
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:16}}>
                        {cl.tags_up.map(f=>(
                          <span key={f} style={{
                            background:`${color}22`,color:color,
                            padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,
                          }}>↑{FEATURE_LABEL[f]}</span>
                        ))}
                        {cl.tags_dn.map(f=>(
                          <span key={f} style={{
                            background:"#282828",color:"#535353",
                            padding:"2px 8px",borderRadius:20,fontSize:10,
                          }}>↓{FEATURE_LABEL[f]}</span>
                        ))}
                      </div>
                    )}

                    {/* 피처 바 */}
                    {/* ──────────────────────────────────────────────
                        왜 5개만 표시하나?
                        tempo는 0~250 BPM 단위라 0~1 스케일 피처와 직접 비교 불가.
                        바로 표시하면 항상 만점처럼 보여서 시각적 왜곡이 생김.
                        대신 아래에 BPM 숫자로 별도 표시함.
                    ────────────────────────────────────────────── */}
                    <div style={{marginBottom:14,position:"relative"}}>
                      {BAR_FEATURES.map(f=>(
                        <FeatureBar key={f} feat={f} value={cl.means[f]} color={color}/>
                      ))}
                    </div>

                    {/* 템포 별도 표시 */}
                    <div style={{
                      background:"#282828",borderRadius:6,padding:"6px 10px",
                      display:"flex",justifyContent:"space-between",
                      alignItems:"center",marginBottom:14,
                    }}>
                      <span style={{fontSize:10,color:"#B3B3B3",fontWeight:500}}>🎵 템포</span>
                      <span style={{fontSize:12,fontWeight:700,color:color}}>
                        {Math.round(cl.means.tempo)} BPM
                      </span>
                    </div>

                    {/* TOP 3 */}
                    <div style={{borderTop:"1px solid #282828",paddingTop:12}}>
                      <div style={{fontSize:10,color:"#535353",marginBottom:8,
                        letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>
                        대표곡
                      </div>
                      {cl.top3.map(([name,artist,pop],i)=>(
                        <div key={i} style={{
                          display:"flex",alignItems:"center",gap:10,
                          marginBottom: i<2?6:0,
                        }}>
                          <div style={{
                            width:20,height:20,borderRadius:4,flexShrink:0,
                            background: i===0?color:"#282828",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:9,color: i===0?"#000":"#535353",fontWeight:700,
                          }}>{pop}</div>
                          <div style={{minWidth:0}}>
                            <div style={{
                              fontSize:11,fontWeight:i===0?700:400,
                              color:i===0?"#FFF":"#B3B3B3",
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                            }}>
                              {name.length>24?name.slice(0,24)+"…":name}
                            </div>
                            <div style={{fontSize:9,color:"#535353",
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                              {artist.length>22?artist.slice(0,22)+"…":artist}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              STEP 2: z-score 취향 세분화
          ═══════════════════════════════════════ */}
          {step===2 && mood && clData && (
            <div style={{maxWidth:560,margin:"0 auto"}}>
              <div style={{marginBottom:32,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:8}}>{meta.emoji}</div>
                <h2 style={{fontSize:24,fontWeight:900,letterSpacing:-1,marginBottom:8,margin:0}}>
                  취향을 더 알려줘
                </h2>
                <p style={{fontSize:13,color:"#B3B3B3",marginTop:8}}>
                  <strong style={{color:color}}>{clData.label}</strong> 안에서 더 세밀하게 골라볼게
                </p>
              </div>

              {/* z-score 설명 */}
              <div style={{
                background:"#181818",border:"1px solid #282828",borderRadius:8,
                padding:"14px 18px",marginBottom:28,
              }}>
                <div style={{fontSize:11,color:"#535353",fontWeight:700,
                  letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>
                  z-score 취향 반영
                </div>
                <div style={{fontSize:12,color:"#B3B3B3",lineHeight:1.7}}>
                  선택한 군집 내에서 오디오 피처를 조정해 seed 벡터를 만들어.
                  그 벡터와 코사인 유사도가 높은 곡들을 우선 선택하고,
                  TSP 그리디로 자연스럽게 이어지는 순서로 플리를 정렬해줘.
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:32}}>
                {(ZSCORE_Q[mood]||[]).map((q,qi)=>(
                  <div key={q.feat} style={{
                    background:"#181818",border:"1px solid #282828",
                    borderRadius:8,padding:"20px",
                  }}>
                    <div style={{
                      fontSize:11,color:"#535353",fontWeight:700,
                      letterSpacing:2,textTransform:"uppercase",marginBottom:12,
                    }}>
                      Q{qi+1}. {FEATURE_LABEL[q.feat]} 선호
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      {[{v:"hi",label:q.hi},{v:"lo",label:q.lo}].map(opt=>(
                        <button key={opt.v} onClick={()=>handleZPref(q.feat,opt.v)} style={{
                          flex:1,padding:"14px 12px",borderRadius:8,cursor:"pointer",
                          fontSize:13,fontWeight:600,transition:"all 0.2s",
                          background: zPrefs[q.feat]===opt.v?`${color}22`:"#282828",
                          border: zPrefs[q.feat]===opt.v?`2px solid ${color}`:"2px solid transparent",
                          color: zPrefs[q.feat]===opt.v?color:"#B3B3B3",
                          transform: zPrefs[q.feat]===opt.v?"scale(1.02)":"scale(1)",
                        }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {!zPrefs[q.feat] && (
                      <div style={{fontSize:10,color:"#535353",marginTop:8,textAlign:"center"}}>
                        선택 안 하면 중간값으로 처리돼
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={handleBuild} style={{
                width:"100%",padding:"18px",borderRadius:50,border:"none",
                background:`linear-gradient(135deg,${color},${meta.color})`,
                color:"#000",fontSize:15,fontWeight:900,cursor:"pointer",
                letterSpacing:1,transition:"all 0.2s",
                boxShadow:`0 8px 32px ${color}44`,
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow=`0 12px 40px ${color}66`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=`0 8px 32px ${color}44`;}}>
                🎵 플리 생성하기
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════
              STEP 4: 플리 뷰어 (스포티파이 스타일)
          ═══════════════════════════════════════ */}
          {step===4 && playlist.length>0 && (
            <div>
              {/* 플리 헤더 */}
              <div style={{
                display:"flex",alignItems:"flex-end",gap:24,
                marginBottom:32,padding:"24px",
                background:`linear-gradient(180deg,${color}44,${color}11)`,
                borderRadius:12,
              }}>
                <div style={{
                  width:120,height:120,borderRadius:8,flexShrink:0,
                  background:`linear-gradient(135deg,${color},${meta.color})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:48,boxShadow:`0 16px 48px ${color}44`,
                }}>
                  {meta.emoji}
                </div>
                <div>
                  <div style={{fontSize:11,color:"#B3B3B3",letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>
                    플레이리스트
                  </div>
                  <h2 style={{fontSize:28,fontWeight:900,letterSpacing:-1,margin:"0 0 8px",lineHeight:1}}>
                    {mood?.toUpperCase()} — {clData?.label}
                  </h2>
                  <div style={{fontSize:12,color:"#B3B3B3",marginBottom:4}}>
                    {clData?.desc}
                  </div>
                  <div style={{fontSize:12,color:"#535353"}}>
                    {playlist.length}곡 · KMeans 군집 C{clusterId} · z-score 취향 반영
                    {Object.keys(zPrefs).length>0 && (
                      <span> ({Object.entries(zPrefs).filter(([,v])=>v).map(([k,v])=>`${FEATURE_LABEL[k]}:${v==="hi"?"↑":"↓"}`).join(", ")})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 재생 컨트롤 */}
              <div style={{
                background:"#181818",border:"1px solid #282828",borderRadius:12,
                padding:"20px 24px",marginBottom:24,
              }}>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
                  <button onClick={()=>setPlaying(p=>!p)} style={{
                    width:52,height:52,borderRadius:"50%",border:"none",
                    background:color,cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:20,flexShrink:0,transition:"all 0.15s",
                    boxShadow:`0 4px 16px ${color}66`,
                  }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                    {playing?"⏸":"▶"}
                  </button>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:2,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {playlist[nowPlaying]?.track_name}
                    </div>
                    <div style={{fontSize:12,color:"#B3B3B3",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {playlist[nowPlaying]?.artists}
                    </div>
                  </div>
                  <div style={{
                    padding:"4px 12px",background:`${color}22`,
                    borderRadius:20,fontSize:11,color:color,fontWeight:700,flexShrink:0,
                  }}>
                    {nowPlaying+1} / {playlist.length}
                  </div>
                </div>
                {/* 진행 바 */}
                <div style={{
                  background:"#282828",borderRadius:3,height:4,
                  cursor:"pointer",overflow:"hidden",
                }} onClick={e=>{
                  const rect=e.currentTarget.getBoundingClientRect();
                  setProgress(((e.clientX-rect.left)/rect.width)*100);
                }}>
                  <div style={{
                    width:`${progress}%`,height:"100%",background:color,
                    borderRadius:3,transition:"width 0.1s linear",
                  }}/>
                </div>
              </div>

              {/* 트랙 리스트 */}
              <div style={{
                background:"#181818",border:"1px solid #282828",borderRadius:12,
                overflow:"hidden",
              }}>
                {/* 테이블 헤더 */}
                <div style={{
                  display:"grid",
                  gridTemplateColumns:"36px 1fr 80px 80px",
                  gap:12,padding:"10px 16px",
                  borderBottom:"1px solid #282828",
                  fontSize:11,color:"#535353",fontWeight:700,
                  letterSpacing:1.5,textTransform:"uppercase",
                }}>
                  <div>#</div>
                  <div>곡 정보</div>
                  <div style={{textAlign:"center"}}>인기도</div>
                  <div style={{textAlign:"right"}}>에너지</div>
                </div>
                {playlist.map((song,i)=>(
                  <div key={i} onClick={()=>{ setNowPlaying(i); setProgress(0); setPlaying(true); }}
                    style={{
                      display:"grid",
                      gridTemplateColumns:"36px 1fr 80px 80px",
                      gap:12,padding:"10px 16px",
                      background: i===nowPlaying?`${color}11`:"transparent",
                      borderLeft: i===nowPlaying?`3px solid ${color}`:"3px solid transparent",
                      cursor:"pointer",transition:"all 0.15s",alignItems:"center",
                    }}
                    onMouseEnter={e=>{ if(i!==nowPlaying) e.currentTarget.style.background="#282828"; }}
                    onMouseLeave={e=>{ if(i!==nowPlaying) e.currentTarget.style.background="transparent"; }}>
                    <div style={{
                      fontSize:12,color: i===nowPlaying?color:"#535353",
                      fontWeight: i===nowPlaying?700:400,textAlign:"center",
                    }}>
                      {i===nowPlaying && playing?"▶":i+1}
                    </div>
                    <div style={{minWidth:0}}>
                      <div style={{
                        fontSize:13,fontWeight:600,
                        color: i===nowPlaying?color:"#FFF",
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                      }}>
                        {song.track_name}
                      </div>
                      <div style={{fontSize:11,color:"#B3B3B3",
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {song.artists}
                      </div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{
                        display:"inline-flex",alignItems:"center",justifyContent:"center",
                        width:32,height:18,borderRadius:4,
                        background:`${color}22`,
                        fontSize:10,fontWeight:700,color:color,
                      }}>
                        {song.popularity||"—"}
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{
                        background:"#282828",borderRadius:3,height:4,overflow:"hidden",
                      }}>
                        <div style={{
                          width:`${(song.energy||0)*100}%`,height:"100%",
                          background: i===nowPlaying?color:"#535353",
                          borderRadius:3,
                        }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 다시 만들기 */}
              <div style={{marginTop:24,textAlign:"center"}}>
                <button onClick={()=>goTo(2)} style={{
                  background:"transparent",border:`1px solid ${color}`,
                  color:color,padding:"10px 24px",borderRadius:20,
                  cursor:"pointer",fontSize:13,fontWeight:600,
                  marginRight:12,transition:"all 0.2s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${color}22`;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                  ← 취향 다시 설정
                </button>
                <button onClick={reset} style={{
                  background:"transparent",border:"1px solid #535353",
                  color:"#B3B3B3",padding:"10px 24px",borderRadius:20,
                  cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.2s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#FFF";e.currentTarget.style.color="#FFF";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#535353";e.currentTarget.style.color="#B3B3B3";}}>
                  새 무드 선택
                </button>
              </div>
            </div>
          )}

        </div>{/* /fade */}
      </div>{/* /container */}
    </div>
  );
}
