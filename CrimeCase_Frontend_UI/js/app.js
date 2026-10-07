const app=document.getElementById("app");
let state={role:localStorage.getItem("role")||null,page:"dashboard",selectedCase:null};

const icons={dashboard:"▦",report:"＋",cases:"▤",track:"◉",evidence:"▧",officers:"♙",citizens:"♙",analytics:"◒",locations:"⌖",settings:"⚙",logout:"↪"};

function statusClass(s){return s.toLowerCase().replaceAll(" ","-").replace("under-review","review")}
function statusBadge(s){return `<span class="status ${statusClass(s)}">${s}</span>`}
function priority(p){return `<span class="priority-${p.toLowerCase()}">${p}</span>`}

function login(){
  app.innerHTML=`<div class="login"><div class="login-box">
    <div class="login-logo"><div class="brand"><div class="brand-badge">⚖</div> CrimeCase</div></div>
    <h1>Crime Reporting & Case Management</h1>
    <p class="subtitle">Securely report, track and manage crime cases.</p>
    <div class="field"><label>Email</label><input id="email" value="demo@crimecase.local"></div>
    <div class="field" style="margin-top:12px"><label>Password</label><input type="password" value="password"></div>
    <button class="btn primary" style="width:100%;margin-top:16px" onclick="loginAs('citizen')">Sign in</button>
    <div class="demo-roles">
      <button class="demo-role" onclick="loginAs('citizen')"><strong>Citizen Portal</strong><span>Report crimes and track your cases</span></button>
      <button class="demo-role" onclick="loginAs('officer')"><strong>Police Officer</strong><span>Review assignments and investigations</span></button>
      <button class="demo-role" onclick="loginAs('admin')"><strong>Administrator</strong><span>Manage users, cases and system data</span></button>
    </div>
  </div></div>`;
}
function loginAs(role){state.role=role;localStorage.setItem("role",role);state.page="dashboard";render()}
function logout(){localStorage.removeItem("role");state.role=null;login()}

function navItems(){
  if(state.role==="citizen") return [
    ["dashboard","Dashboard"],["report","Report Crime"],["track","My Reports"],["cases","Track Case"],["evidence","Evidence"],["settings","Profile"]
  ];
  if(state.role==="officer") return [
    ["dashboard","Dashboard"],["cases","Assigned Cases"],["report","Crime Reports"],["track","Investigations"],["evidence","Evidence"],["settings","Profile"]
  ];
  return [
    ["dashboard","Dashboard"],["report","Crime Reports"],["cases","All Cases"],["officers","Officers"],["citizens","Citizens"],["evidence","Evidence"],["locations","Locations"],["analytics","Analytics"],["settings","Settings"]
  ];
}

function shell(content){
  const roleLabel={citizen:"Citizen",officer:"Police Officer",admin:"Administrator"}[state.role];
  const initials=state.role==="citizen"?"AS":state.role==="officer"?"RP":"AD";
  app.innerHTML=`<header class="topbar"><div class="brand"><div class="brand-badge">⚖</div> CrimeCase</div><div class="top-actions"><span class="role-pill">${roleLabel}</span><div class="avatar">${initials}</div></div></header>
  <div class="layout"><aside class="sidebar"><div class="nav-title">Navigation</div><nav class="nav">
  ${navItems().map(([p,label])=>`<button class="${state.page===p?"active":""}" onclick="go('${p}')"><b>${icons[p]||"•"}</b><span>${label}</span></button>`).join("")}
  <div style="height:14px"></div><button onclick="logout"><b>${icons.logout}</b><span>Logout</span></button></nav></aside>
  <main class="main">${content}<div class="footer-note">CrimeCase UI prototype • Frontend demo with sample data</div></main></div>`;
}
function go(page){state.page=page;render()}

function pageHead(eyebrow,title,sub,actions=""){return `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><div class="page-title">${title}</div><div class="subtitle">${sub}</div></div><div class="actions">${actions}</div></div>`}

function stat(icon,num,label,trend=""){return `<div class="card stat"><div class="stat-icon">${icon}</div><h3>${num}</h3><p>${label}</p>${trend?`<div class="trend">${trend}</div>`:""}</div>`}

function citizenDashboard(){
 return pageHead("Citizen Portal","Good evening, Aarav","Manage your crime reports and follow case progress.",
 `<button class="btn primary" onclick="go('report')">＋ Report a Crime</button>`) +
 `<div class="grid stats">${stat("▤","4","My Reports","+1 this month")}${stat("◉","2","Active Cases")}${stat("✓","1","Resolved Cases")}${stat("⏱","1","Awaiting Review")}</div>
 <div class="grid two" style="margin-top:16px"><div class="card"><div class="card-head"><h3 class="section-title">Recent Reports</h3><button class="btn" onclick="go('track')">View all</button></div>${reportTable(true)}</div>
 <div class="card"><h3 class="section-title">Case Status</h3><div class="timeline">${timeline()}</div></div></div>`;
}
function officerDashboard(){
 return pageHead("Police Officer","Investigation Dashboard","Overview of assigned cases, reports and evidence.",
 `<button class="btn dark" onclick="go('cases')">View Assigned Cases</button>`) +
 `<div class="grid stats">${stat("▤","18","Active Cases","+3 this week")}${stat("⚑","7","Pending Review")}${stat("◉","11","Under Investigation")}${stat("✓","42","Closed Cases","+6 this month")}</div>
 <div class="grid two" style="margin-top:16px"><div class="card"><div class="card-head"><h3 class="section-title">Priority Cases</h3><button class="btn" onclick="go('cases')">All cases</button></div>${caseTable(true)}</div>
 <div class="card"><h3 class="section-title">Today's Tasks</h3><div class="alert warn">3 reports need initial review.</div><div class="alert info">2 evidence items were uploaded today.</div><div class="alert success">Case CS-2388 was marked resolved.</div></div></div>`;
}
function adminDashboard(){
 return pageHead("Administration","System Dashboard","Monitor reports, cases, officers and operational activity.",
 `<button class="btn primary" onclick="go('analytics')">View Analytics</button>`) +
 `<div class="grid stats">${stat("▤","128","Total Reports","+12% this month")}${stat("◉","24","Pending Cases")}${stat("⚑","46","Investigations")}${stat("✓","58","Resolved / Closed")}</div>
 <div class="grid two" style="margin-top:16px"><div class="card"><div class="card-head"><h3 class="section-title">Recent Crime Reports</h3><button class="btn" onclick="go('report')">Manage</button></div>${reportTable(false)}</div>
 <div class="card"><h3 class="section-title">Case Distribution</h3>${bar("Theft",32)}${bar("Fraud",24)}${bar("Cybercrime",19)}${bar("Assault",14)}${bar("Other",11)}</div></div>`;
}
function bar(label,val){return `<div class="kpi"><span>${label}</span><strong>${val}%</strong></div><div class="bar"><span style="width:${val}%"></span></div>`}

function reportTable(onlyMine){
 const rows=DB.reports.filter(r=>!onlyMine||true).slice(0,4);
 return `<div class="table-wrap"><table class="table"><thead><tr><th>Report ID</th><th>Crime</th><th>Location</th><th>Status</th><th>Priority</th></tr></thead><tbody>${rows.map(r=>`<tr onclick="openReport('${r.id}')" style="cursor:pointer"><td><b>${r.id}</b></td><td>${r.type}</td><td>${r.location}</td><td>${statusBadge(r.status)}</td><td>${priority(r.priority)}</td></tr>`).join("")}</tbody></table></div>`;
}
function caseTable(short=false){
 const rows=short?DB.cases.slice(0,4):DB.cases;
 return `<div class="table-wrap"><table class="table"><thead><tr><th>Case</th><th>Type</th><th>Officer</th><th>Status</th><th>Priority</th></tr></thead><tbody>${rows.map(c=>`<tr onclick="openCase('${c.id}')" style="cursor:pointer"><td><b>${c.id}</b><br><small>${c.updated}</small></td><td>${c.type}</td><td>${c.officer}</td><td>${statusBadge(c.status)}</td><td>${priority(c.priority)}</td></tr>`).join("")}</tbody></table></div>`;
}
function timeline(){
 return [{t:"Report submitted",d:"28 Sep 2026 • 10:42 AM",x:"Your cybercrime report was received."},{t:"Initial review",d:"28 Sep 2026 • 12:10 PM",x:"Report assigned for verification."},{t:"Officer assigned",d:"Pending",x:"An investigating officer will be assigned."}].map((a,i)=>`<div class="timeline-item"><div><div class="dot"></div></div><div class="timeline-content"><h4>${a.t}</h4><p>${a.x}</p><time>${a.d}</time></div></div>`).join("");
}

function reportForm(){
 return pageHead("Citizen Services","Report a Crime","Provide accurate information. Required fields are marked with *.",
 `<button class="btn" onclick="go('dashboard')">Cancel</button>`) +
 `<div class="card"><div class="alert info">Your report will be reviewed by an authorized officer. Keep your report ID for tracking.</div>
 <div class="form-grid">
 <div class="field"><label>Crime Type *</label><select id="crimeType">${DB.crimeTypes.map(x=>`<option>${x}</option>`).join("")}</select></div>
 <div class="field"><label>Incident Date *</label><input type="date" value="2026-09-29"></div>
 <div class="field"><label>Location *</label><select>${DB.locations.map(x=>`<option>${x}</option>`).join("")}</select></div>
 <div class="field"><label>Specific Location / Address</label><input placeholder="Street, landmark or area"></div>
 <div class="field full"><label>Incident Description *</label><textarea placeholder="Describe what happened, when it happened and any relevant details..."></textarea></div>
 <div class="field"><label>Suspect / Person Details</label><input placeholder="Optional description"></div>
 <div class="field"><label>Contact Preference</label><select><option>Phone</option><option>Email</option><option>Either</option></select></div>
 <div class="field full"><label>Evidence / Supporting Files</label><input type="file" multiple></div>
 <div class="field full"><label><input type="checkbox" style="width:auto"> I confirm that the information provided is accurate to the best of my knowledge.</label></div>
 <div class="full form-actions"><button class="btn" onclick="go('dashboard')">Save Draft</button><button class="btn primary" onclick="submitReport()">Submit Report</button></div>
 </div></div>`;
}
function submitReport(){alert("Report submitted successfully. Your report ID is CR-2026-1052.");go("track")}

function reportsPage(){
 return pageHead(state.role==="admin"?"Crime Reports":"Reports","Crime Reports","Search, filter and review submitted reports.",
 `<button class="btn primary" onclick="go('report')">＋ New Report</button>`) +
 `<div class="card"><div class="searchbar"><input placeholder="Search by report ID, type, location or keyword..." oninput="filterRows(this.value)"><select style="max-width:170px"><option>All Statuses</option><option>Under Review</option><option>Investigation</option><option>Resolved</option></select></div><div id="reportRows">${reportTable(false)}</div></div>`;
}
function filterRows(q){q=q.toLowerCase();document.querySelectorAll("#reportRows tbody tr").forEach(tr=>tr.style.display=tr.innerText.toLowerCase().includes(q)?"":"none")}

function casesPage(){
 return pageHead(state.role==="officer"?"Assigned Cases":"Case Management","Cases","Review case assignments, status, priority and investigation progress.",
 `<button class="btn" onclick="go('analytics')">Analytics</button>`) +
 `<div class="card"><div class="searchbar"><input placeholder="Search cases..."><select style="max-width:180px"><option>All statuses</option><option>Under Review</option><option>Investigation</option><option>Resolved</option></select></div>${caseTable()}</div>`;
}
function trackPage(){
 return pageHead("Case Tracking","Track Your Cases","Follow the latest status and updates for submitted reports.") +
 `<div class="grid two"><div class="card">${caseTable()}</div><div class="card"><h3 class="section-title">Selected Case Timeline</h3>${timeline()}</div></div>`;
}

function evidencePage(){
 return pageHead("Evidence Management","Evidence","Upload, review and organize supporting evidence linked to cases.",
 `<button class="btn primary" onclick="document.getElementById('evfile').click()">＋ Upload Evidence</button>`) +
 `<input id="evfile" type="file" multiple hidden onchange="alert('Evidence selected. Connect this control to your backend upload API.')">
 <div class="card"><div class="searchbar"><input placeholder="Search evidence by ID, case or filename..."><select style="max-width:160px"><option>All Types</option><option>Image</option><option>Video</option><option>PDF</option></select></div>
 <div class="table-wrap"><table class="table"><thead><tr><th>Evidence ID</th><th>Case</th><th>File</th><th>Type</th><th>Uploaded</th><th>Uploaded By</th><th>Action</th></tr></thead><tbody>${DB.evidence.map(e=>`<tr><td><b>${e.id}</b></td><td>${e.case}</td><td>${e.name}</td><td>${e.type}</td><td>${e.uploaded}</td><td>${e.by}</td><td><button class="btn" onclick="alert('Preview placeholder for ${e.name}')">View</button></td></tr>`).join("")}</tbody></table></div></div>`;
}

function officersPage(){
 return pageHead("Administration","Police Officers","Manage officer profiles, assignments and workload.",
 `<button class="btn primary" onclick="alert('Add Officer form can be connected to your backend.')">＋ Add Officer</button>`) +
 `<div class="grid three">${DB.officers.map(o=>`<div class="card"><div style="display:flex;justify-content:space-between"><div class="avatar">${o.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div>${o.status==="Active"?statusBadge("Resolved"):statusBadge("Closed")}</div><h3 style="margin:14px 0 4px">${o.name}</h3><p class="subtitle">${o.badge} • ${o.station}</p><div class="kpi"><span>Active cases</span><strong>${o.active}</strong></div><div class="kpi"><span>Closed cases</span><strong>${o.closed}</strong></div><button class="btn" style="width:100%" onclick="alert('Officer details: ${o.name}')">View Profile</button></div>`).join("")}</div>`;
}
function citizensPage(){
 return pageHead("Administration","Citizens","Registered citizens and their submitted reports.",
 `<button class="btn" onclick="alert('User export placeholder')">Export</button>`) +
 `<div class="card"><div class="searchbar"><input placeholder="Search citizen..."></div><div class="table-wrap"><table class="table"><thead><tr><th>Citizen</th><th>Contact</th><th>Reports</th><th>Active Cases</th><th>Last Activity</th></tr></thead><tbody>
 <tr><td><b>Aarav Sharma</b></td><td>aarav@example.com</td><td>4</td><td>2</td><td>28 Sep 2026</td></tr><tr><td><b>Meera Kulkarni</b></td><td>meera@example.com</td><td>2</td><td>0</td><td>22 Sep 2026</td></tr><tr><td><b>Rahul Shah</b></td><td>rahul@example.com</td><td>3</td><td>0</td><td>19 Sep 2026</td></tr></tbody></table></div></div>`;
}
function locationsPage(){
 return pageHead("Administration","Locations","Manage locations used in crime reports and analysis.",
 `<button class="btn primary" onclick="alert('Add location placeholder')">＋ Add Location</button>`) +
 `<div class="grid three">${DB.locations.map((x,i)=>`<div class="card"><div style="font-size:28px">⌖</div><h3>${x}</h3><p class="subtitle">${18+i*7} reports recorded</p><button class="btn">View Reports</button></div>`).join("")}</div>`;
}
function analyticsPage(){
 return pageHead("Analytics","Crime Analytics","High-level reporting for operational and database insights.") +
 `<div class="grid three">${stat("▤","128","Reports this period","+12%")}${stat("⌖","5","Active locations")}${stat("👮","4","Officers")}</div>
 <div class="grid two" style="margin-top:16px"><div class="card"><h3 class="section-title">Reports by Crime Type</h3>${bar("Theft",32)}${bar("Fraud",24)}${bar("Cybercrime",19)}${bar("Assault",14)}${bar("Other",11)}</div>
 <div class="card"><h3 class="section-title">Case Status</h3>${bar("Pending / Review",19)}${bar("Investigation",36)}${bar("Resolved",29)}${bar("Closed",16)}</div></div>
 <div class="card" style="margin-top:16px"><h3 class="section-title">Monthly Activity</h3><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;align-items:end;height:190px">${[42,55,48,71,63,82].map((v,i)=>`<div style="text-align:center"><div style="height:${v*1.5}px;background:#2563eb;border-radius:7px 7px 0 0"></div><small style="display:block;margin-top:8px;color:#667085">${["Apr","May","Jun","Jul","Aug","Sep"][i]}</small></div>`).join("")}</div></div>`;
}
function settingsPage(){
 return pageHead("Account","Profile & Settings","Manage your account information and preferences.") +
 `<div class="grid two"><div class="card"><h3 class="section-title">Profile Information</h3><div class="form-grid"><div class="field"><label>Full Name</label><input value="${state.role==="citizen"?"Aarav Sharma":state.role==="officer"?"Inspector R. Patil":"System Administrator"}"></div><div class="field"><label>Email</label><input value="demo@crimecase.local"></div><div class="field"><label>Phone</label><input value="+91 98765 43210"></div><div class="field"><label>Role</label><input value="${state.role}" disabled></div></div><button class="btn primary" style="margin-top:16px" onclick="alert('Profile updated')">Save Changes</button></div>
 <div class="card"><h3 class="section-title">Security & Preferences</h3><div class="alert success">Two-factor authentication: Enabled</div><div class="kpi"><span>Email notifications</span><strong>ON</strong></div><div class="kpi"><span>Case status alerts</span><strong>ON</strong></div><div class="kpi"><span>Session timeout</span><strong>30 min</strong></div><button class="btn danger" onclick="logout()">Sign out</button></div></div>`;
}

function openCase(id){
 const c=DB.cases.find(x=>x.id===id);
 document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="modal"><div class="modal-box"><div class="modal-head"><div><div class="eyebrow">Case Details</div><div class="case-id">${c.id}</div></div><button class="close" onclick="document.getElementById('modal').remove()">×</button></div>
 <div class="case-header"><div><div class="meta"><span class="tag">${c.type}</span><span class="tag">${c.location}</span><span class="tag">${c.complainant}</span></div><p class="subtitle" style="margin-top:15px">Linked report: <b>${c.report}</b> • Last updated ${c.updated}</p></div><div>${statusBadge(c.status)}</div></div>
 <div class="grid two" style="margin-top:18px"><div><h3 class="section-title">Investigation Timeline</h3>${timeline()}</div><div><h3 class="section-title">Case Controls</h3><div class="field"><label>Status</label><select><option>${c.status}</option><option>Under Review</option><option>Investigation</option><option>Resolved</option><option>Closed</option></select></div><div class="field" style="margin-top:12px"><label>Assigned Officer</label><select>${DB.officers.map(o=>`<option ${o.name===c.officer?"selected":""}>${o.name}</option>`).join("")}</select></div><button class="btn primary" style="margin-top:14px;width:100%" onclick="alert('Case updated successfully')">Update Case</button></div></div></div></div>`);
}
function openReport(id){
 const r=DB.reports.find(x=>x.id===id);
 document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="modal"><div class="modal-box"><div class="modal-head"><div><div class="eyebrow">Crime Report</div><div class="case-id">${r.id}</div></div><button class="close" onclick="document.getElementById('modal').remove()">×</button></div>
 <div class="meta"><span class="tag">${r.type}</span><span class="tag">${r.location}</span><span class="tag">${r.date}</span><span class="tag">${r.officer}</span></div>
 <div class="card" style="box-shadow:none;margin-top:16px;background:#f8fafc"><b>Incident description</b><p class="subtitle">${r.description}</p></div>
 <div class="form-grid" style="margin-top:16px"><div class="field"><label>Status</label><select><option>${r.status}</option><option>Under Review</option><option>Investigation</option><option>Resolved</option><option>Closed</option></select></div><div class="field"><label>Priority</label><select><option>${r.priority}</option><option>High</option><option>Medium</option><option>Low</option></select></div></div>
 <div class="form-actions" style="margin-top:16px"><button class="btn primary" onclick="alert('Report updated')">Save Changes</button></div></div></div>`);
}

function render(){
 if(!state.role){login();return}
 let content="";
 if(state.page==="dashboard") content=state.role==="citizen"?citizenDashboard():state.role==="officer"?officerDashboard():adminDashboard();
 else if(state.page==="report") content=state.role==="citizen"?reportForm():reportsPage();
 else if(state.page==="track") content=trackPage();
 else if(state.page==="cases") content=casesPage();
 else if(state.page==="evidence") content=evidencePage();
 else if(state.page==="officers") content=officersPage();
 else if(state.page==="citizens") content=citizensPage();
 else if(state.page==="locations") content=locationsPage();
 else if(state.page==="analytics") content=analyticsPage();
 else content=settingsPage();
 shell(content);
}
render();
