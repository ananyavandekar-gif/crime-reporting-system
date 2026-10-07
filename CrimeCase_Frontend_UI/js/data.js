const DB = {
  currentUser: {name:"Aarav Sharma", role:"citizen"},
  reports: [
    {id:"CR-2026-1048", type:"Cybercrime", location:"Pune, Maharashtra", date:"28 Sep 2026", status:"Under Review", officer:"—", priority:"High", description:"Suspicious online transaction and account access."},
    {id:"CR-2026-1031", type:"Theft", location:"Pimpri, Maharashtra", date:"24 Sep 2026", status:"Investigation", officer:"Inspector R. Patil", priority:"Medium", description:"Missing laptop reported from residence."},
    {id:"CR-2026-0987", type:"Fraud", location:"Pune, Maharashtra", date:"15 Sep 2026", status:"Resolved", officer:"SI N. Joshi", priority:"Medium", description:"Online payment fraud complaint."},
    {id:"CR-2026-0964", type:"Assault", location:"Wakad, Maharashtra", date:"11 Sep 2026", status:"Closed", officer:"Inspector A. More", priority:"High", description:"Physical altercation reported."}
  ],
  cases: [
    {id:"CS-2401", report:"CR-2026-1048", type:"Cybercrime", location:"Pune", complainant:"Aarav Sharma", officer:"Inspector R. Patil", status:"Under Review", priority:"High", updated:"28 Sep 2026"},
    {id:"CS-2394", report:"CR-2026-1031", type:"Theft", location:"Pimpri", complainant:"Aarav Sharma", officer:"Inspector R. Patil", status:"Investigation", priority:"Medium", updated:"27 Sep 2026"},
    {id:"CS-2388", report:"CR-2026-0987", type:"Fraud", location:"Pune", complainant:"Meera Kulkarni", officer:"SI N. Joshi", status:"Resolved", priority:"Medium", updated:"22 Sep 2026"},
    {id:"CS-2377", report:"CR-2026-0964", type:"Assault", location:"Wakad", complainant:"Rahul Shah", officer:"Inspector A. More", status:"Closed", priority:"High", updated:"19 Sep 2026"},
    {id:"CS-2362", report:"CR-2026-0920", type:"Theft", location:"Akurdi", complainant:"Neha Desai", officer:"SI N. Joshi", status:"Investigation", priority:"Low", updated:"18 Sep 2026"}
  ],
  officers: [
    {name:"Inspector R. Patil", badge:"P-1042", station:"Pimpri Police Station", active:18, closed:42, status:"Active"},
    {name:"SI N. Joshi", badge:"P-1128", station:"Pune Cyber Cell", active:11, closed:37, status:"Active"},
    {name:"Inspector A. More", badge:"P-0977", station:"Wakad Police Station", active:9, closed:51, status:"Active"},
    {name:"SI S. Kulkarni", badge:"P-1191", station:"Akurdi Police Station", active:14, closed:29, status:"On Leave"}
  ],
  evidence: [
    {id:"EV-501", case:"CS-2401", name:"Transaction Screenshot", type:"Image", uploaded:"28 Sep 2026", by:"Aarav Sharma"},
    {id:"EV-498", case:"CS-2394", name:"CCTV Footage", type:"Video", uploaded:"25 Sep 2026", by:"Inspector R. Patil"},
    {id:"EV-493", case:"CS-2388", name:"Bank Statement", type:"PDF", uploaded:"20 Sep 2026", by:"SI N. Joshi"}
  ],
  locations:["Pune","Pimpri","Wakad","Akurdi","Chinchwad"],
  crimeTypes:["Theft","Fraud","Cybercrime","Assault","Burglary","Missing Person","Other"]
};
