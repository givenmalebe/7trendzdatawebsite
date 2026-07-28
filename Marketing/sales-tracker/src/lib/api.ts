const API = "http://localhost:3001/api";

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getConfig: (category?: string) =>
    fetchJSON(category ? `${API}/configuration/${category}` : `${API}/configuration`),
  addConfigItem: (category: string, value: string) =>
    fetchJSON(`${API}/configuration`, { method: "POST", body: JSON.stringify({ category, value }) }),
  deleteConfigItem: (category: string, value: string) =>
    fetchJSON(`${API}/configuration/${category}/${encodeURIComponent(value)}`, { method: "DELETE" }),

  getClients: () => fetchJSON(`${API}/clients`),
  getClient: (id: string) => fetchJSON(`${API}/clients/${id}`),
  createClient: (data: any) =>
    fetchJSON(`${API}/clients`, { method: "POST", body: JSON.stringify(data) }),
  updateClient: (id: string, data: any) =>
    fetchJSON(`${API}/clients/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  getOpportunities: (clientId?: string) =>
    fetchJSON(`${API}/opportunities${clientId ? `?client_id=${clientId}` : ""}`),
  getOpportunity: (id: string) => fetchJSON(`${API}/opportunities/${id}`),
  createOpportunity: (data: any) =>
    fetchJSON(`${API}/opportunities`, { method: "POST", body: JSON.stringify(data) }),

  getQualifications: (oppId: string) => fetchJSON(`${API}/qualifications/${oppId}`),
  createQualification: (data: any) =>
    fetchJSON(`${API}/qualifications`, { method: "POST", body: JSON.stringify(data) }),

  getProposals: (oppId: string) => fetchJSON(`${API}/proposals/${oppId}`),
  createProposal: (data: any) =>
    fetchJSON(`${API}/proposals`, { method: "POST", body: JSON.stringify(data) }),

  getSales: (oppId: string) => fetchJSON(`${API}/sales/${oppId}`),
  createSale: (data: any) =>
    fetchJSON(`${API}/sales`, { method: "POST", body: JSON.stringify(data) }),

  getDashboard: (clientId?: string) =>
    fetchJSON(`${API}/dashboard${clientId ? `?client_id=${clientId}` : ""}`),
  getHistoricalReport: (params?: any) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchJSON(`${API}/reports/historical${qs}`);
  },
  getPlanningReport: () => fetchJSON(`${API}/reports/planning`),

  getAgentProjects: () => fetchJSON(`${API}/agents/projects`),
  getAgentProject: (id: number) => fetchJSON(`${API}/agents/projects/${id}`),
  createAgentProject: (data: any) =>
    fetchJSON(`${API}/agents/projects`, { method: "POST", body: JSON.stringify(data) }),
  advanceAgentProject: (id: number) =>
    fetchJSON(`${API}/agents/projects/${id}/advance`, { method: "POST" }),
  runAgentWeek: (id: number) =>
    fetchJSON(`${API}/agents/projects/${id}/run-week`, { method: "POST" }),
  runAgentAll: (id: number) =>
    fetchJSON(`${API}/agents/projects/${id}/run-all`, { method: "POST" }),
  executeAgentTask: (id: number) =>
    fetchJSON(`${API}/agents/tasks/${id}/execute`, { method: "POST" }),
  addAgentLead: (data: any) =>
    fetchJSON(`${API}/agents/leads`, { method: "POST", body: JSON.stringify(data) }),
  addAgentCompetitor: (data: any) =>
    fetchJSON(`${API}/agents/competitors`, { method: "POST", body: JSON.stringify(data) }),

  submitContact: (data: any) =>
    fetchJSON(`${API}/contact`, { method: "POST", body: JSON.stringify(data) }),
  getContactLeads: () => fetchJSON(`${API}/contact-leads`),
  updateContactLeadStatus: (id: number, status: string) =>
    fetchJSON(`${API}/contact-leads/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
};
