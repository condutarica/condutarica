import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://qxvtzxttjmzurfwkxfhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dnR6eHR0am16dXJmd2t4Zmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDcxOTQsImV4cCI6MjA5OTEyMzE5NH0.Gwz13_5ZtXqoRyvMq6WBybXUfQbXkHgchzR-f74cAiE";

async function sbGet(tabela, filtro="") {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}${filtro}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  return r.json();
}
async function sbPost(tabela, body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(body)
  });
  return r.json();
}
async function sbPatch(tabela, id, body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?id=eq.${id}`, {
    method: "PATCH",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(body)
  });
  return r.json();
}

const CORES = {
  marsala:"#4A1020", marsalaClaro:"#6B1A30", dourado:"#C9A84C", douradoClaro:"#E2C97E",
  fundo:"#1a0a0e", card:"#2a1018", cardClaro:"#3a1a22", texto:"#f5ede8",
  textoSuave:"#c9a89a", verde:"#4caf7d", vermelho:"#e05c5c", azul:"#5c9ee0",
};

const EMOCOES_POSITIVAS = ["Gratidão","Confiança","Motivação","Leveza","Orgulho","Alegria","Serenidade","Esperança","Satisfação","Empoderamento"];
const EMOCOES_NEGATIVAS = ["Medo","Culpa","Ansiedade","Impulsividade","Vergonha","Raiva","Tristeza","Desânimo","Inveja","Insegurança"];

const CRENCAS_BASE = [
  {id:1,crenca:"Dinheiro é difícil de ganhar",categoria:"Escassez",ressig:"Dinheiro é o resultado natural do valor que entrego."},
  {id:2,crenca:"Eu não mereço ser rico(a)",categoria:"Merecimento",ressig:"Eu sou digno(a) de abundância. Minha história não define meu destino financeiro."},
  {id:3,crenca:"Dinheiro não é para pessoas como eu",categoria:"Escassez",ressig:"Dinheiro está disponível para qualquer pessoa disposta a aprender e agir."},
  {id:4,crenca:"Rico é quem nasce em berço de ouro",categoria:"Escassez",ressig:"A maioria das pessoas prósperas construiu sua riqueza com educação e consistência."},
  {id:5,crenca:"Dinheiro é a raiz de todo mal",categoria:"Moralidade",ressig:"Dinheiro é uma ferramenta neutra. O que define seu impacto são os valores de quem o utiliza."},
  {id:6,crenca:"Quem tem dinheiro é ganancioso",categoria:"Moralidade",ressig:"Posso ser próspero(a) e generoso(a) ao mesmo tempo."},
  {id:7,crenca:"É errado querer muito dinheiro",categoria:"Moralidade",ressig:"Querer prosperidade é querer segurança, liberdade e possibilidade."},
  {id:8,crenca:"Falar de dinheiro é falta de educação",categoria:"Moralidade",ressig:"Falar de dinheiro com consciência é um ato de responsabilidade e maturidade."},
  {id:9,crenca:"Eu não sei lidar com dinheiro",categoria:"Capacidade",ressig:"Lidar bem com dinheiro é uma habilidade que se aprende."},
  {id:10,crenca:"Sempre fui assim, não vou mudar",categoria:"Identidade",ressig:"Meu cérebro é plástico e meu comportamento é moldável."},
  {id:11,crenca:"Sou desorganizado(a) por natureza",categoria:"Identidade",ressig:"Organização é um hábito, não uma característica inata."},
  {id:12,crenca:"Não tenho cabeça para finanças",categoria:"Capacidade",ressig:"Finanças pessoais se aprende com método e prática."},
  {id:13,crenca:"Dinheiro separa as pessoas",categoria:"Relacionamentos",ressig:"Com comunicação saudável, a prosperidade aproxima e protege os relacionamentos."},
  {id:14,crenca:"Se eu enriquecer vou perder meus amigos",categoria:"Relacionamentos",ressig:"Relacionamentos verdadeiros celebram o crescimento do outro."},
  {id:15,crenca:"Não posso ganhar mais que meu pai/mãe",categoria:"Relacionamentos",ressig:"Honro minha família ao superar limitações que eles não puderam vencer."},
  {id:16,crenca:"Dinheiro vem e vai, não adianta guardar",categoria:"Impermanência",ressig:"Com estratégia e consistência, o dinheiro acumula e trabalha por mim."},
  {id:17,crenca:"Sempre que tenho, perco",categoria:"Impermanência",ressig:"Perdas anteriores me ensinaram. Hoje tenho mais consciência para preservar o que conquisto."},
  {id:18,crenca:"Não vale a pena investir, posso perder tudo",categoria:"Medo",ressig:"Investir com educação e diversificação é diferente de especular."},
  {id:19,crenca:"Segurança financeira é impossível",categoria:"Medo",ressig:"Segurança financeira é construída passo a passo."},
];

const CAT_OPTS=[{v:"salario",l:"Salário"},{v:"freelance",l:"Freelance"},{v:"bonus",l:"Bônus"},{v:"presente",l:"Presente"},{v:"aluguel_rec",l:"Aluguel recebido"},{v:"alimentacao",l:"Alimentação"},{v:"moradia",l:"Moradia"},{v:"saude",l:"Saúde"},{v:"educacao",l:"Educação"},{v:"lazer",l:"Lazer"},{v:"transporte",l:"Transporte"},{v:"vestuario",l:"Vestuário"},{v:"divida",l:"Dívida"},{v:"pensao",l:"Pensão"},{v:"cartao_credito",l:"Cartão de Crédito"},{v:"outro",l:"Outro (especificar)"}];

const fmt = v => "R$ " + Number(v||0).toLocaleString("pt-BR",{minimumFractionDigits:2});
const hoje = () => new Date().toLocaleDateString("pt-BR");
const agora = () => new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const strParaData = s => new Date(s+"T12:00:00");
function statusConta(v){ if(!v)return"pendente"; const h=new Date();h.setHours(0,0,0,0);const d=strParaData(v);d.setHours(0,0,0,0);return d<h?"vencida":"pendente"; }

function Card({children,style={}}){return <div style={{background:CORES.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${CORES.marsalaClaro}55`,...style}}>{children}</div>;}
function Inp({label,value,onChange,type="text",placeholder=""}){return(<div style={{marginBottom:12}}>{label&&<label style={{display:"block",fontSize:12,color:CORES.dourado,marginBottom:4,fontWeight:600}}>{label}</label>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",background:CORES.cardClaro,border:`1px solid ${CORES.marsalaClaro}`,borderRadius:8,padding:"8px 12px",color:CORES.texto,fontSize:14,boxSizing:"border-box",outline:"none"}}/></div>);}
function Sel({label,value,onChange,options}){return(<div style={{marginBottom:12}}>{label&&<label style={{display:"block",fontSize:12,color:CORES.dourado,marginBottom:4,fontWeight:600}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:CORES.cardClaro,border:`1px solid ${CORES.marsalaClaro}`,borderRadius:8,padding:"8px 12px",color:CORES.texto,fontSize:14,boxSizing:"border-box",outline:"none"}}>{options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>);}
function Btn({onClick,children,cor=CORES.dourado,outline=false,full=false,sm=false,style={}}){return(<button onClick={onClick} style={{background:outline?"transparent":cor,color:outline?cor:CORES.marsala,border:`2px solid ${cor}`,borderRadius:8,padding:sm?"4px 10px":"8px 18px",fontWeight:700,fontSize:sm?11:13,cursor:"pointer",width:full?"100%":"auto",...style}}>{children}</button>);}
function Badge({cor,children}){return <span style={{background:cor+"22",color:cor,border:`1px solid ${cor}44`,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:600}}>{children}</span>;}
function Barra({atual,meta}){const pct=Math.min(100,Math.round((atual/meta)*100));return(<div style={{marginTop:6}}><div style={{background:CORES.cardClaro,borderRadius:20,height:10,overflow:"hidden"}}><div style={{width:`${pct}%`,background:`linear-gradient(90deg,${CORES.marsala},${CORES.dourado})`,height:"100%",borderRadius:20}}/></div><div style={{fontSize:11,color:CORES.textoSuave,marginTop:3}}>{pct}% concluído</div></div>);}
function Loader(){return <div style={{color:CORES.dourado,textAlign:"center",padding:40,fontFamily:"'Segoe UI',sans-serif",background:CORES.fundo,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>Carregando Conduta Rica®...</div>;}
function ModalExcluir({onConfirm,onCancel}){return(<div style={{position:"fixed",inset:0,background:"#000a",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:CORES.card,borderRadius:14,padding:24,maxWidth:320,width:"90%",border:`2px solid ${CORES.vermelho}`}}><div style={{fontSize:15,fontWeight:700,color:CORES.vermelho,marginBottom:8}}>Excluir registro?</div><div style={{fontSize:13,color:CORES.textoSuave,marginBottom:20}}>Esta ação não pode ser desfeita.</div><div style={{display:"flex",gap:10}}><Btn onClick={onConfirm} cor={CORES.vermelho} full>Excluir</Btn><Btn onClick={onCancel} cor={CORES.dourado} outline full>Cancelar</Btn></div></div></div>);}

function Login({onLogin}){
  const [email,setEmail]=useState(""); const [senha,setSenha]=useState(""); const [erro,setErro]=useState(""); const [loading,setLoading]=useState(false);
  async function entrar(){
    setLoading(true); setErro("");
    const e=email.trim(); const s=senha.trim();
    if(e==="welica@conducarica.com"&&s==="condutarica2024"){onLogin({tipo:"mentora"});setLoading(false);return;}
    try{
      const res=await sbGet("clientes",`?email=eq.${encodeURIComponent(e)}&select=*`);
      if(res&&res.length>0&&res[0].senha===s){onLogin({tipo:"cliente",dados:res[0]});setLoading(false);return;}
    }catch(_){}
    setErro("E-mail ou senha incorretos."); setLoading(false);
  }
  return(<div style={{minHeight:"100vh",background:CORES.fundo,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Segoe UI',sans-serif"}}>
    <div style={{width:"100%",maxWidth:380}}>
      <div style={{textAlign:"center",marginBottom:32}}><div style={{fontSize:28,fontWeight:900,color:CORES.dourado,letterSpacing:2}}>CONDUTA RICA®</div><div style={{fontSize:13,color:CORES.textoSuave,marginTop:4}}>Rastreador Comportamental-Financeiro</div></div>
      <Card>
        <div style={{fontSize:15,fontWeight:700,color:CORES.dourado,marginBottom:16,textAlign:"center"}}>Acesse sua conta</div>
        <Inp label="E-mail" value={email} onChange={setEmail} placeholder="seu@email.com"/>
        <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,color:CORES.dourado,marginBottom:4,fontWeight:600}}>Senha</label><input type="password" value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==="Enter"&&entrar()} placeholder="••••••••" style={{width:"100%",background:CORES.cardClaro,border:`1px solid ${CORES.marsalaClaro}`,borderRadius:8,padding:"8px 12px",color:CORES.texto,fontSize:14,boxSizing:"border-box",outline:"none"}}/></div>
        {erro&&<div style={{color:CORES.vermelho,fontSize:12,marginBottom:10,textAlign:"center"}}>{erro}</div>}
        <button onClick={entrar} disabled={loading} style={{width:"100%",background:CORES.dourado,color:CORES.marsala,border:`2px solid ${CORES.dourado}`,borderRadius:8,padding:"10px",fontWeight:700,fontSize:14,cursor:"pointer"}}>{loading?"Entrando...":"Entrar"}</button>
      </Card>
      <div style={{textAlign:"center",fontSize:11,color:CORES.textoSuave,marginTop:16}}>Wélica Amaro · CRP 09/12387</div>
    </div>
  </div>);
}

function PainelMentora({onLogout}){
  const [clientes,setClientes]=useState([]); const [aba,setAba]=useState("lista"); const [clienteAberto,setClienteAberto]=useState(null);
  const [nome,setNome]=useState(""); const [email,setEmail]=useState(""); const [senha,setSenha]=useState(""); const [ok,setOk]=useState(""); const [loading,setLoading]=useState(true);
  useEffect(()=>{recarregar();},[]);
  async function recarregar(){setLoading(true);const r=await sbGet("clientes","?select=*&order=created_at.asc");setClientes(Array.isArray(r)?r:[]);setLoading(false);}
  async function cadastrar(){
    if(!nome||!email||!senha)return;
    const novo={id:"cli_"+Date.now(),nome,email,senha,movs:[],emocoes:[],crencas:[],metas:[],contas:[],rendimentos:[],msgs:[{id:1,de:"mentora",texto:`Olá, ${nome}! Bem-vindo(a) à Conduta Rica®!`,hora:"09:00"}]};
    await sbPost("clientes",novo); setNome("");setEmail("");setSenha("");setOk("Cliente cadastrado!");setTimeout(()=>setOk(""),3000); recarregar();
  }
  async function atualizarCliente(cli){await sbPatch("clientes",cli.id,cli);setClienteAberto(cli);setClientes(clientes.map(c=>c.id===cli.id?cli:c));}
  if(clienteAberto)return <PainelDados dados={clienteAberto} isMentora={true} onSalvar={atualizarCliente} onVoltar={()=>{recarregar();setClienteAberto(null);}} onLogout={onLogout}/>;
  return(<div style={{fontFamily:"'Segoe UI',sans-serif",background:CORES.fundo,minHeight:"100vh",color:CORES.texto}}>
    <div style={{background:`linear-gradient(135deg,${CORES.marsala},${CORES.marsalaClaro})`,padding:"14px 20px",borderBottom:`2px solid ${CORES.dourado}44`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:16,fontWeight:800,color:CORES.dourado}}>CONDUTA RICA®</div><div style={{fontSize:11,color:CORES.douradoClaro}}>Painel da Mentora</div></div>
      <div><div style={{fontSize:12,color:CORES.douradoClaro,fontWeight:600}}>Wélica Amaro</div><button onClick={onLogout} style={{background:"transparent",border:"none",color:CORES.textoSuave,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Sair</button></div>
    </div>
    <div style={{display:"flex",background:CORES.card,borderBottom:`1px solid ${CORES.marsalaClaro}55`}}>
      {[["lista","Meus Clientes"],["cadastrar","Cadastrar Cliente"]].map(([v,l])=>(<button key={v} onClick={()=>setAba(v)} style={{padding:"12px 20px",fontSize:12,fontWeight:700,cursor:"pointer",background:"transparent",border:"none",color:aba===v?CORES.dourado:CORES.textoSuave,borderBottom:aba===v?`2px solid ${CORES.dourado}`:"2px solid transparent"}}>{l}</button>))}
    </div>
    <div style={{padding:16,maxWidth:700,margin:"0 auto"}}>
      {aba==="lista"&&<div>
        <div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Clientes ({clientes.length})</div>
        {loading&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:20}}>Carregando...</div>}
        {!loading&&clientes.length===0&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:30,fontSize:13}}>Nenhum cliente cadastrado ainda.</div>}
        {clientes.map(c=>{
          const saldo=(c.movs||[]).filter(m=>m.tipo==="entrada").reduce((a,m)=>a+m.valor,0)+(c.rendimentos||[]).reduce((a,r)=>a+r.valor,0)-(c.movs||[]).filter(m=>m.tipo==="saida").reduce((a,m)=>a+m.valor,0)-(c.movs||[]).filter(m=>m.tipo==="investimento").reduce((a,m)=>a+m.valor,0);
          const vencidas=(c.contas||[]).filter(x=>x.status!=="executada"&&statusConta(x.vencimento)==="vencida").length;
          return(<Card key={c.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:700,fontSize:14}}>{c.nome}</div><div style={{fontSize:11,color:CORES.textoSuave,marginBottom:6}}>{c.email}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Badge cor={CORES.verde}>{(c.movs||[]).filter(m=>m.tipo==="entrada").length} entradas</Badge><Badge cor={CORES.azul}>{(c.metas||[]).length} metas</Badge>{vencidas>0&&<Badge cor={CORES.vermelho}>{vencidas} vencida(s)</Badge>}</div>
            </div>
            <div style={{textAlign:"right"}}><div style={{fontSize:11,color:CORES.textoSuave}}>Saldo</div><div style={{fontWeight:700,color:saldo>=0?CORES.verde:CORES.vermelho,fontSize:13,marginBottom:8}}>{fmt(saldo)}</div><Btn onClick={()=>setClienteAberto(c)}>Abrir</Btn></div>
          </div></Card>);
        })}
      </div>}
      {aba==="cadastrar"&&<Card>
        <div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:14}}>Novo cliente</div>
        <Inp label="Nome completo" value={nome} onChange={setNome} placeholder="Nome do mentorado"/>
        <Inp label="E-mail de acesso" value={email} onChange={setEmail} placeholder="email@exemplo.com"/>
        <Inp label="Senha" value={senha} onChange={setSenha} type="password" placeholder="Crie uma senha"/>
        {ok&&<div style={{color:CORES.verde,fontSize:12,marginBottom:10}}>{ok}</div>}
        <Btn onClick={cadastrar}>Cadastrar</Btn>
      </Card>}
    </div>
  </div>);
}

function PainelDados({dados,isMentora,onSalvar,onVoltar,onLogout}){
  const [d,setD]=useState(dados);
  const [aba,setAba]=useState(0);
  const [salvando,setSalvando]=useState(false);
  const abas=["Financeiro","Agendamentos","Rendimentos","Investimentos","Emocional","Crenças","Metas","Relatório","Mensagens"];
  const msgFim=useRef(null);
  const [confirmarExcluir,setConfirmarExcluir]=useState(null);
  const [editando,setEditando]=useState(null);
  const [valEdit,setValEdit]=useState({});
  useEffect(()=>{if(editando)setValEdit({...editando.item});},[editando]);
  useEffect(()=>{msgFim.current?.scrollIntoView({behavior:"smooth"});},[d.msgs]);

  async function upd(campo,valor){const novo={...d,[campo]:valor};setD(novo);setSalvando(true);await sbPatch("clientes",d.id,{[campo]:valor});setSalvando(false);onSalvar(novo);}
  function excluir(lista,id){upd(lista,(d[lista]||[]).filter(x=>x.id!==id));setConfirmarExcluir(null);}
  function salvarEdicao(lista,item){upd(lista,(d[lista]||[]).map(x=>x.id===item.id?item:x));setEditando(null);}

  const movs=d.movs||[]; const emocoes=d.emocoes||[]; const crencas=d.crencas||[];
  const metas=d.metas||[]; const contas=d.contas||[]; const rendimentos=d.rendimentos||[];
  const entradas=movs.filter(m=>m.tipo==="entrada").reduce((a,m)=>a+m.valor,0);
  const totalRend=rendimentos.reduce((a,r)=>a+r.valor,0);
  const saidas=movs.filter(m=>m.tipo==="saida").reduce((a,m)=>a+m.valor,0);
  const inv=movs.filter(m=>m.tipo==="investimento").reduce((a,m)=>a+m.valor,0);
  const saldo=entradas+totalRend-saidas-inv;
  const contasVencidas=contas.filter(c=>c.status!=="executada"&&statusConta(c.vencimento)==="vencida").length;

  const [mTipo,setMTipo]=useState("entrada"); const [mDesc,setMDesc]=useState(""); const [mVal,setMVal]=useState(""); const [mCat,setMCat]=useState("salario"); const [mCatOutro,setMCatOutro]=useState(""); const [mEmo,setMEmo]=useState(""); const [mData,setMData]=useState("");
  function addMov(){if(!mDesc||!mVal)return;const catFinal=mCat==="outro"&&mCatOutro.trim()?mCatOutro.trim():mCat;const dataFmt=mData?strParaData(mData).toLocaleDateString("pt-BR"):hoje();upd("movs",[...movs,{id:Date.now(),tipo:mTipo,descricao:mDesc,valor:parseFloat(mVal.replace(",",".")),categoria:catFinal,emocao:mEmo,data:dataFmt}]);setMDesc("");setMVal("");setMEmo("");setMData("");setMCatOutro("");}

  const [cTipo,setCTipo]=useState("pagar"); const [cDesc,setCDesc]=useState(""); const [cVal,setCVal]=useState(""); const [cVenc,setCVenc]=useState(""); const [cCat,setCCat]=useState("conta");
  function addConta(){if(!cDesc||!cVal||!cVenc)return;upd("contas",[...contas,{id:Date.now(),tipo:cTipo,descricao:cDesc,valor:parseFloat(cVal.replace(",",".")),vencimento:strParaData(cVenc).toLocaleDateString("pt-BR"),categoria:cCat,status:"pendente"}]);setCDesc("");setCVal("");setCVenc("");}
  async function executarConta(id){const c=contas.find(x=>x.id===id);if(!c)return;const novasMov=[...movs,{id:Date.now(),tipo:c.tipo==="pagar"?"saida":"entrada",descricao:c.descricao+" (agendamento)",valor:c.valor,categoria:c.categoria,emocao:"",data:hoje()}];const novasContas=contas.map(x=>x.id===id?{...x,status:"executada",dataExec:hoje()}:x);const novo={...d,movs:novasMov,contas:novasContas};setD(novo);await sbPatch("clientes",d.id,{movs:novasMov,contas:novasContas});onSalvar(novo);}

  const [rDesc,setRDesc]=useState(""); const [rVal,setRVal]=useState(""); const [rTipo,setRTipo]=useState("dividendos"); const [rData,setRData]=useState("");
  function addRend(){if(!rDesc||!rVal)return;upd("rendimentos",[...rendimentos,{id:Date.now(),descricao:rDesc,valor:parseFloat(rVal.replace(",",".")),tipo:rTipo,data:rData?strParaData(rData).toLocaleDateString("pt-BR"):hoje()}]);setRDesc("");setRVal("");setRData("");}

  const [iDesc,setIDesc]=useState(""); const [iVal,setIVal]=useState(""); const [iTipo,setITipo]=useState("renda_fixa"); const [iData,setIData]=useState("");
  function addInv(){if(!iDesc||!iVal)return;upd("movs",[...movs,{id:Date.now(),tipo:"investimento",descricao:iDesc,valor:parseFloat(iVal.replace(",",".")),categoria:iTipo,emocao:"",data:iData?strParaData(iData).toLocaleDateString("pt-BR"):hoje()}]);setIDesc("");setIVal("");setIData("");}

  const [eTipo,setETipo]=useState("positiva"); const [eNome,setENome]=useState(""); const [eCont,setECont]=useState(""); const [eInt,setEInt]=useState("3"); const [eData,setEData]=useState("");
  function addEmo(){if(!eNome)return;upd("emocoes",[...emocoes,{id:Date.now(),tipo:eTipo,nome:eNome,contexto:eCont,intensidade:parseInt(eInt),data:eData?strParaData(eData).toLocaleDateString("pt-BR"):hoje()}]);setENome("");setECont("");setEInt("3");setEData("");}

  const [cSel,setCSel]=useState(""); const [cPers,setCPers]=useState(""); const [rPers,setRPers]=useState("");
  function addCrencaPre(){if(!cSel)return;const c=CRENCAS_BASE.find(x=>x.id===parseInt(cSel));if(!c||crencas.find(x=>x.crencaId===c.id))return;upd("crencas",[...crencas,{id:Date.now(),crencaId:c.id,crenca:c.crenca,ressig:c.ressig,personalizada:false,notaMentora:"",status:"ativa"}]);setCSel("");}
  function addCrencaPers(){if(!cPers)return;upd("crencas",[...crencas,{id:Date.now(),crencaId:null,crenca:cPers,ressig:rPers,personalizada:true,notaMentora:"",status:"ativa"}]);setCPers("");setRPers("");}
  function toggleCrencaStatus(id){upd("crencas",crencas.map(c=>c.id===id?{...c,status:c.status==="ativa"?"ressignificada":"ativa"}:c));}
  function notaMentora(id,nota){upd("crencas",crencas.map(c=>c.id===id?{...c,notaMentora:nota}:c));}

  const [metaTit,setMetaTit]=useState(""); const [metaVal,setMetaVal]=useState(""); const [metaAt,setMetaAt]=useState(""); const [metaTipo,setMetaTipo]=useState("financeira"); const [metaPrazo,setMetaPrazo]=useState("");
  function addMeta(){if(!metaTit)return;upd("metas",[...metas,{id:Date.now(),titulo:metaTit,tipo:metaTipo,meta:parseFloat(metaVal||100),atual:parseFloat(metaAt||0),prazo:metaPrazo}]);setMetaTit("");setMetaVal("");setMetaAt("");setMetaPrazo("");}
  function updMeta(id,campo,val){upd("metas",metas.map(m=>m.id===id?{...m,[campo]:["atual","meta"].includes(campo)?parseFloat(val||0):val}:m));}

  const [msg,setMsg]=useState("");
  function enviar(){if(!msg.trim())return;upd("msgs",[...(d.msgs||[]),{id:Date.now(),de:isMentora?"mentora":"cliente",texto:msg,hora:agora()}]);setMsg("");}

  function ModalEdicao(){
    if(!editando)return null;
    const {lista}=editando; const val=valEdit; const setVal=setValEdit;
    const corMov=t=>t==="entrada"?CORES.verde:t==="saida"?CORES.vermelho:CORES.azul;
    return(<div style={{position:"fixed",inset:0,background:"#000b",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:CORES.card,borderRadius:14,padding:20,maxWidth:420,width:"100%",border:`2px solid ${CORES.dourado}`,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{fontSize:15,fontWeight:700,color:CORES.dourado,marginBottom:14}}>✏ Editar registro</div>
        {lista==="movs"&&<div>
          {val.tipo!=="investimento"&&<div style={{display:"flex",gap:6,marginBottom:12}}>{["entrada","saida"].map(t=>(<button key={t} onClick={()=>setVal({...val,tipo:t})} style={{flex:1,padding:"6px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",background:val.tipo===t?corMov(t):"transparent",color:val.tipo===t?CORES.marsala:corMov(t),border:`2px solid ${corMov(t)}`}}>{t==="entrada"?"Entrada":"Saída"}</button>))}</div>}
          <Inp label="Descrição" value={val.descricao||""} onChange={v=>setVal({...val,descricao:v})}/>
          <Inp label="Valor (R$)" value={String(val.valor||"")} onChange={v=>setVal({...val,valor:parseFloat(v.replace(",","."))||0})}/>
          <Sel label="Categoria" value={CAT_OPTS.find(o=>o.v===val.categoria)?val.categoria:"outro"} onChange={v=>setVal({...val,categoria:v})} options={CAT_OPTS}/>
          <Inp label="Data" value={val.data||""} onChange={v=>setVal({...val,data:v})} placeholder="dd/mm/aaaa"/>
        </div>}
        {lista==="emocoes"&&<div>
          <Sel label="Tipo" value={val.tipo||"positiva"} onChange={v=>setVal({...val,tipo:v})} options={[{v:"positiva",l:"Positiva"},{v:"negativa",l:"Negativa"}]}/>
          <Sel label="Emoção" value={val.nome||""} onChange={v=>setVal({...val,nome:v})} options={[...(val.tipo==="positiva"?EMOCOES_POSITIVAS:EMOCOES_NEGATIVAS).map(e=>({v:e,l:e})),{v:"outra",l:"Outra"}]}/>
          <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,color:CORES.dourado,marginBottom:4,fontWeight:600}}>Intensidade: {val.intensidade||3}/5</label><input type="range" min="1" max="5" value={val.intensidade||3} onChange={e=>setVal({...val,intensidade:parseInt(e.target.value)})} style={{width:"100%",accentColor:CORES.dourado}}/></div>
          <Inp label="Contexto" value={val.contexto||""} onChange={v=>setVal({...val,contexto:v})}/>
          <Inp label="Data" value={val.data||""} onChange={v=>setVal({...val,data:v})} placeholder="dd/mm/aaaa"/>
        </div>}
        {lista==="rendimentos"&&<div>
          <Inp label="Descrição" value={val.descricao||""} onChange={v=>setVal({...val,descricao:v})}/>
          <Inp label="Valor (R$)" value={String(val.valor||"")} onChange={v=>setVal({...val,valor:parseFloat(v.replace(",","."))||0})}/>
          <Sel label="Tipo" value={val.tipo||"dividendos"} onChange={v=>setVal({...val,tipo:v})} options={[{v:"dividendos",l:"Dividendos"},{v:"juros",l:"Juros / CDB"},{v:"aluguel",l:"Aluguel"},{v:"renda_passiva",l:"Renda passiva"},{v:"bonus",l:"Bônus"},{v:"outro",l:"Outro"}]}/>
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
    <Btn sm cor={CORES.dourado} outline onClick={()=>setEditando({lista,item:{...item}})}>✏ Editar</Btn>
    <Btn sm cor={CORES.vermelho} outline onClick={()=>setConfirmarExcluir({lista,id:item.id})}>🗑 Excluir</Btn>
  </div>);

  return(<div style={{fontFamily:"'Segoe UI',sans-serif",background:CORES.fundo,minHeight:"100vh",color:CORES.texto}}>
    {confirmarExcluir&&<ModalExcluir onConfirm={()=>excluir(confirmarExcluir.lista,confirmarExcluir.id)} onCancel={()=>setConfirmarExcluir(null)}/>}
    <ModalEdicao/>
    <div style={{background:`linear-gradient(135deg,${CORES.marsala},${CORES.marsalaClaro})`,padding:"14px 20px",borderBottom:`2px solid ${CORES.dourado}44`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {isMentora&&<button onClick={onVoltar} style={{background:"transparent",border:`1px solid ${CORES.dourado}`,color:CORES.dourado,borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12}}>← Voltar</button>}
          <div><div style={{fontSize:15,fontWeight:800,color:CORES.dourado}}>CONDUTA RICA®</div><div style={{fontSize:11,color:CORES.douradoClaro}}>{d.nome}</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {salvando&&<span style={{fontSize:11,color:CORES.douradoClaro}}>Salvando...</span>}
          {contasVencidas>0&&<Badge cor={CORES.vermelho}>⚠ {contasVencidas}</Badge>}
          {isMentora&&<Badge cor={CORES.dourado}>Mentora</Badge>}
          {!isMentora&&<button onClick={onLogout} style={{background:"transparent",border:"none",color:CORES.textoSuave,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Sair</button>}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
        {[{l:"Entradas",v:fmt(entradas+totalRend),c:CORES.verde},{l:"Saídas",v:fmt(saidas),c:CORES.vermelho},{l:"Investido",v:fmt(inv),c:CORES.azul},{l:"Saldo",v:fmt(saldo),c:CORES.dourado}].map(x=>(
          <div key={x.l} style={{background:CORES.fundo+"99",borderRadius:10,padding:"6px 12px",flex:1,minWidth:60,textAlign:"center",border:`1px solid ${x.c}33`}}>
            <div style={{fontSize:10,color:CORES.textoSuave}}>{x.l}</div>
            <div style={{fontSize:12,fontWeight:700,color:x.c}}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{display:"flex",overflowX:"auto",background:CORES.card,borderBottom:`1px solid ${CORES.marsalaClaro}55`}}>
      {abas.map((a,i)=>(<button key={a} onClick={()=>setAba(i)} style={{padding:"11px 12px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",background:"transparent",border:"none",color:aba===i?CORES.dourado:CORES.textoSuave,borderBottom:aba===i?`2px solid ${CORES.dourado}`:"2px solid transparent"}}>
        {a}{a==="Agendamentos"&&contasVencidas>0&&<span style={{background:CORES.vermelho,color:"#fff",borderRadius:10,fontSize:9,padding:"1px 5px",marginLeft:4}}>{contasVencidas}</span>}
      </button>))}
    </div>
    <div style={{padding:16,maxWidth:700,margin:"0 auto"}}>
      {aba===0&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Nova Movimentação</div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>{["entrada","saida"].map(t=>(<button key={t} onClick={()=>setMTipo(t)} style={{flex:1,padding:"7px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",background:mTipo===t?(t==="entrada"?CORES.verde:CORES.vermelho):"transparent",color:mTipo===t?CORES.marsala:(t==="entrada"?CORES.verde:CORES.vermelho),border:`2px solid ${t==="entrada"?CORES.verde:CORES.vermelho}`}}>{t==="entrada"?"Entrada":"Saída"}</button>))}</div>
          <Inp label="Descrição" value={mDesc} onChange={setMDesc} placeholder="Ex: Salário de junho"/>
          <Inp label="Valor (R$)" value={mVal} onChange={setMVal} placeholder="0,00"/>
          <Sel label="Categoria" value={mCat} onChange={setMCat} options={CAT_OPTS}/>
          {mCat==="outro"&&<Inp label="Especifique" value={mCatOutro} onChange={setMCatOutro} placeholder="Ex: Assinatura, Pet..."/>}
          <Sel label="Emoção associada (opcional)" value={mEmo} onChange={setMEmo} options={[{v:"",l:"— Nenhuma —"},...EMOCOES_POSITIVAS.map(e=>({v:e,l:"😊 "+e})),...EMOCOES_NEGATIVAS.map(e=>({v:e,l:"😟 "+e}))]}/>
          <Inp label="Data (em branco = hoje)" value={mData} onChange={setMData} type="date"/>
          <Btn onClick={addMov}>Registrar</Btn>
        </Card>
        {movs.filter(m=>m.tipo!=="investimento").length===0&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhuma movimentação ainda.</div>}
        {[...movs.filter(m=>m.tipo!=="investimento")].reverse().map(m=>(<Card key={m.id} style={{padding:"10px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:13,fontWeight:600}}>{m.descricao}</div><div style={{fontSize:11,color:CORES.textoSuave}}>{m.data} · {m.categoria}{m.emocao?" · "+m.emocao:""}</div></div>
            <div style={{fontWeight:700,color:m.tipo==="entrada"?CORES.verde:CORES.vermelho}}>{m.tipo==="saida"?"-":""}{fmt(m.valor)}</div>
          </div>
          <AcoesCard lista="movs" item={m}/>
        </Card>))}
      </div>}
      {aba===1&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Novo Agendamento</div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>{["pagar","receber"].map(t=>(<button key={t} onClick={()=>setCTipo(t)} style={{flex:1,padding:"7px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",background:cTipo===t?(t==="receber"?CORES.verde:CORES.vermelho):"transparent",color:cTipo===t?CORES.marsala:(t==="receber"?CORES.verde:CORES.vermelho),border:`2px solid ${t==="receber"?CORES.verde:CORES.vermelho}`}}>{t==="pagar"?"A Pagar":"A Receber"}</button>))}</div>
          <Inp label="Descrição" value={cDesc} onChange={setCDesc} placeholder="Ex: Aluguel..."/>
          <Inp label="Valor (R$)" value={cVal} onChange={setCVal} placeholder="0,00"/>
          <Inp label="Vencimento" value={cVenc} onChange={setCVenc} type="date"/>
          <Sel label="Categoria" value={cCat} onChange={setCCat} options={[{v:"conta",l:"Conta fixa"},{v:"servico",l:"Serviço"},{v:"cliente",l:"Pagamento de cliente"},{v:"freelance",l:"Freelance"},{v:"aluguel",l:"Aluguel"},{v:"pensao",l:"Pensão"},{v:"cartao_credito",l:"Cartão de Crédito"},{v:"outro",l:"Outro"}]}/>
          <Btn onClick={addConta}>Agendar</Btn>
        </Card>
        {contas.length===0&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhum agendamento cadastrado.</div>}
        {[["vencida","⚠ Vencidas",CORES.vermelho],["pendente","Pendentes",CORES.dourado],["executada","✅ Executadas",CORES.verde]].map(([status,titulo,cor])=>{
          const lista=contas.filter(c=>status==="executada"?c.status==="executada":c.status!=="executada"&&statusConta(c.vencimento)===status);
          if(lista.length===0)return null;
          return(<div key={status}><div style={{fontSize:13,fontWeight:700,color:cor,marginBottom:8,marginTop:4}}>{titulo}</div>
            {lista.map(c=>(<Card key={c.id} style={status==="vencida"?{border:`2px solid ${CORES.vermelho}`,background:CORES.vermelho+"11"}:status==="executada"?{opacity:0.7}:{}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:700,fontSize:13,color:status==="vencida"?CORES.vermelho:CORES.texto}}>{c.descricao}</div><div style={{fontSize:11,color:CORES.textoSuave}}>{status==="executada"?`Exec. ${c.dataExec} · Vencia ${c.vencimento}`:`Venc. ${c.vencimento}`} · {c.tipo==="pagar"?"A Pagar":"A Receber"}</div></div>
                <div style={{fontWeight:700,color:c.tipo==="receber"?CORES.verde:CORES.vermelho}}>{fmt(c.valor)}</div>
              </div>
              {status!=="executada"&&<div style={{display:"flex",gap:6,marginTop:8}}>
                <Btn sm cor={CORES.verde} onClick={()=>executarConta(c.id)}>Executar</Btn>
                <Btn sm cor={CORES.dourado} outline onClick={()=>setEditando({lista:"contas",item:{...c}})}>✏ Editar</Btn>
                <Btn sm cor={CORES.vermelho} outline onClick={()=>setConfirmarExcluir({lista:"contas",id:c.id})}>🗑 Excluir</Btn>
              </div>}
            </Card>))}
          </div>);
        })}
      </div>}
      {aba===2&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Registrar Rendimento</div>
          <Inp label="Descrição" value={rDesc} onChange={setRDesc} placeholder="Ex: Dividendos FII HGLG11"/>
          <Inp label="Valor (R$)" value={rVal} onChange={setRVal} placeholder="0,00"/>
          <Sel label="Tipo" value={rTipo} onChange={setRTipo} options={[{v:"dividendos",l:"Dividendos"},{v:"juros",l:"Juros / CDB / Tesouro"},{v:"aluguel",l:"Aluguel de imóvel"},{v:"renda_passiva",l:"Renda passiva"},{v:"bonus",l:"Bônus / Comissão"},{v:"outro",l:"Outro"}]}/>
          <Inp label="Data (em branco = hoje)" value={rData} onChange={setRData} type="date"/>
          <Btn onClick={addRend}>Registrar</Btn>
        </Card>
        <div style={{fontSize:12,color:CORES.textoSuave,marginBottom:12,background:CORES.cardClaro,borderRadius:8,padding:"8px 12px",borderLeft:`3px solid ${CORES.verde}`}}>Total de rendimentos: <strong style={{color:CORES.verde}}>{fmt(totalRend)}</strong></div>
        {rendimentos.length===0&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhum rendimento registrado ainda.</div>}
        {[...rendimentos].reverse().map(r=>(<Card key={r.id} style={{padding:"10px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:13,fontWeight:600}}>{r.descricao}</div><div style={{fontSize:11,color:CORES.textoSuave}}>{r.data} · {r.tipo}</div></div>
            <div style={{fontWeight:700,color:CORES.verde}}>+{fmt(r.valor)}</div>
          </div>
          <AcoesCard lista="rendimentos" item={r}/>
        </Card>))}
      </div>}
      {aba===3&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Registrar Investimento</div>
          <Inp label="Descrição" value={iDesc} onChange={setIDesc} placeholder="Ex: Tesouro Selic 2029"/>
          <Inp label="Valor aportado (R$)" value={iVal} onChange={setIVal} placeholder="0,00"/>
          <Sel label="Tipo" value={iTipo} onChange={setITipo} options={[{v:"renda_fixa",l:"Renda Fixa (CDB, Tesouro, LCI...)"},{v:"renda_variavel",l:"Renda Variável (Ações, FIIs, ETFs...)"},{v:"cripto",l:"Criptoativos"},{v:"previdencia",l:"Previdência Privada"},{v:"outro",l:"Outro"}]}/>
          <Inp label="Data (em branco = hoje)" value={iData} onChange={setIData} type="date"/>
          <Btn onClick={addInv}>Registrar Aporte</Btn>
        </Card>
        <div style={{fontSize:12,color:CORES.textoSuave,marginBottom:12,background:CORES.cardClaro,borderRadius:8,padding:"8px 12px",borderLeft:`3px solid ${CORES.azul}`}}>Total investido: <strong style={{color:CORES.azul}}>{fmt(inv)}</strong></div>
        {movs.filter(m=>m.tipo==="investimento").length===0&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhum investimento registrado ainda.</div>}
        {[...movs.filter(m=>m.tipo==="investimento")].reverse().map(m=>(<Card key={m.id} style={{padding:"10px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:13,fontWeight:600}}>{m.descricao}</div><div style={{fontSize:11,color:CORES.textoSuave}}>{m.data} · {m.categoria}</div></div>
            <div style={{fontWeight:700,color:CORES.azul}}>{fmt(m.valor)}</div>
          </div>
          <AcoesCard lista="movs" item={m}/>
        </Card>))}
      </div>}
      {aba===4&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Registrar Emoção</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>{["positiva","negativa"].map(t=>(<button key={t} onClick={()=>setETipo(t)} style={{flex:1,padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",background:eTipo===t?(t==="positiva"?CORES.verde:CORES.vermelho):"transparent",color:eTipo===t?CORES.marsala:(t==="positiva"?CORES.verde:CORES.vermelho),border:`2px solid ${t==="positiva"?CORES.verde:CORES.vermelho}`}}>{t==="positiva"?"😊 Positiva":"😟 Negativa"}</button>))}</div>
          <Sel label="Emoção" value={eNome} onChange={setENome} options={[{v:"",l:"— Selecione —"},...(eTipo==="positiva"?EMOCOES_POSITIVAS:EMOCOES_NEGATIVAS).map(e=>({v:e,l:e})),{v:"outra",l:"Outra"}]}/>
          <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,color:CORES.dourado,marginBottom:4,fontWeight:600}}>Intensidade: {eInt}/5</label><input type="range" min="1" max="5" value={eInt} onChange={e=>setEInt(e.target.value)} style={{width:"100%",accentColor:CORES.dourado}}/></div>
          <Inp label="Contexto" value={eCont} onChange={setECont} placeholder="O que aconteceu quando sentiu isso?"/>
          <Inp label="Data (em branco = hoje)" value={eData} onChange={setEData} type="date"/>
          <Btn onClick={addEmo}>Registrar</Btn>
        </Card>
        {emocoes.length===0&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhuma emoção registrada ainda.</div>}
        {[...emocoes].reverse().map(e=>(<Card key={e.id} style={{padding:"10px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div><div style={{fontWeight:700,color:e.tipo==="positiva"?CORES.verde:CORES.vermelho}}>{e.nome}</div><div style={{fontSize:11,color:CORES.textoSuave}}>{e.contexto||"—"} · {e.data}</div></div>
            <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(i=><span key={i} style={{fontSize:13,opacity:i<=e.intensidade?1:0.2}}>⬛</span>)}</div>
          </div>
          <AcoesCard lista="emocoes" item={e}/>
        </Card>))}
      </div>}
      {aba===5&&<div>
        <Card><div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Adicionar da Base</div><Sel label="Selecione" value={cSel} onChange={setCSel} options={[{v:"",l:"— Selecione —"},...CRENCAS_BASE.map(c=>({v:String(c.id),l:`[${c.categoria}] ${c.crenca}`}))]}/><Btn onClick={addCrencaPre}>Adicionar</Btn></Card>
        <Card><div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Crença Personalizada</div><Inp label="Crença" value={cPers} onChange={setCPers} placeholder="Descreva a crença..."/><Inp label="Ressignificação" value={rPers} onChange={setRPers} placeholder="Frase de repadronização..."/><Btn onClick={addCrencaPers} cor={CORES.marsalaClaro} style={{color:CORES.dourado}}>Adicionar</Btn></Card>
        {crencas.length===0&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhuma crença mapeada ainda.</div>}
        {crencas.map(c=>(<Card key={c.id}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{flex:1,fontWeight:700,fontSize:13,color:c.status==="ressignificada"?CORES.verde:CORES.vermelho}}>{c.crenca}</div><Badge cor={c.status==="ressignificada"?CORES.verde:CORES.vermelho}>{c.status==="ressignificada"?"Ressignificada":"Ativa"}</Badge></div>
          <div style={{fontSize:12,color:CORES.textoSuave,background:CORES.cardClaro,borderRadius:8,padding:"8px 10px",marginBottom:8,borderLeft:`3px solid ${CORES.dourado}`}}><span style={{color:CORES.dourado,fontWeight:600}}>Ressignificação: </span>{c.ressig||"—"}</div>
          {isMentora&&<div style={{marginBottom:8}}><label style={{fontSize:11,color:CORES.dourado,fontWeight:600,display:"block",marginBottom:4}}>Nota da Mentora:</label><textarea value={c.notaMentora} onChange={e=>notaMentora(c.id,e.target.value)} rows={2} placeholder="Observação clínica..." style={{width:"100%",background:CORES.cardClaro,border:`1px solid ${CORES.marsalaClaro}`,borderRadius:8,padding:"6px 10px",color:CORES.texto,fontSize:12,boxSizing:"border-box",resize:"vertical"}}/></div>}
          {!isMentora&&c.notaMentora&&<div style={{fontSize:12,color:CORES.dourado,background:CORES.cardClaro,borderRadius:8,padding:"6px 10px",marginBottom:8,borderLeft:`3px solid ${CORES.marsala}`}}><span style={{fontWeight:600}}>Feedback da mentora: </span>{c.notaMentora}</div>}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Btn sm cor={c.status==="ressignificada"?CORES.verde:CORES.dourado} outline onClick={()=>toggleCrencaStatus(c.id)}>{c.status==="ressignificada"?"Reativar":"Marcar Ressignificada"}</Btn>
            <Btn sm cor={CORES.dourado} outline onClick={()=>setEditando({lista:"crencas",item:{...c}})}>✏ Editar</Btn>
            <Btn sm cor={CORES.vermelho} outline onClick={()=>setConfirmarExcluir({lista:"crencas",id:c.id})}>🗑 Excluir</Btn>
          </div>
        </Card>))}
      </div>}
      {aba===6&&<div>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:CORES.dourado,marginBottom:12}}>Nova Meta</div>
          <Inp label="Título" value={metaTit} onChange={setMetaTit} placeholder="Ex: Reserva de emergência"/>
          <Sel label="Tipo" value={metaTipo} onChange={setMetaTipo} options={[{v:"financeira",l:"Financeira"},{v:"comportamental",l:"Comportamental"},{v:"habito",l:"Hábito"}]}/>
          <div style={{display:"flex",gap:8}}><div style={{flex:1}}><Inp label="Total da meta" value={metaVal} onChange={setMetaVal} placeholder="100"/></div><div style={{flex:1}}><Inp label="Progresso atual" value={metaAt} onChange={setMetaAt} placeholder="0"/></div></div>
          <Inp label="Prazo" value={metaPrazo} onChange={setMetaPrazo} type="date"/>
          <Btn onClick={addMeta}>Criar Meta</Btn>
        </Card>
        {metas.length===0&&<div style={{color:CORES.textoSuave,textAlign:"center",padding:20,fontSize:13}}>Nenhuma meta cadastrada ainda.</div>}
        {metas.map(m=>(<Card key={m.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontWeight:700}}>{m.titulo}</div><Badge cor={m.tipo==="financeira"?CORES.dourado:m.tipo==="comportamental"?CORES.azul:CORES.verde}>{m.tipo}</Badge></div>
          {m.prazo&&<div style={{fontSize:11,color:CORES.textoSuave,marginBottom:4}}>Prazo: {new Date(m.prazo+"T12:00:00").toLocaleDateString("pt-BR")}</div>}
          <Barra atual={m.atual} meta={m.meta}/>
          <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}><span style={{fontSize:12,color:CORES.textoSuave}}>Atualizar:</span><input type="number" value={m.atual} onChange={e=>updMeta(m.id,"atual",e.target.value)} style={{width:80,background:CORES.cardClaro,border:`1px solid ${CORES.marsalaClaro}`,borderRadius:6,padding:"4px 8px",color:CORES.texto,fontSize:13}}/><span style={{fontSize:12,color:CORES.textoSuave}}>de {m.meta}</span></div>
          <AcoesCard lista="metas" item={m}/>
        </Card>))}
      </div>}
      {aba===7&&<Card>
        <div style={{fontSize:15,fontWeight:800,color:CORES.dourado,marginBottom:2}}>Relatório — {d.nome}</div>
        <div style={{fontSize:11,color:CORES.textoSuave,marginBottom:14}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
        <div style={{fontSize:13,fontWeight:700,color:CORES.dourado,marginBottom:8}}>💰 Resumo Financeiro</div>
        {[{l:"Entradas",v:fmt(entradas),c:CORES.verde},{l:"Rendimentos",v:fmt(totalRend),c:CORES.verde},{l:"Saídas",v:fmt(saidas),c:CORES.vermelho},{l:"Total Investido",v:fmt(inv),c:CORES.azul},{l:"Saldo Líquido",v:fmt(saldo),c:saldo>=0?CORES.verde:CORES.vermelho}].map(x=>(<div key={x.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${CORES.marsalaClaro}33`}}><span style={{fontSize:13,color:CORES.textoSuave}}>{x.l}</span><span style={{fontSize:13,fontWeight:700,color:x.c}}>{x.v}</span></div>))}
        <div style={{fontSize:13,fontWeight:700,color:CORES.dourado,marginTop:16,marginBottom:8}}>📅 Agendamentos</div>
        <div style={{fontSize:12,color:CORES.textoSuave}}>Pendentes: {contas.filter(c=>c.status!=="executada"&&statusConta(c.vencimento)==="pendente").length} · <span style={{color:CORES.vermelho}}>Vencidas: {contas.filter(c=>c.status!=="executada"&&statusConta(c.vencimento)==="vencida").length}</span> · <span style={{color:CORES.verde}}>Executadas: {contas.filter(c=>c.status==="executada").length}</span></div>
        <div style={{fontSize:13,fontWeight:700,color:CORES.dourado,marginTop:16,marginBottom:8}}>😊 Mapa Emocional</div>
        {emocoes.length===0?<div style={{color:CORES.textoSuave,fontSize:12}}>Nenhuma emoção registrada.</div>:<div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>{Array.from(new Set(emocoes.map(e=>e.nome))).map(nome=>{const qtd=emocoes.filter(e=>e.nome===nome).length;const pos=emocoes.find(e=>e.nome===nome)?.tipo==="positiva";return <span key={nome} style={{background:(pos?CORES.verde:CORES.vermelho)+"22",color:pos?CORES.verde:CORES.vermelho,border:`1px solid ${pos?CORES.verde:CORES.vermelho}44`,borderRadius:20,padding:"3px 10px",fontSize:12}}>{nome} ({qtd})</span>;})}</div><div style={{fontSize:12,color:CORES.textoSuave}}>Positivas: {emocoes.filter(e=>e.tipo==="positiva").length} · Negativas: {emocoes.filter(e=>e.tipo==="negativa").length}</div></div>}
        <div style={{fontSize:13,fontWeight:700,color:CORES.dourado,marginTop:16,marginBottom:8}}>🧠 Crenças</div>
        {crencas.length===0?<div style={{color:CORES.textoSuave,fontSize:12}}>Nenhuma crença mapeada.</div>:<div><div style={{fontSize:12,color:CORES.textoSuave,marginBottom:6}}>Total: {crencas.length} · Ativas: {crencas.filter(c=>c.status==="ativa").length} · Ressignificadas: {crencas.filter(c=>c.status==="ressignificada").length}</div>{crencas.map(c=>(<div key={c.id} style={{padding:"6px 10px",borderLeft:`3px solid ${c.status==="ressignificada"?CORES.verde:CORES.vermelho}`,marginBottom:6,background:CORES.cardClaro,borderRadius:"0 6px 6px 0"}}><div style={{fontSize:12,fontWeight:600}}>{c.crenca}</div><div style={{fontSize:11,color:CORES.textoSuave}}>{c.status==="ressignificada"?"✅ Ressignificada":"⚠️ Em processo"}</div></div>))}</div>}
        <div style={{fontSize:13,fontWeight:700,color:CORES.dourado,marginTop:16,marginBottom:8}}>🎯 Metas</div>
        {metas.length===0?<div style={{color:CORES.textoSuave,fontSize:12}}>Nenhuma meta cadastrada.</div>:metas.map(m=>(<div key={m.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600}}>{m.titulo}</span><Badge cor={CORES.dourado}>{Math.min(100,Math.round((m.atual/m.meta)*100))}%</Badge></div><Barra atual={m.atual} meta={m.meta}/></div>))}
      </Card>}
      {aba===8&&<Card style={{padding:0,overflow:"hidden"}}>
        <div style={{background:CORES.marsala,padding:"10px 16px"}}><div style={{fontWeight:700,color:CORES.dourado,fontSize:13}}>Canal de Comunicação</div><div style={{fontSize:11,color:CORES.douradoClaro}}>Enviando como: {isMentora?"Wélica Amaro (Mentora)":d.nome}</div></div>
        <div style={{height:320,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
          {(d.msgs||[]).map(m=>(<div key={m.id} style={{display:"flex",justifyContent:m.de==="mentora"?"flex-end":"flex-start"}}><div style={{maxWidth:"78%",padding:"8px 12px",borderRadius:m.de==="mentora"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.de==="mentora"?`linear-gradient(135deg,${CORES.marsala},${CORES.marsalaClaro})`:CORES.cardClaro,border:`1px solid ${m.de==="mentora"?CORES.dourado+"55":CORES.marsalaClaro}`}}><div style={{fontSize:13}}>{m.texto}</div><div style={{fontSize:10,color:CORES.textoSuave,marginTop:4,textAlign:"right"}}>{m.hora} · {m.de==="mentora"?"Wélica Amaro":d.nome}</div></div></div>))}
          <div ref={msgFim}/>
        </div>
        <div style={{padding:"10px 12px",borderTop:`1px solid ${CORES.marsalaClaro}55`,display:"flex",gap:8}}>
          <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviar()} placeholder="Digite sua mensagem..." style={{flex:1,background:CORES.cardClaro,border:`1px solid ${CORES.marsalaClaro}`,borderRadius:20,padding:"8px 14px",color:CORES.texto,fontSize:13,outline:"none"}}/>
          <button onClick={enviar} style={{background:CORES.dourado,border:"none",borderRadius:20,padding:"8px 16px",color:CORES.marsala,fontWeight:700,cursor:"pointer"}}>Enviar</button>
        </div>
      </Card>}
    </div>
    <div style={{textAlign:"center",padding:14,fontSize:11,color:CORES.textoSuave,borderTop:`1px solid ${CORES.marsalaClaro}33`}}>Conduta Rica® · Wélica Amaro — CRP 09/12387</div>
  </div>);
}

export default function App(){
  const [sessao,setSessao]=useState(null);
  const [clienteAtivo,setClienteAtivo]=useState(null);
  useEffect(()=>{ if(sessao?.tipo==="cliente") setClienteAtivo(sessao.dados); },[sessao]);
  async function handleSalvarCliente(atualizado){ await sbPatch("clientes",atualizado.id,atualizado); setClienteAtivo(atualizado); }
  if(!sessao)return <Login onLogin={setSessao}/>;
  if(sessao.tipo==="mentora")return <PainelMentora onLogout={()=>setSessao(null)}/>;
  if(sessao.tipo==="cliente"&&clienteAtivo)return <PainelDados dados={clienteAtivo} isMentora={false} onSalvar={handleSalvarCliente} onVoltar={()=>setSessao(null)} onLogout={()=>setSessao(null)}/>;
  return <Loader/>;
}
