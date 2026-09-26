const API_BASE = "/api/auth";
function q(id){ return document.getElementById(id); }
async function post(path, body){
  const res = await fetch(API_BASE + path, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
window.$auth = { qs, post };
