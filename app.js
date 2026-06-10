const state = {
  data: null,
  benchmarkData: { meta: {}, people: [], publications: [] },
  grantsData: { meta: {}, grants: [] },
  phdsData: { meta: {}, theses: [] },
  resourceData: { meta: {}, opportunities: [], tips: [] },
  externalPartnersData: { meta: {}, partners: [] },
  teachingData: { meta: {}, records: [], courses: [], edges: [], personCourseCounts: {}, personNetworkCourseCounts: {} },
  tab: "overview",
  includeAffiliatedResearchers: false,
  recentOnly: false,
  networkMode: "publications",
  networkAipHighOnly: false,
  networkExternal: true,
  networkPersonId: "",
  metricTrendKey: "pubRate",
  search: "",
  aipFilter: "all",
  expertiseSearch: "",
  expertiseTopic: "",
  expertiseMode: "query",
  staffTopicQuery: "",
  staffTopicMode: "query",
  selectedStaffId: "",
};

const els = {};
const DATA_VERSION = "20260610-1659";
const CONTACT_EMAIL = "h.j.van.de.brake@rug.nl";
const FEEDBACK_ISSUE_URL = "https://github.com/hjvandebrake/hrmob-research-dashboard/issues/new";
const OVERVIEW_START_YEAR = 2005;
const METRICS_START_YEAR = 2005;
const AFFILIATED_RESEARCHER_IDS = new Set(["CDD", "MR", "JJ"]);
const METRIC_TREND_COLORS = {
  HRMOB: "#9d3138",
  Marketing: "#2f7480",
  "IM&S": "#667d4a",
  Operations: "#9b742e",
  GEM: "#6773a0",
  Accounting: "#915b76",
};

const EXPERTISE_FAMILIES = [
  ["teams and groups", ["team", "teams", "group", "groups", "teamwork", "small group", "work group", "project team", "team performance", "team effectiveness"]],
  ["collaboration and coordination", ["collaboration", "coordination", "cooperation", "cooperative", "collaborative", "interdependence", "collective action", "coordination failure"]],
  ["multiple team membership", ["multiple team membership", "multiple team memberships", "multiple teams", "multiple team", "multi team", "multiteam", "multiteaming"]],
  ["boundary spanning and external ties", ["boundary spanning", "boundary management", "team boundary", "team boundaries", "boundary crossing", "external ties", "external contact", "external communication", "interteam coordination", "inter team coordination"]],
  ["intergroup relations", ["intergroup", "between groups", "group conflict", "outgroup", "ingroup", "social categorization", "faultline", "group identity"]],
  ["leadership", ["leader", "leaders", "leadership", "supervisor", "supervision", "managerial leadership", "directive leadership", "leader behavior"]],
  ["shared leadership", ["shared leadership", "distributed leadership", "collective leadership", "team leadership", "leadership sharing"]],
  ["power and hierarchy", ["power", "hierarchy", "dominance", "authority", "control", "influence", "asymmetry", "power distance"]],
  ["status and prestige", ["status", "prestige", "rank", "standing", "recognition", "reputation", "social status"]],
  ["governance and boards", ["governance", "board", "boards", "director", "directors", "ceo", "top management team", "upper echelon", "supervisory board", "corporate governance"]],
  ["creativity", ["creativity", "creative", "idea generation", "brainstorming", "creative process", "team creativity", "radical creativity"]],
  ["innovation", ["innovation", "innovative", "new product", "research and development", "r&d", "exploration", "exploitation", "knowledge creation"]],
  ["decision making", ["decision", "decision making", "judgment", "choice", "risk taking", "uncertainty", "problem solving", "information processing"]],
  ["ethics and morality", ["ethics", "ethical", "unethical", "moral", "morality", "moral judgment", "moral decision", "misconduct", "fraud", "corruption"]],
  ["trust and distrust", ["trust", "distrust", "trustworthiness", "suspicion", "betrayal", "confidence", "psychological contract"]],
  ["prosocial behavior", ["prosocial", "helping", "altruism", "generosity", "cooperation", "charity", "social value", "public good"]],
  ["negotiation and bargaining", ["negotiation", "bargaining", "deal", "agreement", "conflict resolution", "settlement", "mediation"]],
  ["conflict", ["conflict", "relationship conflict", "task conflict", "tension", "disagreement", "dispute", "friction"]],
  ["stress and strain", ["stress", "strain", "burnout", "exhaustion", "emotional exhaustion", "role conflict", "role ambiguity", "threat", "pressure", "workload", "demands", "tension"]],
  ["occupational health", ["occupational health", "health", "sick leave", "absenteeism", "illness", "medical", "rehabilitation", "work ability"]],
  ["wellbeing", ["wellbeing", "well-being", "work engagement", "engagement", "satisfaction", "happiness", "flourishing", "need satisfaction"]],
  ["recovery and leisure", ["recovery", "leisure", "vacation", "break", "detachment", "relaxation", "sleep", "after work", "off job"]],
  ["job crafting", ["job crafting", "crafting", "task crafting", "relational crafting", "cognitive crafting", "resource crafting"]],
  ["work design", ["work design", "job design", "autonomy", "job demands", "job resources", "flexibility", "work arrangement", "workplace design"]],
  ["remote and hybrid work", ["remote work", "hybrid work", "virtual work", "telework", "distributed work", "online collaboration", "digital work"]],
  ["motivation and goals", ["motivation", "goal", "goals", "needs", "incentive", "self determination", "achievement", "goal setting"]],
  ["emotions and affect", ["emotion", "emotions", "affect", "mood", "anger", "fear", "anxiety", "emotional", "affective"]],
  ["work-family and roles", ["work family", "work-family", "family work", "role conflict", "multiple roles", "role accumulation", "role strain", "role separation", "role proximity", "role transition", "role ambiguity"]],
  ["identity and belonging", ["identity", "belonging", "self", "self relevance", "social identity", "collective identity", "identification", "belong"]],
  ["stereotypes and bias", ["stereotype", "bias", "prejudice", "discrimination", "implicit bias", "impostor", "stigma"]],
  ["gender and leadership", ["gender", "women", "female", "men", "male", "glass ceiling", "queen bee", "leadership diversity", "gender equality"]],
  ["diversity and inclusion", ["diversity", "inclusion", "dei", "representation", "minority", "multicultural", "inclusive", "demographic diversity"]],
  ["justice and fairness", ["justice", "fairness", "procedural justice", "distributive justice", "interactional justice", "equity", "inequality"]],
  ["voice and silence", ["voice", "employee voice", "silence", "speaking up", "whistleblowing", "suggestions", "participation"]],
  ["psychological safety", ["psychological safety", "safety climate", "speak up", "interpersonal risk", "safe climate"]],
  ["learning and feedback", ["learning", "feedback", "development", "training", "expertise development", "knowledge sharing", "reflection"]],
  ["careers and employability", ["career", "careers", "employability", "career success", "career transition", "promotion", "labor market", "labour market"]],
  ["performance management", ["job performance", "task performance", "contextual performance", "productivity", "performance appraisal", "performance management"]],
  ["people management practices", ["hr practices", "human resource practices", "human resource management", "personnel practices", "workforce management", "talent management", "strategic hrm"]],
  ["selection and recruitment", ["selection", "recruitment", "hiring", "personnel selection", "assessment", "interview", "candidate", "talent acquisition"]],
  ["social networks", ["social network", "networks", "network centrality", "social exchange", "relational", "ties", "tie strength"]],
  ["competition", ["competition", "competitive", "contest", "rivalry", "compete", "tournament", "rank competition"]],
  ["crisis and resilience", ["crisis", "resilience", "disruption", "adaptation", "threat", "emergency", "coping", "recovery after crisis"]],
  ["technology and AI", ["technology", "digital", "algorithm", "artificial intelligence", "ai", "automation", "platform", "information system"]],
  ["entrepreneurship", ["entrepreneur", "entrepreneurship", "startup", "venture", "founder", "new venture", "entrepreneurial"]],
  ["sustainability and csr", ["sustainability", "csr", "corporate social responsibility", "responsible business", "environmental responsibility", "sustainable"]],
  ["age and aging", ["age", "aging", "older worker", "retirement", "lifespan", "age diversity", "elderly"]],
];

const STOPWORDS = new Set([
  "a", "about", "all", "an", "and", "are", "as", "at", "between", "by", "for", "from", "how", "in", "into",
  "is", "it", "its", "of", "on", "or", "over", "the", "their", "this", "through", "to", "under", "when",
  "where", "why", "with", "within", "without", "work", "working", "study", "studies", "research",
]);

const TOPIC_STOPWORDS = new Set(Array.from(STOPWORDS).filter((word) => !["work", "working"].includes(word)));

const EXTRA_TOPIC_STOPWORDS = new Set([
  "analysis", "approach", "article", "case", "comment", "conceptual", "consequence", "effect", "effects",
  "evidence", "experiment", "experimental", "factor", "field", "finding", "future", "impact", "implication",
  "level", "model", "perspective", "process", "relationship", "review", "role", "science", "systematic",
  "theory", "toward", "using", "based", "data", "empirical", "framework", "introduction", "new",
  "paper", "part", "results", "special", "towards", "during", "van", "het", "een", "voor", "door",
]);

const GENERIC_TOPIC_NOUNS = new Set([
  "antecedents", "association", "associations", "change", "changes", "chapter", "consequences", "effects",
  "implications", "mechanisms", "moderators", "outcomes", "predictors", "processes", "relationships",
]);

const GENERIC_TOPIC_PHRASES = new Set([
  "meta analysis", "systematic review", "literature review", "current directions", "special issue",
]);

const DOMAIN_TOPIC_TERMS = new Set([
  "age", "aging", "ai", "algorithm", "autonomy", "bias", "board", "burnout", "career", "careers",
  "conflict", "coordination", "creativity", "crisis", "culture", "decision", "diversity", "emotion",
  "employee", "ethics", "fairness", "feedback", "gender", "goal", "governance", "group", "groups",
  "health", "hierarchy", "identity", "inclusion", "innovation", "intergroup", "job", "justice",
  "leadership", "learning", "management", "motivation", "negotiation", "network", "networks",
  "performance", "power", "prosocial", "recovery", "resilience", "safety", "selection", "social",
  "status", "stereotypes", "stress", "team", "teams", "technology", "trust", "voice", "wellbeing",
  "work", "workplace", "boundary", "multiteam", "multiteaming",
]);

const OPEN_ACCESS_OUTLET_GUIDE = [
  { journal: "Frontiers in Psychology", focus: "Psychology, work, organizational sections" },
  { journal: "PLOS ONE", focus: "Broad empirical research" },
  { journal: "Scientific Reports", focus: "Broad multidisciplinary research" },
  { journal: "Nature Communications", focus: "High-reach multidisciplinary work" },
  { journal: "BMC Psychology", focus: "Psychology and behavioral science" },
  { journal: "Collabra: Psychology", focus: "Open psychology research" },
  { journal: "SAGE Open", focus: "Broad social science research" },
  { journal: "International Journal of Environmental Research and Public Health", focus: "Health, work, wellbeing" },
];

const OPEN_ACCESS_JOURNAL_PATTERNS = [
  /frontiers/i,
  /\bplos\b/i,
  /scientific reports/i,
  /nature communications/i,
  /\belife\b/i,
  /\bbmc\b/i,
  /collabra/i,
  /sage open/i,
  /international journal of environmental research and public health/i,
];

const MEDICAL_FALSE_POSITIVE_PATTERNS = [
  /cardio/i,
  /clinical/i,
  /clinical chemistry/i,
  /defibrillator/i,
  /dialysis/i,
  /kidney/i,
  /nephro/i,
  /nurs/i,
  /pacemaker/i,
  /patient/i,
  /physician/i,
  /placenta/i,
  /pulmonary vein/i,
  /renal/i,
  /surgery/i,
  /tacrolimus/i,
  /transplant/i,
  /urology/i,
  /\bckd\b/i,
];

const MEDICAL_CONTEXT_RESCUE_PATTERNS = [
  /occupational health/i,
  /work and stress/i,
  /work stress/i,
  /employee/i,
  /workplace/i,
  /team/i,
  /leadership/i,
];

document.addEventListener("DOMContentLoaded", async () => {
  cacheElements();
  attachEvents();
  await loadData();
});

function cacheElements() {
  els.subtitle = document.getElementById("subtitle");
  els.footerMeta = document.getElementById("footer-meta");
  els.metrics = document.getElementById("metrics");
  els.benchmarkSummary = document.getElementById("benchmark-summary");
  els.benchmarkPublicationTrend = document.getElementById("benchmark-publication-trend");
  els.benchmarkTrendTitle = document.getElementById("benchmark-trend-title");
  els.benchmarkTrendToggle = document.getElementById("benchmark-trend-toggle");
  els.benchmarkMethodNote = document.getElementById("benchmark-method-note");
  els.benchmarkVariety = document.getElementById("benchmark-variety");
  els.overviewTopicCloud = document.getElementById("overview-topic-cloud");
  els.overviewJournalList = document.getElementById("overview-journal-list");
  els.journalPublishedList = document.getElementById("journal-published-list");
  els.journalOpenAccessList = document.getElementById("journal-open-access-list");
  els.yearBars = document.getElementById("year-bars");
  els.aipBars = document.getElementById("aip-bars");
  els.grantList = document.getElementById("grant-list");
  els.phdList = document.getElementById("phd-list");
  els.expertiseSearch = document.getElementById("expertise-search");
  els.expertiseWordcloud = document.getElementById("expertise-wordcloud");
  els.expertiseSelectedTopic = document.getElementById("expertise-selected-topic");
  els.expertiseStaffResults = document.getElementById("expertise-staff-results");
  els.staffList = document.getElementById("staff-list");
  els.staffProfile = document.getElementById("staff-profile");
  els.staffTopics = document.getElementById("staff-topics");
  els.staffSuggestions = document.getElementById("staff-suggestions");
  els.staffRelated = document.getElementById("staff-related");
  els.staffPublicationEye = document.getElementById("staff-publication-eye");
  els.staffPublicationTitle = document.getElementById("staff-publication-title");
  els.staffPublicationTable = document.getElementById("staff-publication-table");
  els.topicOverlay = document.getElementById("topic-overlay");
  els.topicOverlayTitle = document.getElementById("topic-overlay-title");
  els.topicOverlaySummary = document.getElementById("topic-overlay-summary");
  els.topicOverlayStaff = document.getElementById("topic-overlay-staff");
  els.topicOverlayPublications = document.getElementById("topic-overlay-publications");
  els.publicationTable = document.getElementById("publication-table");
  els.pubSearch = document.getElementById("pub-search");
  els.aipFilter = document.getElementById("aip-filter");
  els.fteToggle = document.getElementById("fte-toggle");
  els.recentToggle = document.getElementById("recent-toggle");
  els.networkModeToggle = document.getElementById("network-mode-toggle");
  els.networkClearSelection = document.getElementById("network-clear-selection");
  els.networkSelectionNote = document.getElementById("network-selection-note");
  els.networkAipToggle = document.getElementById("network-aip-toggle");
  els.networkExternalToggle = document.getElementById("network-external-toggle");
  els.networkSvg = document.getElementById("network-svg");
  els.networkEmpty = document.getElementById("network-empty");
  els.networkLegend = document.getElementById("network-legend");
  els.networkTableWrap = document.getElementById("network-table-wrap");
  els.externalPartnerPanel = document.querySelector(".external-partner-panel");
  els.externalPartnerList = document.getElementById("external-partner-list");
  els.feedbackForm = document.getElementById("feedback-form");
  els.feedbackName = document.getElementById("feedback-name");
  els.feedbackArea = document.getElementById("feedback-area");
  els.feedbackComment = document.getElementById("feedback-comment");
  els.feedbackStatus = document.getElementById("feedback-status");
  els.feedbackEmailLink = document.getElementById("feedback-email-link");
  els.resourceOpportunities = document.getElementById("resource-opportunities");
  els.resourceTips = document.getElementById("resource-tips");
}

function attachEvents() {
  document.querySelectorAll("[data-tab]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      if (el.dataset.tab === "staff") {
        state.selectedStaffId = "";
        state.staffTopicQuery = "";
        state.staffTopicMode = "query";
      }
      if (el.dataset.tab === "expertise") {
        state.expertiseSearch = "";
        state.expertiseTopic = "";
        state.expertiseMode = "query";
        if (els.expertiseSearch) els.expertiseSearch.value = "";
      }
      setTab(el.dataset.tab);
    });
  });
  els.fteToggle.addEventListener("change", () => {
    state.includeAffiliatedResearchers = els.fteToggle.checked;
    renderAll();
  });
  els.recentToggle.addEventListener("change", () => {
    state.recentOnly = els.recentToggle.checked;
    renderAll();
  });
  if (els.networkAipToggle) {
    els.networkAipToggle.addEventListener("change", () => {
      state.networkAipHighOnly = els.networkAipToggle.checked;
      renderNetwork();
    });
  }
  if (els.networkModeToggle) {
    els.networkModeToggle.addEventListener("click", (event) => {
      const button = event.target.closest("[data-network-mode]");
      if (!button) return;
      state.networkMode = button.dataset.networkMode === "teaching" ? "teaching" : "publications";
      state.networkPersonId = "";
      renderNetwork();
    });
  }
  if (els.networkClearSelection) {
    els.networkClearSelection.addEventListener("click", () => {
      state.networkPersonId = "";
      renderNetwork();
    });
  }
  if (els.networkSvg) {
    els.networkSvg.addEventListener("click", (event) => {
      const node = event.target.closest("[data-network-person-id]");
      if (!node) return;
      const id = node.getAttribute("data-network-person-id") || "";
      state.networkPersonId = state.networkPersonId === id ? "" : id;
      renderNetwork();
    });
    els.networkSvg.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const node = event.target.closest("[data-network-person-id]");
      if (!node) return;
      event.preventDefault();
      const id = node.getAttribute("data-network-person-id") || "";
      state.networkPersonId = state.networkPersonId === id ? "" : id;
      renderNetwork();
    });
  }
  if (els.networkExternalToggle) {
    els.networkExternalToggle.addEventListener("change", () => {
      state.networkExternal = els.networkExternalToggle.checked;
      renderNetwork();
    });
  }
  els.benchmarkTrendToggle.addEventListener("click", (event) => {
    const button = event.target.closest("[data-metric-trend]");
    if (!button) return;
    state.metricTrendKey = button.dataset.metricTrend;
    renderMetrics();
  });
  els.pubSearch.addEventListener("input", () => {
    state.search = els.pubSearch.value.trim().toLowerCase();
    renderPublications();
  });
  els.aipFilter.addEventListener("change", () => {
    state.aipFilter = els.aipFilter.value;
    renderPublications();
  });
  if (els.feedbackForm) {
    els.feedbackForm.addEventListener("submit", handleFeedbackSubmit);
  }
  if (els.feedbackEmailLink) {
    els.feedbackEmailLink.addEventListener("click", () => {
      els.feedbackEmailLink.href = feedbackMailtoHref();
    });
  }
  els.expertiseSearch.addEventListener("input", () => {
    state.expertiseSearch = els.expertiseSearch.value.trim();
    state.expertiseTopic = state.expertiseSearch;
    state.expertiseMode = "query";
    renderExpertise();
  });
  els.expertiseWordcloud.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic-query]");
    if (!button) return;
    state.expertiseTopic = button.dataset.topicQuery;
    state.expertiseSearch = state.expertiseTopic;
    state.expertiseMode = button.dataset.topicKind || "phrase";
    els.expertiseSearch.value = state.expertiseTopic;
    renderExpertise();
  });
  els.overviewTopicCloud.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic-query]");
    if (!button) return;
    showTopicOverlay(button.dataset.topicQuery, button.dataset.topicKind || "phrase");
  });
  els.staffTopics.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic-query]");
    if (!button) return;
    showTopicOverlay(button.dataset.topicQuery, button.dataset.topicKind || "phrase");
  });
  document.querySelectorAll("[data-topic-overlay-close]").forEach((button) => {
    button.addEventListener("click", closeTopicOverlay);
  });
  els.topicOverlay.addEventListener("click", (event) => {
    if (event.target === els.topicOverlay) closeTopicOverlay();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.topicOverlay.hidden) closeTopicOverlay();
  });
  els.expertiseStaffResults.addEventListener("click", (event) => {
    const button = event.target.closest("[data-expertise-staff-id]");
    if (!button) return;
    state.selectedStaffId = button.dataset.expertiseStaffId;
    state.staffTopicQuery = state.expertiseSearch || state.expertiseTopic || "";
    state.staffTopicMode = state.expertiseMode || "query";
    setTab("staff");
  });
  els.staffList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-staff-id]");
    if (!button) return;
    state.selectedStaffId = button.dataset.staffId;
    renderStaff();
  });
  els.staffSuggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-staff-id]");
    if (!button) return;
    state.selectedStaffId = button.dataset.staffId;
    renderStaff();
  });
  window.addEventListener("resize", debounce(() => {
    if (state.tab === "network") renderNetwork();
  }, 180));
  window.addEventListener("hashchange", () => {
    const nextTab = location.hash.replace("#", "") || "overview";
    if (nextTab !== state.tab) setTab(nextTab);
  });
}

function handleFeedbackSubmit(event) {
  event.preventDefault();
  const name = (els.feedbackName?.value || "").trim();
  const area = (els.feedbackArea?.value || "General").trim();
  const comment = (els.feedbackComment?.value || "").trim();
  if (!comment) {
    if (els.feedbackStatus) els.feedbackStatus.textContent = "Add a comment first.";
    els.feedbackComment?.focus();
    return;
  }
  const title = `[Dashboard feedback] ${area}`;
  const body = [
    `Name: ${name || "Not provided"}`,
    `Area: ${area}`,
    `Dashboard URL: ${window.location.href}`,
    "",
    "Comment:",
    comment,
  ].join("\n");
  const params = new URLSearchParams({
    template: "dashboard-feedback.md",
    title,
    body,
    labels: "dashboard-feedback",
  });
  const url = `${FEEDBACK_ISSUE_URL}?${params.toString()}`;
  window.open(url, "_blank", "noopener");
  if (els.feedbackStatus) {
    els.feedbackStatus.textContent = "A GitHub issue draft opened. Submit it there to save the suggestion.";
  }
}

function feedbackMailtoHref() {
  const name = (els.feedbackName?.value || "").trim();
  const area = (els.feedbackArea?.value || "General").trim();
  const comment = (els.feedbackComment?.value || "").trim();
  const body = [
    `Name: ${name || "Not provided"}`,
    `Area: ${area}`,
    `Dashboard URL: ${window.location.href}`,
    "",
    comment,
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Dashboard feedback: ${area}`)}&body=${encodeURIComponent(body)}`;
}

async function loadData() {
  try {
    const [response, benchmarkResponse, grantsResponse, phdsResponse, resourceResponse, externalPartnersResponse, teachingResponse] = await Promise.all([
      fetch(`data/dashboard-data.json?v=${DATA_VERSION}`),
      fetch(`data/benchmark-data.json?v=${DATA_VERSION}`).catch(() => null),
      fetch(`data/grants.json?v=${DATA_VERSION}`).catch(() => null),
      fetch(`data/phds.json?v=${DATA_VERSION}`).catch(() => null),
      fetch(`data/resource-data.json?v=${DATA_VERSION}`).catch(() => null),
      fetch(`data/external-partners.json?v=${DATA_VERSION}`).catch(() => null),
      fetch(`data/teaching-data.json?v=${DATA_VERSION}`).catch(() => null),
    ]);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();
    if (benchmarkResponse?.ok) state.benchmarkData = await benchmarkResponse.json();
    if (grantsResponse?.ok) state.grantsData = await grantsResponse.json();
    if (phdsResponse?.ok) state.phdsData = await phdsResponse.json();
    if (resourceResponse?.ok) state.resourceData = await resourceResponse.json();
    if (externalPartnersResponse?.ok) state.externalPartnersData = await externalPartnersResponse.json();
    if (teachingResponse?.ok) state.teachingData = await teachingResponse.json();
    const meta = state.data.meta;
    els.subtitle.textContent = "Publications, journal rankings, collaboration, grants, and PhD supervision.";
    els.footerMeta.textContent = "";
    setTab(location.hash.replace("#", "") || "overview");
    renderAll();
  } catch (error) {
    els.subtitle.textContent = `Could not load dashboard data: ${error.message}`;
  }
}

function setTab(tab) {
  state.tab = ["overview", "staff", "expertise", "publications", "network", "metrics", "resources", "contact"].includes(tab) ? tab : "overview";
  document.querySelectorAll(".nav-tab").forEach((btn) => btn.classList.toggle("on", btn.dataset.tab === state.tab));
  document.querySelectorAll("main > section").forEach((section) => {
    section.hidden = section.id !== `view-${state.tab}`;
  });
  history.replaceState(null, "", `#${state.tab}`);
  if (state.data) renderAll();
}

function renderAll() {
  renderOverview();
  renderMetrics();
  renderStaff();
  renderExpertise();
  renderPublications();
  renderNetwork();
  renderResources();
}

function activePeople() {
  return state.data.people.filter((person) => (
    state.includeAffiliatedResearchers || !AFFILIATED_RESEARCHER_IDS.has(person.id)
  ));
}

function fteLabel() {
  return state.includeAffiliatedResearchers ? "Department members + affiliated researchers" : "Department members";
}

function activePeopleSet() {
  return new Set(activePeople().map((person) => person.id));
}

function peopleById() {
  return new Map(state.data.people.map((person) => [person.id, person]));
}

function activePublications() {
  return activePublicationPool({ countedOnly: true });
}

function activeDisplayPublications() {
  return activePublicationPool({ countedOnly: false });
}

function activePublicationPool({ countedOnly }) {
  const ids = activePeopleSet();
  const [fromYear, toYear] = activeWindowYears();
  const filtered = state.data.publications.filter((pub) => (
    (!countedOnly || countedPublication(pub))
    && displayPublication(pub)
    && pub.matchedPeople.some((id) => ids.has(id))
    && (!fromYear || pub.year >= fromYear)
    && (!toYear || pub.year <= toYear)
  ));
  return dedupePublications(filtered);
}

function dedupePublications(pubs) {
  const groups = [];
  pubs.forEach((pub) => {
    const key = duplicatePublicationKey(pub);
    const group = groups.find((candidate) => (
      candidate.keys.has(key) || candidate.items.some((existing) => samePublicationWork(existing, pub))
    ));
    if (group) {
      group.keys.add(key);
      group.items.push(pub);
      return;
    }
    groups.push({ keys: new Set([key]), items: [pub] });
  });
  return groups.map((group) => mergePublicationGroup(group.items));
}

function duplicatePublicationKey(pub) {
  const doi = String(pub.doi || "").toLowerCase().trim();
  if (doi) return `doi:${doi}`;
  const normalizedTitle = normalizeSearchText(pub.title);
  if (normalizedTitle.length > 30) return `title:${normalizedTitle}|year:${pub.year || ""}`;
  return `id:${pub.id}`;
}

function samePublicationWork(a, b) {
  const doiA = normalizeDoi(a.doi);
  const doiB = normalizeDoi(b.doi);
  if (doiA && doiB) return doiA === doiB;
  if (nonOriginalPublicationTitle(a.title) || nonOriginalPublicationTitle(b.title)) return false;
  const titleA = normalizeSearchText(a.title);
  const titleB = normalizeSearchText(b.title);
  if (titleA.length < 35 || titleB.length < 35) return false;
  const yearA = Number(a.year);
  const yearB = Number(b.year);
  if (Number.isFinite(yearA) && Number.isFinite(yearB) && Math.abs(yearA - yearB) > 1) return false;
  const journalA = normalizeSearchText(a.aipJournal || a.journal || "");
  const journalB = normalizeSearchText(b.aipJournal || b.journal || "");
  if (journalA && journalB && journalA !== journalB) return false;
  return titleSimilarity(titleA, titleB) >= 0.92 || tokenOverlap(titleA, titleB) >= 0.82;
}

function nonOriginalPublicationTitle(title) {
  const normalized = normalizeSearchText(title);
  return normalized.startsWith("correction to ")
    || normalized.startsWith("corrigendum to ")
    || normalized.startsWith("addendum to ")
    || normalized.startsWith("retraction ")
    || normalized.startsWith("publisher correction")
    || normalized.startsWith("author correction")
    || normalized.includes(" corrigendum ");
}

function titleSimilarity(a, b) {
  if (a === b) return 1;
  const rows = new Array(b.length + 1).fill(0);
  for (let j = 0; j <= b.length; j += 1) rows[j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    let previous = rows[0];
    rows[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const old = rows[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[j] = Math.min(rows[j] + 1, rows[j - 1] + 1, previous + cost);
      previous = old;
    }
  }
  const distance = rows[b.length];
  return 1 - distance / Math.max(a.length, b.length, 1);
}

function tokenOverlap(a, b) {
  const tokensA = new Set(tokenizePublicationTitle(a));
  const tokensB = new Set(tokenizePublicationTitle(b));
  if (!tokensA.size || !tokensB.size) return 0;
  const intersection = [...tokensA].filter((token) => tokensB.has(token)).length;
  const union = new Set([...tokensA, ...tokensB]).size;
  return intersection / union;
}

function tokenizePublicationTitle(title) {
  return normalizeSearchText(title)
    .split(" ")
    .map(stemToken)
    .filter((token) => token && token.length > 2 && !STOPWORDS.has(token));
}

function mergePublicationGroup(group) {
  if (group.length === 1) return group[0];
  const sorted = group.slice().sort(publicationPreferenceSort);
  const base = { ...sorted[0] };
  base.duplicateIds = group.map((pub) => pub.id);
  base.matchedPeople = uniqueFlat(group.map((pub) => pub.matchedPeople || []));
  base.sourcePeople = uniqueFlat(group.map((pub) => pub.sourcePeople || []));
  base.evidence = uniqueFlat(group.map((pub) => pub.evidence || []));
  base.authors = mergeAuthorLists(group);
  if (!base.doi) base.doi = group.find((pub) => pub.doi)?.doi || "";
  if (!isNumber(base.aip)) {
    const ranked = group.find((pub) => isNumber(pub.aip));
    if (ranked) {
      base.aip = ranked.aip;
      base.aipJournal = ranked.aipJournal;
      base.aipCategory = ranked.aipCategory;
      base.aipMatchMethod = ranked.aipMatchMethod;
    }
  }
  return base;
}

function publicationPreferenceSort(a, b) {
  const aipA = isNumber(a.aip) ? a.aip : -1;
  const aipB = isNumber(b.aip) ? b.aip : -1;
  if (aipB !== aipA) return aipB - aipA;
  if (Boolean(b.doi) !== Boolean(a.doi)) return Boolean(b.doi) - Boolean(a.doi);
  const sourceA = String(a.sourceType || "");
  const sourceB = String(b.sourceType || "");
  if (sourceA !== sourceB) {
    if (/repository|preprint/i.test(sourceA)) return 1;
    if (/repository|preprint/i.test(sourceB)) return -1;
  }
  return String(b.journal || "").length - String(a.journal || "").length;
}

function mergeAuthorLists(group) {
  const preferred = group.slice().sort((a, b) => (b.authors || []).length - (a.authors || []).length)[0]?.authors || [];
  const seen = new Set();
  const authors = [];
  [...preferred, ...group.flatMap((pub) => pub.authors || [])].forEach((author) => {
    const key = normalizeSearchText(author);
    if (!key || seen.has(key)) return;
    seen.add(key);
    authors.push(author);
  });
  return authors;
}

function uniqueFlat(groups) {
  return Array.from(new Set(groups.flat().filter(Boolean)));
}

function activeGrants() {
  const ids = activePeopleSet();
  return (state.grantsData?.grants || []).filter((grant) => (
    (grant.personIds || []).some((id) => ids.has(id))
  ));
}

function activeTheses() {
  const ids = activePeopleSet();
  return (state.phdsData?.theses || []).filter((thesis) => (
    (thesis.roles || []).some((role) => ids.has(role.personId))
  ));
}

function staffPublicationRecords(personId, options = {}) {
  const pool = options.countedOnly === false ? activeDisplayPublications() : activePublications();
  return pool.filter((pub) => pub.matchedPeople.includes(personId));
}

function staffGrantRecords(personId) {
  return activeGrants().filter((grant) => (grant.personIds || []).includes(personId));
}

function staffThesisRecords(personId) {
  return activeTheses().filter((thesis) => (thesis.roles || []).some((role) => role.personId === personId));
}

function staffEvidenceDocs(personId) {
  const pubs = staffPublicationRecords(personId).map((pub) => ({
    id: pub.id,
    type: "publication",
    year: pub.year,
    item: pub,
    text: [
      pub.title,
      pub.journal,
      pub.aipJournal,
      (pub.subjects || []).join(" "),
      (pub.evidence || []).join(" "),
    ].join(" "),
  }));
  const grants = staffGrantRecords(personId).map((grant) => ({
    id: grant.id,
    type: "grant",
    year: grant.year || 0,
    item: grant,
    text: [grant.scheme, grant.funder, grant.category, grant.title, grant.role].join(" "),
  }));
  const theses = staffThesisRecords(personId).map((thesis) => ({
    id: thesis.id,
    type: "phd",
    year: thesis.year || 0,
    item: thesis,
    text: [thesis.title, thesis.candidate, thesis.department, roleSummary(thesis, peopleById())].join(" "),
  }));
  return [...pubs, ...grants, ...theses];
}

function renderStaff() {
  if (!state.data || !els.staffList) return;
  const bundle = expertiseBundle(state.staffTopicQuery || "", state.staffTopicMode || "query");
  const rows = rankedStaff(bundle);
  const selected = ensureSelectedStaff(rows);
  renderStaffList(rows, bundle);
  renderStaffProfile(selected, bundle);
}

function renderExpertise() {
  if (!state.data || !els.expertiseWordcloud) return;
  if (els.expertiseSearch && els.expertiseSearch.value !== state.expertiseSearch) {
    els.expertiseSearch.value = state.expertiseSearch || "";
  }
  const signals = globalTopicSignals(activePublications()).slice(0, 90);
  renderWordCloud(els.expertiseWordcloud, signals, {
    selected: state.expertiseTopic,
    clickable: true,
  });
  const query = state.expertiseSearch || state.expertiseTopic || "";
  const mode = state.expertiseSearch === state.expertiseTopic ? state.expertiseMode : "query";
  const bundle = expertiseBundle(query, mode || "query");
  renderExpertiseStaffResults(bundle);
}

function renderExpertiseStaffResults(bundle) {
  if (!els.expertiseStaffResults) return;
  if (!bundle.raw) {
    els.expertiseSelectedTopic.innerHTML = "";
    els.expertiseStaffResults.innerHTML = `<div class="staff-empty">Select a topic from the word cloud.</div>`;
    return;
  }
  const topicPubs = topicPublicationMatches(bundle);
  const rows = rankedStaff(bundle).filter((row) => row.topicPubs > 0);
  els.expertiseSelectedTopic.innerHTML = `
    <div class="query-strip topic-query-strip">
      <span>Selected area</span>
      <strong>${escapeHtml(bundle.raw)}</strong>
      <em>${topicPubs.length} unique publication${topicPubs.length === 1 ? "" : "s"} - ${rows.length} staff member${rows.length === 1 ? "" : "s"}</em>
    </div>
  `;
  if (!rows.length) {
    els.expertiseStaffResults.innerHTML = `<div class="staff-empty">No staff publication records match this topic.</div>`;
    return;
  }
  els.expertiseStaffResults.innerHTML = `
    <div class="expertise-results-grid">
      <section class="expertise-result-panel">
        <div class="overview-panel-head">
          <div>
            <p class="eye">Relevant people</p>
            <h3 class="overview-h3">Staff with matching publications</h3>
          </div>
        </div>
        <div class="table-wrap expertise-staff-wrap"><table id="expertise-staff-table"></table></div>
      </section>
      <section class="expertise-result-panel">
        <div class="overview-panel-head">
          <div>
            <p class="eye">Relevant work</p>
            <h3 class="overview-h3">Matching publications</h3>
          </div>
        </div>
        <div id="expertise-publication-list" class="topic-publication-list"></div>
      </section>
    </div>
  `;
  const tableRows = rows.map((row) => [
    `<button class="person-link" type="button" data-expertise-staff-id="${escapeHtml(row.person.id)}">${escapeHtml(row.person.display)}</button><br><span class="small-muted">${escapeHtml(row.person.name)}</span>`,
    row.topicPubs,
    `${formatPercent(row.topicPubPct)} of counted publications`,
  ]);
  setTable(document.getElementById("expertise-staff-table"), ["Staff member", "Pubs", "Share"], tableRows, [false, true, false]);
  renderTopicPublicationList(document.getElementById("expertise-publication-list"), topicPubs);
}

function rankedStaff(bundle) {
  const people = activePeople();
  const rows = people.map((person) => staffSearchStats(person, bundle));
  if (bundle.raw) {
    return rows
      .filter((row) => row.score > 0)
      .sort((a, b) => b.topicPubPct - a.topicPubPct || b.topicPubs - a.topicPubs || b.score - a.score || a.person.display.localeCompare(b.person.display));
  }
  return rows.sort((a, b) => a.person.display.localeCompare(b.person.display));
}

function staffSearchStats(person, bundle) {
  const pubs = staffPublicationRecords(person.id);
  const grants = staffGrantRecords(person.id);
  const theses = staffThesisRecords(person.id);
  const aipPubs = pubs.filter((pub) => isNumber(pub.aip));
  const matchingPublicationDocs = bundle.raw ? topicPublicationMatches(bundle, person.id)
    .map((pub) => ({
      id: pub.id,
      type: "publication",
      year: pub.year || 0,
      item: pub,
      text: publicationTopicText(pub),
      matchScore: scorePublicationAgainstBundle(pub, bundle),
    }))
    : [];
  const nonPublicationDocs = bundle.raw ? staffEvidenceDocs(person.id)
    .filter((doc) => doc.type !== "publication")
    .map((doc) => ({
      ...doc,
      matchScore: scoreTextAgainstBundle(doc.text, bundle),
    }))
    .filter((doc) => doc.matchScore > 0)
    : [];
  const matchingDocs = [...matchingPublicationDocs, ...nonPublicationDocs];
  return {
    person,
    publications: pubs.length,
    high90Aip: pubs.filter((pub) => isNumber(pub.aip) && pub.aip >= 90).length,
    highAip: pubs.filter((pub) => isNumber(pub.aip) && pub.aip >= 95).length,
    meanAip: aipPubs.length ? aipPubs.reduce((sum, pub) => sum + pub.aip, 0) / aipPubs.length : null,
    grants: grants.length,
    phds: theses.length,
    score: matchingDocs.reduce((sum, doc) => sum + doc.matchScore, 0),
    topicPubs: matchingPublicationDocs.length,
    topicPubPct: pubs.length ? matchingPublicationDocs.length / pubs.length : 0,
    topicGrants: matchingDocs.filter((doc) => doc.type === "grant").length,
    topicPhds: matchingDocs.filter((doc) => doc.type === "phd").length,
    matchingDocs,
  };
}

function ensureSelectedStaff(rows) {
  if (!rows.length) {
    state.selectedStaffId = "";
    return null;
  }
  if (!state.selectedStaffId) {
    return null;
  }
  if (!rows.some((row) => row.person.id === state.selectedStaffId)) {
    state.selectedStaffId = "";
    return null;
  }
  return rows.find((row) => row.person.id === state.selectedStaffId) || rows[0];
}

function renderStaffList(rows, bundle) {
  if (!rows.length) {
    els.staffList.innerHTML = `<div class="staff-empty">No staff records for the current filters.</div>`;
    return;
  }
  els.staffList.innerHTML = rows.map((row) => {
    const selected = row.person.id === state.selectedStaffId;
    const meta = bundle.raw
      ? `${formatPercent(row.topicPubPct)} - ${row.topicPubs} matching pubs`
      : `${row.publications} pubs`;
    return `<button class="staff-row${selected ? " on" : ""}" type="button" data-staff-id="${escapeHtml(row.person.id)}">
      <span class="staff-row-main">
        ${personPhoto(row.person, "staff-row-photo")}
        <span>
          <strong>${escapeHtml(row.person.display)}</strong>
          <em>${escapeHtml(row.person.name)}</em>
        </span>
      </span>
      <span class="staff-row-meta">${escapeHtml(meta)}</span>
    </button>`;
  }).join("");
}

function renderStaffProfile(row, bundle) {
  if (!row) {
    els.staffProfile.innerHTML = `<div class="staff-empty">No profile selected.</div>`;
    els.staffTopics.innerHTML = "";
    if (els.staffSuggestions) els.staffSuggestions.innerHTML = "";
    els.staffRelated.innerHTML = "";
    els.staffPublicationEye.textContent = "Publications";
    els.staffPublicationTitle.textContent = "Selected staff publications";
    setEmptyTable(els.staffPublicationTable, "No matching publications.");
    return;
  }
  const person = row.person;
  const queryStrip = bundle.raw ? `
    <div class="query-strip">
      <span>Matches for</span>
      <strong>${escapeHtml(bundle.raw)}</strong>
      <em>${escapeHtml(matchSummary(row))}</em>
    </div>
  ` : "";
  els.staffProfile.innerHTML = `
    <div class="staff-profile-head">
      ${personPhoto(person, "staff-profile-photo")}
      <div>
        <p class="eye">${escapeHtml(person.display)}</p>
        <h3>${escapeHtml(person.name)}</h3>
      </div>
    </div>
    ${queryStrip}
    <div class="staff-metrics">
      ${staffMetric("Publications", row.publications)}
      ${staffMetric("AIP >= 90", row.high90Aip)}
      ${staffMetric("AIP >= 95", row.highAip)}
      ${staffMetric("Grants", row.grants)}
      ${staffMetric("PhDs", row.phds)}
    </div>
  `;
  renderStaffTopics(person.id);
  renderStaffSuggestions(person.id);
  renderStaffRelated(person.id, bundle, row);
  renderStaffPublications(person.id, bundle, row);
}

function personPhoto(person, className) {
  if (!person?.photo) return "";
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(person.photo)}" alt="" loading="lazy">`;
}

function staffMetric(label, value) {
  return `<div class="staff-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function matchSummary(row) {
  const parts = [`${formatPercent(row.topicPubPct)} of publications`, `${row.topicPubs} publication${row.topicPubs === 1 ? "" : "s"}`];
  if (row.topicGrants) parts.push(`${row.topicGrants} grant${row.topicGrants === 1 ? "" : "s"}`);
  if (row.topicPhds) parts.push(`${row.topicPhds} PhD${row.topicPhds === 1 ? "" : "s"}`);
  return parts.join(", ");
}

function formatPercent(value) {
  if (!isNumber(value)) return "0%";
  return `${Math.round(value * 100)}%`;
}

function renderStaffTopics(personId) {
  const signals = topicSignals(personId).slice(0, 12);
  if (!signals.length) {
    els.staffTopics.innerHTML = `<span class="small-muted">No topic signals in the current data window.</span>`;
    return;
  }
  els.staffTopics.innerHTML = signals.map((signal) => (
    `<button class="topic-chip" type="button" data-topic-query="${escapeHtml(signal.query || signal.label)}" data-topic-kind="${signal.semantic ? "family" : "phrase"}">${escapeHtml(signal.label)} <b>${signal.count}</b></button>`
  )).join("");
}

function renderStaffSuggestions(personId) {
  if (!els.staffSuggestions) return;
  const suggestions = staffCollaborationSuggestions(personId).slice(0, 5);
  if (!suggestions.length) {
    els.staffSuggestions.innerHTML = `<p class="small-muted">No strong overlap signals in the current data window.</p>`;
    return;
  }
  els.staffSuggestions.innerHTML = suggestions.map((item) => `
    <article class="suggestion-card">
      <button class="person-link suggestion-name" type="button" data-staff-id="${escapeHtml(item.person.id)}">${escapeHtml(item.person.display)}</button>
      <p>${escapeHtml(item.person.name)}</p>
      <div class="suggestion-reasons">
        ${item.reasons.map((reason) => `<span>${escapeHtml(reason)}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function staffCollaborationSuggestions(personId) {
  const people = activePeople().filter((person) => person.id !== personId);
  const selectedProfile = staffOverlapProfile(personId);
  return people.map((person) => {
    const otherProfile = staffOverlapProfile(person.id);
    const sharedTopics = intersectSets(selectedProfile.topics, otherProfile.topics).slice(0, 4);
    const sharedExternal = intersectSets(selectedProfile.externalAuthors, otherProfile.externalAuthors).slice(0, 4);
    const sharedGrants = intersectSets(selectedProfile.grants, otherProfile.grants);
    const sharedPartners = intersectSets(selectedProfile.partners, otherProfile.partners).slice(0, 3);
    const score = sharedTopics.length * 3 + sharedExternal.length * 4 + sharedGrants.length * 6 + sharedPartners.length * 3;
    const reasons = [];
    if (sharedTopics.length) reasons.push(`Topics: ${sharedTopics.join(", ")}`);
    if (sharedExternal.length) reasons.push(`External coauthors: ${sharedExternal.map((id) => selectedProfile.externalAuthorLabels.get(id) || id).join(", ")}`);
    if (sharedPartners.length) reasons.push(`Institutions: ${sharedPartners.map((id) => selectedProfile.partnerLabels.get(id) || id).join(", ")}`);
    if (sharedGrants.length) reasons.push(`${sharedGrants.length} shared grant${sharedGrants.length === 1 ? "" : "s"}`);
    return { person, score, reasons };
  })
    .filter((item) => item.score > 0 && item.reasons.length)
    .sort((a, b) => b.score - a.score || a.person.display.localeCompare(b.person.display));
}

function staffOverlapProfile(personId) {
  const topics = new Set(semanticTopicSignals(staffPublicationRecords(personId), { minCount: 1, phraseMinCount: 2 })
    .slice(0, 18)
    .map((signal) => signal.query || signal.label));
  const externalAuthorLabels = new Map();
  const externalAuthors = new Set();
  staffPublicationRecords(personId).forEach((pub) => {
    externalAuthorsForPublication(pub).forEach((author) => {
      const id = externalAuthorId(author);
      externalAuthors.add(id);
      externalAuthorLabels.set(id, externalAuthorLabel(author));
    });
  });
  const grants = new Set(staffGrantRecords(personId).map((grant) => grant.id));
  const partnerLabels = new Map();
  const partners = new Set();
  (state.externalPartnersData?.partners || []).forEach((partner) => {
    const staffIds = new Set((partner.publications || []).flatMap((pub) => pub.staffIds || []));
    if (!staffIds.has(personId)) return;
    partners.add(partner.id);
    partnerLabels.set(partner.id, partner.institution);
  });
  return { topics, externalAuthors, externalAuthorLabels, grants, partners, partnerLabels };
}

function intersectSets(a, b) {
  return Array.from(a).filter((value) => b.has(value));
}

function showTopicOverlay(query, mode = "query") {
  if (!els.topicOverlay || !query) return;
  const bundle = expertiseBundle(query, mode);
  const people = peopleById();
  const rows = rankedStaff(bundle)
    .filter((row) => row.topicPubs > 0)
    .sort((a, b) => b.topicPubPct - a.topicPubPct || b.topicPubs - a.topicPubs || a.person.display.localeCompare(b.person.display));
  const pubs = topicPublicationMatches(bundle);

  els.topicOverlayTitle.textContent = query;
  els.topicOverlaySummary.textContent = `${pubs.length} counted publication${pubs.length === 1 ? "" : "s"} and ${rows.length} staff member${rows.length === 1 ? "" : "s"} match this topic under the current filters.`;
  els.topicOverlayStaff.innerHTML = rows.length ? rows.slice(0, 8).map((row) => `
    <div class="topic-detail-row">
      <strong>${escapeHtml(row.person.display)}</strong>
      <span>${escapeHtml(formatPercent(row.topicPubPct))} of counted publications - ${row.topicPubs} publication${row.topicPubs === 1 ? "" : "s"}</span>
    </div>
  `).join("") : `<p class="small-muted">No staff-level matches under the current filters.</p>`;
  els.topicOverlayPublications.innerHTML = pubs.length ? pubs.slice(0, 8).map((pub) => `
    <div class="topic-detail-row">
      <strong>${escapeHtml(pub.title)}</strong>
      <span>${escapeHtml(String(pub.year || ""))} - ${escapeHtml(displayJournalName(pub.journal || pub.aipJournal || "Unknown journal"))}${pub.matchedPeople?.length ? ` - ${escapeHtml(pub.matchedPeople.map((id) => people.get(id)?.display || id).sort().join(", "))}` : ""}</span>
    </div>
  `).join("") : `<p class="small-muted">No publication examples under the current filters.</p>`;
  els.topicOverlay.hidden = false;
  document.body.classList.add("overlay-open");
}

function closeTopicOverlay() {
  if (!els.topicOverlay) return;
  els.topicOverlay.hidden = true;
  document.body.classList.remove("overlay-open");
}

function renderStaffRelated(personId, bundle, row) {
  let summaryPubs = staffPublicationRecords(personId);
  if (bundle.raw) {
    const matchingPubIds = new Set(row.matchingDocs.filter((doc) => doc.type === "publication").map((doc) => doc.id));
    summaryPubs = summaryPubs.filter((pub) => matchingPubIds.has(pub.id));
  }
  const journalItems = topStaffJournals(summaryPubs);
  const coauthorItems = topStaffCoauthors(personId, summaryPubs);
  const grants = staffGrantRecords(personId);
  const theses = staffThesisRecords(personId);
  let grantItems = grants.map((grant) => ({ type: grantDisplayLabel(grant), year: grant.year || "", title: grant.title, sourceUrl: grant.sourceUrl, sourceLabel: grant.sourceLabel }));
  let thesisItems = theses.map((thesis) => ({ type: "PhD", year: thesis.year || "", title: `${thesis.candidate}: ${thesis.title}`, sourceUrl: thesis.sourceUrl, sourceLabel: thesis.sourceLabel }));
  if (bundle.raw) {
    grantItems = row.matchingDocs
      .filter((doc) => doc.type === "grant")
      .map((doc) => ({
        type: grantDisplayLabel(doc.item),
        year: doc.year || "",
        title: doc.item.title,
        sourceUrl: doc.item.sourceUrl,
        sourceLabel: doc.item.sourceLabel,
      }));
    thesisItems = row.matchingDocs
      .filter((doc) => doc.type === "phd")
      .map((doc) => ({
        type: "PhD",
        year: doc.year || "",
        title: `${doc.item.candidate}: ${doc.item.title}`,
        sourceUrl: doc.item.sourceUrl,
        sourceLabel: doc.item.sourceLabel,
      }));
  }
  grantItems = grantItems.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  thesisItems = thesisItems.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  if (!journalItems.length && !coauthorItems.length && !grantItems.length && !thesisItems.length) {
    els.staffRelated.innerHTML = "";
    return;
  }
  els.staffRelated.innerHTML = [
    relatedSection(bundle.raw ? `Journals matching "${bundle.raw}"` : "Journals", journalItems),
    relatedSection(bundle.raw ? `Coauthors matching "${bundle.raw}"` : "Coauthors", coauthorItems),
    relatedSection(bundle.raw ? `Grants matching "${bundle.raw}"` : "Grants", grantItems),
    relatedSection(bundle.raw ? `PhD supervision matching "${bundle.raw}"` : "PhD supervision", thesisItems),
  ].join("");
}

function topStaffJournals(pubs) {
  const byJournal = new Map();
  pubs.forEach((pub) => {
    const journal = pub.aipJournal || pub.journal;
    if (!journal) return;
    if (!byJournal.has(journal)) {
      byJournal.set(journal, { journal, journalDisplay: displayJournalName(pub.journal || journal), count: 0, aip: null, rankableJournal: pub.rankableJournal !== false });
    }
    const row = byJournal.get(journal);
    row.count += 1;
    row.journalDisplay = preferredJournalDisplay(row.journalDisplay, pub.journal || journal);
    if (isNumber(pub.aip)) row.aip = pub.aip;
    if (pub.rankableJournal === false) row.rankableJournal = false;
  });
  return Array.from(byJournal.values())
    .sort((a, b) => b.count - a.count || (b.aip || -1) - (a.aip || -1) || a.journal.localeCompare(b.journal))
    .slice(0, 6)
    .map((row) => ({
      type: `${row.count} ${row.count === 1 ? "pub" : "pubs"}`,
      year: "",
      title: `${journalDisplayName(row)}${isNumber(row.aip) ? ` (AIP ${row.aip.toFixed(1)})` : ""}`,
    }));
}

function topStaffCoauthors(personId, pubs) {
  const people = peopleById();
  const byCoauthor = new Map();
  pubs.forEach((pub) => {
    const seen = new Set();
    pub.matchedPeople.forEach((id) => {
      if (id === personId || !people.has(id)) return;
      const key = `roster:${id}`;
      if (seen.has(key)) return;
      seen.add(key);
      addCoauthorStat(byCoauthor, key, people.get(id).display, "roster", pub.id);
    });
    externalAuthorsForPublication(pub).forEach((author) => {
      const key = externalAuthorId(author);
      if (seen.has(key)) return;
      seen.add(key);
      addCoauthorStat(byCoauthor, key, externalAuthorLabel(author), "external", pub.id);
    });
  });
  return Array.from(byCoauthor.values())
    .map((row) => ({ ...row, count: row.pubIds.size }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 8)
    .map((row) => ({
      type: `${row.count} shared`,
      year: "",
      title: `${row.label}${row.scope === "external" ? " (external)" : ""}`,
    }));
}

function addCoauthorStat(map, key, label, scope, pubId) {
  if (!map.has(key)) map.set(key, { key, label, scope, pubIds: new Set() });
  if (scope === "external" && betterExternalLabel(label, map.get(key).label)) map.get(key).label = label;
  map.get(key).pubIds.add(pubId);
}

function relatedSection(title, items) {
  if (!items.length) return "";
  return `<h3 class="sub-h2">${escapeHtml(title)}</h3>
    <div class="related-list related-list-separated">
      ${items.map((item) => `
        <div class="related-row">
          <span>${escapeHtml(item.type)} ${escapeHtml(item.year)}</span>
          <p>${escapeHtml(item.title)}</p>
          ${item.sourceUrl ? `<a class="source-link" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(item.sourceLabel || "Source")}</a>` : ""}
        </div>
      `).join("")}
    </div>`;
}

function grantDisplayLabel(grant) {
  const scheme = String(grant.scheme || "").trim();
  const funder = String(grant.funder || "").trim();
  if (/spinoza/i.test(scheme)) return "NWO Spinoza";
  if (/veni|vidi|vici/i.test(scheme) && /nwo/i.test(funder)) return `NWO ${scheme}`;
  if (/advanced grant|starting grant|consolidator grant|erc project/i.test(scheme) && /erc|european research council/i.test(funder)) return `ERC ${scheme}`;
  if (/nwo/i.test(funder) && scheme) return /^nwo/i.test(scheme) ? scheme : `NWO ${scheme}`;
  return scheme || funder || "Grant";
}

function renderStaffPublications(personId, bundle, row) {
  let pubs = staffPublicationRecords(personId, { countedOnly: false }).slice();
  if (bundle.raw) {
    const matchingPubIds = new Set((row?.matchingDocs || [])
      .filter((doc) => doc.type === "publication")
      .map((doc) => doc.id));
    pubs = pubs.filter((pub) => matchingPubIds.has(pub.id));
    els.staffPublicationEye.textContent = "Expertise match";
    els.staffPublicationTitle.textContent = `Publications matching "${bundle.raw}"`;
  } else {
    els.staffPublicationEye.textContent = "Publications";
    els.staffPublicationTitle.textContent = "Publications";
  }
  pubs.sort((a, b) => b.year - a.year || (b.aip || -1) - (a.aip || -1));
  if (!pubs.length) {
    setEmptyTable(els.staffPublicationTable, bundle.raw ? "No publications match this query for this staff member." : "No publications for this staff member.");
    return;
  }
  const rows = pubs.map((pub) => [
    pub.year,
    publicationCell(pub),
    escapeHtml(displayJournalName(pub.journal || pub.aipJournal || "Unknown")),
    aipBadge(pub.aip, pub),
  ]);
  setTable(els.staffPublicationTable, ["Year", "Publication", "Journal", "AIP"], rows, [true, false, false, true]);
}

function topicSignals(personId) {
  return semanticTopicSignals(staffPublicationRecords(personId), { minCount: 1, phraseMinCount: 1 })
    .slice(0, 18);
}

function topicPublicationMatches(bundle, personId = "") {
  if (!bundle.raw) return [];
  return activePublications()
    .filter((pub) => !personId || pub.matchedPeople.includes(personId))
    .map((pub) => ({ pub, score: scorePublicationAgainstBundle(pub, bundle) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => Number(b.pub.year || 0) - Number(a.pub.year || 0) || b.score - a.score || a.pub.title.localeCompare(b.pub.title))
    .map((row) => row.pub);
}

function scorePublicationAgainstBundle(pub, bundle) {
  if (bundle.mode === "family" && bundle.families.length) {
    const familyHit = (pub.topicFamilies || []).some((label) => bundle.families.includes(label));
    return familyHit ? 100 : 0;
  }
  return scoreTextAgainstBundle(publicationTopicText(pub), bundle);
}

function renderTopicPublicationList(container, pubs) {
  if (!container) return;
  const people = peopleById();
  if (!pubs.length) {
    container.innerHTML = `<p class="small-muted">No matching publications under the current filters.</p>`;
    return;
  }
  container.innerHTML = pubs.map((pub) => {
    const staff = (pub.matchedPeople || [])
      .map((id) => people.get(id)?.display || id)
      .sort()
      .join(", ");
    return `<div class="topic-publication-row">
      <p class="grant-kicker">${escapeHtml(String(pub.year || ""))}${pub.journal || pub.aipJournal ? ` - ${escapeHtml(displayJournalName(pub.journal || pub.aipJournal))}` : ""}${isNumber(pub.aip) ? ` - AIP ${escapeHtml(pub.aip.toFixed(1))}` : ""}</p>
      <p class="grant-title">${escapeHtml(pub.title)}</p>
      ${staff ? `<p class="grant-meta">${escapeHtml(staff)}</p>` : ""}
    </div>`;
  }).join("");
}

function globalTopicSignals(pubs) {
  return semanticTopicSignals(pubs, { minCount: 6, phraseMinCount: 6 });
}

function publicationTopicText(pub) {
  return [
    pub.title,
    (pub.subjects || []).join(" "),
  ].join(" ");
}

function publicationSearchText(pub) {
  return [
    pub.title,
    pub.journal,
    pub.aipJournal,
    (pub.subjects || []).join(" "),
    (pub.evidence || []).join(" "),
    (pub.authors || []).join(" "),
  ].join(" ");
}

function semanticTopicSignals(pubs, options = {}) {
  const minCount = options.minCount ?? 3;
  const phraseMinCount = options.phraseMinCount ?? minCount;
  const familySignals = publicationFamilySignals(pubs)
    .filter((signal) => signal.count >= minCount);
  const familyLabels = new Set(familySignals.map((signal) => normalizeSearchText(signal.label)));
  const phraseSignals = publicationTopicSignals(pubs, { minCount: phraseMinCount })
    .filter((signal) => !familyLabels.has(normalizeSearchText(signal.label)))
    .filter((signal) => !familySignals.some((family) => normalizedHasPhrase(family.label, signal.label)));
  return [...familySignals, ...phraseSignals]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 120);
}

function publicationFamilySignals(pubs) {
  const counts = new Map();
  pubs.forEach((pub) => {
    const labels = new Set(pub.topicFamilies || []);
    if (!labels.size) {
      const text = publicationTopicText(pub);
      EXPERTISE_FAMILIES.forEach(([label, terms]) => {
        if (scoreTextAgainstBundle(text, familyBundle(label, terms)) > 0) labels.add(label);
      });
    }
    labels.forEach((label) => counts.set(label, (counts.get(label) || 0) + 1));
  });
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, query: label, count, semantic: true }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function publicationTopicSignals(pubs, options = {}) {
  const minCount = options.minCount ?? 3;
  const counts = new Map();
  pubs.forEach((pub) => {
    publicationTopicCandidates(pub).forEach((phrase) => {
      counts.set(phrase, (counts.get(phrase) || 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, query: label, count }))
    .filter((signal) => signal.count >= minCount)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .filter((signal, _, signals) => !coveredByLongerTopic(signal, signals))
    .slice(0, 120);
}

function coveredByLongerTopic(signal, signals) {
  const words = signal.label.split(" ");
  return signals.some((other) => {
    if (other === signal || other.count < signal.count * 0.7) return false;
    const otherWords = other.label.split(" ");
    if (otherWords.length <= words.length) return false;
    return normalizedHasPhrase(other.label, signal.label);
  });
}

function publicationTopicCandidates(pub) {
  const phrases = new Set();
  const texts = [pub.title, ...(pub.subjects || [])].map(String).filter(Boolean);
  texts.forEach((text) => {
    const tokens = topicTokens(text);
    for (let size = 2; size <= 4; size += 1) {
      for (let idx = 0; idx <= tokens.length - size; idx += 1) {
        const phraseTokens = tokens.slice(idx, idx + size);
        if (!validTopicPhrase(phraseTokens)) continue;
        phrases.add(phraseTokens.join(" "));
      }
    }
  });
  return Array.from(phrases);
}

function topicTokens(value) {
  return normalizeSearchText(value)
    .split(" ")
    .filter((token) => token && !TOPIC_STOPWORDS.has(token) && !EXTRA_TOPIC_STOPWORDS.has(token));
}

function validTopicPhrase(tokens) {
  if (tokens.length < 2) return false;
  if (tokens.some((token) => token.length < 3 || EXTRA_TOPIC_STOPWORDS.has(token))) return false;
  if (tokens.every((token) => GENERIC_TOPIC_NOUNS.has(token))) return false;
  const phrase = tokens.join(" ");
  if (GENERIC_TOPIC_PHRASES.has(phrase)) return false;
  return tokens.some((token) => DOMAIN_TOPIC_TERMS.has(token) || token.length >= 6);
}

function renderWordCloud(container, signals, options = {}) {
  if (!container) return;
  if (!signals.length) {
    container.innerHTML = `<span class="small-muted">No topic signals in the current data window.</span>`;
    return;
  }
  const max = Math.max(...signals.map((signal) => signal.count));
  const min = Math.min(...signals.map((signal) => signal.count));
  container.innerHTML = signals.map((signal) => {
    const level = wordCloudLevel(signal.count, min, max);
    const selected = normalizeSearchText(options.selected) === normalizeSearchText(signal.query || signal.label);
    const attrs = options.clickable
      ? `button type="button" data-topic-query="${escapeHtml(signal.query || signal.label)}" data-topic-kind="${signal.semantic ? "family" : "phrase"}"`
      : `span`;
    const close = options.clickable ? "button" : "span";
    return `<${attrs} class="word-cloud-item word-cloud-${level}${selected ? " on" : ""}" title="${escapeHtml(`${signal.count} publication matches`)}">
      ${escapeHtml(signal.label)} <b>${escapeHtml(String(signal.count))}</b>
    </${close}>`;
  }).join("");
}

function wordCloudLevel(count, min, max) {
  if (max <= min) return 3;
  return Math.max(1, Math.min(6, 1 + Math.round(((count - min) / (max - min)) * 5)));
}

function expertiseBundle(query, mode = "query") {
  return buildExpertiseBundle(query, mode);
}

function buildExpertiseBundle(query, mode = "query") {
  const raw = query.trim();
  const normalized = normalizeSearchText(raw);
  const terms = new Map();
  let families = [];
  if (normalized && mode === "family") {
    families = EXPERTISE_FAMILIES.filter(([label]) => normalizeSearchText(label) === normalized);
  } else if (normalized && mode === "query") {
    families = EXPERTISE_FAMILIES.filter(([label, familyTerms]) => queryMatchesFamily(normalized, label, familyTerms));
  }
  families.forEach(([label, familyTerms]) => {
    addSearchTerm(terms, label, 2.5);
    familyTerms.forEach((term) => addSearchTerm(terms, term, 1.4));
  });
  if (normalized.includes(" ")) {
    terms.set(normalized, 2);
  } else {
    tokenize(normalized).forEach((token) => addSearchTerm(terms, token, 1));
  }
  return { raw, normalized, mode, terms: Array.from(terms.entries()), families: families.map(([label]) => label) };
}

function bundleFromTerms(sourceTerms) {
  const terms = new Map();
  sourceTerms.forEach((term) => addSearchTerm(terms, term, 1));
  return { raw: sourceTerms.join(" "), normalized: "", terms: Array.from(terms.entries()), families: [] };
}

function familyBundle(label, terms) {
  return bundleFromTerms([label, ...terms]);
}

function queryMatchesFamily(normalizedQuery, label, terms) {
  if (!normalizedQuery) return false;
  const queryTokens = new Set(tokenize(normalizedQuery));
  return [label, ...terms].some((term) => {
    const normalizedTerm = normalizeSearchText(term);
    if (!normalizedTerm) return false;
    if (normalizedTerm.includes(normalizedQuery)) return true;
    if (normalizedQuery.includes(normalizedTerm) && normalizedTerm.includes(" ")) return true;
    if (queryTokens.size > 1) return false;
    return tokenize(normalizedTerm).some((token) => queryTokens.has(token));
  });
}

function addSearchTerm(map, term, weight) {
  const normalized = normalizeSearchText(term);
  if (!normalized || STOPWORDS.has(normalized)) return;
  if (normalized.includes(" ")) {
    map.set(normalized, Math.max(map.get(normalized) || 0, weight));
    return;
  }
  const token = stemToken(normalized);
  if (!token || STOPWORDS.has(token)) return;
  map.set(token, Math.max(map.get(token) || 0, weight));
}

function queryMatchesTerm(queryText, term) {
  if (!queryText) return false;
  const normalized = normalizeSearchText(term);
  if (!normalized) return false;
  if (normalized.includes(" ") && queryText.includes(normalized)) return true;
  const queryTokens = new Set(tokenize(queryText));
  return tokenize(normalized).some((token) => queryTokens.has(token));
}

function scoreTextAgainstBundle(text, bundle) {
  if (!bundle.terms.length) return 0;
  const normalized = normalizeSearchText(text);
  const tokens = new Set(tokenize(normalized));
  let score = 0;
  bundle.terms.forEach(([term, weight]) => {
    if (term.includes(" ")) {
      if (normalizedHasPhrase(normalized, term)) score += weight * 2.5;
      return;
    }
    if (tokens.has(term)) score += weight;
  });
  return score;
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bwell being\b/g, "wellbeing")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeSearchText(value)
    .split(" ")
    .map(stemToken)
    .filter((token) => token && !STOPWORDS.has(token));
}

function stemToken(token) {
  if (token.length > 5 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  if (token.length > 4 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

function countedPublication(pub) {
  const title = normalizeSearchText(pub.title || "");
  const kind = normalizeSearchText(pub.publicationKind || "");
  const sourceType = normalizeSearchText(pub.sourceType || "");
  const source = normalizeSearchText([pub.journal, pub.aipJournal, pub.publisher, pub.publicationKind, pub.sourceType].join(" "));
  const titleWords = ` ${title} `;
  if (
    title === "editorial"
    || title === "acknowledgement"
    || title === "acknowledgment"
    || title.startsWith("editorial ")
    || title.startsWith("commentary ")
    || title.startsWith("commentary on ")
    || title.startsWith("comment on ")
    || title.startsWith("comments on ")
    || title.startsWith("reply to ")
    || title.startsWith("response to ")
    || title.startsWith("author response")
    || title.startsWith("publisher correction")
    || title.startsWith("author correction")
    || title.startsWith("correction to ")
    || title.startsWith("corrigendum to ")
    || title.startsWith("addendum to ")
    || title.startsWith("retraction ")
    || title.startsWith("expression of concern")
    || title.startsWith("from the editors")
    || title.startsWith("guest editorial")
    || title.includes(" introduction to the special issue")
    || title.includes(" comment on ")
    || titleWords.includes(" editorial ")
    || titleWords.includes(" commentary ")
    || title.startsWith("acknowledgment ")
    || title.startsWith("acknowledgement ")
    || title.includes("ad hoc reviewers")
    || title.includes("reviewers ")
    || ["commentary", "comment", "editorial", "book review", "erratum", "correction", "corrigendum", "addendum", "letter", "reply"].includes(kind)
    || ["commentary", "comment", "editorial", "book review", "erratum", "correction", "corrigendum", "addendum", "letter", "reply"].includes(sourceType)
    || kind.includes("commentary")
    || sourceType.includes("commentary")
    || kind.includes("correction")
    || sourceType.includes("correction")
    || kind.includes("corrigendum")
    || sourceType.includes("corrigendum")
    || kind.includes("letter")
    || sourceType.includes("letter")
    || kind.includes("out of scope")
    || sourceType.includes("out of scope")
    || editorialLikePublication(pub, title, source)
  ) return false;
  if (medicalFalsePositivePublication(pub)) return false;
  if (
    source.includes("conference")
    || kind.includes("conference")
    || sourceType.includes("conference")
    || ((source.includes("proceedings") || kind.includes("proceedings")) && !isRankableProceedingsJournal(pub))
  ) return false;
  if (pub.rankableJournal !== false) return true;
  return false;
}

function displayPublication(pub) {
  return !hiddenProceedingsPublication(pub);
}

function hiddenProceedingsPublication(pub) {
  const kind = normalizeSearchText(pub.publicationKind || "");
  const sourceType = normalizeSearchText(pub.sourceType || "");
  const source = normalizeSearchText([pub.journal, pub.aipJournal, pub.publisher, pub.publicationKind, pub.sourceType].join(" "));
  if (isRankableProceedingsJournal(pub)) return false;
  return source.includes("academy of management proceedings")
    || source.includes("conference")
    || kind.includes("conference")
    || sourceType.includes("conference")
    || source.includes("proceedings")
    || kind.includes("proceedings")
    || sourceType.includes("proceedings");
}

function editorialLikePublication(pub, title, source) {
  const doi = String(pub.doi || "").toLowerCase().trim();
  if (source.includes("academy of management journal") && /^10\.5465\/amj\.\d{4}\.400\d/.test(doi)) return true;
  if (title.includes("review and best practice recommendations") && source.includes("academy of management journal")) return true;
  return false;
}

function isRankableProceedingsJournal(pub) {
  const source = normalizeSearchText([pub.journal, pub.aipJournal].join(" "));
  return source.includes("proceedings of the national academy of sciences") || source === "pnas" || source.includes(" pnas ");
}

function medicalFalsePositivePublication(pub) {
  if (publicationHasVerifiedPersonEvidence(pub)) return false;
  const text = [
    pub.title,
    pub.journal,
    pub.aipJournal,
    pub.aipCategory,
    pub.publisher,
    (pub.subjects || []).join(" "),
  ].join(" ");
  if (!MEDICAL_FALSE_POSITIVE_PATTERNS.some((pattern) => pattern.test(text))) return false;
  return !MEDICAL_CONTEXT_RESCUE_PATTERNS.some((pattern) => pattern.test(text));
}

function publicationHasVerifiedPersonEvidence(pub) {
  const evidence = (pub.evidence || []).join(" ");
  return evidence.includes("RUG staff publication page") || evidence.includes("Crossref ORCID matched");
}

function renderOverview() {
  if (!state.data) return;
  const pubs = overviewPublications();
  const aipPubs = pubs.filter((pub) => isNumber(pub.aip));
  const journals = aggregateJournals(pubs);
  const grants = activeGrants();
  const theses = activeTheses();
  els.metrics.innerHTML = [
    metric("Total publications", pubs.length),
    metric("Publishing outlets", journals.length),
    metric("Defended PhDs", theses.length),
    metric("Competitive grants", grants.length),
  ].join("");

  renderYearBars(pubs);
  renderAipBars(aipPubs);
  renderOverviewTopicCloud(pubs);
  renderOverviewJournals(journals);
  renderOverviewGrants(grants);
  renderOverviewPhds(theses);
}

function renderResources() {
  if (!els.resourceOpportunities || !els.resourceTips) return;
  const opportunities = state.resourceData?.opportunities || [];
  if (!opportunities.length) {
    els.resourceOpportunities.innerHTML = `<div class="staff-empty">No grant opportunity data loaded.</div>`;
  } else {
    const stageOrder = ["Early Career", "Mid-Career", "Senior", "Consortium", "Watch List"];
    els.resourceOpportunities.innerHTML = stageOrder
      .map((stage) => {
        const rows = opportunities.filter((item) => item.stage === stage);
        if (!rows.length) return "";
        return `<section class="grant-stage">
          <div class="grant-stage-head">
            <h4>${escapeHtml(stage)}</h4>
            <span>${rows.length} option${rows.length === 1 ? "" : "s"}</span>
          </div>
          <div class="grant-stage-grid">
            ${rows.map(resourceOpportunityCard).join("")}
          </div>
        </section>`;
      })
      .join("");
  }

  const tips = (state.resourceData?.tips || []).filter((tip) => tip.topic && tip.detail).slice(0, 12);
  els.resourceTips.innerHTML = tips.length
    ? tips.map((tip) => `<article class="resource-tip">
        <strong>${escapeHtml(tip.topic)}</strong>
        ${tip.appliesTo ? `<span>${escapeHtml(tip.appliesTo)}</span>` : ""}
        <p>${escapeHtml(clipText(tip.detail, 280))}</p>
      </article>`).join("")
    : `<div class="staff-empty">No workbook tips loaded.</div>`;
}

function resourceOpportunityCard(item) {
  const title = item.link
    ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener">${escapeHtml(item.name)}</a>`
    : escapeHtml(item.name);
  const facts = [
    item.funder,
    item.amount,
    item.duration,
    item.deadline ? `Deadline: ${item.deadline}` : "",
    item.successRate ? `Success: ${item.successRate}` : "",
  ].filter(Boolean);
  return `<article class="grant-opportunity-card">
    <h5>${title}</h5>
    <p class="grant-opportunity-meta">${escapeHtml(facts.join(" - "))}</p>
    ${item.eligibility ? `<p><strong>Eligibility</strong> ${escapeHtml(clipText(item.eligibility, 150))}</p>` : ""}
    ${item.tips ? `<p><strong>Tip</strong> ${escapeHtml(clipText(item.tips, 260))}</p>` : ""}
  </article>`;
}

function clipText(value, maxLength) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function overviewPublications() {
  return activePublications().filter((pub) => pub.year >= overviewStartYear());
}

function metric(label, value, sub = "", suffix = "", suffixLabel = "SD") {
  const suffixText = suffix
    ? ` <span class="metric-sd">(${suffixLabel ? `${escapeHtml(suffixLabel)} ` : ""}${escapeHtml(suffix)})</span>`
    : "";
  return `<div class="metric">
    <p class="metric-label">${escapeHtml(label)}</p>
    <p class="metric-value">${escapeHtml(String(value))}${suffixText}</p>
    ${sub ? `<p class="metric-sub">${escapeHtml(sub)}</p>` : ""}
  </div>`;
}

function personYearAverages(pubs, people, startYearOverride = null) {
  const [fromYear, toYear] = activeWindowYears();
  const years = pubs.map((pub) => pub.year).filter((year) => Number.isFinite(year));
  const startYear = Number.isFinite(startYearOverride)
    ? startYearOverride
    : Number.isFinite(fromYear) ? fromYear : Math.min(...years);
  const endYear = Number.isFinite(toYear) ? toYear : Math.max(...years);
  if (!Number.isFinite(startYear) || !Number.isFinite(endYear) || endYear < startYear) {
    return { publications: null, highAip: null, personYears: 0 };
  }
  const pubObservations = [];
  const highAipObservations = [];
  people.forEach((person) => {
    const personPubs = pubs.filter((pub) => pub.matchedPeople.includes(person.id));
    if (!personPubs.length) return;
    const firstYear = Math.min(...personPubs.map((pub) => pub.year).filter((year) => Number.isFinite(year)));
    if (!Number.isFinite(firstYear)) return;
    for (let year = Math.max(startYear, firstYear); year <= endYear; year += 1) {
      const yearPubs = personPubs.filter((pub) => pub.year === year);
      pubObservations.push(yearPubs.length);
      highAipObservations.push(yearPubs.filter((pub) => isNumber(pub.aip) && pub.aip >= 95).length);
    }
  });
  const personYears = pubObservations.length;
  if (!personYears) return { publications: null, highAip: null, personYears: 0 };
  return {
    publications: mean(pubObservations),
    publicationsSd: standardDeviation(pubObservations),
    highAip: mean(highAipObservations),
    highAipSd: standardDeviation(highAipObservations),
    personYears,
  };
}

function renderMetrics() {
  if (!state.data || !els.benchmarkSummary) return;
  const groups = buildMetricGroups();
  if (!groups.length) {
    els.benchmarkSummary.innerHTML = metric("Benchmark data", "NA", "No benchmark file loaded.");
    return;
  }
  const hrm = groups.find((group) => group.key === "HRMOB") || groups[0];

  els.benchmarkSummary.innerHTML = [
    metric("Pubs per person per year", formatMetricValue(hrm.avgPubs), "Mean counted journal publications.", isNumber(hrm.avgPubsSd) ? formatMetricValue(hrm.avgPubsSd) : ""),
    metric("AIP >= 95 pubs per person per year", formatMetricValue(hrm.avgHighAip), "Mean counted publications in AIP >= 95 journals.", isNumber(hrm.avgHighAipSd) ? formatMetricValue(hrm.avgHighAipSd) : ""),
    metric("AIP >= 95 share", formatPercentValue(hrm.highAipShare), "Share of counted publications in AIP >= 95 journals."),
    metric("Output centralization", formatPercentValue(hrm.outputCentralization, 1), `Gini-style concentration of publication rates across ${hrm.activePeople} active people.`, isNumber(hrm.highAipCentralization) ? formatPercentValue(hrm.highAipCentralization, 1) : "", "AIP >= 95 only"),
  ].join("");

  const comparisonGroups = groups.filter((group) => group.key !== "REST" && group.key !== "REST_HRM");
  const trendKey = state.metricTrendKey === "highAipRate" ? "highAipRate" : "pubRate";
  renderMetricTrendControls(trendKey);
  renderMetricLineChart(els.benchmarkPublicationTrend, comparisonGroups, trendKey);
  renderMetricVariety(els.benchmarkVariety, comparisonGroups);
  renderMetricMethodNote(els.benchmarkMethodNote, hrm, null);
}

function renderMetricTrendControls(trendKey) {
  if (els.benchmarkTrendTitle) {
    els.benchmarkTrendTitle.textContent = trendKey === "highAipRate"
      ? "Average AIP >= 95 publications per person per year by group"
      : "Average counted publications per person per year by group";
  }
  if (!els.benchmarkTrendToggle) return;
  els.benchmarkTrendToggle.querySelectorAll("[data-metric-trend]").forEach((button) => {
    const active = button.dataset.metricTrend === trendKey;
    button.classList.toggle("on", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function buildMetricGroups() {
  const years = metricYears();
  if (!years.length) return [];
  const hrm = buildHrmMetricGroup(years);
  const benchmarkDepartments = buildBenchmarkMetricGroups(years);
  return [hrm, ...benchmarkDepartments].filter(Boolean);
}

function metricYears() {
  const [fromYear, toYear] = activeWindowYears();
  const currentYear = new Date().getFullYear();
  const start = Math.max(METRICS_START_YEAR, Number.isFinite(fromYear) ? fromYear : METRICS_START_YEAR);
  const rawEnd = Number.isFinite(toYear) ? toYear : currentYear;
  const end = Math.min(rawEnd, currentYear);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
}

function completedMetricYears(years) {
  const latestCompletedYear = new Date().getFullYear() - 1;
  return years.filter((year) => year <= latestCompletedYear);
}

function buildHrmMetricGroup(years) {
  const basePeople = activePeople();
  const firstYears = firstPublicationYearsForHrm(basePeople);
  const people = basePeople.map((person) => ({ id: person.id, department: "HRM&OB", firstYear: firstYears.get(person.id) }));
  const ids = new Set(people.map((person) => person.id));
  const yearSet = new Set(years);
  const pubs = dedupePublications(state.data.publications.filter((pub) => (
    countedPublication(pub)
    && yearSet.has(pub.year)
    && pub.matchedPeople.some((id) => ids.has(id))
  ))).map((pub) => ({
    id: pub.id,
    year: pub.year,
    aip: pub.aip,
    people: pub.matchedPeople.filter((id) => ids.has(id)),
  }));
  return computeMetricGroup("HRM&OB", "HRMOB", people, pubs, years, true);
}

function firstPublicationYearsForHrm(people) {
  const ids = new Set(people.map((person) => person.id));
  const firstYears = new Map();
  dedupePublications((state.data?.publications || []).filter((pub) => (
    countedPublication(pub)
    && pub.matchedPeople.some((id) => ids.has(id))
  ))).forEach((pub) => {
    if (!Number.isFinite(pub.year)) return;
    pub.matchedPeople.forEach((id) => {
      if (!ids.has(id)) return;
      firstYears.set(id, Math.min(firstYears.get(id) || pub.year, pub.year));
    });
  });
  return firstYears;
}

function buildBenchmarkMetricGroups(years) {
  const departments = ["Marketing", "IM&S", "Operations", "GEM", "Accounting"];
  return departments.map((department) => {
    const people = benchmarkPeople().filter((person) => person.department === department);
    const pubs = benchmarkPublicationsForPeople(people, years);
    return computeMetricGroup(department, department, people, pubs, years, false);
  });
}

function benchmarkPeople() {
  const firstYears = firstPublicationYearsForBenchmark();
  return (state.benchmarkData?.people || [])
    .filter((person) => person.includedInDenominator)
    .map((person) => ({ id: person.id, department: person.department, firstYear: firstYears.get(person.id) }));
}

function firstPublicationYearsForBenchmark() {
  const firstYears = new Map();
  (state.benchmarkData?.publications || []).forEach((pub) => {
    if (!Number.isFinite(pub.year)) return;
    (pub.people || []).forEach((id) => {
      firstYears.set(id, Math.min(firstYears.get(id) || pub.year, pub.year));
    });
  });
  return firstYears;
}

function benchmarkPublicationsForPeople(people, years) {
  const ids = new Set(people.map((person) => person.id));
  const yearSet = new Set(years);
  return (state.benchmarkData?.publications || [])
    .filter((pub) => yearSet.has(pub.year) && (pub.people || []).some((id) => ids.has(id)))
    .map((pub) => ({
      id: pub.id,
      year: pub.year,
      aip: pub.aip,
      people: (pub.people || []).filter((id) => ids.has(id)),
    }));
}

function computeMetricGroup(label, key, people, pubs, years, primary) {
  const summaryYears = completedMetricYears(years);
  const summaryYearSet = new Set(summaryYears);
  const summaryPubs = pubs.filter((pub) => summaryYearSet.has(pub.year));
  const firstYearByPerson = new Map();
  people.forEach((person) => {
    if (Number.isFinite(person.firstYear)) {
      firstYearByPerson.set(person.id, person.firstYear);
      return;
    }
    const yearsForPerson = pubs
      .filter((pub) => pub.people.includes(person.id))
      .map((pub) => pub.year)
      .filter(Number.isFinite);
    if (yearsForPerson.length) firstYearByPerson.set(person.id, Math.min(...yearsForPerson));
  });

  const pubsByPerson = new Map(people.map((person) => [person.id, []]));
  pubs.forEach((pub) => {
    [...new Set(pub.people || [])].forEach((id) => {
      if (pubsByPerson.has(id)) pubsByPerson.get(id).push(pub);
    });
  });
  const yearly = years.map((year) => {
    const activePeopleForYear = people.filter((person) => {
      const firstYear = firstYearByPerson.get(person.id);
      return Number.isFinite(firstYear) && firstYear <= year;
    });
    const personPubCounts = activePeopleForYear.map((person) => (
      pubs.filter((pub) => pub.year === year && pub.people.includes(person.id)).length
    ));
    const personHighCounts = activePeopleForYear.map((person) => (
      pubs.filter((pub) => pub.year === year && pub.people.includes(person.id) && isNumber(pub.aip) && pub.aip >= 95).length
    ));
    return {
      year,
      activePeople: activePeopleForYear.length,
      pubRate: mean(personPubCounts),
      highAipRate: mean(personHighCounts),
    };
  });

  const lastCompletedMetricYear = summaryYears.length ? Math.max(...summaryYears) : null;
  const activePeople = people.filter((person) => {
    const firstYear = firstYearByPerson.get(person.id);
    return Number.isFinite(firstYear) && Number.isFinite(lastCompletedMetricYear) && firstYear <= lastCompletedMetricYear;
  });
  const personRates = [];
  const personHighRates = [];
  activePeople.forEach((person) => {
    const firstYear = firstYearByPerson.get(person.id);
    const activeYears = summaryYears.filter((year) => Number.isFinite(firstYear) && year >= firstYear);
    if (!activeYears.length) return;
    const personPubs = (pubsByPerson.get(person.id) || []).filter((pub) => summaryYearSet.has(pub.year));
    personRates.push(personPubs.length / activeYears.length);
    personHighRates.push(personPubs.filter((pub) => isNumber(pub.aip) && pub.aip >= 95).length / activeYears.length);
  });

  return {
    label,
    key,
    primary,
    people: people.length,
    activePeople: activePeople.length,
    publications: summaryPubs.length,
    highAipPublications: summaryPubs.filter((pub) => isNumber(pub.aip) && pub.aip >= 95).length,
    highAipShare: summaryPubs.length ? summaryPubs.filter((pub) => isNumber(pub.aip) && pub.aip >= 95).length / summaryPubs.length : null,
    avgPubs: mean(personRates),
    avgPubsSd: standardDeviation(personRates),
    avgHighAip: mean(personHighRates),
    avgHighAipSd: standardDeviation(personHighRates),
    medianPubs: percentileValue(personRates, 0.5),
    spreadPubs: spreadValue(personRates),
    outputSd: standardDeviation(personRates),
    outputCentralization: outputCentralization(personRates),
    highAipCentralization: outputCentralization(personHighRates),
    pubPaceChange: paceChange(yearly, "pubRate"),
    highAipPaceChange: paceChange(yearly, "highAipRate"),
    yearly,
  };
}

function paceChange(yearly, key) {
  const values = yearly.filter((row) => isNumber(row[key]));
  if (values.length < 6) return null;
  const recent = values.slice(-5);
  const previous = values.slice(Math.max(0, values.length - 10), values.length - 5);
  if (!recent.length || !previous.length) return null;
  return mean(recent.map((row) => row[key])) - mean(previous.map((row) => row[key]));
}

function percentileValue(values, percentile) {
  const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (!sorted.length) return null;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * percentile)));
  return sorted[idx];
}

function spreadValue(values) {
  const p90 = percentileValue(values, 0.9);
  const p10 = percentileValue(values, 0.1);
  return isNumber(p90) && isNumber(p10) ? p90 - p10 : null;
}

function outputCentralization(values) {
  const clean = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
  const n = clean.length;
  const total = clean.reduce((sum, value) => sum + value, 0);
  if (n <= 1 || !total) return null;
  const gini = clean.reduce((sum, value, idx) => sum + (2 * (idx + 1) - n - 1) * value, 0) / (n * total);
  return Math.max(0, Math.min(1, gini * (n / (n - 1))));
}

function renderMetricLineChart(container, groups, key) {
  if (!container) return;
  const years = metricYears();
  const rows = groups.flatMap((group) => group.yearly.map((row) => ({ ...row, groupKey: group.key })));
  const values = rows.map((row) => row[key]).filter(isNumber);
  if (!years.length || !values.length) {
    container.innerHTML = `<p class="small-muted">No benchmark trend data for this filter.</p>`;
    return;
  }
  const yMax = metricLineChartMax(rows, key);
  const width = 760;
  const height = 260;
  const pad = { left: 44, right: 118, top: 18, bottom: 34 };
  const xForYear = (year) => {
    if (years.length === 1) return pad.left;
    return pad.left + ((year - years[0]) / (years[years.length - 1] - years[0])) * (width - pad.left - pad.right);
  };
  const yForValue = (value) => clamp(
    height - pad.bottom - (value / yMax) * (height - pad.top - pad.bottom),
    pad.top,
    height - pad.bottom,
  );
  const lastYear = years[years.length - 1];
  const xLabels = years.filter((year) => (
    year === years[0]
    || year === lastYear
    || (year % 5 === 0 && year <= lastYear - 2)
  ));
  const yTicks = key === "highAipRate" ? [0, yMax / 3, (yMax * 2) / 3, yMax] : [0, yMax / 2, yMax];
  const endpointLabels = metricEndpointLabels(groups, key, xForYear, yForValue, years, pad, height);
  const paths = groups.map((group, idx) => {
    const points = group.yearly
      .filter((row) => isNumber(row[key]))
      .map((row) => `${xForYear(row.year).toFixed(1)},${yForValue(row[key]).toFixed(1)}`);
    const color = metricTrendColor(group);
    const cls = idx === 0 ? "metric-line metric-line-primary" : "metric-line metric-line-secondary";
    return points.length ? `<polyline class="${cls}" style="stroke:${color}" points="${points.join(" ")}"></polyline>` : "";
  }).join("");
  container.innerHTML = `
    <svg class="metric-line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Benchmark trend chart">
      ${yTicks.map((tick) => `
        <line class="metric-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${yForValue(tick).toFixed(1)}" y2="${yForValue(tick).toFixed(1)}"></line>
        <text class="metric-axis-label" x="${pad.left - 8}" y="${(yForValue(tick) + 4).toFixed(1)}" text-anchor="end">${formatMetricValue(tick)}</text>
      `).join("")}
      ${xLabels.map((year) => `<text class="metric-axis-label" x="${xForYear(year).toFixed(1)}" y="${height - 10}" text-anchor="middle">${metricYearLabel(year)}</text>`).join("")}
      ${paths}
      ${endpointLabels.map((label) => `
        <text class="metric-line-end-label" x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" style="fill:${label.color}">${escapeHtml(label.text)}</text>
      `).join("")}
    </svg>
    <div class="chart-legend">
      ${groups.map((group, idx) => `<span class="${idx === 0 ? "legend-hrmob" : ""}"><i style="background:${metricTrendColor(group)}"></i>${escapeHtml(group.label)}</span>`).join("")}
    </div>
  `;
}

function metricLineChartMax(rows, key) {
  const values = rows.map((row) => row[key]).filter(isNumber);
  const stableRows = key === "highAipRate"
    ? rows.filter((row) => (row.activePeople || 0) >= 5)
    : rows;
  const scaleValues = stableRows.map((row) => row[key]).filter(isNumber);
  let rawMax = Math.max(...(scaleValues.length ? scaleValues : values));
  if (key === "highAipRate" && scaleValues.length >= 8) {
    const latestYear = Math.max(...rows.map((row) => row.year).filter(Number.isFinite));
    const latestValues = rows
      .filter((row) => row.year === latestYear)
      .map((row) => row[key])
      .filter(isNumber);
    rawMax = Math.max(percentileValue(scaleValues, 0.95) || rawMax, ...latestValues);
  }
  const floor = key === "highAipRate" ? 0.12 : 0.25;
  return niceMetricCeiling(Math.max(floor, rawMax * 1.1));
}

function niceMetricCeiling(value) {
  if (!isNumber(value) || value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 1.2 ? 1.2 : normalized <= 1.5 ? 1.5 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 3 ? 3 : normalized <= 4 ? 4 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

function metricEndpointLabels(groups, key, xForYear, yForValue, years, pad, height) {
  const lastYear = years[years.length - 1];
  const labels = groups.map((group) => {
    const rows = group.yearly.filter((row) => isNumber(row[key]) && row.year <= lastYear);
    const row = rows[rows.length - 1];
    if (!row) return null;
    return {
      text: group.label,
      color: metricTrendColor(group),
      x: xForYear(row.year) + 8,
      y: yForValue(row[key]),
    };
  }).filter(Boolean).sort((a, b) => a.y - b.y);
  const minGap = 14;
  labels.forEach((label, idx) => {
    if (idx === 0) {
      label.y = Math.max(pad.top + 4, label.y);
      return;
    }
    label.y = Math.max(label.y, labels[idx - 1].y + minGap);
  });
  for (let idx = labels.length - 1; idx >= 0; idx -= 1) {
    const lowerBound = height - pad.bottom - 2 - (labels.length - 1 - idx) * minGap;
    labels[idx].y = Math.min(labels[idx].y, lowerBound);
    if (idx < labels.length - 1) labels[idx].y = Math.min(labels[idx].y, labels[idx + 1].y - minGap);
  }
  return labels;
}

function metricTrendColor(group) {
  return METRIC_TREND_COLORS[group.key] || METRIC_TREND_COLORS[group.label] || "#7f8c8d";
}

function metricYearLabel(year) {
  return year === new Date().getFullYear() ? `${year} YTD` : String(year);
}

function renderMetricMethodNote(container, hrm, rest) {
  if (!container) return;
  const quality = state.benchmarkData?.qualitySummary || {};
  const aipGaps = isNumber(quality.rankableAipGapRows) ? quality.rankableAipGapRows : null;
  const aipNotInSource = isNumber(quality.aipNotInSourceRows) ? quality.aipNotInSourceRows : null;
  const usablePeople = (state.benchmarkData?.people || []).filter((person) => person.includedInDenominator && person.department !== "HRM&OB").length;
  const trendYears = metricYears();
  const currentYear = new Date().getFullYear();
  const currentYearNote = trendYears.includes(currentYear) ? ` Cards use completed years; trend lines include ${currentYear} so far.` : "";
  container.innerHTML = `
    <div class="method-grid">
      <div>
        <strong>Pubs/person/year</strong>
        <p>Mean counted journal publications per active person-year. People enter from their first counted publication year.${currentYearNote}</p>
      </div>
      <div>
        <strong>AIP &ge; 95 pubs/person/year</strong>
        <p>Mean counted publications in journals with AIP score 95.0 or higher per active person-year.</p>
      </div>
      <div>
        <strong>Benchmark</strong>
        <p>Assistant, associate, and full professors from Marketing, IM&amp;S, Operations, GEM, and Accounting with usable publication records. Current denominator: ${usablePeople} people.</p>
      </div>
      <div>
        <strong>AIP source rule</strong>
        <p>AIP values use the supplied 2020-2024 average AIP file.${isNumber(aipNotInSource) ? ` ${aipNotInSource} comparison person-publication rows have journals outside that source.` : ""}${isNumber(aipGaps) && aipGaps ? ` ${aipGaps} comparable rows need AIP matching.` : ""}</p>
      </div>
      <div>
        <strong>Output centralization</strong>
        <p>Gini-style concentration of counted publications per person-year across included people.</p>
      </div>
    </div>
  `;
}

function renderMetricVariety(container, groups) {
  if (!container) return;
  const maxCentralization = Math.max(0.01, ...groups.map((group) => group.outputCentralization).filter(isNumber));
  container.innerHTML = groups.map((group) => {
    const width = isNumber(group.outputCentralization) ? Math.max(2, (group.outputCentralization / maxCentralization) * 100) : 0;
    return `
      <div class="variety-row ${group.primary ? "primary" : ""}">
        <div>
          <strong>${escapeHtml(group.label)}</strong>
          <span>Median ${formatMetricValue(group.medianPubs)} - SD ${formatMetricValue(group.outputSd)} - spread ${formatMetricValue(group.spreadPubs)}</span>
        </div>
        <i><em style="width:${width}%"></em></i>
        <b>${formatPercentValue(group.outputCentralization)}</b>
      </div>
    `;
  }).join("");
}

function formatMetricValue(value) {
  if (!isNumber(value)) return "NA";
  return value >= 10 ? value.toFixed(0) : value >= 1 ? value.toFixed(1) : value.toFixed(2);
}

function formatSignedMetric(value) {
  if (!isNumber(value)) return "NA";
  const formatted = formatMetricValue(Math.abs(value));
  return `${value >= 0 ? "+" : "-"}${formatted}`;
}

function formatPercentValue(value, decimals = 0) {
  if (!isNumber(value)) return "NA";
  return `${(value * 100).toFixed(decimals)}%`;
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function standardDeviation(values) {
  if (!values.length) return null;
  const avg = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length);
}

function overviewStartYear() {
  const [fromYear] = activeWindowYears();
  return Math.max(OVERVIEW_START_YEAR, Number.isFinite(fromYear) ? fromYear : OVERVIEW_START_YEAR);
}

function publicationWindowYears() {
  const [fromYear, toYear] = activeWindowYears();
  if (Number.isFinite(fromYear) && Number.isFinite(toYear) && toYear >= fromYear) return toYear - fromYear + 1;
  const years = new Set(activePublications().map((pub) => pub.year));
  return years.size;
}

function publicationWindowLabel() {
  return activeWindowLabel();
}

function activeWindow() {
  const meta = state.data?.meta || {};
  return state.recentOnly ? (meta.recentWindow || meta.publicationWindow || {}) : (meta.publicationWindow || {});
}

function activeWindowYears() {
  const window = activeWindow();
  const fromYear = Number(String(window.from || "").slice(0, 4));
  const toYear = Number(String(window.to || "").slice(0, 4));
  return [Number.isFinite(fromYear) ? fromYear : null, Number.isFinite(toYear) ? toYear : null];
}

function activeWindowLabel() {
  const [fromYear, toYear] = activeWindowYears();
  return fromYear && toYear ? `${fromYear}-${toYear}` : "All years";
}

function aggregateJournals(pubs) {
  const people = peopleById();
  const byJournal = new Map();
  pubs.forEach((pub) => {
    const name = pub.aipJournal || pub.journal || pub.publicationKind || "Unmatched journal";
    if (!byJournal.has(name)) {
      byJournal.set(name, {
        journal: name,
        journalDisplay: displayJournalName(pub.journal || name),
        count: 0,
        aip: pub.aip,
        category: journalTypeCategory(pub),
        rankableJournal: pub.rankableJournal !== false,
        people: new Set(),
        years: new Set(),
        recentCount: 0,
      });
    }
    const row = byJournal.get(name);
    row.count += 1;
    row.journalDisplay = preferredJournalDisplay(row.journalDisplay, pub.journal || name);
    row.years.add(pub.year);
    if (isRecentPublication(pub)) row.recentCount += 1;
    if (isNumber(pub.aip)) row.aip = pub.aip;
    row.category = journalTypeCategory(pub);
    if (pub.rankableJournal === false) row.rankableJournal = false;
    pub.matchedPeople.forEach((id) => {
      if (people.has(id)) row.people.add(id);
    });
  });
  return Array.from(byJournal.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const aipA = isNumber(a.aip) ? a.aip : -1;
    const aipB = isNumber(b.aip) ? b.aip : -1;
    if (aipB !== aipA) return aipB - aipA;
    return journalDisplayName(a).localeCompare(journalDisplayName(b));
  });
}

function journalDisplayName(journal) {
  return journal?.journalDisplay || displayJournalName(journal?.journal || journal);
}

function preferredJournalDisplay(current, candidate) {
  const currentName = displayJournalName(current);
  const candidateName = displayJournalName(candidate);
  if (!currentName || currentName === "Unknown journal") return candidateName;
  if (!candidateName || candidateName === "Unknown journal") return currentName;
  const currentLooksCanonical = allCapsPhrase(current);
  const candidateLooksCanonical = allCapsPhrase(candidate);
  if (currentLooksCanonical !== candidateLooksCanonical) return candidateLooksCanonical ? currentName : candidateName;
  return currentName.length <= candidateName.length ? currentName : candidateName;
}

function displayJournalName(value) {
  const raw = String(value || "").replace(/\s+/g, " ").trim();
  if (!raw) return "Unknown journal";
  return allCapsPhrase(raw) || lowerCaseSignificantJournalWords(raw) ? titleCaseJournalName(raw) : raw;
}

function allCapsPhrase(value) {
  const letters = String(value || "").replace(/[^A-Za-z]/g, "");
  return letters.length > 3 && letters === letters.toUpperCase() && letters !== letters.toLowerCase();
}

function lowerCaseSignificantJournalWords(value) {
  const smallWords = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"]);
  return String(value || "")
    .split(/[^A-Za-z&]+/)
    .some((word) => word.length > 3 && !smallWords.has(word.toLowerCase()) && word === word.toLowerCase());
}

function titleCaseJournalName(value) {
  const smallWords = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"]);
  const acronyms = new Set(["AOM", "CEO", "CSR", "HR", "HRM", "IEEE", "JIBS", "JMS", "MIS", "OB", "OBHDP", "OECD", "PNAS", "PLOS", "R&D"]);
  return String(value || "")
    .toLowerCase()
    .split(/(\s+|[-/:,&()])/)
    .map((part, idx) => {
      if (!/[a-z0-9]/i.test(part) || /^\s+$/.test(part)) return part;
      const upper = part.toUpperCase();
      if (acronyms.has(upper)) return upper;
      if (idx > 0 && smallWords.has(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("")
    .replace(/\bPlos One\b/g, "PLOS ONE");
}

function renderJournalPublishedList(journals) {
  if (!els.journalPublishedList) return;
  renderJournalList(els.journalPublishedList, journals, 12, "No outlet history for the current filters.");
}

function renderJournalList(target, journals, limit, emptyMessage) {
  const rows = journals.slice(0, limit);
  if (!rows.length) {
    target.innerHTML = `<p class="small-muted">${escapeHtml(emptyMessage)}</p>`;
    return;
  }
  target.innerHTML = rows.map((journal) => `
    <div class="list-row">
      <p class="list-title">${escapeHtml(journalDisplayName(journal))}</p>
      <p class="list-meta">${journal.count} publications, ${escapeHtml(yearSetLabel(journal.years))}${isNumber(journal.aip) ? `, AIP ${journal.aip.toFixed(1)}` : ""}</p>
    </div>
  `).join("");
}

function renderJournalOpenAccessList(journals) {
  if (!els.journalOpenAccessList) return;
  const historical = journals.filter((journal) => openAccessSignal(journal.journal)).slice(0, 5);
  const historicalNames = new Set(historical.map((journal) => normalizeJournalName(journal.journal)));
  const candidates = OPEN_ACCESS_OUTLET_GUIDE
    .map((outlet) => enrichOutlet(outlet, journals))
    .filter((outlet) => !historicalNames.has(normalizeJournalName(outlet.journal)))
    .slice(0, 8);
  els.journalOpenAccessList.innerHTML = [
    ...historical.map((journal) => outletItemHtml({
      journal: journalDisplayName(journal),
      focus: `${journal.count} publication${journal.count === 1 ? "" : "s"} in our history`,
      meta: `${yearSetLabel(journal.years)}${isNumber(journal.aip) ? ` - AIP ${journal.aip.toFixed(1)}` : ""}`,
    })),
    ...candidates.map((outlet) => outletItemHtml(outlet)),
  ].join("");
}

function enrichOutlet(outlet, journals) {
  const history = journals.find((journal) => normalizeJournalName(journal.journal) === normalizeJournalName(outlet.journal));
  const bits = [];
  if (history) bits.push(`${history.count} prior pub${history.count === 1 ? "" : "s"}`);
  if (history?.years?.size) bits.push(yearSetLabel(history.years));
  if (isNumber(history?.aip)) bits.push(`AIP ${history.aip.toFixed(1)}`);
  if (!bits.length) bits.push("No prior HRM&OB record in this data");
  return { ...outlet, meta: bits.join(" - ") };
}

function outletItemHtml(outlet) {
  return `<div class="outlet-item">
    <p class="outlet-name">${escapeHtml(outlet.journal)}</p>
    <p class="outlet-focus">${escapeHtml(outlet.focus)}</p>
    <p class="outlet-meta">${escapeHtml(outlet.meta || "Verify current scope, review model, and costs before submission.")}</p>
  </div>`;
}

function openAccessSignal(journalName) {
  return OPEN_ACCESS_JOURNAL_PATTERNS.some((pattern) => pattern.test(String(journalName || "")));
}

function normalizeJournalName(value) {
  return normalizeSearchText(value).replace(/\b(the|journal|of)\b/g, " ").replace(/\s+/g, " ").trim();
}

function yearSetLabel(years) {
  const values = Array.from(years || []).filter((year) => Number.isFinite(year)).sort((a, b) => a - b);
  if (!values.length) return "Unknown";
  const first = values[0];
  const last = values[values.length - 1];
  return first === last ? String(first) : `${first}-${last}`;
}

function isRecentPublication(pub) {
  const window = state.data?.meta?.recentWindow || {};
  const fromYear = Number(String(window.from || "").slice(0, 4));
  const toYear = Number(String(window.to || "").slice(0, 4));
  if (!Number.isFinite(fromYear) || !Number.isFinite(toYear)) return false;
  return Number.isFinite(pub.year) && pub.year >= fromYear && pub.year <= toYear;
}

function renderYearBars(pubs) {
  const counts = countBy(pubs, (pub) => pub.year);
  const startYear = overviewStartYear();
  const endYear = Math.max(startYear, ...Array.from(counts.keys()).filter((year) => Number.isFinite(year)));
  const years = [];
  for (let year = startYear; year <= endYear; year += 1) years.push(year);
  const max = Math.max(1, ...years.map((year) => counts.get(year) || 0));
  els.yearBars.innerHTML = `<div class="year-histogram">
    ${years.map((year) => {
      const count = counts.get(year) || 0;
      const label = year === startYear || year % 5 === 0 ? year : "";
      const height = count ? Math.max(8, (count / max) * 100) : 0;
      return `<span class="year-bar" title="${year}: ${count} publication${count === 1 ? "" : "s"}">
        <i style="height:${height}%"></i>
        <b>${escapeHtml(label)}</b>
      </span>`;
    }).join("")}
  </div>`;
}

function renderAipBars(pubs) {
  const bands = [
    ["AIP >= 90", (pub) => isNumber(pub.aip) && pub.aip >= 90],
    ["AIP >= 95", (pub) => isNumber(pub.aip) && pub.aip >= 95],
  ];
  const entries = bands.map(([label, fn]) => [label, pubs.filter(fn).length]);
  els.aipBars.innerHTML = entries.map(([label, value]) => `
    <div class="aip-pill">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `).join("");
}

function renderOverviewTopicCloud(pubs) {
  renderWordCloud(els.overviewTopicCloud, globalTopicSignals(pubs).slice(0, 24), { clickable: true });
}

function renderOverviewJournals(journals) {
  if (!els.overviewJournalList) return;
  renderJournalList(els.overviewJournalList, journals, 12, "No journal records for the overview window.");
}

function internalCollaborationEdges(pubs) {
  const activeIds = activePeopleSet();
  const edgeMap = new Map();
  pubs.forEach((pub) => {
    const ids = [...new Set(pub.matchedPeople.filter((id) => activeIds.has(id)))].sort();
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const key = `${ids[i]}|${ids[j]}`;
        if (!edgeMap.has(key)) edgeMap.set(key, { source: ids[i], target: ids[j], count: 0, pubIds: [] });
        const edge = edgeMap.get(key);
        edge.count += 1;
        edge.pubIds.push(pub.id);
      }
    }
  });
  return Array.from(edgeMap.values()).sort((a, b) => b.count - a.count);
}

function journalTypeCategory(pub) {
  const raw = String(pub.aipCategory || "").toUpperCase();
  const kind = String(pub.publicationKind || "").toLowerCase();
  if (raw.includes("PSYCHOLOGY") || raw.includes("PSYCHIATRY") || raw.includes("BEHAVIORAL SCIENCES")) return "Psychology";
  if (raw.includes("MANAGEMENT") || raw.includes("BUSINESS")) return "Management & Business";
  if (raw.includes("SOCIAL SCIENCES") || raw.includes("SOCIOLOGY") || raw.includes("SOCIAL ISSUES") || raw.includes("WOMENS STUDIES") || raw.includes("CRIMINOLOGY") || raw.includes("COMMUNICATION")) return "Social Sciences";
  if (raw.includes("PUBLIC ADMINISTRATION") || raw.includes("POLITICAL") || raw.includes("INTERNATIONAL RELATIONS") || raw.includes("URBAN") || raw.includes("GEOGRAPHY") || raw.includes("DEVELOPMENT STUDIES")) return "Public Policy & Administration";
  if (raw.includes("PUBLIC, ENVIRONMENTAL") || raw.includes("HEALTH") || raw.includes("MEDICINE") || raw.includes("NURSING") || raw.includes("REHABILITATION") || raw.includes("SPORT") || raw.includes("ERGONOMICS") || raw.includes("NUTRITION") || raw.includes("OTORHINOLARYNGOLOGY")) return "Health & Work";
  if (raw.includes("ECONOMICS") || raw.includes("FINANCE")) return "Economics & Finance";
  if (raw.includes("EDUCATION")) return "Education";
  if (raw.includes("COMPUTER") || raw.includes("INFORMATION SCIENCE") || raw.includes("ENGINEERING") || raw.includes("CONSTRUCTION")) return "Technology & Engineering";
  if (raw.includes("BIO") || raw.includes("NEURO") || raw.includes("EVOLUTIONARY")) return "Life Sciences";
  if (raw.includes("MULTIDISCIPLINARY")) return "Multidisciplinary";
  if (raw.includes("ENVIRONMENTAL")) return "Environment";
  if (kind.includes("book") || kind.includes("chapter") || kind.includes("conference")) return "Books & Chapters";
  if (kind.includes("repository") || kind.includes("preprint") || kind.includes("unknown") || kind.includes("out-of-scope")) return "Other";
  if (!raw || kind === "journal") return "Other";
  return titleCaseCategory(raw);
}

function titleCaseCategory(value) {
  return String(value).toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase()).replace(/\s*&\s*/g, " & ");
}

function renderOverviewGrants(grants) {
  if (!els.grantList) return;
  const people = peopleById();
  const rows = grants.slice().sort(sortGrants);
  if (!rows.length) {
    els.grantList.innerHTML = `<p class="small-muted">No source-backed grant records for the current staff filter.</p>`;
    return;
  }
  els.grantList.innerHTML = `
    ${rows.map((grant) => `
      <div class="grant-item">
        <p class="grant-kicker">${escapeHtml(formatYear(grant.year))} - ${escapeHtml(grant.scheme)}</p>
        <p class="grant-title">${escapeHtml(grant.title)}</p>
        <p class="grant-meta">${escapeHtml(grantStaff(grant, people))}</p>
      </div>
    `).join("")}
  `;
}

function renderOverviewPhds(theses) {
  if (!els.phdList) return;
  const people = peopleById();
  const rows = theses.slice().sort(sortTheses);
  if (!rows.length) {
    els.phdList.innerHTML = `<p class="small-muted">No source-backed defended PhD records for the current staff filter.</p>`;
    return;
  }
  els.phdList.innerHTML = `
    ${rows.map((thesis) => `
      <div class="grant-item">
        <p class="grant-kicker">${escapeHtml(formatYear(thesis.year))} - ${escapeHtml(thesis.candidate)}</p>
        <p class="grant-title">${escapeHtml(thesis.title)}</p>
        <p class="grant-meta">${escapeHtml(roleSummary(thesis, people))}</p>
      </div>
    `).join("")}
  `;
}

function roleSummary(thesis, people) {
  return (thesis.roles || [])
    .map((role) => `${people.get(role.personId)?.display || role.personId} (${role.role || "Supervisor"})`)
    .sort()
    .join(", ");
}

function sortTheses(a, b) {
  const dateA = Date.parse(a.defenseDate || `${a.year || 0}-01-01`) || 0;
  const dateB = Date.parse(b.defenseDate || `${b.year || 0}-01-01`) || 0;
  if (dateB !== dateA) return dateB - dateA;
  return String(a.candidate || "").localeCompare(String(b.candidate || ""));
}

function grantStaff(grant, people) {
  return (grant.personIds || [])
    .map((id) => people.get(id)?.display || id)
    .sort()
    .join(", ");
}

function sortGrants(a, b) {
  const yearA = isNumber(a.year) ? a.year : -Infinity;
  const yearB = isNumber(b.year) ? b.year : -Infinity;
  if (yearB !== yearA) return yearB - yearA;
  const categoryA = grantCategoryRank(a.category);
  const categoryB = grantCategoryRank(b.category);
  if (categoryB !== categoryA) return categoryB - categoryA;
  return String(a.title || "").localeCompare(String(b.title || ""));
}

function grantCategoryRank(category) {
  const ranks = {
    "ERC grant": 5,
    "Talent scheme": 4,
    "Competitive project grant": 3,
    "Major prize funding": 2,
  };
  return ranks[category] || 1;
}

function formatYear(year) {
  return isNumber(year) ? String(year) : "Year n/a";
}

function renderPublications() {
  if (!state.data) return;
  const people = peopleById();
  let pubs = dashboardEraPublications(activePublications());
  renderPublicationJournalSummary(pubs);
  if (state.search) {
    pubs = pubs.filter((pub) => {
      const haystack = [
        pub.title,
        pub.journal,
        pub.aipJournal,
        pub.authors.join(" "),
        pub.matchedPeople.map((id) => people.get(id)?.display || id).join(" "),
      ].join(" ").toLowerCase();
      return haystack.includes(state.search);
    });
  }
  pubs = pubs.filter((pub) => {
    if (state.aipFilter === "gte90") return isNumber(pub.aip) && pub.aip >= 90;
    if (state.aipFilter === "gte95") return isNumber(pub.aip) && pub.aip >= 95;
    return true;
  });
  pubs = pubs
    .map((pub, idx) => ({ pub, idx }))
    .sort((a, b) => publicationDateValue(b.pub) - publicationDateValue(a.pub) || a.idx - b.idx)
    .map((row) => row.pub);

  const rows = pubs.map((pub) => [
    pub.year,
    publicationCell(pub),
    escapeHtml(displayJournalName(pub.journal || pub.aipJournal || "Unknown")),
    aipBadge(pub.aip, pub),
    pub.matchedPeople.map((id) => people.get(id)?.display || id).sort().join(", "),
  ]);
  setTable(els.publicationTable, ["Year", "Publication", "Journal", "AIP", "HRM&OB authors"], rows, [true, false, false, true, false]);
}

function renderPublicationJournalSummary(pubs) {
  const journals = aggregateJournals(dashboardEraPublications(pubs));
  renderJournalPublishedList(journals);
  renderJournalOpenAccessList(journals);
}

function dashboardEraPublications(pubs) {
  const start = overviewStartYear();
  return pubs.filter((pub) => Number.isFinite(pub.year) && pub.year >= start);
}

function publicationCell(pub) {
  const doi = pub.doi ? `<a class="doi" href="https://doi.org/${encodeURIComponent(pub.doi)}" target="_blank" rel="noopener">doi</a>` : "";
  const status = publicationStatusBadge(pub);
  return `<span class="primary-text">${escapeHtml(pub.title)}</span> ${doi}${status}<br>
    <span class="small-muted">${escapeHtml(pub.authors.slice(0, 8).join(", "))}${pub.authors.length > 8 ? ", ..." : ""}</span>`;
}

function publicationStatusBadge(pub) {
  if (countedPublication(pub)) return "";
  const kind = String(pub.publicationKind || pub.sourceType || "").trim();
  const label = kind && !/journal/i.test(kind) ? `${kind} - not counted` : "Not counted";
  return ` <span class="tag muted">${escapeHtml(label)}</span>`;
}

function publicationDateValue(pub) {
  const rawDate = pub.publicationDate || pub.publishedDate || pub.date || "";
  if (rawDate) {
    const parsed = Date.parse(rawDate);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return isNumber(pub.year) ? Date.UTC(pub.year, 0, 1) : 0;
}

function buildFacultyCollaboration(pubs, activeIds) {
  const people = benchmarkPeopleById();
  const stats = new Map();
  const edgeMap = new Map();
  pubs.forEach((pub) => {
    const internalIds = [...new Set(pub.matchedPeople.filter((id) => activeIds.has(id)))].sort();
    if (!internalIds.length) return;
    const facultyPeople = benchmarkOtherDepartmentPeopleForPublication(pub, people);
    if (!facultyPeople.length) return;
    internalIds.forEach((id) => {
      facultyPeople.forEach((person) => {
        const target = `faculty:${person.id}`;
        const label = benchmarkPersonLabel(person);
        if (!stats.has(target)) {
          stats.set(target, { id: target, label, shortLabel: shortFacultyLabel(label, person.department), department: person.department, pubIds: new Set(), strength: 0, scope: "faculty" });
        }
        const stat = stats.get(target);
        stat.pubIds.add(pub.id);
        stat.strength += 1;
        const key = `${id}|${target}`;
        if (!edgeMap.has(key)) edgeMap.set(key, { source: id, target, count: 0, pubIds: [], scope: "faculty" });
        const edge = edgeMap.get(key);
        edge.count += 1;
        edge.pubIds.push(pub.id);
      });
    });
  });

  const selectedEdges = Array.from(edgeMap.values()).sort((a, b) => b.count - a.count);
  const selectedIds = new Set(selectedEdges.map((edge) => edge.target));
  const labelIds = priorityExternalLabelIds(selectedEdges, 4);
  const nodes = Array.from(stats.values())
    .filter((node) => selectedIds.has(node.id))
    .map((node) => ({
      ...node,
      count: node.pubIds.size,
      aggregate: false,
      priority: labelIds.has(node.id) || node.pubIds.size >= 2,
    }))
    .sort((a, b) => b.count - a.count || b.strength - a.strength || a.label.localeCompare(b.label));

  return { nodes, edges: selectedEdges };
}

function buildExternalCollaboration(pubs, activeIds) {
  const stats = new Map();
  const edgeMap = new Map();
  pubs.forEach((pub) => {
    const internalIds = [...new Set(pub.matchedPeople.filter((id) => activeIds.has(id)))].sort();
    if (!internalIds.length) return;
    const excludedPeople = benchmarkOtherDepartmentPeopleForPublication(pub);
    const externalAuthors = externalAuthorsForPublication(pub, excludedPeople);
    if (!externalAuthors.length) return;
    internalIds.forEach((id) => {
      externalAuthors.forEach((author) => {
        const target = externalAuthorId(author);
        const label = externalAuthorLabel(author);
        if (!stats.has(target)) stats.set(target, { id: target, label, pubIds: new Set(), strength: 0, scope: "external" });
        const stat = stats.get(target);
        if (betterExternalLabel(label, stat.label)) stat.label = label;
        stat.pubIds.add(pub.id);
        stat.strength += 1;
        const key = `${id}|${target}`;
        if (!edgeMap.has(key)) edgeMap.set(key, { source: id, target, count: 0, pubIds: [], scope: "external" });
        const edge = edgeMap.get(key);
        edge.count += 1;
        edge.pubIds.push(pub.id);
      });
    });
  });

  const selectedEdges = Array.from(edgeMap.values())
    .sort((a, b) => b.count - a.count);
  const selectedIds = new Set(selectedEdges.map((edge) => edge.target));
  const labelIds = priorityExternalLabelIds(selectedEdges, 3);
  const ranked = Array.from(stats.values())
    .filter((node) => selectedIds.has(node.id))
    .map((node) => ({
      id: node.id,
      label: node.label,
      shortLabel: shortExternalLabel(node.label),
      count: node.pubIds.size,
      strength: node.strength,
      scope: "external",
      aggregate: false,
      priority: labelIds.has(node.id),
    }))
    .sort((a, b) => b.count - a.count || b.strength - a.strength || a.label.localeCompare(b.label));

  return {
    nodes: ranked,
    edges: selectedEdges,
  };
}

function priorityExternalLabelIds(edges, perSource) {
  const labelIds = new Set();
  const edgesBySource = new Map();
  edges.forEach((edge) => {
    if (!edgesBySource.has(edge.source)) edgesBySource.set(edge.source, []);
    edgesBySource.get(edge.source).push(edge);
  });
  edgesBySource.forEach((sourceEdges) => {
    sourceEdges
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, perSource)
      .forEach((edge) => labelIds.add(edge.target));
  });
  return labelIds;
}

function externalAuthorsForPublication(pub, excludedBenchmarkPeople = []) {
  const roster = state.data?.people || [];
  const authors = new Map();
  (pub.authors || []).forEach((rawAuthor) => {
    const author = canonicalExternalAuthor(rawAuthor);
    if (!author || authorIsRosterMember(author, roster)) return;
    if (excludedBenchmarkPeople.some((person) => authorMatchesBenchmarkPerson(author, person))) return;
    authors.set(externalAuthorId(author), author);
  });
  return Array.from(authors.values()).slice(0, 10);
}

function benchmarkPeopleById() {
  const people = state.benchmarkData?.people || [];
  const token = `${people.length}:${state.benchmarkData?.meta?.generatedOn || ""}`;
  if (state._benchmarkPeopleById?.token === token) return state._benchmarkPeopleById.map;
  const map = new Map(people.map((person) => [person.id, person]));
  state._benchmarkPeopleById = { token, map };
  return map;
}

function benchmarkPublicationLookup() {
  const publications = state.benchmarkData?.publications || [];
  const token = `${publications.length}:${state.benchmarkData?.meta?.generatedOn || ""}`;
  if (state._benchmarkPublicationLookup?.token === token) return state._benchmarkPublicationLookup;
  const lookup = { byDoi: new Map(), byTitleYear: new Map(), byTitle: new Map() };
  publications.forEach((pub) => {
    const doi = normalizeDoi(pub.doi);
    if (doi) lookup.byDoi.set(doi, preferBenchmarkPublication(lookup.byDoi.get(doi), pub));
    const title = normalizeSearchText(pub.title);
    if (!title) return;
    const titleYear = `${title}|${pub.year || ""}`;
    lookup.byTitleYear.set(titleYear, preferBenchmarkPublication(lookup.byTitleYear.get(titleYear), pub));
    lookup.byTitle.set(title, preferBenchmarkPublication(lookup.byTitle.get(title), pub));
  });
  lookup.token = token;
  state._benchmarkPublicationLookup = lookup;
  return lookup;
}

function matchingBenchmarkPublication(pub) {
  const lookup = benchmarkPublicationLookup();
  const doi = normalizeDoi(pub.doi);
  if (doi && lookup.byDoi.has(doi)) return lookup.byDoi.get(doi);
  const title = normalizeSearchText(pub.title);
  if (!title) return null;
  return lookup.byTitleYear.get(`${title}|${pub.year || ""}`) || lookup.byTitle.get(title) || null;
}

function preferBenchmarkPublication(current, candidate) {
  if (!current) return candidate;
  const currentPeople = current.people?.length || 0;
  const candidatePeople = candidate.people?.length || 0;
  return candidatePeople > currentPeople ? candidate : current;
}

function benchmarkOtherDepartmentPeopleForPublication(pub, people = benchmarkPeopleById()) {
  const benchmarkPub = matchingBenchmarkPublication(pub);
  if (!benchmarkPub) return [];
  const seen = new Set();
  return (benchmarkPub.allPeople || benchmarkPub.people || [])
    .map((id) => people.get(id))
    .filter((person) => person && person.department && person.department !== "HRM&OB")
    .filter((person) => {
      if (seen.has(person.id)) return false;
      seen.add(person.id);
      return true;
    });
}

function benchmarkPersonLabel(person) {
  return person.name || person.display || person.id;
}

function normalizeDoi(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, "")
    .replace(/^doi:\s*/, "");
}

function canonicalExternalAuthor(value) {
  const author = String(value || "").replace(/\s+/g, " ").trim();
  if (!author || /^anonymous$/i.test(author)) return "";
  return author;
}

function externalAuthorId(author) {
  const parts = externalAuthorParts(author);
  if (!parts.family) return `external:${normalizeSearchText(author)}`;
  return `external:${parts.family}|${parts.initials || "unknown"}`;
}

function externalAuthorLabel(author) {
  return canonicalExternalAuthor(author);
}

function externalAuthorParts(author) {
  const raw = canonicalExternalAuthor(author);
  const normalized = normalizeSearchText(raw);
  if (!normalized) return { family: "", initials: "" };
  const commaParts = raw.split(",");
  if (commaParts.length > 1) {
    const family = normalizeSearchText(commaParts[0]);
    const given = normalizeSearchText(commaParts.slice(1).join(" "));
    return { family, initials: initialsFromGivenText(given) };
  }
  const tokens = normalized.split(" ").filter(Boolean);
  if (!tokens.length) return { family: "", initials: "" };
  const particles = new Set(["de", "der", "van", "von", "den", "ten", "ter", "da", "di", "la", "le"]);
  let familyStart = tokens.length - 1;
  while (familyStart > 0 && particles.has(tokens[familyStart - 1])) familyStart -= 1;
  const family = tokens.slice(familyStart).join(" ");
  const given = tokens.slice(0, familyStart).join(" ");
  return { family, initials: initialsFromGivenText(given) };
}

function initialsFromGivenText(text) {
  return normalizeSearchText(text)
    .split(" ")
    .filter(Boolean)
    .map((token) => {
      if (token.length <= 3) return token.replace(/[^a-z]/g, "");
      return token[0];
    })
    .join("")
    .slice(0, 4);
}

function betterExternalLabel(candidate, current) {
  const next = canonicalExternalAuthor(candidate);
  const prev = canonicalExternalAuthor(current);
  if (!next) return false;
  if (!prev) return true;
  const nextComma = next.includes(",");
  const prevComma = prev.includes(",");
  if (nextComma !== prevComma) return !nextComma;
  const nextTokens = normalizeSearchText(next).split(" ").filter(Boolean).length;
  const prevTokens = normalizeSearchText(prev).split(" ").filter(Boolean).length;
  if (nextTokens !== prevTokens) return nextTokens > prevTokens;
  return next.length > prev.length;
}

function authorIsRosterMember(author, roster) {
  return roster.some((person) => authorMatchesPerson(author, person));
}

function authorMatchesBenchmarkPerson(author, person) {
  return authorMatchesPerson(author, benchmarkAuthorProfile(person));
}

function benchmarkAuthorProfile(person) {
  const family = person.family || familyFromName(person.name || person.display || "");
  const given = person.given || givenFromName(person.name || person.display || "");
  return {
    ...person,
    families: [family].filter(Boolean),
    firstInitials: initialsFromGivenText(given).split("").filter(Boolean),
  };
}

function familyFromName(name) {
  const normalized = normalizeSearchText(name);
  const tokens = normalized.split(" ").filter(Boolean);
  if (!tokens.length) return "";
  const particles = new Set(["de", "der", "van", "von", "den", "ten", "ter", "da", "di", "la", "le"]);
  let start = tokens.length - 1;
  while (start > 0 && particles.has(tokens[start - 1])) start -= 1;
  return tokens.slice(start).join(" ");
}

function givenFromName(name) {
  const normalized = normalizeSearchText(name);
  const family = familyFromName(name);
  return family ? removeNormalizedPhrase(normalized, family) : normalized;
}

function authorMatchesPerson(author, person) {
  const normalized = normalizeSearchText(author);
  if (!normalized) return false;
  const families = (person.families || [])
    .map(normalizeSearchText)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const matchedFamily = families.find((family) => normalizedHasPhrase(normalized, family));
  if (!matchedFamily) return false;
  const initials = authorInitials(author, families);
  const firstInitials = new Set((person.firstInitials || []).map((initial) => String(initial).toLowerCase()));
  if (!firstInitials.size || !initials.size) return true;
  return Array.from(firstInitials).some((initial) => initials.has(initial));
}

function authorInitials(author, families) {
  let normalized = normalizeSearchText(author);
  families.forEach((family) => {
    normalized = removeNormalizedPhrase(normalized, family);
  });
  normalized = normalized.replace(/\b(de|der|van|von|den|the|and)\b/g, " ").replace(/\s+/g, " ").trim();
  const initials = new Set();
  normalized.split(" ").filter(Boolean).forEach((token) => {
    if (token.length <= 3) {
      token.split("").forEach((letter) => initials.add(letter));
    } else {
      initials.add(token[0]);
    }
  });
  return initials;
}

function normalizedHasPhrase(text, phrase) {
  return ` ${text} `.includes(` ${phrase} `);
}

function removeNormalizedPhrase(text, phrase) {
  return ` ${text} `.replaceAll(` ${phrase} `, " ").replace(/\s+/g, " ").trim();
}

function shortExternalLabel(name) {
  const trimmed = String(name || "").replace(/\s+/g, " ").trim();
  if (trimmed.length <= 20) return trimmed;
  const commaParts = trimmed.split(",");
  if (commaParts.length > 1) {
    return `${commaParts[0].trim()}, ${commaParts[1].trim().slice(0, 4)}`.slice(0, 22);
  }
  const tokens = trimmed.split(" ").filter(Boolean);
  if (tokens.length > 1) return `${tokens[tokens.length - 1]}, ${tokens[0][0]}.`.slice(0, 22);
  return trimmed.slice(0, 20);
}

function shortFacultyLabel(name, department) {
  const base = shortFacultyName(name);
  return department ? `${base} (${department})` : base;
}

function shortFacultyName(name) {
  const trimmed = String(name || "").replace(/\s+/g, " ").trim();
  const commaParts = trimmed.split(",");
  if (commaParts.length > 1) {
    const family = commaParts[0].trim();
    const given = commaParts.slice(1).join(" ").trim();
    return given ? `${family}, ${given[0]}.` : family;
  }
  const tokens = trimmed.split(" ").filter(Boolean);
  if (tokens.length > 1) {
    const particles = new Set(["de", "der", "van", "von", "den", "ten", "ter", "da", "di"]);
    let familyStart = tokens.length - 1;
    while (familyStart > 0 && particles.has(tokens[familyStart - 1].toLowerCase())) familyStart -= 1;
    return `${tokens.slice(familyStart).join(" ")}, ${tokens[0][0]}.`;
  }
  return trimmed.slice(0, 14);
}

function syncNetworkControls(people) {
  const activeIds = new Set(people.map((person) => person.id));
  if (state.networkPersonId && !activeIds.has(state.networkPersonId)) {
    state.networkPersonId = "";
  }
  if (els.networkModeToggle) {
    els.networkModeToggle.querySelectorAll("[data-network-mode]").forEach((button) => {
      const on = button.dataset.networkMode === state.networkMode;
      button.classList.toggle("on", on);
      button.setAttribute("aria-pressed", String(on));
    });
  }
  document.querySelectorAll(".publication-network-control").forEach((control) => {
    control.hidden = state.networkMode === "teaching";
  });
  if (els.externalPartnerPanel) els.externalPartnerPanel.hidden = state.networkMode === "teaching";
  const selected = people.find((person) => person.id === state.networkPersonId);
  if (els.networkClearSelection) els.networkClearSelection.hidden = !selected;
  if (els.networkSelectionNote) {
    const base = state.networkMode === "teaching"
      ? "Click a department member to focus shared-course teaching links."
      : "Click a department member to focus publication collaborations.";
    els.networkSelectionNote.textContent = selected
      ? `Focused on ${selected.display}. Click the same node again or use Show all to reset.`
      : base;
  }
  if (els.networkEmpty) {
    els.networkEmpty.textContent = state.networkMode === "teaching"
      ? "No shared teaching-course ties for the current filters."
      : "No coauthorship edges for the current filters.";
  }
  renderNetworkLegend();
}

function renderNetwork() {
  if (!state.data || !els.networkSvg) return;
  const people = activePeople();
  syncNetworkControls(people);
  if (state.networkMode === "teaching") {
    renderTeachingNetwork(people);
    return;
  }
  renderPublicationNetwork(people);
}

function renderPublicationNetwork(people) {
  const activeIds = new Set(people.map((person) => person.id));
  const selectedPersonId = state.networkPersonId;
  let pubs = activePublications();
  if (state.networkAipHighOnly) pubs = pubs.filter((pub) => isNumber(pub.aip) && pub.aip >= 95);

  const nodeStats = new Map(people.map((person) => [person.id, { count: 0, degree: 0, strength: 0 }]));
  const edgeMap = new Map();
  pubs.forEach((pub) => {
    const ids = [...new Set(pub.matchedPeople.filter((id) => activeIds.has(id)))].sort();
    ids.forEach((id) => {
      const stat = nodeStats.get(id);
      if (stat) stat.count += 1;
    });
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const key = `${ids[i]}|${ids[j]}`;
        if (!edgeMap.has(key)) edgeMap.set(key, { source: ids[i], target: ids[j], count: 0, pubIds: [] });
        const edge = edgeMap.get(key);
        edge.count += 1;
        edge.pubIds.push(pub.id);
      }
    }
  });
  const edges = Array.from(edgeMap.values()).sort((a, b) => b.count - a.count);
  edges.forEach((edge) => {
    const source = nodeStats.get(edge.source);
    const target = nodeStats.get(edge.target);
    if (source) {
      source.degree += 1;
      source.strength += edge.count;
    }
    if (target) {
      target.degree += 1;
      target.strength += edge.count;
    }
  });

  const nodes = people.map((person) => ({
    id: person.id,
    label: person.display,
    name: person.name,
    fte: person.fte,
    count: nodeStats.get(person.id)?.count || 0,
    degree: nodeStats.get(person.id)?.degree || 0,
    strength: nodeStats.get(person.id)?.strength || 0,
    metricLabel: "publications",
    focus: person.id === selectedPersonId,
  }));
  let visibleEdges = edges;
  let visibleNodes = nodes;
  let collaborationPubs = pubs;
  let collaborationActiveIds = activeIds;
  if (selectedPersonId) {
    const visibleIds = new Set([selectedPersonId]);
    visibleEdges = edges.filter((edge) => edge.source === selectedPersonId || edge.target === selectedPersonId);
    visibleEdges.forEach((edge) => {
      visibleIds.add(edge.source);
      visibleIds.add(edge.target);
    });
    visibleNodes = nodes.filter((node) => visibleIds.has(node.id));
    collaborationPubs = pubs.filter((pub) => pub.matchedPeople.includes(selectedPersonId));
    collaborationActiveIds = new Set([selectedPersonId]);
  }
  const faculty = state.networkExternal
    ? buildFacultyCollaboration(collaborationPubs, collaborationActiveIds)
    : { nodes: [], edges: [] };
  const external = state.networkExternal
    ? buildExternalCollaboration(collaborationPubs, collaborationActiveIds)
    : { nodes: [], edges: [] };
  const collaboratorNodes = [...faculty.nodes, ...external.nodes];
  const collaboratorEdges = [...faculty.edges, ...external.edges];
  els.networkEmpty.hidden = Boolean(selectedPersonId) || visibleEdges.length > 0 || collaboratorEdges.length > 0;
  drawNetwork(visibleNodes, visibleEdges, collaboratorNodes, collaboratorEdges);
  renderNetworkTable(visibleEdges, collaborationPubs);
  renderExternalPartners(collaborationPubs, collaborationActiveIds);
}

function renderTeachingNetwork(people) {
  const activeIds = new Set(people.map((person) => person.id));
  const selectedPersonId = state.networkPersonId;
  const records = (state.teachingData?.records || []).filter((record) => (
    activeIds.has(record.personId) && record.networkEligible
  ));
  const countByPerson = countBy(records, (record) => record.personId);
  const edgeMap = new Map();
  (state.teachingData?.edges || []).forEach((edge) => {
    if (!activeIds.has(edge.source) || !activeIds.has(edge.target)) return;
    const key = `${edge.source}|${edge.target}`;
    edgeMap.set(key, {
      source: edge.source,
      target: edge.target,
      count: edge.count || 0,
      courseCodes: edge.courseCodes || [],
      courseTitles: edge.courseTitles || [],
      metricLabel: "shared course offerings",
    });
  });
  const edges = Array.from(edgeMap.values()).sort((a, b) => b.count - a.count);
  const nodeStats = new Map(people.map((person) => [person.id, { count: countByPerson.get(person.id) || 0, degree: 0, strength: 0 }]));
  edges.forEach((edge) => {
    const source = nodeStats.get(edge.source);
    const target = nodeStats.get(edge.target);
    if (source) {
      source.degree += 1;
      source.strength += edge.count;
    }
    if (target) {
      target.degree += 1;
      target.strength += edge.count;
    }
  });
  const nodes = people.map((person) => ({
    id: person.id,
    label: person.display,
    name: person.name,
    fte: person.fte,
    count: nodeStats.get(person.id)?.count || 0,
    degree: nodeStats.get(person.id)?.degree || 0,
    strength: nodeStats.get(person.id)?.strength || 0,
    metricLabel: "listed courses",
    focus: person.id === selectedPersonId,
  }));
  let visibleEdges = edges;
  let visibleNodes = nodes;
  if (selectedPersonId) {
    const visibleIds = new Set([selectedPersonId]);
    visibleEdges = edges.filter((edge) => edge.source === selectedPersonId || edge.target === selectedPersonId);
    visibleEdges.forEach((edge) => {
      visibleIds.add(edge.source);
      visibleIds.add(edge.target);
    });
    visibleNodes = nodes.filter((node) => visibleIds.has(node.id));
  }
  els.networkEmpty.hidden = Boolean(selectedPersonId) || visibleEdges.length > 0;
  drawNetwork(visibleNodes, visibleEdges, [], []);
  renderTeachingNetworkTable(visibleEdges);
  renderExternalPartners([], activeIds);
}

function renderNetworkLegend() {
  if (!els.networkLegend) return;
  if (state.networkMode === "teaching") {
    els.networkLegend.innerHTML = `
      <span><i class="legend-node"></i> Node size = listed courses</span>
      <span><i class="legend-count"></i> Number = listed courses</span>
      <span><i class="legend-line"></i> Line thickness = shared course offerings</span>
    `;
    return;
  }
  els.networkLegend.innerHTML = `
    <span><i class="legend-node"></i> Node size = publications</span>
    <span><i class="legend-count"></i> Number = publications</span>
    <span><i class="legend-line"></i> Line thickness = shared publications</span>
    <span><i class="legend-faculty"></i> Other FEB departments</span>
    <span><i class="legend-external"></i> Faint outer ties = outside coauthors, capped at 10 per publication</span>
  `;
}

function drawNetwork(nodes, edges, collaboratorNodes = [], collaboratorEdges = []) {
  const svg = els.networkSvg;
  const rect = svg.getBoundingClientRect();
  const width = Math.max(560, rect.width || svg.clientWidth || 900);
  const height = Math.max(480, rect.height || 620);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";
  const placed = layoutNetwork(nodes, edges, width, height);
  const byId = new Map(placed.map((node) => [node.id, node]));
  const placedExternal = layoutExternalNodes(collaboratorNodes, collaboratorEdges, placed, width, height);
  const externalById = new Map(placedExternal.map((node) => [node.id, node]));

  const appendCollaboratorEdge = (edge) => {
    const a = byId.get(edge.source);
    const b = externalById.get(edge.target);
    if (!a || !b) return;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", externalEdgePath(a, b, width, height));
    const facultyEdge = edge.scope === "faculty";
    path.setAttribute("class", facultyEdge ? "faculty-edge" : "external-edge");
    path.setAttribute("stroke-width", String(collaboratorEdgeWidth(edge).toFixed(2)));
    const title = facultyEdge
      ? `${a.label} + ${b.label} (${b.department || "other department"}): ${edge.count} shared publications`
      : `${a.label} + ${b.label}: ${edge.count} shared publications`;
    path.appendChild(svgTitle(title));
    svg.appendChild(path);
  };

  const appendCollaboratorNode = (node) => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const facultyNode = node.scope === "faculty";
    const radius = facultyNode
      ? Math.max(11, Math.min(21, 8.5 + Math.sqrt(node.count || 0) * 2.8))
      : Math.max(3, Math.min(7, 2.6 + Math.sqrt(node.count || 0) * 1.2));
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", String(radius.toFixed(1)));
    circle.setAttribute("class", `${facultyNode ? "faculty-node" : "external-node"}${node.aggregate ? " aggregate" : ""}`);
    const nodeTitle = facultyNode
      ? `${node.label}: ${node.count} shared publications with HRM&OB (${node.department || "other department"})`
      : `${node.label}: ${node.count} shared publications with HRM&OB`;
    circle.appendChild(svgTitle(nodeTitle));
    group.appendChild(circle);

    if (!node.aggregate || node.priority) {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const labelPlacement = facultyNode
        ? collaboratorLabelPlacement(node, radius, width, height)
        : { x: node.x, y: node.y + radius + 10, anchor: "middle" };
      label.setAttribute("x", labelPlacement.x);
      label.setAttribute("y", labelPlacement.y);
      label.setAttribute("text-anchor", labelPlacement.anchor);
      label.setAttribute("class", `${facultyNode ? "faculty-label" : "external-label"}${node.aggregate ? " aggregate" : ""}`);
      if (facultyNode) {
        const nameLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        nameLine.setAttribute("x", labelPlacement.x);
        nameLine.setAttribute("dy", "0");
        nameLine.textContent = shortFacultyName(node.label);
        label.appendChild(nameLine);
        if (node.department) {
          const departmentLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          departmentLine.setAttribute("x", labelPlacement.x);
          departmentLine.setAttribute("dy", "1.08em");
          departmentLine.textContent = `(${node.department})`;
          label.appendChild(departmentLine);
        }
      } else {
        label.textContent = node.shortLabel;
      }
      group.appendChild(label);
    }
    svg.appendChild(group);
  };

  collaboratorEdges.filter((edge) => edge.scope !== "faculty").forEach(appendCollaboratorEdge);
  placedExternal.filter((node) => node.scope !== "faculty").forEach(appendCollaboratorNode);

  edges.forEach((edge) => {
    const a = byId.get(edge.source);
    const b = byId.get(edge.target);
    if (!a || !b) return;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", edgePath(edge, a, b, placed));
    path.setAttribute("class", "edge");
    path.setAttribute("stroke-width", String(staffEdgeWidth(edge).toFixed(2)));
    path.appendChild(svgTitle(`${a.label} + ${b.label}: ${edge.count} ${edge.metricLabel || "shared publications"}`));
    svg.appendChild(path);
  });

  collaboratorEdges.filter((edge) => edge.scope === "faculty").forEach(appendCollaboratorEdge);
  placedExternal.filter((node) => node.scope === "faculty").forEach(appendCollaboratorNode);

  placed.forEach((node) => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "network-person-node");
    group.setAttribute("data-network-person-id", node.id);
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", `Focus ${node.label}`);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const radius = Math.max(10, Math.min(38, 8 + Math.sqrt(node.count || 0) * 3.8));
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", String(radius));
    circle.setAttribute("class", `node${node.count ? "" : " low"}${node.focus ? " focus" : ""}`);
    circle.appendChild(svgTitle(`${node.label}: ${node.count} ${node.metricLabel || "publications"}, FTE ${node.fte}`));
    group.appendChild(circle);

    const countLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    countLabel.setAttribute("x", node.x);
    countLabel.setAttribute("y", node.y);
    countLabel.setAttribute("class", "node-count");
    countLabel.textContent = String(node.count || 0);
    group.appendChild(countLabel);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", node.x);
    label.setAttribute("y", clamp(node.y + radius + 17, 30, height - 30));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("class", "node-label");
    label.textContent = node.label;
    group.appendChild(label);
    svg.appendChild(group);
  });
}

function layoutNetwork(nodes, edges, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const margin = 76;
  const innerRx = Math.max(105, width * 0.16);
  const innerRy = Math.max(84, height * 0.145);
  const outerRx = Math.max(205, width * 0.34);
  const outerRy = Math.max(160, height * 0.29);
  const centrality = networkLayoutCentrality(nodes);
  const sorted = nodes.slice().map((node) => ({
    ...node,
    layoutCentrality: centrality.get(node.id) || 0,
  })).sort((a, b) => {
    if (a.focus !== b.focus) return a.focus ? -1 : 1;
    if (b.layoutCentrality !== a.layoutCentrality) return b.layoutCentrality - a.layoutCentrality;
    if (b.degree !== a.degree) return b.degree - a.degree;
    if (b.strength !== a.strength) return b.strength - a.strength;
    if (b.count !== a.count) return b.count - a.count;
    return a.label.localeCompare(b.label);
  });
  if (!sorted.length) return [];
  const placed = [{ ...sorted[0], x: cx, y: cy }];
  const inner = sorted.slice(1, Math.min(sorted.length, 7));
  const outer = sorted.slice(7);
  inner.forEach((node, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(1, inner.length);
    placed.push({
      ...node,
      x: clamp(cx + Math.cos(angle) * innerRx, margin, width - margin),
      y: clamp(cy + Math.sin(angle) * innerRy, margin, height - margin),
    });
  });
  outer.forEach((node, index) => {
    const angle = -Math.PI / 2 + Math.PI / Math.max(1, outer.length) + (Math.PI * 2 * index) / Math.max(1, outer.length);
    placed.push({
      ...node,
      x: clamp(cx + Math.cos(angle) * outerRx, margin, width - margin),
      y: clamp(cy + Math.sin(angle) * outerRy, margin, height - margin),
    });
  });
  return placed;
}

function collaboratorEdgeWidth(edge) {
  const count = Math.max(1, Number(edge.count) || 1);
  if (edge.scope === "faculty") {
    return Math.min(9.2, 0.45 + Math.pow(count, 0.82) * 1.05);
  }
  return Math.min(2.4, 0.12 + Math.pow(count, 0.74) * 0.38);
}

function collaboratorLabelPlacement(node, radius, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const dx = node.x - cx;
  const dy = node.y - cy;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const offset = radius + 16;
  const verticalNudge = uy < -0.35 ? -1 : 3;
  return {
    x: clamp(node.x + ux * offset, 58, width - 58),
    y: clamp(node.y + uy * offset + verticalNudge, 38, height - 38),
    anchor: ux > 0.28 ? "start" : ux < -0.28 ? "end" : "middle",
  };
}

function internalNodeLabelPlacement(node, radius, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const dx = node.x - cx;
  const dy = node.y - cy;
  const length = Math.hypot(dx, dy);
  if (length < 14) {
    return {
      x: node.x,
      y: clamp(node.y - radius - 13, 28, height - 28),
      anchor: "middle",
    };
  }
  const ux = dx / length;
  const uy = dy / length;
  const offset = radius + 18;
  return {
    x: clamp(node.x + ux * offset, 50, width - 50),
    y: clamp(node.y + uy * offset + 5, 30, height - 30),
    anchor: ux > 0.28 ? "start" : ux < -0.28 ? "end" : "middle",
  };
}

function staffEdgeWidth(edge) {
  const count = Math.max(1, Number(edge.count) || 1);
  return Math.min(24, 0.85 + Math.pow(count, 0.88) * 1.55);
}

function networkLayoutCentrality(nodes) {
  const maxPossibleDegree = Math.max(1, nodes.length - 1);
  const maxStrength = Math.max(1, ...nodes.map((node) => node.strength || 0));
  return new Map(nodes.map((node) => {
    const degreeCentrality = (node.degree || 0) / maxPossibleDegree;
    const weightedDegreeCentrality = (node.strength || 0) / maxStrength;
    return [node.id, degreeCentrality * 0.82 + weightedDegreeCentrality * 0.18];
  }));
}

function layoutExternalNodes(externalNodes, externalEdges, internalNodes, width, height) {
  if (!externalNodes.length) return [];
  const cx = width / 2;
  const cy = height / 2;
  const internalById = new Map(internalNodes.map((node) => [node.id, node]));
  const placed = [];
  const facultyNodes = externalNodes
    .filter((node) => node.scope === "faculty")
    .sort((a, b) => b.count - a.count || b.strength - a.strength || a.label.localeCompare(b.label));
  const facultyMargin = 92;
  const facultyRx = Math.max(210, width * 0.385);
  const facultyRy = Math.max(160, height * 0.355);
  facultyNodes.forEach((node, index) => {
    const count = Math.max(1, facultyNodes.length);
    const ring = Math.floor(index / Math.max(1, Math.ceil(count / 2)));
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count + hashNumber(node.id) * 0.045;
    const ringOffset = ring * 18;
    placed.push({
      ...node,
      x: clamp(cx + Math.cos(angle) * Math.max(width * 0.24, facultyRx - ringOffset), facultyMargin, width - facultyMargin),
      y: clamp(cy + Math.sin(angle) * Math.max(height * 0.23, facultyRy - ringOffset), facultyMargin, height - facultyMargin),
    });
  });

  const externalOnlyNodes = externalNodes.filter((node) => node.scope !== "faculty");
  const edgesByExternal = new Map();
  externalEdges.forEach((edge) => {
    if (!edgesByExternal.has(edge.target)) edgesByExternal.set(edge.target, []);
    edgesByExternal.get(edge.target).push(edge);
  });
  const groups = new Map();
  externalOnlyNodes.forEach((node) => {
    const strongest = (edgesByExternal.get(node.id) || [])
      .slice()
      .sort((a, b) => b.count - a.count)[0];
    const anchorId = strongest?.source || "_unanchored";
    if (!groups.has(anchorId)) groups.set(anchorId, []);
    groups.get(anchorId).push(node);
  });

  const rx = width * 0.47;
  const ry = height * 0.43;
  Array.from(groups.entries()).forEach(([anchorId, group], groupIndex) => {
    const anchor = internalById.get(anchorId);
    const baseAngle = anchor
      ? Math.atan2(anchor.y - cy, anchor.x - cx)
      : -Math.PI / 2 + (Math.PI * 2 * groupIndex) / Math.max(1, groups.size);
    const aggregate = group.filter((node) => node.aggregate);
    const named = group.filter((node) => !node.aggregate)
      .sort((a, b) => (
        Number(b.scope === "faculty") - Number(a.scope === "faculty")
        || Number(b.priority) - Number(a.priority)
        || b.count - a.count
        || a.label.localeCompare(b.label)
      ));
    [...aggregate, ...named].forEach((node, index) => {
      let spread = 0;
      let radialStep = 0;
      if (!node.aggregate) {
        const isFaculty = node.scope === "faculty";
        const lanes = 12;
        const ring = Math.floor(index / lanes);
        const lane = index % lanes;
        spread = (lane - (lanes - 1) / 2) * 0.12 + ring * 0.045;
        radialStep = ring * 25;
      }
      const jitter = hashNumber(node.id) * 0.1;
      const angle = baseAngle + spread + jitter;
      const localRx = Math.max(width * 0.28, rx - radialStep);
      const localRy = Math.max(height * 0.27, ry - radialStep * 0.75);
      placed.push({
        ...node,
        x: clamp(cx + Math.cos(angle) * localRx, 42, width - 42),
        y: clamp(cy + Math.sin(angle) * localRy, 42, height - 42),
      });
    });
  });
  return placed;
}

function edgePath(edge, a, b, nodes) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  let sign = hashSign(`${edge.source}|${edge.target}`);
  let bend = 18 + Math.min(38, edge.count * 5);

  nodes.forEach((node) => {
    if (node.id === edge.source || node.id === edge.target) return;
    const distance = distancePointToSegment(node.x, node.y, a.x, a.y, b.x, b.y);
    const radius = Math.max(18, Math.min(45, 12 + Math.sqrt(node.count || 0) * 4));
    if (distance < radius + 14) {
      const side = Math.sign((node.x - a.x) * nx + (node.y - a.y) * ny) || sign;
      sign = -side;
      bend += radius + 20;
    }
  });

  const cx = (a.x + b.x) / 2 + nx * bend * sign;
  const cy = (a.y + b.y) / 2 + ny * bend * sign;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

function externalEdgePath(a, b, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const dx = b.x - cx;
  const dy = b.y - cy;
  const len = Math.hypot(dx, dy) || 1;
  const outX = dx / len;
  const outY = dy / len;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bend = 22 + Math.min(28, Math.max(0, (Math.hypot(b.x - a.x, b.y - a.y) - 180) * 0.08));
  const qx = mx + outX * bend;
  const qy = my + outY * bend;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

function distancePointToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const x = ax + t * dx;
  const y = ay + t * dy;
  return Math.hypot(px - x, py - y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashSign(value) {
  let hash = 0;
  for (let idx = 0; idx < value.length; idx += 1) {
    hash = (hash * 31 + value.charCodeAt(idx)) | 0;
  }
  return hash % 2 === 0 ? 1 : -1;
}

function hashNumber(value) {
  let hash = 0;
  for (let idx = 0; idx < value.length; idx += 1) {
    hash = (hash * 31 + value.charCodeAt(idx)) | 0;
  }
  return ((Math.abs(hash) % 2000) / 1000) - 1;
}

function renderNetworkTable(edges, pubs) {
  const people = peopleById();
  const pubById = new Map(pubs.map((pub) => [pub.id, pub]));
  const rows = edges.slice(0, 25).map((edge) => [
    `${people.get(edge.source)?.display || edge.source} + ${people.get(edge.target)?.display || edge.target}`,
    edge.count,
    edge.pubIds.slice(0, 4).map((id) => pubById.get(id)?.title).filter(Boolean).join("; "),
  ]);
  els.networkTableWrap.innerHTML = `<table id="network-table"></table>`;
  setTable(document.getElementById("network-table"), ["Pair", "Shared pubs", "Examples"], rows, [false, true, false]);
}

function renderTeachingNetworkTable(edges) {
  const people = peopleById();
  const rows = edges.slice(0, 25).map((edge) => [
    `${people.get(edge.source)?.display || edge.source} + ${people.get(edge.target)?.display || edge.target}`,
    edge.count,
    (edge.courseTitles || []).slice(0, 5).join("; "),
  ]);
  if (!rows.length) {
    els.networkTableWrap.innerHTML = `<div class="staff-empty">No shared teaching-course ties for the current focus.</div>`;
    return;
  }
  els.networkTableWrap.innerHTML = `<table id="network-table"></table>`;
  setTable(document.getElementById("network-table"), ["Pair", "Shared course offerings", "Courses"], rows, [false, true, false]);
}

function renderExternalPartners(pubs, activeIds) {
  if (!els.externalPartnerList) return;
  const activePubIds = new Set(pubs.map((pub) => pub.id));
  const people = peopleById();
  const partners = (state.externalPartnersData?.partners || [])
    .map((partner) => {
      const visiblePubs = (partner.publications || []).filter((pub) => (
        activePubIds.has(pub.id)
        && (pub.staffIds || []).some((id) => activeIds.has(id))
      ));
      if (!visiblePubs.length) return null;
      const staffIds = new Set(visiblePubs.flatMap((pub) => pub.staffIds || []).filter((id) => activeIds.has(id)));
      const authorCounts = countBy(visiblePubs.flatMap((pub) => pub.authors || []), (author) => author);
      const authors = Array.from(authorCounts.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 5)
        .map(([author]) => author);
      return {
        ...partner,
        visiblePubs,
        staffIds,
        authors,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.visiblePubs.length - a.visiblePubs.length || a.institution.localeCompare(b.institution))
    .slice(0, 12);

  if (!partners.length) {
    els.externalPartnerList.innerHTML = `<p class="small-muted">No external institution affiliation data for the current filters.</p>`;
    return;
  }
  els.externalPartnerList.innerHTML = partners.map((partner) => {
    const staff = Array.from(partner.staffIds)
      .map((id) => people.get(id)?.display || id)
      .sort()
      .join(", ");
    const years = yearSetLabel(new Set(partner.visiblePubs.map((pub) => pub.year)));
    return `<article class="partner-card">
      <div>
        <p class="partner-name">${escapeHtml(partner.institution)}</p>
        <p class="partner-meta">${partner.visiblePubs.length} publication${partner.visiblePubs.length === 1 ? "" : "s"} - ${escapeHtml(years)}${partner.country ? ` - ${escapeHtml(partner.country)}` : ""}</p>
      </div>
      <p><strong>HRM&OB</strong> ${escapeHtml(staff || "Unknown")}</p>
      ${partner.authors.length ? `<p><strong>External authors</strong> ${escapeHtml(partner.authors.join(", "))}</p>` : ""}
    </article>`;
  }).join("");
}

function setTable(table, headers, rows, numeric = []) {
  table.innerHTML = `
    <thead><tr>${headers.map((header, idx) => `<th class="${numeric[idx] ? "num" : ""}">${escapeHtml(header)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((cell, idx) => `<td class="${numeric[idx] ? "num" : ""}">${cell}</td>`).join("")}</tr>`).join("")}</tbody>
  `;
}

function setEmptyTable(table, message) {
  table.innerHTML = `<tbody><tr><td>${escapeHtml(message)}</td></tr></tbody>`;
}

function aipBadge(value, source = {}) {
  if (!isNumber(value)) {
    if (source.rankableJournal === false) return `<span class="tag">Not ranked</span>`;
    if (source.aipComparable === false || source.aipStatus === "reviewed-not-in-aip-source") return `<span class="tag">Not in source</span>`;
    return `<span class="tag">NA</span>`;
  }
  const cls = value >= 95 ? "red" : value >= 90 ? "teal" : "";
  return `<span class="tag ${cls}">${value.toFixed(1)}</span>`;
}

function countBy(items, keyFn) {
  const counts = new Map();
  items.forEach((item) => {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

function svgTitle(text) {
  const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
  title.textContent = text;
  return title;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[ch]));
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function percent(part, whole) {
  if (!whole) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

function debounce(fn, wait) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}
