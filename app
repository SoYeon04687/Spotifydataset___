import { useState, useEffect } from "react";

// ── 실제 분석 데이터 ──────────────────────────────────────────
const MOOD_DATA = {
  chill: {
    total: 725, sil: 0.226,
    clusters: [
      { id: 0, n: 258, sil: 0.232, label: "감성 어쿠스틱", desc: "조용하고 차분한 보컬 중심", tags_up: [], tags_dn: ["danceability"], top3: [["Another Love","Tom Odell",93],["double take","dhruv",83],["Happier Than Ever","ASTN",76]], means: {danceability:0.575,energy:0.376,valence:0.288,tempo:112.9,acousticness:0.651,instrumentalness:0.024} },
      { id: 1, n: 358, sil: 0.216, label: "업비트 칠팝", desc: "에너지 있는 밝고 여유로운 칠", tags_up: ["danceability","energy","valence","tempo"], tags_dn: ["acousticness"], top3: [["NVMD","Denise Julia",79],["At My Worst","Pink Sweat$",76],["Next Up","JBee",77]], means: {danceability:0.724,energy:0.554,valence:0.558,tempo:119.7,acousticness:0.304,instrumentalness:0.044} },
      { id: 2, n: 109, sil: 0.244, label: "앰비언트 기악", desc: "가사 없는 로파이·앰비언트", tags_up: ["instrumentalness"], tags_dn: ["energy","tempo"], top3: [["Eternal Youth","RŮDE",71],["i'm closing my eyes","potsu",69],["Controlla","Idealism",67]], means: {danceability:0.632,energy:0.319,valence:0.263,tempo:109.6,acousticness:0.687,instrumentalness:0.838} },
    ]
  },
  happy: {
    total: 999, sil: 0.209,
    clusters: [
      { id: 0, n: 243, sil: 0.115, label: "따뜻한 해피팝", desc: "어쿠스틱하고 긍정적인 분위기", tags_up: ["danceability","valence","acousticness"], tags_dn: ["tempo"], top3: [["Wanna Play?","The Prophet",65],["Dreams (Will Come Alive)","2 Brothers",65],["How Much Is The Fish?","Scooter",60]], means: {danceability:0.65,energy:0.918,valence:0.538,tempo:135.8,acousticness:0.093,instrumentalness:0.085} },
      { id: 1, n: 479, sil: 0.309, label: "유로댄스 해피", desc: "고에너지·고템포 유로팝", tags_up: ["energy","tempo"], tags_dn: ["danceability"], top3: [["Us Against The World","Darren Styles",62],["The Logical Song","Scooter",62],["Nessaja","Scooter",61]], means: {danceability:0.485,energy:0.942,valence:0.25,tempo:161.1,acousticness:0.053,instrumentalness:0.09} },
      { id: 2, n: 277, sil: 0.118, label: "기악 해피", desc: "가사 없는 해피 배경음", tags_up: ["instrumentalness"], tags_dn: ["energy","acousticness"], top3: [["DLMD","Darren Styles",59],["Switch","Darren Styles",56],["This Moment","Party Animals",50]], means: {danceability:0.584,energy:0.85,valence:0.278,tempo:153.7,acousticness:0.034,instrumentalness:0.72} },
    ]
  },
  romance: {
    total: 902, sil: 0.286,
    clusters: [
      { id: 0, n: 311, sil: 0.163, label: "댄서블 로맨스", desc: "빠르고 역동적인 러브송", tags_up: ["danceability","energy","valence","tempo"], tags_dn: ["acousticness"], top3: [["Эти глаза напротив","Valery Obodzinsky",35],["Katyusha","Georgi Vinogradov",34],["Летний дождь","Igor Talkov",32]], means: {danceability:0.539,energy:0.429,valence:0.619,tempo:118.2,acousticness:0.728,instrumentalness:0.013} },
      { id: 1, n: 68, sil: 0.217, label: "기악 로맨스", desc: "발라이카·클래식 기반 서정", tags_up: ["instrumentalness"], tags_dn: [], top3: [["Katyusha","Ivan Rebroff",25],["До завтра","Vladimir Troshin",24],["Les bateliers","Ivan Rebroff",15]], means: {danceability:0.361,energy:0.288,valence:0.343,tempo:104.1,acousticness:0.92,instrumentalness:0.501} },
      { id: 2, n: 523, sil: 0.368, label: "서정 로맨스", desc: "조용하고 감성적인 사랑 노래", tags_up: [], tags_dn: ["energy"], top3: [["Чистые пруды","Igor Talkov",34],["Kalinka, Kalinka","Ivan Rebroff",33],["Kuchalara","Rashid Beibutov",33]], means: {danceability:0.378,energy:0.223,valence:0.269,tempo:105.9,acousticness:0.938,instrumentalness:0.018} },
    ]
  },
  sad: {
    total: 726, sil: 0.22,
    clusters: [
      { id: 0, n: 47, sil: 0.328, label: "앰비언트 슬픔", desc: "가장 순수하게 슬픈 기악곡", tags_up: ["instrumentalness"], tags_dn: ["danceability","energy","valence"], top3: [["I'm Only a Fool for You","Dybbukk",70],["Nobody Cares","Kina",65],["U're Mine","Kina",64]], means: {danceability:0.657,energy:0.323,valence:0.309,tempo:123.3,acousticness:0.629,instrumentalness:0.734} },
      { id: 1, n: 383, sil: 0.236, label: "격정적 슬픔", desc: "이모·트랩 에너지 있는 슬픔", tags_up: ["danceability","energy","valence"], tags_dn: ["acousticness"], top3: [["By the Sword","iamjakehill",75],["NUMB","Chri$tian Gate$",73],["MARCELINE","Lil God Dan",73]], means: {danceability:0.715,energy:0.611,valence:0.491,tempo:125.1,acousticness:0.182,instrumentalness:0.008} },
      { id: 2, n: 296, sil: 0.182, label: "인디팝 슬픔", desc: "느리고 감성적인 대중적 슬픔", tags_up: [], tags_dn: ["tempo"], top3: [["death bed","Powfu;beabadoobee",83],["Living Life, In The Night","Cheriimoya",83],["Get You The Moon","Kina;Snøw",80]], means: {danceability:0.678,energy:0.397,valence:0.403,tempo:114.6,acousticness:0.65,instrumentalness:0.012} },
    ]
  },
  sleep: {
    total: 853, sil: 0.295,
    clusters: [
      { id: 0, n: 124, sil: 0.144, label: "리드미컬 수면", desc: "음악에 가까운 수면 사운드", tags_up: ["danceability","valence","tempo"], tags_dn: ["instrumentalness"], top3: [["Endless Sky","Nils August Valentin",61],["Shhhh 1","Silent Knights",60],["Delta Sinus Noise Pad","Wiser Noise",60]], means: {danceability:0.348,energy:0.193,valence:0.245,tempo:111.5,acousticness:0.914,instrumentalness:0.417} },
      { id: 1, n: 330, sil: 0.179, label: "백색소음", desc: "전자 노이즈·핑크소음 계열", tags_up: ["energy"], tags_dn: ["acousticness"], top3: [["Weißes Rauschen","Weißes Rauschen HD",67],["Shhhh Baby Shusher","Baby Sleep",66],["Constant Broad Spectrum","White Noise Baby Sleep",62]], means: {danceability:0.188,energy:0.759,valence:0.018,tempo:100.0,acousticness:0.335,instrumentalness:0.745} },
      { id: 2, n: 399, sil: 0.437, label: "조용한 수면", desc: "가장 부드러운 대중적 수면음악", tags_up: [], tags_dn: ["tempo"], top3: [["Brown Sleep Noise","Sleep Miracle",80],["White Noise Sleeping Aid","White Noise Baby Sleep",75],["Herinneringen","Sohn Aelia",74]], means: {danceability:0.154,energy:0.117,valence:0.054,tempo:92.7,acousticness:0.918,instrumentalness:0.824} },
    ]
  },
  study: {
    total: 998, sil: 0.21,
    clusters: [
      { id: 0, n: 361, sil: 0.175, label: "업비트 BGM", desc: "활기찬 작업·집중 배경음악", tags_up: ["energy","valence","tempo"], tags_dn: ["acousticness"], top3: [["Ritual","Talented Mr Tipsy",53],["r u kiddin me?","Wibke Komi",51],["Elastic","4to28",50]], means: {danceability:0.707,energy:0.529,valence:0.523,tempo:117.5,acousticness:0.269,instrumentalness:0.846} },
      { id: 1, n: 534, sil: 0.235, label: "로파이 재즈", desc: "전형적인 공부할 때 듣는 음악", tags_up: ["acousticness"], tags_dn: ["danceability","energy","valence"], top3: [["Distractions","Timothy Infinite",55],["Shoreditch","Clint Is Quinn",55],["Skin Tone","Timothy Infinite",54]], means: {danceability:0.667,energy:0.324,valence:0.31,tempo:108.7,acousticness:0.722,instrumentalness:0.859} },
      { id: 2, n: 103, sil: 0.206, label: "보컬 스터디", desc: "가사 있는 집중 음악 소수 계열", tags_up: [], tags_dn: ["instrumentalness"], top3: [["Latex","Sail & Weep",50],["Morning Stretch","Timothy Infinite",50],["The Sun's Out","Sarah, the Illstrumentalist",46]], means: {danceability:0.703,energy:0.451,valence:0.462,tempo:108.0,acousticness:0.454,instrumentalness:0.235} },
    ]
  },
  party: {
    total: 992, sil: 0.271,
    clusters: [
      { id: 0, n: 693, sil: 0.354, label: "테크노 댄스홀", desc: "고에너지 유러피안 파티", tags_up: ["energy","tempo"], tags_dn: ["danceability","valence"], top3: [["Olivia","Die Zipfelbuben;DJ Cashi",74],["Layla","DJ Robin;Schürze",74],["Dicht im Flieger","Julian Sommer",72]], means: {danceability:0.636,energy:0.92,valence:0.655,tempo:136.0,acousticness:0.053,instrumentalness:0.001} },
      { id: 1, n: 298, sil: 0.079, label: "어쿠스틱 파티", desc: "분위기 전환용 슬로우 파티", tags_up: ["acousticness"], tags_dn: ["energy","tempo"], top3: [["LEBENSLANG - HBz Remix","Tream;HBz",73],["Easy Peasy","FiNCH;Leony;VIZE",65],["Partyanimal","Micha von der Rampe",64]], means: {danceability:0.741,energy:0.758,valence:0.741,tempo:120.4,acousticness:0.185,instrumentalness:0.001} },
      { id: 2, n: 1, sil: 0.0, label: "아웃라이어", desc: "KMeans 수렴 결과 단독 군집", tags_up: [], tags_dn: [], top3: [["I Like To Move It","The Party Cats",37]], means: {danceability:0.817,energy:0.864,valence:0.826,tempo:130.0,acousticness:0.0,instrumentalness:0.49} },
    ]
  },
};

const MOOD_META = {
  chill:   { emoji: "🌊", color: "#14B8A6", bg: "#0D2E2A", desc: "여유롭고 편안한 분위기" },
  happy:   { emoji: "☀️", color: "#F59E0B", bg: "#2D1F00", desc: "밝고 에너지 넘치는 기분" },
  romance: { emoji: "🌹", color: "#EC4899", bg: "#2D0A1A", desc: "설레고 감성적인 순간" },
  sad:     { emoji: "🌧", color: "#3B82F6", bg: "#0A1628", desc: "감정에 솔직한 시간" },
  sleep:   { emoji: "🌙", color: "#7C3AED", bg: "#120A2D", desc: "깊고 편안한 휴식" },
  study:   { emoji: "📚", color: "#1DB954", bg: "#0A1F0F", desc: "집중력 최대로 끌어올리기" },
  party:   { emoji: "🎉", color: "#EF4444", bg: "#2D0A0A", desc: "텐션 폭발하는 파티 타임" },
};

const FEATURE_LABEL = {
  danceability: "댄서블",
  energy: "에너지",
  valence: "긍정감",
  tempo: "템포",
  acousticness: "어쿠스틱",
  instrumentalness: "기악성",
};

// z-score 취향 세분화 피처 및 라벨
const ZSCORE_Q = {
  chill:   [{ feat:"instrumentalness", hi:"🎹 기악 중심", lo:"🎤 보컬 중심" }, { feat:"energy", hi:"⚡ 에너지 있게", lo:"🍃 조용하게" }],
  happy:   [{ feat:"energy", hi:"🔥 강렬하게", lo:"😊 부드럽게" }, { feat:"acousticness", hi:"🎸 어쿠스틱", lo:"🎛 전자음" }],
  romance: [{ feat:"energy", hi:"💃 역동적으로", lo:"🕯 잔잔하게" }, { feat:"instrumentalness", hi:"🎻 기악 중심", lo:"🎤 보컬 중심" }],
  sad:     [{ feat:"energy", hi:"😤 격정적으로", lo:"💧 잔잔하게" }, { feat:"instrumentalness", hi:"🎹 음악으로 위로", lo:"💬 가사로 공감" }],
  sleep:   [{ feat:"energy", hi:"📻 백색소음", lo:"🌿 자연스럽게" }, { feat:"tempo", hi:"🎵 리드미컬하게", lo:"😴 느리게" }],
  study:   [{ feat:"acousticness", hi:"☕ 어쿠스틱 로파이", lo:"🎛 전자음 BGM" }, { feat:"energy", hi:"⚡ 활기찬 집중", lo:"🧘 차분한 집중" }],
  party:   [{ feat:"energy", hi:"🔊 고에너지", lo:"🎊 적당한 분위기" }, { feat:"valence", hi:"😁 밝고 흥겨운", lo:"💪 강렬하고 파워풀" }],
};

// TSP 그리디 시뮬레이션
function tspSort(songs) {
  if (songs.length <= 1) return songs;
  const feats = ["danceability","energy","valence","tempo","acousticness","instrumentalness"];
  const norm = (s) => feats.map(f => (s[f] || 0));
  const dist = (a, b) => {
    const va = norm(a), vb = norm(b);
    const dot = va.reduce((s,v,i) => s + v*vb[i], 0);
    const ma = Math.sqrt(va.reduce((s,v) => s+v*v, 0));
    const mb = Math.sqrt(vb.reduce((s,v) => s+v*v, 0));
    return 1 - (ma && mb ? dot/(ma*mb) : 0);
  };
  const remaining = [...songs.slice(1)];
  const result = [songs[0]];
  while (remaining.length) {
    const last = result[result.length-1];
    let best = 0, bestD = Infinity;
    remaining.forEach((s,i) => { const d=dist(last,s); if(d<bestD){bestD=d;best=i;}});
    result.push(remaining.splice(best,1)[0]);
  }
  return result;
}

// 후보 100곡 코사인 유사도 선택 시뮬레이션
function selectCandidates(allSongs, seed, n=20) {
  const feats = ["danceability","energy","valence","tempo","acousticness","instrumentalness"];
  const sv = feats.map(f => seed[f] || 0);
  const sm = Math.sqrt(sv.reduce((s,v)=>s+v*v,0));
  const scored = allSongs.map(song => {
    const av = feats.map(f => song[f] || 0);
    const am = Math.sqrt(av.reduce((s,v)=>s+v*v,0));
    const dot = sv.reduce((s,v,i)=>s+v*av[i],0);
    return { ...song, similarity: sm&&am ? dot/(sm*am) : 0 };
  });
  scored.sort((a,b) => b.similarity - a.similarity);
  const artistCount = {};
  const result = [];
  for (const s of scored) {
    if (result.length >= n) break;
    const a = s.artists;
    if ((artistCount[a]||0) >= 2) continue;
    const popOk = Math.abs((s.popularity||0) - (seed.popularity||50)) <= 35;
    if (!popOk && result.length < n*0.7) { /* 다양성 위해 약간 허용 */ }
    artistCount[a] = (artistCount[a]||0) + 1;
    result.push(s);
  }
  return result;
}

// ── 메인 앱 ──────────────────────────────────────────────────
export default function SpotifyMoodApp() {
  const [step, setStep] = useState(0); // 0:무드 1:군집 2:z-score 3:seed 4:플리
  const [mood, setMood] = useState(null);
  const [cluster, setCluster] = useState(null);
  const [zPrefs, setZPrefs] = useState({});
  const [seedMethod, setSeedMethod] = useState("popularity");
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (nextStep, delay=0) => {
    setAnimating(true);
    setTimeout(() => { setStep(nextStep); setAnimating(false); }, delay);
  };

  const selectMood = (m) => { setMood(m); setZPrefs({}); setCluster(null); go(1); };
  const selectCluster = (c) => { setCluster(c); go(2); };

  const buildPlaylist = () => {
    const cl = MOOD_DATA[mood].clusters[cluster];
    // seed = 군집 대표곡 + z-score 취향 반영
    const seed = {
      track_name: cl.top3[0][0], artists: cl.top3[0][1], popularity: cl.top3[0][2],
      ...cl.means
    };
    // 해당 무드 전체 곡을 means 기반으로 시뮬레이션 (20곡)
    const pool = MOOD_DATA[mood].clusters.flatMap(c =>
      c.top3.map(t => ({ track_name:t[0], artists:t[1], popularity:t[2], ...c.means }))
    );
    // z-score 취향 반영해서 seed 조정
    const qs = ZSCORE_Q[mood] || [];
    qs.forEach(q => {
      if (zPrefs[q.feat] === "hi") seed[q.feat] = Math.min(1, seed[q.feat] * 1.3);
      if (zPrefs[q.feat] === "lo") seed[q.feat] = Math.max(0, seed[q.feat] * 0.7);
    });
    const candidates = selectCandidates(pool, seed, 20);
    const sorted = tspSort([seed, ...candidates.slice(0,19)]);
    setPlaylist(sorted);
    setCurrentSong(0);
    go(4);
  };

  const meta = mood ? MOOD_META[mood] : null;
  const moodData = mood ? MOOD_DATA[mood] : null;
  const clusterData = (mood && cluster !== null) ? MOOD_DATA[mood].clusters[cluster] : null;

  return (
    <div style={{
      minHeight:"100vh", background:"#0A0A0A", color:"#F0F0F0",
      fontFamily:"'DM Sans', 'Pretendard', sans-serif",
      overflowX:"hidden"
    }}>
      {/* 배경 그라디언트 */}
      {meta && (
        <div style={{
          position:"fixed", inset:0, zIndex:0,
          background:`radial-gradient(ellipse 60% 40% at 50% 0%, ${meta.color}22 0%, transparent 70%)`,
          pointerEvents:"none"
        }}/>
      )}

      <div style={{ position:"relative", zIndex:1, maxWidth:900, margin:"0 auto", padding:"40px 20px" }}>

        {/* 헤더 */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
          <div style={{
            width:36, height:36, borderRadius:"50%",
            background:"#1DB954", display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18
          }}>🎵</div>
          <div>
            <div style={{ fontSize:13, color:"#888", letterSpacing:3, textTransform:"uppercase" }}>Ensemble Project</div>
            <div style={{ fontSize:18, fontWeight:700, letterSpacing:-0.5 }}>무드 플리 생성 시스템</div>
          </div>
          {step > 0 && (
            <button onClick={() => { setStep(0); setMood(null); setCluster(null); }}
              style={{ marginLeft:"auto", background:"transparent", border:"1px solid #333",
                color:"#888", padding:"6px 14px", borderRadius:20, cursor:"pointer", fontSize:12 }}>
              처음으로
            </button>
          )}
        </div>

        {/* 진행 단계 표시 */}
        <div style={{ display:"flex", gap:8, marginBottom:48, alignItems:"center" }}>
          {["무드 선택","군집 카드","취향 세분화","플리 생성"].map((label, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                display:"flex", alignItems:"center", gap:6,
                opacity: step >= i ? 1 : 0.3,
                transition:"opacity 0.3s"
              }}>
                <div style={{
                  width:24, height:24, borderRadius:"50%",
                  background: step > i ? "#1DB954" : step === i ? (meta?.color || "#555") : "#222",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:700,
                  border: step === i ? `2px solid ${meta?.color || "#555"}` : "2px solid transparent",
                  transition:"all 0.3s"
                }}>
                  {step > i ? "✓" : i+1}
                </div>
                <span style={{ fontSize:12, color: step===i ? "#F0F0F0" : "#666" }}>{label}</span>
              </div>
              {i < 3 && <div style={{ width:24, height:1, background:"#222" }}/>}
            </div>
          ))}
        </div>

        {/* ── STEP 0: 무드 선택 ─────────────────────────────── */}
        {step === 0 && (
          <div style={{ opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>
            <div style={{ marginBottom:32 }}>
              <div style={{ fontSize:28, fontWeight:800, letterSpacing:-1, marginBottom:8 }}>
                지금 어떤 기분이야?
              </div>
              <div style={{ fontSize:14, color:"#666" }}>
                무드를 선택하면 KMeans 군집화로 3가지 결을 찾아줄게
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))", gap:16 }}>
              {Object.entries(MOOD_META).map(([m, meta]) => (
                <button key={m} onClick={() => selectMood(m)} style={{
                  background:`linear-gradient(135deg, ${meta.bg} 0%, #111 100%)`,
                  border:`1px solid ${meta.color}33`,
                  borderRadius:16, padding:"24px 20px", cursor:"pointer",
                  textAlign:"left", color:"#F0F0F0", transition:"all 0.2s",
                  transform:"scale(1)"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=meta.color; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=meta.color+"33"; e.currentTarget.style.transform="translateY(0)"; }}
                >
                  <div style={{ fontSize:32, marginBottom:12 }}>{meta.emoji}</div>
                  <div style={{ fontSize:16, fontWeight:700, textTransform:"capitalize", marginBottom:6, color:meta.color }}>{m}</div>
                  <div style={{ fontSize:12, color:"#888", marginBottom:12 }}>{meta.desc}</div>
                  <div style={{ fontSize:11, color:"#555" }}>
                    {MOOD_DATA[m].total}곡 · 실루엣 {MOOD_DATA[m].sil.toFixed(3)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: 군집 카드 3장 ──────────────────────────── */}
        {step === 1 && mood && (
          <div style={{ opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>
            <div style={{ marginBottom:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:28 }}>{meta.emoji}</span>
                <span style={{ fontSize:24, fontWeight:800, color:meta.color, textTransform:"capitalize" }}>{mood}</span>
                <span style={{ fontSize:14, color:"#555", marginLeft:4 }}>· {moodData.total}곡 · 실루엣 {moodData.sil.toFixed(3)}</span>
              </div>
              <div style={{ fontSize:14, color:"#666" }}>
                KMeans k=3으로 나뉜 3가지 결 중 하나를 골라봐
              </div>
            </div>

            {/* 실루엣 계수 설명 */}
            <div style={{
              background:"#111", border:"1px solid #222", borderRadius:10,
              padding:"12px 16px", marginBottom:24, fontSize:12, color:"#555"
            }}>
              📊 실루엣 계수: 군집이 얼마나 잘 분리됐는지 (0~1, 높을수록 명확)
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
              {moodData.clusters.map((cl) => {
                const silColor = cl.sil >= 0.30 ? "#1DB954" : cl.sil >= 0.20 ? "#F59E0B" : "#EF4444";
                return (
                  <button key={cl.id} onClick={() => selectCluster(cl.id)} style={{
                    background:"#111", border:`1px solid #222`, borderRadius:16,
                    padding:"20px", cursor:"pointer", textAlign:"left", color:"#F0F0F0",
                    transition:"all 0.2s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=meta.color; e.currentTarget.style.background="#161616"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#222"; e.currentTarget.style.background="#111"; }}
                  >
                    {/* 군집 번호 + 실루엣 */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                      <div style={{
                        width:32, height:32, borderRadius:8,
                        background:`${meta.color}22`, color:meta.color,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontWeight:800, fontSize:14
                      }}>C{cl.id}</div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:11, color:silColor, fontWeight:600 }}>실루엣 {cl.sil.toFixed(3)}</div>
                        <div style={{ fontSize:10, color:"#444" }}>{cl.n}곡</div>
                      </div>
                    </div>

                    {/* 라벨 + 설명 */}
                    <div style={{ fontSize:15, fontWeight:700, marginBottom:4, color:meta.color }}>{cl.label}</div>
                    <div style={{ fontSize:12, color:"#666", marginBottom:16 }}>{cl.desc}</div>

                    {/* 특성 태그 */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:16 }}>
                      {cl.tags_up.map(f => (
                        <span key={f} style={{
                          background:`${meta.color}22`, color:meta.color,
                          padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:600
                        }}>↑{FEATURE_LABEL[f]}</span>
                      ))}
                      {cl.tags_dn.map(f => (
                        <span key={f} style={{
                          background:"#1A1A1A", color:"#555",
                          padding:"2px 8px", borderRadius:20, fontSize:10
                        }}>↓{FEATURE_LABEL[f]}</span>
                      ))}
                    </div>

                    {/* 피처 바 차트 */}
                    <div style={{ marginBottom:16 }}>
                      {["danceability","energy","valence","acousticness","instrumentalness"].map(f => (
                        <div key={f} style={{ marginBottom:4 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#555", marginBottom:1 }}>
                            <span>{FEATURE_LABEL[f]}</span>
                            <span>{(cl.means[f]*100).toFixed(0)}%</span>
                          </div>
                          <div style={{ background:"#1A1A1A", borderRadius:4, height:4, overflow:"hidden" }}>
                            <div style={{
                              width:`${cl.means[f]*100}%`, height:"100%",
                              background:`linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
                              borderRadius:4, transition:"width 0.5s"
                            }}/>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 대표곡 TOP3 */}
                    <div style={{ borderTop:"1px solid #1A1A1A", paddingTop:12 }}>
                      <div style={{ fontSize:10, color:"#444", marginBottom:8 }}>🎵 대표곡</div>
                      {cl.top3.map(([name, artist, pop], i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <div style={{
                            width:18, height:18, borderRadius:4,
                            background: i===0 ? meta.color : "#1A1A1A",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:9, color: i===0 ? "#000" : "#444", fontWeight:700, flexShrink:0
                          }}>{pop}</div>
                          <div>
                            <div style={{ fontSize:11, fontWeight: i===0 ? 600 : 400, color: i===0 ? "#F0F0F0":"#888" }}>
                              {name.length > 22 ? name.slice(0,22)+"…" : name}
                            </div>
                            <div style={{ fontSize:9, color:"#444" }}>{artist.length>20?artist.slice(0,20)+"…":artist}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: z-score 취향 세분화 ────────────────────── */}
        {step === 2 && mood && cluster !== null && (
          <div style={{ opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>
            <div style={{ marginBottom:32 }}>
              <div style={{ fontSize:24, fontWeight:800, letterSpacing:-0.5, marginBottom:8 }}>
                좀 더 세세하게 취향을 알려줘
              </div>
              <div style={{ fontSize:13, color:"#666" }}>
                클러스터 안에서 z-score로 한 번 더 취향 좁히기
                <span style={{
                  marginLeft:8, background:`${meta.color}22`, color:meta.color,
                  padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600
                }}>
                  {clusterData.label} · C{cluster}
                </span>
              </div>
            </div>

            {/* z-score 설명 박스 */}
            <div style={{
              background:"#111", border:`1px solid ${meta.color}22`,
              borderRadius:12, padding:"14px 18px", marginBottom:32, fontSize:12
            }}>
              <div style={{ color:meta.color, fontWeight:600, marginBottom:4 }}>💡 z-score 취향 세분화란?</div>
              <div style={{ color:"#666" }}>
                같은 군집 안에서도 피처가 다양해. z = (곡의 값 - 군집 평균) / 표준편차로
                군집 내 <strong style={{color:"#F0F0F0"}}>상대적 위치</strong>를 파악해서 취향을 더 정밀하게 반영해.
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:20, marginBottom:40 }}>
              {(ZSCORE_Q[mood] || []).map((q, qi) => (
                <div key={qi} style={{
                  background:"#111", border:"1px solid #1A1A1A", borderRadius:14, padding:"20px 24px"
                }}>
                  <div style={{ fontSize:11, color:"#555", marginBottom:12, textTransform:"uppercase", letterSpacing:2 }}>
                    {FEATURE_LABEL[q.feat]} 기준
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {[["hi", q.hi], ["lo", q.lo]].map(([val, label]) => (
                      <button key={val} onClick={() => setZPrefs(p => ({...p, [q.feat]: val}))} style={{
                        padding:"16px", borderRadius:12, cursor:"pointer",
                        background: zPrefs[q.feat]===val ? `${meta.color}22` : "#161616",
                        border: zPrefs[q.feat]===val ? `1.5px solid ${meta.color}` : "1.5px solid #222",
                        color: zPrefs[q.feat]===val ? meta.color : "#888",
                        fontSize:14, fontWeight: zPrefs[q.feat]===val ? 700 : 400,
                        transition:"all 0.15s", cursor:"pointer"
                      }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Seed 결정 방식 */}
            <div style={{
              background:"#111", border:"1px solid #1A1A1A", borderRadius:14, padding:"20px 24px", marginBottom:32
            }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>🌱 Seed 결정 방식</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  { val:"popularity", title:"⭐ 인기도 기준", desc:"많은 사람이 좋아한 검증된 곡으로 시작" },
                  { val:"centroid",   title:"🎯 취향 좌표", desc:"내 취향 벡터에 가장 가까운 곡으로 시작" }
                ].map(opt => (
                  <button key={opt.val} onClick={() => setSeedMethod(opt.val)} style={{
                    padding:"14px", borderRadius:12,
                    background: seedMethod===opt.val ? `${meta.color}22` : "#161616",
                    border: seedMethod===opt.val ? `1.5px solid ${meta.color}` : "1.5px solid #222",
                    color: seedMethod===opt.val ? meta.color : "#888",
                    textAlign:"left", cursor:"pointer", transition:"all 0.15s"
                  }}>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{opt.title}</div>
                    <div style={{ fontSize:11, opacity:0.7 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={buildPlaylist} style={{
              width:"100%", padding:"16px", borderRadius:14,
              background:`linear-gradient(135deg, ${meta.color}, ${meta.color}99)`,
              border:"none", color:"#000", fontSize:15, fontWeight:800,
              cursor:"pointer", letterSpacing:-0.3,
              boxShadow:`0 8px 32px ${meta.color}44`
            }}>
              🎵 플리 20곡 생성하기 →
            </button>
          </div>
        )}

        {/* ── STEP 4: 플리 결과 ───────────────────────────────── */}
        {step === 4 && playlist.length > 0 && (
          <div style={{ opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>
            <div style={{ marginBottom:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:28 }}>{meta.emoji}</span>
                <div>
                  <div style={{ fontSize:22, fontWeight:800 }}>
                    {clusterData.label} 플리 완성!
                  </div>
                  <div style={{ fontSize:12, color:"#555" }}>
                    TSP 그리디 정렬 · {playlist.length}곡 · z-score 취향 반영
                  </div>
                </div>
              </div>
            </div>

            {/* 파이프라인 요약 */}
            <div style={{
              display:"flex", gap:8, alignItems:"center", marginBottom:28,
              background:"#111", borderRadius:12, padding:"12px 16px",
              fontSize:11, color:"#555", flexWrap:"wrap"
            }}>
              {[
                `${meta.emoji} ${mood}`,
                `→ C${cluster}: ${clusterData.label}`,
                `→ z-score: ${Object.entries(zPrefs).map(([f,v])=>`${FEATURE_LABEL[f]} ${v==="hi"?"↑":"↓"}`).join(", ")||"기본"}`,
                `→ Seed: ${seedMethod==="popularity"?"인기도":"취향좌표"}`,
                `→ TSP 정렬`,
              ].map((t,i) => (
                <span key={i} style={{ color: i===4 ? meta.color : "#555" }}>{t}</span>
              ))}
            </div>

            {/* 현재 재생 곡 */}
            <div style={{
              background:`linear-gradient(135deg, ${meta.bg}, #111)`,
              border:`1px solid ${meta.color}33`, borderRadius:20,
              padding:"24px", marginBottom:24
            }}>
              <div style={{ fontSize:11, color:meta.color, marginBottom:12, letterSpacing:2, textTransform:"uppercase" }}>
                Now Playing
              </div>
              <div style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>
                {playlist[currentSong]?.track_name || "—"}
              </div>
              <div style={{ fontSize:13, color:"#888", marginBottom:16 }}>
                {playlist[currentSong]?.artists || "—"}
              </div>
              {/* 피처 미니 바 */}
              <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                {["danceability","energy","valence"].map(f => (
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ fontSize:10, color:"#555", width:50 }}>{FEATURE_LABEL[f]}</div>
                    <div style={{ background:"#1A1A1A", borderRadius:4, height:4, width:60, overflow:"hidden" }}>
                      <div style={{
                        width:`${(playlist[currentSong]?.[f]||0)*100}%`, height:"100%",
                        background:meta.color, borderRadius:4
                      }}/>
                    </div>
                    <div style={{ fontSize:10, color:"#444" }}>{((playlist[currentSong]?.[f]||0)*100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
              {/* 재생 컨트롤 */}
              <div style={{ display:"flex", gap:12, marginTop:20, alignItems:"center" }}>
                <button onClick={() => setCurrentSong(Math.max(0, currentSong-1))} style={{
                  background:"#1A1A1A", border:"none", color:"#888", padding:"8px 16px",
                  borderRadius:8, cursor:"pointer", fontSize:12
                }}>⏮ 이전</button>
                <div style={{ fontSize:12, color:"#555" }}>{currentSong+1} / {playlist.length}</div>
                <button onClick={() => setCurrentSong(Math.min(playlist.length-1, currentSong+1))} style={{
                  background:meta.color, border:"none", color:"#000", padding:"8px 16px",
                  borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700
                }}>다음 ⏭</button>
              </div>
            </div>

            {/* 플리 전체 목록 */}
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {playlist.map((song, i) => (
                <div key={i}
                  onClick={() => setCurrentSong(i)}
                  style={{
                    display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
                    borderRadius:10, cursor:"pointer", transition:"all 0.15s",
                    background: currentSong===i ? `${meta.color}18` : "transparent",
                    border: currentSong===i ? `1px solid ${meta.color}33` : "1px solid transparent"
                  }}>
                  <div style={{
                    width:28, height:28, borderRadius:6, flexShrink:0,
                    background: currentSong===i ? meta.color : "#1A1A1A",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, color: currentSong===i ? "#000":"#555", fontWeight:700
                  }}>{i+1}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{
                      fontSize:13, fontWeight: currentSong===i ? 600 : 400,
                      color: currentSong===i ? "#F0F0F0":"#888",
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"
                    }}>{song.track_name}</div>
                    <div style={{ fontSize:11, color:"#444" }}>{song.artists}</div>
                  </div>
                  {/* Energy 미니 인디케이터 */}
                  <div style={{ display:"flex", gap:2, alignItems:"flex-end", flexShrink:0 }}>
                    {[3,5,4,2,6,5,3].map((h,j) => (
                      <div key={j} style={{
                        width:2, height: h * (song.energy||0.5) * 4,
                        background: currentSong===i ? meta.color : "#333",
                        borderRadius:1, transition:"all 0.2s"
                      }}/>
                    ))}
                  </div>
                  <div style={{ fontSize:10, color:"#444", flexShrink:0, width:24, textAlign:"right" }}>
                    {song.popularity||"—"}
                  </div>
                </div>
              ))}
            </div>

            {/* 다시 만들기 버튼 */}
            <button onClick={() => setStep(0)} style={{
              width:"100%", marginTop:24, padding:"14px",
              background:"transparent", border:`1px solid ${meta.color}44`,
              borderRadius:14, color:meta.color, fontSize:14, fontWeight:600,
              cursor:"pointer"
            }}>
              🔄 다른 무드로 다시 만들기
            </button>
          </div>
        )}

        {/* ── 하단 파이프라인 설명 ──────────────────────────── */}
        {step < 4 && (
          <div style={{ marginTop:60, borderTop:"1px solid #1A1A1A", paddingTop:24 }}>
            <div style={{ fontSize:11, color:"#333", marginBottom:12, textTransform:"uppercase", letterSpacing:2 }}>
              파이프라인
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[
                ["1","무드 선택","7가지 무드 중 선택"],
                ["2","KMeans k=3","3가지 결로 군집화"],
                ["3","z-score","취향 세분화"],
                ["4","Seed 결정","인기도 or 좌표"],
                ["5","코사인 유사도","100곡 후보 선택"],
                ["6","TSP 정렬","자연스러운 흐름"],
                ["7","V-E 커브","기승전결 (v2.0)"],
              ].map(([num, title, desc], i) => (
                <div key={i} style={{
                  background:"#0F0F0F", border:`1px solid ${i < step ? "#1DB95444" : "#1A1A1A"}`,
                  borderRadius:8, padding:"8px 12px", fontSize:10
                }}>
                  <span style={{ color: i < step ? "#1DB954" : "#333", marginRight:4 }}>{num}</span>
                  <span style={{ color: i < step ? "#888" : "#333" }}>{title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
