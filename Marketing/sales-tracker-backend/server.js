const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const agentService = require("./agent-service");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "sales_tracker.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      message TEXT,
      source TEXT DEFAULT 'contact_form',
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS configuration (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      value TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      UNIQUE(category, value)
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      company_name TEXT,
      division TEXT,
      industry TEXT,
      address1 TEXT,
      address2 TEXT,
      city TEXT,
      province TEXT,
      postal_code TEXT,
      country TEXT,
      contact_person TEXT,
      title TEXT,
      email TEXT,
      telephone_h TEXT,
      telephone_w TEXT,
      telephone_c TEXT,
      fax TEXT,
      website TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      opportunity_no TEXT,
      problem_opportunity TEXT,
      source_of_opportunity TEXT,
      guestimated_value REAL DEFAULT 0,
      guestimated_timeline TEXT,
      guestimated_probability TEXT,
      planned_1st_meeting TEXT,
      outcome_of_1st_meeting TEXT,
      next_step TEXT,
      reason_no_next_step TEXT,
      sales_rep TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );

    CREATE TABLE IF NOT EXISTS qualifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      opportunity_id TEXT NOT NULL,
      qualification_meeting_date TEXT,
      outcome TEXT,
      solution TEXT,
      estimated_value REAL DEFAULT 0,
      estimated_timeline TEXT,
      estimated_probability TEXT,
      next_step TEXT,
      reason_no_opportunity TEXT,
      scheduled_proposal_delivery TEXT,
      sales_rep TEXT,
      inside_sales_rep TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
    );

    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      opportunity_id TEXT NOT NULL,
      proposal_delivery_date TEXT,
      proposed_offering TEXT,
      proposal_value REAL DEFAULT 0,
      proposal_probability TEXT,
      scheduled_gonogo_date TEXT,
      sales_rep TEXT,
      inside_sales_rep TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      opportunity_id TEXT NOT NULL,
      gonogo_date TEXT,
      deliverable TEXT,
      gonogo TEXT,
      sale_value REAL DEFAULT 0,
      scheduled_delivery_date TEXT,
      reason_value_variance TEXT,
      reason_no_sale TEXT,
      sales_rep TEXT,
      inside_sales_rep TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
    );

    CREATE TABLE IF NOT EXISTS status_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT,
      opportunity_id TEXT,
      stage TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function seedConfig() {
  const count = db.prepare("SELECT COUNT(*) as c FROM configuration").get();
  if (count.c > 0) return;

  const insert = db.prepare("INSERT OR IGNORE INTO configuration (category, value, sort_order) VALUES (?, ?, ?)");

  const configs = {
    Industry: ["Agriculture", "Communications", "Construction", "Electronic", "Financial Services", "Food", "Government", "Health", "Hospitality", "Manufacturing", "Retail"],
    "Source of Business": ["Ad Save Coupon Book", "Bay Observer", "BBB", "Billboard", "Brabant - Ancaster", "Brabant - Dundas", "Brabant - Mountain", "Brabant - Stoney Creek", "Burlington Post", "Bus Signage", "Caledonia News", "Car Signage", "Fax Blast", "Flamboro Review", "Flyer", "Glanbrook Gazette", "Grimsby News", "Home Saver Magazine", "Internet Search", "Lawn Sign", "Money Saver", "Oakville News", "Open and Save - Coupons", "Pioneer Web Site", "Property Management", "Radio CHML-900", "Referral", "Regional News Newspaper", "Reno Magazine", "Repeat Customer", "Spec - Burlington", "Spec - Hamilton", "Spectator Coupon Clipper", "Trade show", "Truck Signage", "Turtle Island news", "TV Ad", "Unknown", "Valpak", "Yard Sign", "Yellow Pages - online", "Yellow Pages - print"],
    Solution: ["Product 1", "Product 2", "Product 3", "Product 4", "Product 5", "Product 6", "Product 7", "Product 8", "Product 9", "Product 10", "Product 11", "Product 12", "Product 13", "Product 14", "Product 15", "Product 16", "Product 17", "Product 18", "Product 19", "Product 20", "Product 21", "Product 22", "Product 23", "Product 24", "Product 25", "Product 26", "Product 27", "Product 28"],
    "Sales Rep": ["Bill", "Daniel", "Daryl", "John", "Leigh", "Luke", "Office", "Ray", "Rick", "Todd"],
    "Inside Sales Rep": ["Carry", "Christine", "Dawn", "Donna", "Kathy", "Lori", "Pamela", "Rhoda", "Rosemary", "Susan"],
    "Meeting Outcome": ["Proceed to next step", "End", "No Show"],
    "Next Steps": ["Another meeting", "Proposal", "Sale", "Revisit in future", "None"],
    "Reason for No Proposal": ["Problem Inadequately Defined", "Too Long to Respond", "Incorrect Site Details", "Misunderstanding on Phone"],
    "Reason for No Go": ["Price", "Problem Gone Away", "Competitor", "Reputation", "Will Do Himself"],
    "Reason for Value Variance": ["Estimating Error", "Scope Change", "Inefficient Crew", "Start Delay", "Job Interrupted", "Strategic"],
    "Report Frequency": ["Day", "Week", "Month", "Quarter", "Year"],
    "Existing/New": ["Existing", "New"]
  };

  const tx = db.transaction(() => {
    for (const [category, items] of Object.entries(configs)) {
      items.forEach((item, idx) => {
        insert.run(category, item, idx + 1);
      });
    }
  });
  tx();
}

initDB();
seedConfig();

try { db.exec("ALTER TABLE clients ADD COLUMN website TEXT"); } catch (e) { /* column may already exist */ }

app.get("/api/configuration/:category", (req, res) => {
  const items = db.prepare("SELECT value FROM configuration WHERE category = ? ORDER BY sort_order").all(req.params.category);
  res.json(items.map(i => i.value));
});

app.get("/api/configuration", (req, res) => {
  const all = db.prepare("SELECT category, value FROM configuration ORDER BY category, sort_order").all();
  const grouped = {};
  for (const row of all) {
    if (!grouped[row.category]) grouped[row.category] = [];
    grouped[row.category].push(row.value);
  }
  res.json(grouped);
});

app.post("/api/configuration", (req, res) => {
  const { category, value } = req.body;
  const max = db.prepare("SELECT COALESCE(MAX(sort_order),0) + 1 as n FROM configuration WHERE category = ?").get(category);
  db.prepare("INSERT INTO configuration (category, value, sort_order) VALUES (?, ?, ?)").run(category, value, max.n);
  res.json({ success: true });
});

app.delete("/api/configuration/:category/:value", (req, res) => {
  db.prepare("DELETE FROM configuration WHERE category = ? AND value = ?").run(req.params.category, req.params.value);
  res.json({ success: true });
});

app.get("/api/clients", (req, res) => {
  const clients = db.prepare("SELECT * FROM clients ORDER BY company_name").all();
  res.json(clients);
});

app.get("/api/clients/:id", (req, res) => {
  const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(req.params.id);
  if (!client) return res.status(404).json({ error: "Not found" });
  res.json(client);
});

app.post("/api/clients", (req, res) => {
  const { company_name, division, industry, address1, address2, city, province, postal_code, country, contact_person, title, email, telephone_h, telephone_w, telephone_c, fax, website, notes } = req.body;
  const count = db.prepare("SELECT COUNT(*) as c FROM clients").get();
  const id = `C${String(count.c + 1).padStart(3, "0")}`;
  db.prepare(`INSERT INTO clients (id, company_name, division, industry, address1, address2, city, province, postal_code, country, contact_person, title, email, telephone_h, telephone_w, telephone_c, fax, website, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(id, company_name, division, industry, address1, address2, city, province, postal_code, country, contact_person, title, email, telephone_h, telephone_w, telephone_c, fax, website, notes);

  const clientName = company_name || website || null;
  if (clientName) {
    try {
      const projectId = agentService.createAgentProject(id, company_name || "Unknown", industry || "Unknown", website);
      agentService.autoRunWeek(projectId);
      res.json({ id, agentProjectId: projectId, agentStatus: "research_started" });
      return;
    } catch (e) {
      console.error("Agent auto-launch error:", e.message);
    }
  }

  res.json({ id });
});

app.put("/api/clients/:id", (req, res) => {
  const fields = ["company_name", "division", "industry", "address1", "address2", "city", "province", "postal_code", "country", "contact_person", "title", "email", "telephone_h", "telephone_w", "telephone_c", "fax", "website", "notes"];
  const sets = fields.map(f => `${f} = ?`).join(", ");
  const vals = fields.map(f => req.body[f]);
  db.prepare(`UPDATE clients SET ${sets}, updated_at = datetime('now') WHERE id = ?`).run(...vals, req.params.id);
  res.json({ success: true });
});

app.get("/api/opportunities", (req, res) => {
  const clientId = req.query.client_id;
  let sql = `SELECT o.*, c.company_name FROM opportunities o LEFT JOIN clients c ON o.client_id = c.id`;
  const params = [];
  if (clientId) { sql += " WHERE o.client_id = ?"; params.push(clientId); }
  sql += " ORDER BY o.created_at DESC";
  res.json(db.prepare(sql).all(...params));
});

app.post("/api/opportunities", (req, res) => {
  const { client_id } = req.body;
  const count = db.prepare("SELECT COUNT(*) as c FROM opportunities WHERE client_id = ?").get(client_id);
  const id = `${client_id}#${String(count.c + 1).padStart(2, "0")}`;
  const fields = ["id", "client_id", "opportunity_no", "problem_opportunity", "source_of_opportunity", "guestimated_value", "guestimated_timeline", "guestimated_probability", "planned_1st_meeting", "outcome_of_1st_meeting", "next_step", "reason_no_next_step", "sales_rep", "notes"];
  const placeholders = fields.map(() => "?").join(",");
  const vals = fields.map(f => req.body[f] || null);
  vals[0] = id; vals[1] = client_id;
  db.prepare(`INSERT INTO opportunities (${fields.join(",")}) VALUES (${placeholders})`).run(...vals);
  res.json({ id });
});

app.get("/api/opportunities/:id", (req, res) => {
  const opp = db.prepare("SELECT o.*, c.company_name FROM opportunities o LEFT JOIN clients c ON o.client_id = c.id WHERE o.id = ?").get(req.params.id);
  if (!opp) return res.status(404).json({ error: "Not found" });
  res.json(opp);
});

app.get("/api/qualifications/:opportunity_id", (req, res) => {
  const q = db.prepare("SELECT * FROM qualifications WHERE opportunity_id = ? ORDER BY id DESC").all(req.params.opportunity_id);
  res.json(q);
});

app.post("/api/qualifications", (req, res) => {
  const { opportunity_id, qualification_meeting_date, outcome, solution, estimated_value, estimated_timeline, estimated_probability, next_step, reason_no_opportunity, scheduled_proposal_delivery, sales_rep, inside_sales_rep, notes } = req.body;
  db.prepare(`INSERT INTO qualifications (opportunity_id, qualification_meeting_date, outcome, solution, estimated_value, estimated_timeline, estimated_probability, next_step, reason_no_opportunity, scheduled_proposal_delivery, sales_rep, inside_sales_rep, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(opportunity_id, qualification_meeting_date, outcome, solution, estimated_value, estimated_timeline, estimated_probability, next_step, reason_no_opportunity, scheduled_proposal_delivery, sales_rep, inside_sales_rep, notes);
  res.json({ success: true });
});

app.get("/api/proposals/:opportunity_id", (req, res) => {
  const p = db.prepare("SELECT * FROM proposals WHERE opportunity_id = ? ORDER BY id DESC").all(req.params.opportunity_id);
  res.json(p);
});

app.post("/api/proposals", (req, res) => {
  const { opportunity_id, proposal_delivery_date, proposed_offering, proposal_value, proposal_probability, scheduled_gonogo_date, sales_rep, inside_sales_rep, notes } = req.body;
  db.prepare(`INSERT INTO proposals (opportunity_id, proposal_delivery_date, proposed_offering, proposal_value, proposal_probability, scheduled_gonogo_date, sales_rep, inside_sales_rep, notes) VALUES (?,?,?,?,?,?,?,?,?)`).run(opportunity_id, proposal_delivery_date, proposed_offering, proposal_value, proposal_probability, scheduled_gonogo_date, sales_rep, inside_sales_rep, notes);
  res.json({ success: true });
});

app.get("/api/sales/:opportunity_id", (req, res) => {
  const s = db.prepare("SELECT * FROM sales WHERE opportunity_id = ? ORDER BY id DESC").all(req.params.opportunity_id);
  res.json(s);
});

app.post("/api/sales", (req, res) => {
  const { opportunity_id, gonogo_date, deliverable, gonogo, sale_value, scheduled_delivery_date, reason_value_variance, reason_no_sale, sales_rep, inside_sales_rep } = req.body;
  db.prepare(`INSERT INTO sales (opportunity_id, gonogo_date, deliverable, gonogo, sale_value, scheduled_delivery_date, reason_value_variance, reason_no_sale, sales_rep, inside_sales_rep) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(opportunity_id, gonogo_date, deliverable, gonogo, sale_value, scheduled_delivery_date, reason_value_variance, reason_no_sale, sales_rep, inside_sales_rep);
  res.json({ success: true });
});

app.get("/api/dashboard", (req, res) => {
  const clientId = req.query.client_id;
  const data = {};

  data.totalClients = db.prepare("SELECT COUNT(*) as c FROM clients").get().c;
  data.totalOpportunities = db.prepare("SELECT COUNT(*) as c FROM opportunities").get().c;

  if (clientId) {
    data.client = db.prepare("SELECT * FROM clients WHERE id = ?").get(clientId);
    data.opportunities = db.prepare("SELECT * FROM opportunities WHERE client_id = ? ORDER BY created_at DESC").all(clientId);
    data.qualifications = db.prepare("SELECT q.* FROM qualifications q JOIN opportunities o ON q.opportunity_id = o.id WHERE o.client_id = ? ORDER BY q.id DESC").all(clientId);
    data.proposals = db.prepare("SELECT p.* FROM proposals p JOIN opportunities o ON p.opportunity_id = o.id WHERE o.client_id = ? ORDER BY p.id DESC").all(clientId);
    data.sales = db.prepare("SELECT s.* FROM sales s JOIN opportunities o ON s.opportunity_id = o.id WHERE o.client_id = ? ORDER BY s.id DESC").all(clientId);
  }

  data.recentActivity = db.prepare(`
    SELECT 'opportunity' as type, o.id, c.company_name, o.outcome_of_1st_meeting as detail, o.created_at
    FROM opportunities o JOIN clients c ON o.client_id = c.id
    ORDER BY o.created_at DESC LIMIT 10
  `).all();

  res.json(data);
});

app.get("/api/reports/historical", (req, res) => {
  const { from, to, frequency } = req.query;
  const allSales = db.prepare(`
    SELECT s.*, o.client_id, c.company_name
    FROM sales s
    JOIN opportunities o ON s.opportunity_id = o.id
    JOIN clients c ON o.client_id = c.id
    WHERE s.gonogo = 'Go'
    ORDER BY s.sale_value DESC
  `).all();

  const totalValue = allSales.reduce((sum, s) => sum + (s.sale_value || 0), 0);
  const proposalCount = db.prepare("SELECT COUNT(*) as c FROM proposals").get().c;
  const saleCount = allSales.length;

  res.json({
    allSales,
    totalValue,
    proposalCount,
    saleCount,
    conversionRate: proposalCount > 0 ? Math.round((saleCount / proposalCount) * 100) : 0
  });
});

app.get("/api/reports/planning", (req, res) => {
  const upcomingMeetings = db.prepare(`
    SELECT o.planned_1st_meeting as meeting_date, o.outcome_of_1st_meeting, o.sales_rep, c.company_name, o.id as opportunity_id, '1st Meeting' as stage
    FROM opportunities o JOIN clients c ON o.client_id = c.id
    WHERE o.planned_1st_meeting IS NOT NULL AND o.planned_1st_meeting != ''
    ORDER BY o.planned_1st_meeting ASC LIMIT 100
  `).all();

  const upcomingQual = db.prepare(`
    SELECT q.qualification_meeting_date as meeting_date, q.outcome, q.sales_rep, c.company_name, q.opportunity_id, 'Qualification' as stage
    FROM qualifications q JOIN opportunities o ON q.opportunity_id = o.id JOIN clients c ON o.client_id = c.id
    WHERE q.qualification_meeting_date IS NOT NULL AND q.qualification_meeting_date != ''
    ORDER BY q.qualification_meeting_date ASC LIMIT 100
  `).all();

  const upcomingProp = db.prepare(`
    SELECT p.proposal_delivery_date as meeting_date, p.proposed_offering as outcome, p.sales_rep, c.company_name, p.opportunity_id, 'Proposal' as stage
    FROM proposals p JOIN opportunities o ON p.opportunity_id = o.id JOIN clients c ON o.client_id = c.id
    WHERE p.proposal_delivery_date IS NOT NULL AND p.proposal_delivery_date != ''
    ORDER BY p.proposal_delivery_date ASC LIMIT 100
  `).all();

  const upcomingSales = db.prepare(`
    SELECT s.gonogo_date as meeting_date, s.deliverable as outcome, s.sales_rep, c.company_name, s.opportunity_id, 'Sale' as stage
    FROM sales s JOIN opportunities o ON s.opportunity_id = o.id JOIN clients c ON o.client_id = c.id
    WHERE s.gonogo_date IS NOT NULL AND s.gonogo_date != ''
    ORDER BY s.gonogo_date ASC LIMIT 100
  `).all();

  res.json({ upcomingMeetings, upcomingQual, upcomingProp, upcomingSales });
});

// ─── AI Agent Routes ──────────────────────────────────────────

app.post("/api/agents/projects", (req, res) => {
  const { client_id, client_name, industry, website } = req.body;
  const projectId = agentService.createAgentProject(client_id, client_name, industry, website);
  agentService.autoRunWeek(projectId);
  const project = agentService.getProject(projectId);
  res.json(project);
});

app.get("/api/agents/projects", (req, res) => {
  res.json(agentService.getAllProjects());
});

app.get("/api/agents/projects/:id", (req, res) => {
  const project = agentService.getProject(Number(req.params.id));
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.post("/api/agents/projects/:id/advance", (req, res) => {
  const project = agentService.advanceWeek(Number(req.params.id));
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.post("/api/agents/projects/:id/run-week", (req, res) => {
  const project = agentService.autoRunWeek(Number(req.params.id));
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.post("/api/agents/projects/:id/run-all", (req, res) => {
  const project = agentService.autoRunAll(Number(req.params.id));
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.post("/api/agents/tasks/:id/execute", (req, res) => {
  const task = agentService.executeTask(Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

app.post("/api/agents/leads", (req, res) => {
  const result = agentService.addLead(req.body.project_id, req.body);
  res.json(result);
});

app.post("/api/agents/competitors", (req, res) => {
  const result = agentService.addCompetitor(req.body.project_id, req.body);
  res.json(result);
});

// ─── Contact Form / Leads ──────────────────────────────────────

app.post("/api/contact", (req, res) => {
  const { name, email, phone, company, message, source } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const result = db.prepare(
    "INSERT INTO contact_leads (name, email, phone, company, message, source) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(name, email, phone || null, company || null, message || null, source || "contact_form");
  res.json({ success: true, id: result.lastInsertRowid });
});

app.get("/api/contact-leads", (req, res) => {
  const leads = db.prepare("SELECT * FROM contact_leads ORDER BY created_at DESC").all();
  res.json(leads);
});

app.put("/api/contact-leads/:id", (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  db.prepare("UPDATE contact_leads SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ success: true });
});

// ─── Start Server ─────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Sales Tracker API running on http://localhost:${PORT}`);
});
