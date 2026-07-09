import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://qxvtzxttjmzurfwkxfhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dnR6eHR0am16dXJmd2t4Zmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDcxOTQsImV4cCI6MjA5OTEyMzE5NH0.Gwz13_5ZtXqoRyvMq6WBybXUfQbXkHgchzR-f74cAiE";

async function sbGet(t,f=""){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}${f}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});return r.json();}
async function sbPost(t,b){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}`,{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(b)});return r.json();}
async function sbPatch(t,id,b){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?id=eq.${id}`,{method:"PATCH",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(b)});return r.json();}

const C={marsala:"#4A1020",marsalaClaro:"#6B1A30",dourado:"#B8860B",fundo:"#F5EFE6",card:"#FFFFFF",cardClaro:"#EDE4D8",texto:"#1A0A0E",textoSuave:"#5C3D2E",verde:"#1B6B3A",vermelho:"#A52020",azul:"#1A4F7A"};

const EP=["Gratidão","Confiança","Motivação","Leveza","Orgulho","Alegria","Serenidade","Esperança","Satisfação","Empoderamento"];
const EN=["Medo","Culpa","Ansiedade","Impulsividade","Vergonha","Raiva","Tristeza","Desânimo","Inveja","Insegurança"];

const CB=[
  {id:1,crenca:"Dinheiro é difícil de ganhar",categoria:"Escassez",ressig:"Dinheiro é o resultado natural do valor que entrego."},
  {id:2,crenca:"Eu não mereço ser rico(a)",categoria:"Merecimento",ressig:"Eu sou digno(a) de abundância."},
  {id:3,crenca:"Dinheiro não é para pessoas como eu",categoria:"Escassez",ressig:"Dinheiro está disponível para qualquer pessoa disposta a aprender e agir."},
  {id:4,crenca:"Rico é quem nasce em berço de ouro",categoria:"Escassez",ressig:"A maioria das pessoas prósperas construiu sua riqueza com educação e consistência."},
  {id:5,crenca:"Dinheiro é a raiz de todo mal",categoria:"Moralidade",ressig:"Dinheiro é uma ferramenta neutra."},
  {id:6,crenca:"Quem tem dinheiro é ganancioso",categoria:"Moralidade",ressig:"Posso ser próspero(a) e generoso(a) ao mesmo tempo."},
  {id:7,crenca:"É errado querer muito dinheiro",categoria:"Moralidade",ressig:"Querer prosperidade é querer segurança, liberdade e possibilidade."},
  {id:8,crenca:"Falar de dinheiro é falta de educação",categoria:"Moralidade",ressig:"Falar de dinheiro com consciência é um ato de maturidade."},
  {id:9,crenca:"Eu não sei lidar com dinheiro",categoria:"Capacidade",ressig:"Lidar bem com dinheiro é uma habilidade que se aprende."},
  {id:10,crenca:"Sempre fui assim, não vou mudar",categoria:"Identidade",ressig:"Meu cérebro é plástico e meu comportamento é moldável."},
  {id:11,crenca:"Sou desorganizado(a) por natureza",categoria:"Identidade",ressig:"Organização é um hábito, não uma característica inata."},
  {id:12,crenca:"Não tenho cabeça para finanças",categoria:"Capacidade",ressig:"Finanças pessoais se aprende com método e prática."},
  {id:13,crenca:"Dinheiro separa as pessoas",categoria:"Relacionamentos",ressig:"Com comunicação saudável, a prosperidade aproxima os relacionamentos."},
  {id:14,crenca:"Se eu enriquecer vou perder meus amigos",categoria:"Relacionamentos",ressig:"Relacionamentos verdadeiros celebram o crescimento do outro."},
  {id:15,crenca:"Não posso ganhar mais que meu pai/mãe",categoria:"Relacionamentos",ressig:"Honro minha família ao superar limitações que eles não puderam vencer."},
  {id:16,crenca:"Dinheiro vem e vai, não adianta guardar",categoria:"Impermanência",ressig:"Com estratégia e consistência, o dinheiro acumula e trabalha por mim."},
  {id:17,crenca:"Sempre que tenho, perco",categoria:"Impermanência",ressig:"Hoje tenho mais consciência para preservar o que conquisto."},
  {id:18,crenca:"Não vale a pena investir, posso perder tudo",categoria:"Medo",ressig:"Investir com educação e diversificação é diferente de especular."},
  {id:19,crenca:"Segurança financeira é impossível",categoria:"Medo",ressig:"Segurança financeira é construída passo a passo."},
];

const CAT_MOV=[{v:"salario",l:"Salário"},{v:"freelance",l:"Freelance"},{v:"bonus",l:"Bônus"},{v:"presente",l:"Presente"},{v:"aluguel_rec",l:"Aluguel recebido"},{v:"alimentacao",l:"Alimentação"},{v:"moradia",l:"Moradia"},{v:"saude",l:"Saúde"},{v:"educacao",l:"Educação"},{v:"lazer",l:"Lazer"},{v:"transporte",l:"Transporte"},{v:"vestuario",l:"Vestuário"},{v:"divida",l:"Dívida"},{v:"pensao",l:"Pensão"},{v:"cartao_credito",l:"Cartão de Crédito"}];
const CAT_AGE=[{v:"conta",l:"Conta fixa"},{v:"servico",l:"Serviço"},{v:"cliente",l:"Pagamento de cliente"},{v:"freelance",l:"Freelance"},{v:"aluguel",l:"Aluguel"},{v:"pensao",l:"Pensão"},{v:"cartao_credito",l:"Cartão de Crédito"}];

const fmt=v=>"R$ "+Number(v||0).toLocaleString("pt-BR",{minimumFractionDigits:2});
const fmtPct=v=>(v>=0?"+":"")+Number(v||0).toFixed(2)+"%";
const hoje=()=>new Date().toLocaleDateString("pt-BR");
const agoraStr=()=>new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const strParaData=s=>new Date(s+"T12:00:00");
const mesAnoAtual=()=>{const d=new Date();return`${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;}
const mesAnoDeData=s=>{if(!s)return"";const p=s.split("/");return p.length===3?`${p[1]}/${p[2]}`:"";}
function statusConta(v){if(!v)return"pendente";const h=new Date();h.setHours(0,0,0,0);const d=strParaData(v);d.setHours(0,0,0,0);return d<h?"vencida":"pendente";}

// Cálculo de saldo por mês
function calcSaldoMes(movs,rendimentos,mesAno){
  const e=(movs||[]).filter(m=>m.tipo==="entrada"&&mesAnoDeData(m.data)===mesAno).reduce((a,m)=>a+m.valor,0);
  const r=(rendimentos||[]).filter(r=>mesAnoDeData(r.data)===mesAno).reduce((a,r)=>a+r.valor,0);
  const s=(movs||[]).filter(m=>m.tipo==="saida"&&mesAnoDeData(m.data)===mesAno).reduce((a,m)=>a+m.valor,0);
  return e+r-s;
}

// Todos os meses com lançamentos
function getMesesComLancamentos(movs,rendimentos){
  const meses=new Set();
  (movs||[]).forEach(m=>{const ma=mesAnoDeData(m.data);if(ma)meses.add(ma);});
  (rendimentos||[]).forEach(r=>{const ma=mesAnoDeData(r.data);if(ma)meses.add(ma);});
  return Array.from(meses).sort((a,b)=>{const [ma,ya]=a.split("/");const [mb,yb]=b.split("/");return ya!==yb?ya-yb:ma-mb;});
}

// Carteira de investimentos unificada
function calcCarteira(ativos){
  return (ativos||[]).map(a=>{
    const compras=a.aportes||[];
    const vendas=a.vendas||[];
    const totalCotas=compras.reduce((s,c)=>s+c.qtd,0)-vendas.reduce((s,v)=>s+v.qtd,0);
    const totalInvestido=compras.reduce((s,c)=>s+(c.qtd*c.preco),0);
    const totalRecebido=vendas.reduce((s,v)=>s+(v.qtd*v.preco),0);
    const qtdComprada=compras.reduce((s,c)=>s+c.qtd,0);
    const precoMedio=qtdComprada>0?compras.reduce((s,c)=>s+(c.qtd*c.preco),0)/qtdComprada:0;
    const valorAtual=(a.precoAtual||0)*totalCotas;
    const lucro=valorAtual-(precoMedio*totalCotas)+totalRecebido;
    const pct=precoMedio>0?((a.precoAtual||0)-precoMedio)/precoMedio*100:0;
    return {...a,totalCotas,totalInvestido,precoMedio,valorAtual,lucro,pct,totalRecebido};
  });
}

// UI
function Card({children,style={}}){return <div style={{background:C.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${C.marsalaClaro}33`,...style}}>{children}</div>;}
function Inp({label,value,onChange,type="text",placeholder="",step}){return(<div style={{marginBottom:12}}>{label&&<label style={{display:"block",fontSize:12,color:C.dourado,marginBottom:4,fontWeight:600}}>{label}</label>}<input type={type} step={step} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",background:C.cardClaro,border:`1px solid ${C.marsalaClaro}55`,borderRadius:8,padding:"8px 12px",color:C.texto,fontSize:14,boxSizing:"border-box",outline:"none"}}/></div>);}
function Sel({label,value,onChange,options}){return(<div style={{marginBottom:12}}>{label&&<label style={{display:"block",fontSize:12,color:C.dourado,marginBottom:4,fontWeight:600}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:C.cardClaro,border:`1px solid ${C.marsalaClaro}55`,borderRadius:8,padding:"8px 12px",color:C.texto,fontSize:14,boxSizing:"border-box",outline:"none"}}>{options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>);}
function Btn({onClick,children,cor=C.marsala,outline=false,full=false,sm=false,style={}}){return(<button onClick={onClick} style={{background:outline?"transparent":cor,color:outline?cor:"#fff",border:`2px solid ${cor}`,borderRadius:8,padding:sm?"4px 10px":"8px 18px",fontWeight:700,fontSize:sm?11:13,cursor:"pointer",width:full?"100%":"auto",...style}}>{children}</button>);}
function Badge({cor,children}){return <span style={{background:cor+"22",color:cor,border:`1px solid ${cor}44`,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:600}}>{children}</span>;}
function Barra({atual,meta}){const pct=Math.min(100,Math.round((atual/meta)*100));return(<div style={{marginTop:6}}><div style={{background:C.cardClaro,borderRadius:20,height:10,overflow:"hidden"}}><div style={{width:`${pct}%`,background:`linear-gradient(90deg,${C.marsala},${C.dourado})`,height:"100%",borderRadius:20}}/></div><div style={{fontSize:11,color:C.textoSuave,marginTop:3}}>{pct}% concluído</div></div>);}
function Loader(){return <div style={{color:C.marsala,textAlign:"center",padding:40,fontFamily:"'Segoe UI',sans-serif",background:C.fundo,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>Carregando Conduta Rica®...</div>;}
function ModalExcluir({onConfirm,onCancel}){return(<div style={{position:"fixed",inset:0,background:"#000a",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:C.card,borderRadius:14,padding:24,maxWidth:320,width:"90%",border:`2px solid ${C.vermelho}`}}><div style={{fontSize:15,fontWeight:700,color:C.vermelho,marginBottom:8}}>Excluir registro?</div><div style={{fontSize:13,color:C.textoSuave,marginBottom:20}}>Esta ação não pode ser desfeita.</div><div style={{display:"flex",gap:10}}><Btn onClick={onConfirm} cor={C.vermelho} full>Excluir</Btn><Btn onClick={onCancel} cor={C.marsala} outline full>Cancelar</Btn></div></div></div>);}

// Exportação
function exportarCSV(d){
  const linhas=[["Tipo","Descrição","Valor","Categoria","Emoção","Data","Mês/Ano"]];
  (d.movs||[]).forEach(m=>linhas.push([m.tipo,m.descricao,m.valor,m.categoria,m.emocao||"",m.data,mesAnoDeData(m.data)]));
  const csv=linhas.map(l=>l.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=`conduta-rica-${d.nome}.csv`;a.click();
  URL.revokeObjectURL(url);
}

function exportarPDF(d,modulos){
  const movs=d.movs||[];const emocoes=d.emocoes||[];const crencas=d.crencas||[];const metas=d.metas||[];const rendimentos=d.rendimentos||[];
  const meses=getMesesComLancamentos(movs,rendimentos);
  const emoMovs=movs.filter(m=>m.emocao).map(m=>({nome:m.emocao,tipo:EP.includes(m.emocao)?"positiva":"negativa"}));
  const todasEmo=[...emocoes,...emoMovs];
  let html=`<html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;margin:30px;color:#1A0A0E;}h1{color:#4A1020;border-bottom:2px solid #B8860B;padding-bottom:8px;}h2{color:#4A1020;margin-top:24px;font-size:15px;}h3{color:#6B1A30;font-size:13px;margin-top:16px;}table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;}th{background:#4A1020;color:#fff;padding:6px 8px;text-align:left;}td{padding:5px 8px;border-bottom:1px solid #EDE4D8;}.badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:bold;}.pos{background:#d4edda;color:#1B6B3A;}.neg{background:#f8d7da;color:#A52020;}.resumo{display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;}.ri{background:#F5EFE6;border-radius:8px;padding:10px 14px;min-width:100px;}.rl{font-size:11px;color:#5C3D2E;}.rv{font-size:15px;font-weight:bold;}</style></head><body>`;
  html+=`<h1>CONDUTA RICA® — Relatório</h1><p><strong>Cliente:</strong> ${d.nome} &nbsp;|&nbsp; <strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>`;

  if(modulos.financeiro){
    html+=`<h2>💰 Extrato por Mês</h2>`;
    meses.forEach(ma=>{
      const s=calcSaldoMes(movs,rendimentos,ma);
      const movMes=movs.filter(m=>mesAnoDeData(m.data)===ma&&m.tipo!=="investimento");
      html+=`<h3>${ma} — Saldo: <span style="color:${s>=0?"#1B6B3A":"#A52020"}">${fmt(s)}</span></h3>`;
      if(movMes.length>0){
        html+=`<table><tr><th>Tipo</th><th>Descrição</th><th>Valor</th><th>Categoria</th><th>Emoção</th></tr>`;
        movMes.forEach(m=>{html+=`<tr><td>${m.tipo}</td><td>${m.descricao}</td><td style="color:${m.tipo==="entrada"?"#1B6B3A":"#A52020"}">${m.tipo==="saida"?"-":""}${fmt(m.valor)}</td><td>${m.categoria}</td><td>${m.emocao||"-"}</td></tr>`;});
        html+=`</table>`;
      }
    });
  }

  if(modulos.emocional&&todasEmo.length>0){
    html+=`<h2>😊 Mapa Emocional</h2>`;
    const freq={};todasEmo.forEach(e=>{freq[e.nome]=(freq[e.nome]||0)+1;});
    html+=Object.entries(freq).map(([n,q])=>`<span class="badge ${EP.includes(n)?"pos":"neg"}">${n} (${q})</span> `).join("");
  }

  if(modulos.crencas&&crencas.length>0){
    html+=`<h2>🧠 Crenças Mapeadas</h2><table><tr><th>Crença</th><th>Status</th><th>Nota da Mentora</th></tr>`;
    crencas.forEach(c=>{html+=`<tr><td>${c.crenca}</td><td><span class="badge ${c.status==="ressignificada"?"pos":"neg"}">${c.status==="ressignificada"?"Ressignificada":"Ativa"}</span></td><td>${c.notaMentora||"-"}</td></tr>`;});
    html+=`</table>`;
  }

  if(modulos.metas&&metas.length>0){
    html+=`<h2>🎯 Metas</h2><table><tr><th>Meta</th><th>Tipo</th><th>Progresso</th><th>Prazo</th></tr>`;
    metas.forEach(m=>{const pct=Math.min(100,Math.round((m.atual/m.meta)*100));html+=`<tr><td>${m.titulo}</td><td>${m.tipo}</td><td>${pct}%</td><td>${m.prazo||"-"}</td></tr>`;});
    html+=`</table>`;
  }

  html+=`<p style="margin-top:40px;font-size:10px;color:#888;border-top:1px solid #EDE4D8;padding-top:8px">Conduta Rica® · Wélica Amaro — CRP 09/12387</p></body></html>`;
  const j=window.open("","_blank");j.document.write(html);j.document.close();setTimeout(()=>j.print(),500);
}

// Login
function Login({onLogin}){
  const [email,setEmail]=useState("");const [senha,setSenha]=useState("");const [erro,setErro]=useState("");const [loading,setLoading]=useState(false);
  async function entrar(){
    setLoading(true);setErro("");
    const e=email.trim();const s=senha.trim();
    if(e==="welica@conducarica.com"&&s==="condutarica2024"){onLogin({tipo:"mentora"});setLoading(false);return;}
    try{const res=await sbGet("clientes",`?email=eq.${encodeURIComponent(e)}&select=*`);if(res&&res.length>0&&res[0].senha===s){onLogin({tipo:"cliente",dados:res[0]});setLoading(false);return;}}catch(_){}
    setErro("E-mail ou senha incorretos.");setLoading(false);
  }
  return(<div style={{minHeight:"100vh",background:C.fundo,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Segoe UI',sans-serif"}}>
    <div style={{width:"100%",maxWidth:380}}>
      <div style={{textAlign:"center",marginBottom:32}}><div style={{fontSize:28,fontWeight:900,color:C.marsala,letterSpacing:2}}>CONDUTA RICA®</div><div style={{fontSize:13,color:C.textoSuave,marginTop:4}}>Rastreador Comportamental-Financeiro</div></div>
      <Card>
        <div style={{fontSize:15,fontWeight:700,color:C.marsala,marginBottom:16,textAlign:"center"}}>Acesse sua conta</div>
        <Inp label="E-mail" value={email} onChange={setEmail} placeholder="seu@email.com"/>
        <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,color:C.dourado,marginBottom:4,fontWeight:600}}>Senha</label><input type="password" value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==="Enter"&&entrar()} placeholder="••••••••" style={{width:"100%",background:C.cardClaro,border:`1px solid ${C.marsalaClaro}55`,borderRadius:8,padding:"8px 12px",color:C.texto,fontSize:14,boxSizing:"border-box",outline:"none"}}/></div>
        {erro&&<div style={{color:C.vermelho,fontSize:12,marginBottom:10,textAlign:"center"}}>{erro}</div>}
        <button onClick={entrar} disabled={loading} style={{width:"100%",background:C.marsala,color:"#fff",border:`2px solid ${C.marsala}`,borderRadius:8,padding:"10px",fontWeight:700,fontSize:14,cursor:"pointer"}}>{loading?"Entrando...":"Entrar"}</button>
      </Card>
      <div style={{textAlign:"center",fontSize:11,color:C.textoSuave,marginTop:16}}>Wélica Amaro · CRP 09/12387</div>
    </div>
  </div>);
}

// Painel Mentora
function PainelMentora({onLogout}){
  const [clientes,setClientes]=useState([]);const [aba,setAba]=useState("lista");const [clienteAberto,setClienteAberto]=useState(null);
  const [nome,setNome]=useState("");const [email,setEmail]=useState("");const [senha,setSenha]=useState("");const [ok,setOk]=useState("");const [loading,setLoading]=useState(true);
  const [editandoCli,setEditandoCli]=useState(null);const [editNome,setEditNome]=useState("");const [editEmail,setEditEmail]=useState("");const [editSenha,setEditSenha]=useState("");const [okEdit,setOkEdit]=useState("");

  useEffect(()=>{recarregar();},[]);
  async function recarregar(){setLoading(true);const r=await sbGet("clientes","?select=*&order=created_at.asc");setClientes(Array.isArray(r)?r:[]);setLoading(false);}
  async function cadastrar(){
    if(!nome||!email||!senha)return;
    const novo={id:"cli_"+Date.now(),nome,email,senha,movs:[],emocoes:[],crencas:[],metas:[],contas:[],rendimentos:[],ativos:[],rf:[],msgs:[{id:1,de:"mentora",texto:`Olá, ${nome}! Bem-vindo(a) à Conduta Rica®!`,hora:"09:00"}],categorias_custom:[],cats_agenda_custom:[],ultimo_mes_acesso:mesAnoAtual()};
    await sbPost("clientes",novo);setNome("");setEmail("");setSenha("");setOk("Cliente cadastrado!");setTimeout(()=>setOk(""),3000);recarregar();
  }
  function abrirEdicao(c){setEditandoCli(c);setEditNome(c.nome);setEditEmail(c.email);setEditSenha(c.senha);setOkEdit("");}
  async function salvarEdicaoCli(){
    if(!editNome||!editEmail||!editSenha)return;
    await sbPatch("clientes",editandoCli.id,{nome:editNome,email:editEmail,senha:editSenha});
    setOkEdit("Salvo!");setTimeout(()=>{setOkEdit("");setEditandoCli(null);recarregar();},1500);
  }
  async function atualizarCliente(cli){await sbPatch("clientes",cli.id,cli);setClienteAberto(cli);setClientes(clientes.map(c=>c.id===cli.id?cli:c));}
  if(clienteAberto)return <PainelDados dados={clienteAberto} isMentora={true} onSalvar={atualizarCliente} onVoltar={()=>{recarregar();setClienteAberto(null);}} onLogout={onLogout}/>;

  return(<div style={{fontFamily:"'Segoe UI',sans-serif",background:C.fundo,minHeight:"100vh",color:C.texto}}>
    {editandoCli&&<div style={{position:"fixed",inset:0,background:"#000a",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.card,borderRadius:14,padding:24,maxWidth:380,width:"90%",border:`2px solid ${C.marsala}`}}>
        <div style={{fontSize:15,fontWeight:700,color:C.marsala,marginBottom:14}}>✏ Editar Cliente</div>
        <Inp label="Nome" value={editNome} onChange={setEditNome}/>
        <Inp label="E-mail" value={editEmail} onChange={setEditEmail}/>
        <Inp label="Senha" value={editSenha} onChange={setEditSenha} type="password"/>
        {okEdit&&<div style={{color:C.verde,fontSize:12,marginBottom:8}}>{okEdit}</div>}
        <div style={{display:"flex",gap:10,marginTop:8}}><Btn onClick={salvarEdicaoCli} full>Salvar</Btn><Btn onClick={()=>setEditandoCli(null)} outline full>Cancelar</Btn></div>
      </div>
    </div>}
    <div style={{background:`linear-gradient(135deg,${C.marsala},${C.marsalaClaro})`,padding:"14px 20px",borderBottom:`2px solid ${C.dourado}44`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:16,fontWeight:800,color:C.dourado}}>CONDUTA RICA®</div><div style={{fontSize:11,color:"#f5ede8"}}>Painel da Mentora</div></div>
      <div><div style={{fontSize:12,color:"#f5ede8",fontWeight:600}}>Wélica Amaro</div><button onClick={onLogout} style={{background:"transparent",border:"none",color:"#f5ede8",fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Sair</button></div>
    </div>
    <div style={{display:"flex",background:C.card,borderBottom:`1px solid ${C.marsalaClaro}33`}}>
      {[["lista","Meus Clientes"],["cadastrar","Cadastrar"]].map(([v,l])=>(<button key={v} onClick={()=>setAba(v)} style={{padding:"12px 20px",fontSize:12,fontWeight:700,cursor:"pointer",background:"transparent",border:"none",color:aba===v?C.marsala:C.textoSuave,borderBottom:aba===v?`2px solid ${C.marsala}`:"2px solid transparent"}}>{l}</button>))}
    </div>
    <div style={{padding:16,maxWidth:700,margin:"0 auto"}}>
      {aba==="lista"&&<div>
        <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>Clientes ({clientes.length})</div>
        {loading&&<div style={{color:C.textoSuave,textAlign:"center",padding:20}}>Carregando...</div>}
        {!loading&&clientes.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:30,fontSize:13}}>Nenhum cliente ainda.</div>}
        {clientes.map(c=>{
          const saldoMes=calcSaldoMes(c.movs,c.rendimentos,mesAnoAtual());
          const vencidas=(c.contas||[]).filter(x=>x.status!=="executada"&&statusConta(x.vencimento)==="vencida").length;
          return(<Card key={c.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:700,fontSize:14,color:C.texto}}>{c.nome}</div><div style={{fontSize:11,color:C.textoSuave,marginBottom:6}}>{c.email}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Badge cor={C.verde}>{(c.movs||[]).filter(m=>m.tipo==="entrada").length} entradas</Badge><Badge cor={C.azul}>{(c.metas||[]).length} metas</Badge>{vencidas>0&&<Badge cor={C.vermelho}>{vencidas} vencidas</Badge>}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:C.textoSuave}}>Saldo do mês</div>
              <div style={{fontWeight:700,color:saldoMes>=0?C.verde:C.vermelho,fontSize:13,marginBottom:8}}>{fmt(saldoMes)}</div>
              <div style={{display:"flex",gap:6}}>
                <Btn onClick={()=>setClienteAberto(c)} sm>Abrir</Btn>
                <Btn onClick={()=>abrirEdicao(c)} sm outline>✏</Btn>
              </div>
            </div>
          </div></Card>);
        })}
      </div>}
      {aba==="cadastrar"&&<Card>
        <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:14}}>Novo cliente</div>
        <Inp label="Nome completo" value={nome} onChange={setNome} placeholder="Nome do mentorado"/>
        <Inp label="E-mail" value={email} onChange={setEmail} placeholder="email@exemplo.com"/>
        <Inp label="Senha" value={senha} onChange={setSenha} type="password" placeholder="Crie uma senha"/>
        {ok&&<div style={{color:C.verde,fontSize:12,marginBottom:10}}>{ok}</div>}
        <Btn onClick={cadastrar}>Cadastrar</Btn>
      </Card>}
    </div>
  </div>);
}

// Painel de Dados
function PainelDados({dados,isMentora,onSalvar,onVoltar,onLogout}){
  const [d,setD]=useState(dados);
  const [aba,setAba]=useState(0);
  const [salvando,setSalvando]=useState(false);
  const abas=["Financeiro","Agendamentos","Rendimentos","Investimentos","Emocional","Crenças","Metas","Relatório","Mensagens","Perfil"];
  const msgFim=useRef(null);
  const [confirmarExcluir,setConfirmarExcluir]=useState(null);
  const [editando,setEditando]=useState(null);
  const [valEdit,setValEdit]=useState({});
  const [modalExportar,setModalExportar]=useState(false);
  const [modExp,setModExp]=useState({financeiro:true,emocional:true,crencas:true,metas:true});
  const [modalMigracao,setModalMigracao]=useState(false);
  const [modalMigManual,setModalMigManual]=useState(false);
  const [mesMigrar,setMesMigrar]=useState("");
  const [filtroPeriodo,setFiltroPeriodo]=useState(mesAnoAtual());

  useEffect(()=>{if(editando)setValEdit({...editando.item});},[editando]);
  useEffect(()=>{msgFim.current?.scrollIntoView({behavior:"smooth"});},[d.msgs]);

  // Verifica virada do mês
  useEffect(()=>{
    const ultimoMes=d.ultimo_mes_acesso||mesAnoAtual();
    if(ultimoMes!==mesAnoAtual()){
      setModalMigracao(true);
    }
  },[]);

  async function upd(campo,valor){const novo={...d,[campo]:valor};setD(novo);setSalvando(true);await sbPatch("clientes",d.id,{[campo]:valor});setSalvando(false);onSalvar(novo);}
  async function updMulti(obj){const novo={...d,...obj};setD(novo);setSalvando(true);await sbPatch("clientes",d.id,obj);setSalvando(false);onSalvar(novo);}
  function excluir(lista,id){upd(lista,(d[lista]||[]).filter(x=>x.id!==id));setConfirmarExcluir(null);}
  function salvarEdicao(lista,item){upd(lista,(d[lista]||[]).map(x=>x.id===item.id?item:x));setEditando(null);}

  const movs=d.movs||[];const emocoes=d.emocoes||[];const crencas=d.crencas||[];
  const metas=d.metas||[];const contas=d.contas||[];const rendimentos=d.rendimentos||[];
  const ativos=d.ativos||[];const rf=d.rf||[];
  const carteiraCalc=calcCarteira(ativos);
  const catsCustom=d.categorias_custom||[];
  const catsAgendaCustom=d.cats_agenda_custom||[];
  const meses=getMesesComLancamentos(movs,rendimentos);

  // Saldo do mês atual
  const saldoMesAtual=calcSaldoMes(movs,rendimentos,mesAnoAtual());
  const totalInvestidoRV=carteiraCalc.reduce((a,x)=>a+x.totalInvestido,0);
  const totalInvestidoRF=rf.reduce((a,x)=>a+x.valor,0);
  const totalCarteira=carteiraCalc.reduce((a,x)=>a+(x.valorAtual||x.totalInvestido),0)+totalInvestidoRF;
  const contasVencidas=contas.filter(c=>c.status!=="executada"&&statusConta(c.vencimento)==="vencida").length;
  const emoMovs=movs.filter(m=>m.emocao).map(m=>({nome:m.emocao,tipo:EP.includes(m.emocao)?"positiva":"negativa"}));
  const todasEmo=[...emocoes,...emoMovs];

  function buildCatOpts(){return[...catsCustom.map(c=>({v:c,l:c})),...CAT_MOV,{v:"outro",l:"Outro (especificar)"}];}
  function buildCatAgendaOpts(){return[...catsAgendaCustom.map(c=>({v:c,l:c})),...CAT_AGE,{v:"outro",l:"Outro (especificar)"}];}
  function salvarCatCustom(nova){if(!nova||catsCustom.includes(nova))return;upd("categorias_custom",[nova,...catsCustom]);}
  function salvarCatAgendaCustom(nova){if(!nova||catsAgendaCustom.includes(nova))return;upd("cats_agenda_custom",[nova,...catsAgendaCustom]);}

  // Migração de saldo
  async function migrarSaldo(mesOrigem){
    const saldoOrigem=calcSaldoMes(movs,rendimentos,mesOrigem);
    if(saldoOrigem===0){alert("Saldo do mês selecionado é zero.");return;}
    const [mo,yo]=mesOrigem.split("/");
    const novasMov=[...movs,{id:Date.now(),tipo:"entrada",descricao:`Saldo migrado de ${mo}/${yo}`,valor:Math.abs(saldoOrigem),categoria:"saldo_migrado",emocao:"",data:hoje()}];
    await updMulti({movs:novasMov,ultimo_mes_acesso:mesAnoAtual()});
    setModalMigracao(false);setModalMigManual(false);
  }

  // Financeiro
  const [mTipo,setMTipo]=useState("entrada");const [mDesc,setMDesc]=useState("");const [mVal,setMVal]=useState("");const [mCat,setMCat]=useState("salario");const [mCatOutro,setMCatOutro]=useState("");const [mEmo,setMEmo]=useState("");const [mData,setMData]=useState("");
  function addMov(){
    if(!mDesc||!mVal)return;
    const catFinal=mCat==="outro"&&mCatOutro.trim()?mCatOutro.trim():mCat;
    if(mCat==="outro"&&mCatOutro.trim())salvarCatCustom(mCatOutro.trim());
    const dataFmt=mData?strParaData(mData).toLocaleDateString("pt-BR"):hoje();
    upd("movs",[...movs,{id:Date.now(),tipo:mTipo,descricao:mDesc,valor:parseFloat(mVal.replace(",",".")),categoria:catFinal,emocao:mEmo||"",data:dataFmt}]);
    setMDesc("");setMVal("");setMEmo("");setMData("");setMCatOutro("");
  }

  // Agendamentos
  const [cTipo,setCTipo]=useState("pagar");const [cDesc,setCDesc]=useState("");const [cVal,setCVal]=useState("");const [cVenc,setCVenc]=useState("");const [cCat,setCCat]=useState("conta");const [cCatOutro,setCCatOutro]=useState("");
  function addConta(){
    if(!cDesc||!cVal||!cVenc)return;
    const catFinal=cCat==="outro"&&cCatOutro.trim()?cCatOutro.trim():cCat;
    if(cCat==="outro"&&cCatOutro.trim())salvarCatAgendaCustom(cCatOutro.trim());
    upd("contas",[...contas,{id:Date.now(),tipo:cTipo,descricao:cDesc,valor:parseFloat(cVal.replace(",",".")),vencimento:strParaData(cVenc).toLocaleDateString("pt-BR"),categoria:catFinal,status:"pendente"}]);
    setCDesc("");setCVal("");setCVenc("");setCCatOutro("");
  }
  async function executarConta(id){
    const c=contas.find(x=>x.id===id);if(!c)return;
    const novasMov=[...movs,{id:Date.now(),tipo:c.tipo==="pagar"?"saida":"entrada",descricao:c.descricao+" (agendamento)",valor:c.valor,categoria:c.categoria,emocao:"",data:hoje()}];
    const novasContas=contas.map(x=>x.id===id?{...x,status:"executada",dataExec:hoje()}:x);
    await updMulti({movs:novasMov,contas:novasContas});
  }

  // Rendimentos
  const [rDesc,setRDesc]=useState("");const [rVal,setRVal]=useState("");const [rTipo,setRTipo]=useState("dividendos");const [rData,setRData]=useState("");
  function addRend(){if(!rDesc||!rVal)return;upd("rendimentos",[...rendimentos,{id:Date.now(),descricao:rDesc,valor:parseFloat(rVal.replace(",",".")),tipo:rTipo,data:rData?strParaData(rData).toLocaleDateString("pt-BR"):hoje()}]);setRDesc("");setRVal("");setRData("");}

  // Investimentos RV
  const [invAba,setInvAba]=useState("rv");
  const [ativoSel,setAtivoSel]=useState("");const [novoAtivo,setNovoAtivo]=useState("");const [invTipo,setInvTipo]=useState("acao");
  const [compQtd,setCompQtd]=useState("");const [compPreco,setCompPreco]=useState("");const [compData,setCompData]=useState("");
  const [vendaAtivoSel,setVendaAtivoSel]=useState("");const [vendaQtd,setVendaQtd]=useState("");const [vendaPreco,setVendaPreco]=useState("");const [vendaData,setVendaData]=useState("");
  const [precoAtualSel,setPrecoAtualSel]=useState("");const [precoAtualVal,setPrecoAtualVal]=useState("");

  function addAtivoECompra(){
    if(!compQtd||!compPreco)return;
    const nomeAtivo=(ativoSel==="novo"?novoAtivo:ativoSel).toUpperCase().trim();
    if(!nomeAtivo)return;
    const dataFmt=compData?strParaData(compData).toLocaleDateString("pt-BR"):hoje();
    const existente=ativos.find(a=>a.nome===nomeAtivo);
    let novosAtivos;
    if(existente){
      novosAtivos=ativos.map(a=>a.nome===nomeAtivo?{...a,aportes:[...(a.aportes||[]),{id:Date.now(),qtd:parseFloat(compQtd),preco:parseFloat(compPreco.replace(",",".")),data:dataFmt}]}:a);
    } else {
      novosAtivos=[...ativos,{id:Date.now(),nome:nomeAtivo,tipo:invTipo,aportes:[{id:Date.now(),qtd:parseFloat(compQtd),preco:parseFloat(compPreco.replace(",",".")),data:dataFmt}],vendas:[],precoAtual:0}];
    }
    upd("ativos",novosAtivos);
    setCompQtd("");setCompPreco("");setCompData("");setAtivoSel("");setNovoAtivo("");
  }

  function addVenda(){
    if(!vendaAtivoSel||!vendaQtd||!vendaPreco)return;
    const dataFmt=vendaData?strParaData(vendaData).toLocaleDateString("pt-BR"):hoje();
    const novosAtivos=ativos.map(a=>a.nome===vendaAtivoSel?{...a,vendas:[...(a.vendas||[]),{id:Date.now(),qtd:parseFloat(vendaQtd),preco:parseFloat(vendaPreco.replace(",",".")),data:dataFmt}]}:a);
    upd("ativos",novosAtivos);
    setVendaQtd("");setVendaPreco("");setVendaData("");setVendaAtivoSel("");
  }

  function atualizarPrecoAtual(){
    if(!precoAtualSel||!precoAtualVal)return;
    const novosAtivos=ativos.map(a=>a.nome===precoAtualSel?{...a,precoAtual:parseFloat(precoAtualVal.replace(",","."))}:a);
    upd("ativos",novosAtivos);
    setPrecoAtualSel("");setPrecoAtualVal("");
  }

  // RF
  const [rfDesc,setRfDesc]=useState("");const [rfVal,setRfVal]=useState("");const [rfTaxa,setRfTaxa]=useState("");const [rfVenc,setRfVenc]=useState("");const [rfData,setRfData]=useState("");
  function addRF(){
    if(!rfDesc||!rfVal)return;
    upd("rf",[...rf,{id:Date.now(),descricao:rfDesc,valor:parseFloat(rfVal.replace(",",".")),taxa:rfTaxa,vencimento:rfVenc?strParaData(rfVenc).toLocaleDateString("pt-BR"):"",data:rfData?strParaData(rfData).toLocaleDateString("pt-BR"):hoje()}]);
    setRfDesc("");setRfVal("");setRfTaxa("");setRfVenc("");setRfData("");
  }

  // Emocional
  const [eTipo,setETipo]=useState("positiva");const [eNome,setENome]=useState("");const [eCont,setECont]=useState("");const [eInt,setEInt]=useState("3");const [eData,setEData]=useState("");
  function addEmo(){if(!eNome)return;upd("emocoes",[...emocoes,{id:Date.now(),tipo:eTipo,nome:eNome,contexto:eCont,intensidade:parseInt(eInt),data:eData?strParaData(eData).toLocaleDateString("pt-BR"):hoje()}]);setENome("");setECont("");setEInt("3");setEData("");}

  // Crenças
  const [cSel,setCSel]=useState("");const [cPers,setCPers]=useState("");const [rPers,setRPers]=useState("");
  function addCrencaPre(){if(!cSel)return;const c=CB.find(x=>x.id===parseInt(cSel));if(!c||crencas.find(x=>x.crencaId===c.id))return;upd("crencas",[...crencas,{id:Date.now(),crencaId:c.id,crenca:c.crenca,ressig:c.ressig,personalizada:false,notaMentora:"",status:"ativa"}]);setCSel("");}
  function addCrencaPers(){if(!cPers)return;upd("crencas",[...crencas,{id:Date.now(),crencaId:null,crenca:cPers,ressig:rPers,personalizada:true,notaMentora:"",status:"ativa"}]);setCPers("");setRPers("");}
  function toggleCrencaStatus(id){upd("crencas",crencas.map(c=>c.id===id?{...c,status:c.status==="ativa"?"ressignificada":"ativa"}:c));}
  function notaMentora(id,nota){upd("crencas",crencas.map(c=>c.id===id?{...c,notaMentora:nota}:c));}

  // Metas
  const [metaTit,setMetaTit]=useState("");const [metaVal,setMetaVal]=useState("");const [metaAt,setMetaAt]=useState("");const [metaTipo,setMetaTipo]=useState("financeira");const [metaPrazo,setMetaPrazo]=useState("");
  function addMeta(){if(!metaTit)return;upd("metas",[...metas,{id:Date.now(),titulo:metaTit,tipo:metaTipo,meta:parseFloat(metaVal||100),atual:parseFloat(metaAt||0),prazo:metaPrazo}]);setMetaTit("");setMetaVal("");setMetaAt("");setMetaPrazo("");}
  function updMeta(id,campo,val){upd("metas",metas.map(m=>m.id===id?{...m,[campo]:["atual","meta"].includes(campo)?parseFloat(val||0):val}:m));}

  // Mensagens
  const [msg,setMsg]=useState("");
  function enviar(){if(!msg.trim())return;upd("msgs",[...(d.msgs||[]),{id:Date.now(),de:isMentora?"mentora":"cliente",texto:msg,hora:agoraStr()}]);setMsg("");}

  // Perfil
  const [senhaAtual,setSenhaAtual]=useState("");const [senhaNova,setSenhaNova]=useState("");const [senhaConf,setSenhaConf]=useState("");const [msgSenha,setMsgSenha]=useState("");const [erroSenha,setErroSenha]=useState("");
  async function trocarSenha(){
    setMsgSenha("");setErroSenha("");
    if(!senhaAtual||!senhaNova||!senhaConf){setErroSenha("Preencha todos os campos.");return;}
    if(senhaAtual!==d.senha){setErroSenha("Senha atual incorreta.");return;}
    if(senhaNova.length<6){setErroSenha("Mínimo 6 caracteres.");return;}
    if(senhaNova!==senhaConf){setErroSenha("As senhas não coincidem.");return;}
    await upd("senha",senhaNova);setSenhaAtual("");setSenhaNova("");setSenhaConf("");
    setMsgSenha("Senha alterada!");setTimeout(()=>setMsgSenha(""),4000);
  }

  function ModalEdicao(){
    if(!editando)return null;
    const {lista}=editando;const val=valEdit;const setVal=setValEdit;
    return(<div style={{position:"fixed",inset:0,background:"#000b",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,borderRadius:14,padding:20,maxWidth:420,width:"100%",border:`2px solid ${C.marsala}`,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{fontSize:15,fontWeight:700,color:C.marsala,marginBottom:14}}>✏ Editar registro</div>
        {lista==="movs"&&<div>
          {val.tipo!=="investimento"&&<div style={{display:"flex",gap:6,marginBottom:12}}>{["entrada","saida"].map(t=>(<button key={t} onClick={()=>setVal({...val,tipo:t})} style={{flex:1,padding:"6px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",background:val.tipo===t?(t==="entrada"?C.verde:C.vermelho):"transparent",color:val.tipo===t?"#fff":(t==="entrada"?C.verde:C.vermelho),border:`2px solid ${t==="entrada"?C.verde:C.vermelho}`}}>{t==="entrada"?"Entrada":"Saída"}</button>))}</div>}
          <Inp label="Descrição" value={val.descricao||""} onChange={v=>setVal({...val,descricao:v})}/>
          <Inp label="Valor (R$)" value={String(val.valor||"")} onChange={v=>setVal({...val,valor:parseFloat(v.replace(",","."))||0})}/>
          <Sel label="Categoria" value={buildCatOpts().find(o=>o.v===val.categoria)?val.categoria:"outro"} onChange={v=>setVal({...val,categoria:v})} options={buildCatOpts()}/>
          <Sel label="Emoção" value={val.emocao||""} onChange={v=>setVal({...val,emocao:v})} options={[{v:"",l:"— Nenhuma —"},...EP.map(e=>({v:e,l:"😊 "+e})),...EN.map(e=>({v:e,l:"😟 "+e}))]}/>
          <Inp label="Data" value={val.data||""} onChange={v=>setVal({...val,data:v})} placeholder="dd/mm/aaaa"/>
        </div>}
        {lista==="emocoes"&&<div>
          <Sel label="Tipo" value={val.tipo||"positiva"} onChange={v=>setVal({...val,tipo:v})} options={[{v:"positiva",l:"Positiva"},{v:"negativa",l:"Negativa"}]}/>
          <Sel label="Emoção" value={val.nome||""} onChange={v=>setVal({...val,nome:v})} options={[...(val.tipo==="positiva"?EP:EN).map(e=>({v:e,l:e})),{v:"outra",l:"Outra"}]}/>
          <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,color:C.dourado,marginBottom:4,fontWeight:600}}>Intensidade: {val.intensidade||3}/5</label><input type="range" min="1" max="5" value={val.intensidade||3} onChange={e=>setVal({...val,intensidade:parseInt(e.target.value)})} style={{width:"100%",accentColor:C.marsala}}/></div>
          <Inp label="Contexto" value={val.contexto||""} onChange={v=>setVal({...val,contexto:v})}/>
          <Inp label="Data" value={val.data||""} onChange={v=>setVal({...val,data:v})} placeholder="dd/mm/aaaa"/>
        </div>}
        {lista==="rendimentos"&&<div>
          <Inp label="Descrição" value={val.descricao||""} onChange={v=>setVal({...val,descricao:v})}/>
          <Inp label="Valor (R$)" value={String(val.valor||"")} onChange={v=>setVal({...val,valor:parseFloat(v.replace(",","."))||0})}/>
          <Inp label="Data" value={val.data||""} onChange={v=>setVal({...val,data:v})} placeholder="dd/mm/aaaa"/>
        </div>}
        {lista==="metas"&&<div>
          <Inp label="Título" value={val.titulo||""} onChange={v=>setVal({...val,titulo:v})}/>
          <Sel label="Tipo" value={val.tipo||"financeira"} onChange={v=>setVal({...val,tipo:v})} options={[{v:"financeira",l:"Financeira"},{v:"comportamental",l:"Comportamental"},{v:"habito",l:"Hábito"}]}/>
          <Inp label="Total da meta" value={String(val.meta||"")} onChange={v=>setVal({...val,meta:parseFloat(v)||0})}/>
          <Inp label="Progresso atual" value={String(val.atual||"")} onChange={v=>setVal({...val,atual:parseFloat(v)||0})}/>
          <Inp label="Prazo" value={val.prazo||""} onChange={v=>setVal({...val,prazo:v})} type="date"/>
        </div>}
        {lista==="crencas"&&<div>
          <Inp label="Crença" value={val.crenca||""} onChange={v=>setVal({...val,crenca:v})}/>
          <Inp label="Ressignificação" value={val.ressig||""} onChange={v=>setVal({...val,ressig:v})}/>
        </div>}
        {lista==="contas"&&<div>
          <Inp label="Descrição" value={val.descricao||""} onChange={v=>setVal({...val,descricao:v})}/>
          <Inp label="Valor (R$)" value={String(val.valor||"")} onChange={v=>setVal({...val,valor:parseFloat(v.replace(",","."))||0})}/>
          <Inp label="Vencimento" value={val.vencimento||""} onChange={v=>setVal({...val,vencimento:v})} placeholder="dd/mm/aaaa"/>
        </div>}
        <div style={{display:"flex",gap:10,marginTop:16}}><Btn onClick={()=>salvarEdicao(lista,val)} full>Salvar</Btn><Btn onClick={()=>setEditando(null)} outline full>Cancelar</Btn></div>
      </div>
    </div>);
  }

  const AcoesCard=({lista,item})=>(<div style={{display:"flex",gap:6,marginTop:8}}>
    <Btn sm cor={C.dourado} outline onClick={()=>setEditando({lista,item:{...item}})}>✏ Editar</Btn>
    <Btn sm cor={C.vermelho} outline onClick={()=>setConfirmarExcluir({lista,id:item.id})}>🗑 Excluir</Btn>
  </div>);

  // Meses para filtro
  const opsMeses=[{v:"todos",l:"Todos os períodos"},...meses.map(m=>({v:m,l:m}))];
  const movsFiltrados=filtroPeriodo==="todos"?movs.filter(m=>m.tipo!=="investimento"):movs.filter(m=>m.tipo!=="investimento"&&mesAnoDeData(m.data)===filtroPeriodo);
  const rendFiltrados=filtroPeriodo==="todos"?rendimentos:rendimentos.filter(r=>mesAnoDeData(r.data)===filtroPeriodo);

  return(<div style={{fontFamily:"'Segoe UI',sans-serif",background:C.fundo,minHeight:"100vh",color:C.texto}}>
    {confirmarExcluir&&<ModalExcluir onConfirm={()=>excluir(confirmarExcluir.lista,confirmarExcluir.id)} onCancel={()=>setConfirmarExcluir(null)}/>}
    <ModalEdicao/>

    {/* Modal Migração Automática */}
    {modalMigracao&&<div style={{position:"fixed",inset:0,background:"#000a",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,borderRadius:14,padding:24,maxWidth:360,width:"100%",border:`2px solid ${C.marsala}`}}>
        <div style={{fontSize:15,fontWeight:700,color:C.marsala,marginBottom:8}}>🔄 Virada do Mês</div>
        <div style={{fontSize:13,color:C.textoSuave,marginBottom:6}}>Seu saldo do mês anterior foi:</div>
        <div style={{fontSize:22,fontWeight:800,color:calcSaldoMes(movs,rendimentos,d.ultimo_mes_acesso||"")>=0?C.verde:C.vermelho,marginBottom:16}}>{fmt(calcSaldoMes(movs,rendimentos,d.ultimo_mes_acesso||""))}</div>
        <div style={{fontSize:13,color:C.texto,marginBottom:16}}>Deseja migrar esse valor como entrada no mês atual?</div>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={()=>migrarSaldo(d.ultimo_mes_acesso||"")} full>Migrar agora</Btn>
          <Btn onClick={async()=>{await upd("ultimo_mes_acesso",mesAnoAtual());setModalMigracao(false);}} outline full>Deixar para depois</Btn>
        </div>
      </div>
    </div>}

    {/* Modal Migração Manual */}
    {modalMigManual&&<div style={{position:"fixed",inset:0,background:"#000a",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,borderRadius:14,padding:24,maxWidth:360,width:"100%",border:`2px solid ${C.marsala}`}}>
        <div style={{fontSize:15,fontWeight:700,color:C.marsala,marginBottom:14}}>🔄 Migrar Saldo Manual</div>
        <Sel label="Selecione o mês de origem" value={mesMigrar} onChange={setMesMigrar} options={[{v:"",l:"— Selecione —"},...meses.map(m=>({v:m,l:m}))]}/>
        {mesMigrar&&<div style={{fontSize:13,color:C.textoSuave,marginBottom:12}}>Saldo disponível: <strong style={{color:C.verde}}>{fmt(calcSaldoMes(movs,rendimentos,mesMigrar))}</strong></div>}
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={()=>{if(mesMigrar)migrarSaldo(mesMigrar);}} full disabled={!mesMigrar}>Migrar</Btn>
          <Btn onClick={()=>setModalMigManual(false)} outline full>Cancelar</Btn>
        </div>
      </div>
    </div>}

    {/* Modal Exportar */}
    {modalExportar&&<div style={{position:"fixed",inset:0,background:"#000a",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,borderRadius:14,padding:24,maxWidth:360,width:"100%",border:`2px solid ${C.marsala}`}}>
        <div style={{fontSize:15,fontWeight:700,color:C.marsala,marginBottom:16}}>📤 Exportar Dados</div>
        {[["financeiro","💰 Financeiro"],["emocional","😊 Emocional"],["crencas","🧠 Crenças"],["metas","🎯 Metas"]].map(([k,l])=>(
          <label key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,cursor:"pointer"}}>
            <input type="checkbox" checked={modExp[k]} onChange={e=>setModExp({...modExp,[k]:e.target.checked})} style={{accentColor:C.marsala,width:16,height:16}}/>
            <span style={{fontSize:13,fontWeight:600,color:C.texto}}>{l}</span>
          </label>
        ))}
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <Btn onClick={()=>{exportarPDF(d,modExp);setModalExportar(false);}} style={{flex:1}}>📄 PDF</Btn>
          <Btn onClick={()=>{exportarCSV(d);setModalExportar(false);}} cor={C.azul} style={{flex:1}}>📊 CSV</Btn>
        </div>
        <Btn onClick={()=>setModalExportar(false)} outline full style={{marginTop:8}}>Cancelar</Btn>
      </div>
    </div>}

    {/* Header */}
    <div style={{background:`linear-gradient(135deg,${C.marsala},${C.marsalaClaro})`,padding:"14px 20px",borderBottom:`2px solid ${C.dourado}44`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {isMentora&&<button onClick={onVoltar} style={{background:"transparent",border:`1px solid ${C.dourado}`,color:C.dourado,borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12}}>← Voltar</button>}
          <div><div style={{fontSize:15,fontWeight:800,color:C.dourado}}>CONDUTA RICA®</div><div style={{fontSize:11,color:"#f5ede8"}}>{d.nome}</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
          {salvando&&<span style={{fontSize:11,color:C.dourado}}>Salvando...</span>}
          {contasVencidas>0&&<Badge cor={C.vermelho}>⚠ {contasVencidas}</Badge>}
          <button onClick={()=>setModalExportar(true)} style={{background:"transparent",border:`1px solid ${C.dourado}`,color:C.dourado,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:11,fontWeight:700}}>📤</button>
          {isMentora&&<Badge cor={C.dourado}>Mentora</Badge>}
          {!isMentora&&<button onClick={onLogout} style={{background:"transparent",border:"none",color:"#f5ede8",fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Sair</button>}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
        {[{l:"Saldo do Mês",v:fmt(saldoMesAtual),c:saldoMesAtual>=0?"#4caf7d":"#e05c5c"},{l:"Carteira",v:fmt(totalCarteira),c:"#90caf9"},{l:"Mês",v:mesAnoAtual(),c:C.dourado}].map(x=>(
          <div key={x.l} style={{background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"6px 12px",flex:1,minWidth:80,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#f5ede8aa"}}>{x.l}</div>
            <div style={{fontSize:12,fontWeight:700,color:x.c}}>{x.v}</div>
          </div>
        ))}
        <button onClick={()=>setModalMigManual(true)} style={{background:"rgba(0,0,0,0.2)",border:"none",borderRadius:10,padding:"6px 12px",color:C.dourado,fontSize:11,fontWeight:700,cursor:"pointer"}}>🔄 Migrar Saldo</button>
      </div>
    </div>

    {/* Abas */}
    <div style={{display:"flex",overflowX:"auto",background:C.card,borderBottom:`1px solid ${C.marsalaClaro}22`}}>
      {abas.map((a,i)=>(<button key={a} onClick={()=>setAba(i)} style={{padding:"11px 12px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",background:"transparent",border:"none",color:aba===i?C.marsala:C.textoSuave,borderBottom:aba===i?`2px solid ${C.marsala}`:"2px solid transparent"}}>
        {a}{a==="Agendamentos"&&contasVencidas>0&&<span style={{background:C.vermelho,color:"#fff",borderRadius:10,fontSize:9,padding:"1px 5px",marginLeft:4}}>{contasVencidas}</span>}
      </button>))}
    </div>

    <div style={{padding:16,maxWidth:700,margin:"0 auto"}}>

      {/* FINANCEIRO */}
      {aba===0&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>Nova Movimentação</div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>{["entrada","saida"].map(t=>(<button key={t} onClick={()=>setMTipo(t)} style={{flex:1,padding:"7px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",background:mTipo===t?(t==="entrada"?C.verde:C.vermelho):"transparent",color:mTipo===t?"#fff":(t==="entrada"?C.verde:C.vermelho),border:`2px solid ${t==="entrada"?C.verde:C.vermelho}`}}>{t==="entrada"?"Entrada":"Saída"}</button>))}</div>
          <Inp label="Descrição" value={mDesc} onChange={setMDesc} placeholder="Ex: Salário de junho"/>
          <Inp label="Valor (R$)" value={mVal} onChange={setMVal} placeholder="0,00"/>
          <Sel label="Categoria" value={mCat} onChange={setMCat} options={buildCatOpts()}/>
          {mCat==="outro"&&<Inp label="Especifique (salvo para uso futuro)" value={mCatOutro} onChange={setMCatOutro} placeholder="Ex: Assinatura, Pet..."/>}
          <Sel label="Emoção associada (opcional)" value={mEmo} onChange={setMEmo} options={[{v:"",l:"— Nenhuma —"},...EP.map(e=>({v:e,l:"😊 "+e})),...EN.map(e=>({v:e,l:"😟 "+e}))]}/>
          <Inp label="Data (em branco = hoje)" value={mData} onChange={setMData} type="date"/>
          <Btn onClick={addMov}>Registrar</Btn>
        </Card>

        {/* Filtro por período */}
        <div style={{marginBottom:12}}>
          <Sel label="Filtrar por período" value={filtroPeriodo} onChange={setFiltroPeriodo} options={[{v:mesAnoAtual(),l:`Mês atual (${mesAnoAtual()})`},...meses.filter(m=>m!==mesAnoAtual()).map(m=>({v:m,l:m})),{v:"todos",l:"Todos os períodos"}]}/>
        </div>

        {filtroPeriodo!=="todos"&&<div style={{background:C.cardClaro,borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:12}}>
          <span style={{color:C.textoSuave}}>Saldo do período: </span>
          <strong style={{color:calcSaldoMes(movs,rendimentos,filtroPeriodo)>=0?C.verde:C.vermelho}}>{fmt(calcSaldoMes(movs,rendimentos,filtroPeriodo))}</strong>
        </div>}

        {movsFiltrados.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhuma movimentação neste período.</div>}
        {[...movsFiltrados].reverse().map(m=>(<Card key={m.id} style={{padding:"10px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:C.texto}}>{m.descricao}</div>
              <div style={{fontSize:11,color:C.textoSuave,marginTop:2}}>{m.data} · {m.categoria}</div>
              {m.emocao&&<div style={{marginTop:4,display:"inline-block",background:C.marsala+"11",border:`1px solid ${C.marsala}33`,borderRadius:20,padding:"2px 10px",fontSize:11,color:C.marsala,fontWeight:600}}>{EP.includes(m.emocao)?"😊":"😟"} {m.emocao}</div>}
            </div>
            <div style={{fontWeight:700,color:m.tipo==="entrada"?C.verde:C.vermelho,marginLeft:8}}>{m.tipo==="saida"?"-":""}{fmt(m.valor)}</div>
          </div>
          <AcoesCard lista="movs" item={m}/>
        </Card>))}
      </div>}

      {/* AGENDAMENTOS */}
      {aba===1&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>Novo Agendamento</div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>{["pagar","receber"].map(t=>(<button key={t} onClick={()=>setCTipo(t)} style={{flex:1,padding:"7px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",background:cTipo===t?(t==="receber"?C.verde:C.vermelho):"transparent",color:cTipo===t?"#fff":(t==="receber"?C.verde:C.vermelho),border:`2px solid ${t==="receber"?C.verde:C.vermelho}`}}>{t==="pagar"?"A Pagar":"A Receber"}</button>))}</div>
          <Inp label="Descrição" value={cDesc} onChange={setCDesc} placeholder="Ex: Aluguel..."/>
          <Inp label="Valor (R$)" value={cVal} onChange={setCVal} placeholder="0,00"/>
          <Inp label="Vencimento" value={cVenc} onChange={setCVenc} type="date"/>
          <Sel label="Categoria" value={cCat} onChange={setCCat} options={buildCatAgendaOpts()}/>
          {cCat==="outro"&&<Inp label="Especifique (salvo para uso futuro)" value={cCatOutro} onChange={setCCatOutro} placeholder="Ex: Academia, Seguro..."/>}
          <Btn onClick={addConta}>Agendar</Btn>
        </Card>
        {contas.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhum agendamento.</div>}
        {[["vencida","⚠ Vencidas",C.vermelho],["pendente","Pendentes",C.marsala],["executada","✅ Executadas",C.verde]].map(([status,titulo,cor])=>{
          const lista=contas.filter(c=>status==="executada"?c.status==="executada":c.status!=="executada"&&statusConta(c.vencimento)===status);
          if(lista.length===0)return null;
          return(<div key={status}><div style={{fontSize:13,fontWeight:700,color:cor,marginBottom:8,marginTop:4}}>{titulo}</div>
            {lista.map(c=>(<Card key={c.id} style={status==="vencida"?{border:`2px solid ${C.vermelho}`,background:C.vermelho+"11"}:status==="executada"?{opacity:0.7}:{}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:700,fontSize:13,color:status==="vencida"?C.vermelho:C.texto}}>{c.descricao}</div><div style={{fontSize:11,color:C.textoSuave}}>{status==="executada"?`Exec. ${c.dataExec}`:`Venc. ${c.vencimento}`} · {c.tipo==="pagar"?"A Pagar":"A Receber"} · {c.categoria}</div></div>
                <div style={{fontWeight:700,color:c.tipo==="receber"?C.verde:C.vermelho}}>{fmt(c.valor)}</div>
              </div>
              {status!=="executada"&&<div style={{display:"flex",gap:6,marginTop:8}}>
                <Btn sm cor={C.verde} onClick={()=>executarConta(c.id)}>Executar</Btn>
                <Btn sm cor={C.dourado} outline onClick={()=>setEditando({lista:"contas",item:{...c}})}>✏ Editar</Btn>
                <Btn sm cor={C.vermelho} outline onClick={()=>setConfirmarExcluir({lista:"contas",id:c.id})}>🗑 Excluir</Btn>
              </div>}
            </Card>))}
          </div>);
        })}
      </div>}

      {/* RENDIMENTOS */}
      {aba===2&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>Registrar Rendimento</div>
          <Inp label="Descrição" value={rDesc} onChange={setRDesc} placeholder="Ex: Dividendos FII HGLG11"/>
          <Inp label="Valor (R$)" value={rVal} onChange={setRVal} placeholder="0,00"/>
          <Sel label="Tipo" value={rTipo} onChange={setRTipo} options={[{v:"dividendos",l:"Dividendos"},{v:"juros",l:"Juros / CDB / Tesouro"},{v:"aluguel",l:"Aluguel de imóvel"},{v:"renda_passiva",l:"Renda passiva"},{v:"bonus",l:"Bônus / Comissão"},{v:"outro",l:"Outro"}]}/>
          <Inp label="Data (em branco = hoje)" value={rData} onChange={setRData} type="date"/>
          <Btn onClick={addRend}>Registrar</Btn>
        </Card>
        {rendimentos.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhum rendimento ainda.</div>}
        {[...rendimentos].reverse().map(r=>(<Card key={r.id} style={{padding:"10px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:13,fontWeight:600,color:C.texto}}>{r.descricao}</div><div style={{fontSize:11,color:C.textoSuave}}>{r.data} · {r.tipo}</div></div>
            <div style={{fontWeight:700,color:C.verde}}>+{fmt(r.valor)}</div>
          </div>
          <AcoesCard lista="rendimentos" item={r}/>
        </Card>))}
      </div>}

      {/* INVESTIMENTOS */}
      {aba===3&&<div>
        {/* Resumo da carteira */}
        <Card style={{background:`linear-gradient(135deg,${C.marsala}11,${C.azul}11)`}}>
          <div style={{fontSize:13,fontWeight:700,color:C.marsala,marginBottom:10}}>📊 Carteira Total</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{l:"Renda Variável",v:fmt(carteiraCalc.reduce((a,x)=>a+(x.valorAtual||x.totalInvestido),0)),c:C.azul},{l:"Renda Fixa",v:fmt(totalInvestidoRF),c:C.verde},{l:"Total",v:fmt(totalCarteira),c:C.marsala}].map(x=>(
              <div key={x.l} style={{background:C.card,borderRadius:8,padding:"8px 12px",flex:1,minWidth:80,textAlign:"center"}}>
                <div style={{fontSize:10,color:C.textoSuave}}>{x.l}</div>
                <div style={{fontSize:13,fontWeight:700,color:x.c}}>{x.v}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sub-abas */}
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[["rv","📈 Renda Variável"],["comprar","🛒 Comprar"],["vender","💰 Vender"],["rf","🏦 Renda Fixa"]].map(([v,l])=>(
            <button key={v} onClick={()=>setInvAba(v)} style={{flex:1,padding:"7px 4px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",background:invAba===v?C.marsala:"transparent",color:invAba===v?"#fff":C.marsala,border:`2px solid ${C.marsala}`}}>{l}</button>
          ))}
        </div>

        {invAba==="rv"&&<div>
          {/* Atualizar preço atual */}
          {ativos.length>0&&<Card>
            <div style={{fontSize:13,fontWeight:700,color:C.marsala,marginBottom:10}}>Atualizar Preço Atual</div>
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              <div style={{flex:1}}><Sel label="Ativo" value={precoAtualSel} onChange={setPrecoAtualSel} options={[{v:"",l:"— Selecione —"},...ativos.map(a=>({v:a.nome,l:a.nome}))]}/></div>
              <div style={{flex:1}}><Inp label="Preço atual (R$)" value={precoAtualVal} onChange={setPrecoAtualVal} placeholder="0,00"/></div>
            </div>
            <Btn onClick={atualizarPrecoAtual} sm>Atualizar</Btn>
          </Card>}

          {carteiraCalc.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhum ativo cadastrado ainda.</div>}
          {carteiraCalc.map(a=>(
            <Card key={a.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontWeight:800,fontSize:15,color:C.marsala}}>{a.nome}</div>
                  <Badge cor={C.azul}>{a.tipo}</Badge>
                </div>
                <div style={{textAlign:"right"}}>
                  {a.precoAtual>0&&<div style={{fontSize:12,color:C.textoSuave}}>Preço atual: <strong>{fmt(a.precoAtual)}</strong></div>}
                  {a.precoAtual>0&&<div style={{fontSize:13,fontWeight:700,color:a.pct>=0?C.verde:C.vermelho}}>{fmtPct(a.pct)}</div>}
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                {[{l:"Cotas",v:a.totalCotas.toFixed(4)},{l:"Preço Médio",v:fmt(a.precoMedio)},{l:"Investido",v:fmt(a.totalInvestido)},{l:"Valor Atual",v:a.precoAtual>0?fmt(a.valorAtual):"—"}].map(x=>(
                  <div key={x.l} style={{background:C.cardClaro,borderRadius:8,padding:"6px 10px",flex:1,minWidth:70,textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.textoSuave}}>{x.l}</div>
                    <div style={{fontSize:12,fontWeight:700,color:C.texto}}>{x.v}</div>
                  </div>
                ))}
              </div>
              {a.precoAtual>0&&<div style={{fontSize:12,color:a.lucro>=0?C.verde:C.vermelho,fontWeight:600}}>Lucro/Prejuízo: {fmt(a.lucro)}</div>}
              {/* Histórico de aportes */}
              {(a.aportes||[]).length>0&&<div style={{marginTop:8}}>
                <div style={{fontSize:11,color:C.textoSuave,marginBottom:4}}>Aportes:</div>
                {a.aportes.map(ap=>(<div key={ap.id} style={{fontSize:11,color:C.textoSuave,padding:"2px 0",borderBottom:`1px solid ${C.cardClaro}`}}>{ap.data} — {ap.qtd} cotas × {fmt(ap.preco)} = {fmt(ap.qtd*ap.preco)}</div>))}
              </div>}
              {(a.vendas||[]).length>0&&<div style={{marginTop:8}}>
                <div style={{fontSize:11,color:C.textoSuave,marginBottom:4}}>Vendas:</div>
                {a.vendas.map(v=>(<div key={v.id} style={{fontSize:11,color:C.verde,padding:"2px 0"}}>{v.data} — {v.qtd} cotas × {fmt(v.preco)} = {fmt(v.qtd*v.preco)}</div>))}
              </div>}
            </Card>
          ))}
        </div>}

        {invAba==="comprar"&&<Card>
          <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>🛒 Registrar Compra</div>
          <Sel label="Ativo" value={ativoSel} onChange={setAtivoSel} options={[{v:"",l:"— Selecione —"},...ativos.map(a=>({v:a.nome,l:a.nome})),{v:"novo",l:"+ Novo ativo"}]}/>
          {ativoSel==="novo"&&<div>
            <Inp label="Nome do ativo (ex: HGLG11)" value={novoAtivo} onChange={setNovoAtivo} placeholder="Ticker ou nome"/>
            <Sel label="Tipo" value={invTipo} onChange={setInvTipo} options={[{v:"acao",l:"Ação"},{v:"fii",l:"FII"},{v:"etf",l:"ETF"},{v:"cripto",l:"Criptoativo"},{v:"outro",l:"Outro"}]}/>
          </div>}
          <Inp label="Quantidade de cotas" value={compQtd} onChange={setCompQtd} type="number" step="0.0001" placeholder="0"/>
          <Inp label="Preço por cota (R$)" value={compPreco} onChange={setCompPreco} placeholder="0,00"/>
          {compQtd&&compPreco&&<div style={{fontSize:13,color:C.azul,marginBottom:12,fontWeight:600}}>Total: {fmt(parseFloat(compQtd||0)*parseFloat(compPreco.replace(",",".")||0))}</div>}
          <Inp label="Data (em branco = hoje)" value={compData} onChange={setCompData} type="date"/>
          <Btn onClick={addAtivoECompra}>Registrar Compra</Btn>
        </Card>}

        {invAba==="vender"&&<Card>
          <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>💰 Registrar Venda</div>
          {ativos.length===0?<div style={{color:C.textoSuave,fontSize:13}}>Nenhum ativo cadastrado ainda.</div>:<div>
            <Sel label="Ativo" value={vendaAtivoSel} onChange={setVendaAtivoSel} options={[{v:"",l:"— Selecione —"},...carteiraCalc.filter(a=>a.totalCotas>0).map(a=>({v:a.nome,l:`${a.nome} (${a.totalCotas.toFixed(4)} cotas)`}))]}/>
            {vendaAtivoSel&&<div style={{fontSize:12,color:C.textoSuave,marginBottom:12}}>Preço médio: <strong>{fmt(carteiraCalc.find(a=>a.nome===vendaAtivoSel)?.precoMedio||0)}</strong></div>}
            <Inp label="Quantidade de cotas" value={vendaQtd} onChange={setVendaQtd} type="number" step="0.0001" placeholder="0"/>
            <Inp label="Preço de venda por cota (R$)" value={vendaPreco} onChange={setVendaPreco} placeholder="0,00"/>
            {vendaQtd&&vendaPreco&&vendaAtivoSel&&<div style={{fontSize:13,marginBottom:12}}>
              <span style={{color:C.textoSuave}}>Total recebido: </span><strong style={{color:C.verde}}>{fmt(parseFloat(vendaQtd||0)*parseFloat(vendaPreco.replace(",",".")||0))}</strong>
              {carteiraCalc.find(a=>a.nome===vendaAtivoSel)&&<span style={{color:C.textoSuave}}> · Lucro: <strong style={{color:(parseFloat(vendaPreco.replace(",",".")||0)-carteiraCalc.find(a=>a.nome===vendaAtivoSel).precoMedio)*parseFloat(vendaQtd||0)>=0?C.verde:C.vermelho}}>{fmt((parseFloat(vendaPreco.replace(",",".")||0)-carteiraCalc.find(a=>a.nome===vendaAtivoSel).precoMedio)*parseFloat(vendaQtd||0))}</strong></span>}
            </div>}
            <Inp label="Data (em branco = hoje)" value={vendaData} onChange={setVendaData} type="date"/>
            <Btn onClick={addVenda}>Registrar Venda</Btn>
          </div>}
        </Card>}

        {invAba==="rf"&&<div>
          <Card>
            <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>🏦 Registrar Renda Fixa</div>
            <Inp label="Descrição" value={rfDesc} onChange={setRfDesc} placeholder="Ex: CDB Nubank 115% CDI"/>
            <Inp label="Valor aportado (R$)" value={rfVal} onChange={setRfVal} placeholder="0,00"/>
            <Inp label="Taxa / Rentabilidade" value={rfTaxa} onChange={setRfTaxa} placeholder="Ex: 115% CDI, 12% a.a."/>
            <Inp label="Vencimento" value={rfVenc} onChange={setRfVenc} type="date"/>
            <Inp label="Data do aporte (em branco = hoje)" value={rfData} onChange={setRfData} type="date"/>
            <Btn onClick={addRF}>Registrar</Btn>
          </Card>
          {rf.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhum título de renda fixa.</div>}
          {rf.map(r=>(<Card key={r.id} style={{padding:"10px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:C.texto}}>{r.descricao}</div>
                <div style={{fontSize:11,color:C.textoSuave}}>{r.data} · {r.taxa||"—"} · Vence: {r.vencimento||"—"}</div>
              </div>
              <div style={{fontWeight:700,color:C.verde}}>{fmt(r.valor)}</div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:8}}>
              <Btn sm cor={C.vermelho} outline onClick={()=>upd("rf",rf.filter(x=>x.id!==r.id))}>🗑 Excluir</Btn>
            </div>
          </Card>))}
        </div>}
      </div>}

      {/* EMOCIONAL */}
      {aba===4&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>Registrar Emoção</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>{["positiva","negativa"].map(t=>(<button key={t} onClick={()=>setETipo(t)} style={{flex:1,padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",background:eTipo===t?(t==="positiva"?C.verde:C.vermelho):"transparent",color:eTipo===t?"#fff":(t==="positiva"?C.verde:C.vermelho),border:`2px solid ${t==="positiva"?C.verde:C.vermelho}`}}>{t==="positiva"?"😊 Positiva":"😟 Negativa"}</button>))}</div>
          <Sel label="Emoção" value={eNome} onChange={setENome} options={[{v:"",l:"— Selecione —"},...(eTipo==="positiva"?EP:EN).map(e=>({v:e,l:e})),{v:"outra",l:"Outra"}]}/>
          <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,color:C.dourado,marginBottom:4,fontWeight:600}}>Intensidade: {eInt}/5</label><input type="range" min="1" max="5" value={eInt} onChange={e=>setEInt(e.target.value)} style={{width:"100%",accentColor:C.marsala}}/></div>
          <Inp label="Contexto" value={eCont} onChange={setECont} placeholder="O que aconteceu quando sentiu isso?"/>
          <Inp label="Data (em branco = hoje)" value={eData} onChange={setEData} type="date"/>
          <Btn onClick={addEmo}>Registrar</Btn>
        </Card>
        {emocoes.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhuma emoção registrada ainda.</div>}
        {[...emocoes].reverse().map(e=>(<Card key={e.id} style={{padding:"10px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div><div style={{fontWeight:700,color:e.tipo==="positiva"?C.verde:C.vermelho}}>{e.nome}</div><div style={{fontSize:11,color:C.textoSuave}}>{e.contexto||"—"} · {e.data}</div></div>
            <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(i=><span key={i} style={{fontSize:13,opacity:i<=e.intensidade?1:0.2}}>⬛</span>)}</div>
          </div>
          <AcoesCard lista="emocoes" item={e}/>
        </Card>))}
      </div>}

      {/* CRENÇAS */}
      {aba===5&&<div>
        <Card><div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>Adicionar da Base</div><Sel label="Selecione" value={cSel} onChange={setCSel} options={[{v:"",l:"— Selecione —"},...CB.map(c=>({v:String(c.id),l:`[${c.categoria}] ${c.crenca}`}))]}/><Btn onClick={addCrencaPre}>Adicionar</Btn></Card>
        <Card><div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>Crença Personalizada</div><Inp label="Crença" value={cPers} onChange={setCPers} placeholder="Descreva a crença..."/><Inp label="Ressignificação" value={rPers} onChange={setRPers} placeholder="Frase de repadronização..."/><Btn onClick={addCrencaPers}>Adicionar</Btn></Card>
        {crencas.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhuma crença mapeada ainda.</div>}
        {crencas.map(c=>(<Card key={c.id}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{flex:1,fontWeight:700,fontSize:13,color:c.status==="ressignificada"?C.verde:C.vermelho}}>{c.crenca}</div><Badge cor={c.status==="ressignificada"?C.verde:C.vermelho}>{c.status==="ressignificada"?"Ressignificada":"Ativa"}</Badge></div>
          <div style={{fontSize:12,color:C.textoSuave,background:C.cardClaro,borderRadius:8,padding:"8px 10px",marginBottom:8,borderLeft:`3px solid ${C.dourado}`}}><span style={{color:C.dourado,fontWeight:600}}>Ressignificação: </span>{c.ressig||"—"}</div>
          {isMentora&&<div style={{marginBottom:8}}><label style={{fontSize:11,color:C.dourado,fontWeight:600,display:"block",marginBottom:4}}>Nota da Mentora:</label><textarea value={c.notaMentora} onChange={e=>notaMentora(c.id,e.target.value)} rows={2} placeholder="Observação clínica..." style={{width:"100%",background:C.cardClaro,border:`1px solid ${C.marsalaClaro}55`,borderRadius:8,padding:"6px 10px",color:C.texto,fontSize:12,boxSizing:"border-box",resize:"vertical"}}/></div>}
          {!isMentora&&c.notaMentora&&<div style={{fontSize:12,color:C.marsala,background:C.cardClaro,borderRadius:8,padding:"6px 10px",marginBottom:8,borderLeft:`3px solid ${C.marsala}`}}><span style={{fontWeight:600}}>Feedback da mentora: </span>{c.notaMentora}</div>}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Btn sm cor={c.status==="ressignificada"?C.verde:C.marsala} outline onClick={()=>toggleCrencaStatus(c.id)}>{c.status==="ressignificada"?"Reativar":"Marcar Ressignificada"}</Btn>
            <Btn sm cor={C.dourado} outline onClick={()=>setEditando({lista:"crencas",item:{...c}})}>✏ Editar</Btn>
            <Btn sm cor={C.vermelho} outline onClick={()=>setConfirmarExcluir({lista:"crencas",id:c.id})}>🗑 Excluir</Btn>
          </div>
        </Card>))}
      </div>}

      {/* METAS */}
      {aba===6&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>Nova Meta</div>
          <Inp label="Título" value={metaTit} onChange={setMetaTit} placeholder="Ex: Reserva de emergência"/>
          <Sel label="Tipo" value={metaTipo} onChange={setMetaTipo} options={[{v:"financeira",l:"Financeira"},{v:"comportamental",l:"Comportamental"},{v:"habito",l:"Hábito"}]}/>
          <div style={{display:"flex",gap:8}}><div style={{flex:1}}><Inp label="Total da meta" value={metaVal} onChange={setMetaVal} placeholder="100"/></div><div style={{flex:1}}><Inp label="Progresso atual" value={metaAt} onChange={setMetaAt} placeholder="0"/></div></div>
          <Inp label="Prazo" value={metaPrazo} onChange={setMetaPrazo} type="date"/>
          <Btn onClick={addMeta}>Criar Meta</Btn>
        </Card>
        {metas.length===0&&<div style={{color:C.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhuma meta cadastrada ainda.</div>}
        {metas.map(m=>(<Card key={m.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontWeight:700,color:C.texto}}>{m.titulo}</div><Badge cor={m.tipo==="financeira"?C.marsala:m.tipo==="comportamental"?C.azul:C.verde}>{m.tipo}</Badge></div>
          {m.prazo&&<div style={{fontSize:11,color:C.textoSuave,marginBottom:4}}>Prazo: {new Date(m.prazo+"T12:00:00").toLocaleDateString("pt-BR")}</div>}
          <Barra atual={m.atual} meta={m.meta}/>
          <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}><span style={{fontSize:12,color:C.textoSuave}}>Atualizar:</span><input type="number" value={m.atual} onChange={e=>updMeta(m.id,"atual",e.target.value)} style={{width:80,background:C.cardClaro,border:`1px solid ${C.marsalaClaro}55`,borderRadius:6,padding:"4px 8px",color:C.texto,fontSize:13}}/><span style={{fontSize:12,color:C.textoSuave}}>de {m.meta}</span></div>
          <AcoesCard lista="metas" item={m}/>
        </Card>))}
      </div>}

      {/* RELATÓRIO */}
      {aba===7&&<div>
        <Card>
          <div style={{fontSize:15,fontWeight:800,color:C.marsala,marginBottom:2}}>Relatório — {d.nome}</div>
          <div style={{fontSize:11,color:C.textoSuave,marginBottom:14}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>

          {/* Extrato por mês */}
          <div style={{fontSize:13,fontWeight:700,color:C.marsala,marginBottom:10}}>💰 Extrato por Mês</div>
          {meses.length===0&&<div style={{color:C.textoSuave,fontSize:12,marginBottom:14}}>Nenhum lançamento ainda.</div>}
          {meses.map(ma=>{
            const s=calcSaldoMes(movs,rendimentos,ma);
            const movMes=movs.filter(m=>mesAnoDeData(m.data)===ma&&m.tipo!=="investimento");
            const rendMes=rendimentos.filter(r=>mesAnoDeData(r.data)===ma);
            return(<div key={ma} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:C.cardClaro,borderRadius:10,marginBottom:4}}>
                <span style={{fontWeight:700,color:C.marsala}}>{ma}</span>
                <span style={{fontWeight:800,color:s>=0?C.verde:C.vermelho}}>{fmt(s)}</span>
              </div>
              {movMes.map(m=>(<div key={m.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 12px",fontSize:12}}>
                <span style={{color:C.textoSuave}}>{m.descricao} · {m.categoria}{m.emocao?" · "+m.emocao:""}</span>
                <span style={{fontWeight:600,color:m.tipo==="entrada"?C.verde:C.vermelho}}>{m.tipo==="saida"?"-":""}{fmt(m.valor)}</span>
              </div>))}
              {rendMes.map(r=>(<div key={r.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 12px",fontSize:12}}>
                <span style={{color:C.textoSuave}}>{r.descricao} · rendimento</span>
                <span style={{fontWeight:600,color:C.verde}}>+{fmt(r.valor)}</span>
              </div>))}
            </div>);
          })}

          {/* Carteira */}
          <div style={{fontSize:13,fontWeight:700,color:C.marsala,marginTop:8,marginBottom:8}}>📊 Carteira de Investimentos</div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.cardClaro}`}}><span style={{fontSize:13,color:C.textoSuave}}>Renda Variável</span><span style={{fontSize:13,fontWeight:700,color:C.azul}}>{fmt(carteiraCalc.reduce((a,x)=>a+(x.valorAtual||x.totalInvestido),0))}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.cardClaro}`}}><span style={{fontSize:13,color:C.textoSuave}}>Renda Fixa</span><span style={{fontSize:13,fontWeight:700,color:C.verde}}>{fmt(totalInvestidoRF)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.cardClaro}`}}><span style={{fontSize:13,fontWeight:600,color:C.texto}}>Total da Carteira</span><span style={{fontSize:14,fontWeight:800,color:C.marsala}}>{fmt(totalCarteira)}</span></div>

          {/* Emocional */}
          <div style={{fontSize:13,fontWeight:700,color:C.marsala,marginTop:16,marginBottom:8}}>😊 Mapa Emocional</div>
          {todasEmo.length===0?<div style={{color:C.textoSuave,fontSize:12}}>Nenhuma emoção registrada.</div>:<div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>{Array.from(new Set(todasEmo.map(e=>e.nome))).map(nome=>{const qtd=todasEmo.filter(e=>e.nome===nome).length;const pos=EP.includes(nome);return <span key={nome} style={{background:(pos?C.verde:C.vermelho)+"22",color:pos?C.verde:C.vermelho,border:`1px solid ${pos?C.verde:C.vermelho}44`,borderRadius:20,padding:"3px 10px",fontSize:12}}>{nome} ({qtd})</span>;})}</div>
            <div style={{fontSize:12,color:C.textoSuave}}>Positivas: {todasEmo.filter(e=>EP.includes(e.nome)).length} · Negativas: {todasEmo.filter(e=>EN.includes(e.nome)).length}</div>
          </div>}

          {/* Crenças */}
          <div style={{fontSize:13,fontWeight:700,color:C.marsala,marginTop:16,marginBottom:8}}>🧠 Crenças</div>
          {crencas.length===0?<div style={{color:C.textoSuave,fontSize:12}}>Nenhuma crença mapeada.</div>:<div>
            <div style={{fontSize:12,color:C.textoSuave,marginBottom:6}}>Total: {crencas.length} · Ativas: {crencas.filter(c=>c.status==="ativa").length} · Ressignificadas: {crencas.filter(c=>c.status==="ressignificada").length}</div>
            {crencas.map(c=>(<div key={c.id} style={{padding:"6px 10px",borderLeft:`3px solid ${c.status==="ressignificada"?C.verde:C.vermelho}`,marginBottom:6,background:C.cardClaro,borderRadius:"0 6px 6px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.texto}}>{c.crenca}</div><div style={{fontSize:11,color:C.textoSuave}}>{c.status==="ressignificada"?"✅ Ressignificada":"⚠️ Em processo"}</div></div>))}
          </div>}

          {/* Metas */}
          <div style={{fontSize:13,fontWeight:700,color:C.marsala,marginTop:16,marginBottom:8}}>🎯 Metas</div>
          {metas.length===0?<div style={{color:C.textoSuave,fontSize:12}}>Nenhuma meta cadastrada.</div>:metas.map(m=>(<div key={m.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600,color:C.texto}}>{m.titulo}</span><Badge cor={C.marsala}>{Math.min(100,Math.round((m.atual/m.meta)*100))}%</Badge></div><Barra atual={m.atual} meta={m.meta}/></div>))}

          <div style={{marginTop:16}}><Btn onClick={()=>setModalExportar(true)}>📤 Exportar Dados</Btn></div>
        </Card>
      </div>}

      {/* MENSAGENS */}
      {aba===8&&<Card style={{padding:0,overflow:"hidden"}}>
        <div style={{background:C.marsala,padding:"10px 16px"}}><div style={{fontWeight:700,color:C.dourado,fontSize:13}}>Canal de Comunicação</div><div style={{fontSize:11,color:"#f5ede8"}}>Enviando como: {isMentora?"Wélica Amaro (Mentora)":d.nome}</div></div>
        <div style={{height:320,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
          {(d.msgs||[]).map(m=>(<div key={m.id} style={{display:"flex",justifyContent:m.de==="mentora"?"flex-end":"flex-start"}}><div style={{maxWidth:"78%",padding:"8px 12px",borderRadius:m.de==="mentora"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.de==="mentora"?C.marsala:C.cardClaro}}><div style={{fontSize:13,color:m.de==="mentora"?"#fff":C.texto}}>{m.texto}</div><div style={{fontSize:10,color:m.de==="mentora"?"#f5ede8aa":C.textoSuave,marginTop:4,textAlign:"right"}}>{m.hora} · {m.de==="mentora"?"Wélica Amaro":d.nome}</div></div></div>))}
          <div ref={msgFim}/>
        </div>
        <div style={{padding:"10px 12px",borderTop:`1px solid ${C.cardClaro}`,display:"flex",gap:8}}>
          <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviar()} placeholder="Digite sua mensagem..." style={{flex:1,background:C.cardClaro,border:`1px solid ${C.marsalaClaro}33`,borderRadius:20,padding:"8px 14px",color:C.texto,fontSize:13,outline:"none"}}/>
          <button onClick={enviar} style={{background:C.marsala,border:"none",borderRadius:20,padding:"8px 16px",color:"#fff",fontWeight:700,cursor:"pointer"}}>Enviar</button>
        </div>
      </Card>}

      {/* PERFIL */}
      {aba===9&&<Card>
        <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:16}}>👤 Meu Perfil</div>
        <div style={{fontSize:13,color:C.textoSuave,marginBottom:4}}>Nome: <strong style={{color:C.texto}}>{d.nome}</strong></div>
        <div style={{fontSize:13,color:C.textoSuave,marginBottom:20}}>E-mail: <strong style={{color:C.texto}}>{d.email}</strong></div>
        <div style={{fontSize:14,fontWeight:700,color:C.marsala,marginBottom:12}}>🔒 Alterar Senha</div>
        <Inp label="Senha atual" value={senhaAtual} onChange={setSenhaAtual} type="password" placeholder="••••••••"/>
        <Inp label="Nova senha" value={senhaNova} onChange={setSenhaNova} type="password" placeholder="Mínimo 6 caracteres"/>
        <Inp label="Confirmar nova senha" value={senhaConf} onChange={setSenhaConf} type="password" placeholder="Repita a nova senha"/>
        {erroSenha&&<div style={{color:C.vermelho,fontSize:12,marginBottom:10}}>{erroSenha}</div>}
        {msgSenha&&<div style={{color:C.verde,fontSize:12,marginBottom:10}}>{msgSenha}</div>}
        <Btn onClick={trocarSenha}>Alterar Senha</Btn>
      </Card>}

    </div>
    <div style={{textAlign:"center",padding:14,fontSize:11,color:C.textoSuave,borderTop:`1px solid ${C.cardClaro}`}}>Conduta Rica® · Wélica Amaro — CRP 09/12387</div>
  </div>);
}

export default function App(){
  const [sessao,setSessao]=useState(null);
  const [clienteAtivo,setClienteAtivo]=useState(null);
  useEffect(()=>{if(sessao?.tipo==="cliente")setClienteAtivo(sessao.dados);},[sessao]);
  async function handleSalvarCliente(atualizado){await sbPatch("clientes",atualizado.id,atualizado);setClienteAtivo(atualizado);}
  if(!sessao)return <Login onLogin={setSessao}/>;
  if(sessao.tipo==="mentora")return <PainelMentora onLogout={()=>setSessao(null)}/>;
  if(sessao.tipo==="cliente"&&clienteAtivo)return <PainelDados dados={clienteAtivo} isMentora={false} onSalvar={handleSalvarCliente} onVoltar={()=>setSessao(null)} onLogout={()=>setSessao(null)}/>;
  return <Loader/>;
}
