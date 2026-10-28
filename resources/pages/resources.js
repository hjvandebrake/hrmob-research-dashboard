/* Resources page: a landing page with one subpage per topic (#resources/<key>).
   Content lives in PAGES, GRANT_FLOW, and TIME_GUIDE so it can be edited without touching the renderer.
   Pages with status "pending" show a short placeholder. app.js calls HRMOBResources.render(page). */
(function () {
  "use strict";

  const PAGES = [
    {
      key: "research-time",
      icon: "clock",
      group: "faq",
      title: "How is my research time determined?",
      summary: "Career track, FEBRI status, grants, and the department research pool.",
    },
    {
      key: "grant-steps",
      icon: "grant",
      group: "faq",
      title: "What steps do I take when applying for a grant?",
      summary: "Who to contact, and what a grant means for your teaching and for new positions.",
      note: "I will refine these steps with the funding officer.",
    },
    {
      key: "phd-supervision",
      icon: "cap",
      group: "faq",
      title: "How do I become involved in PhD supervision?",
      summary: "How FEBRI PhD positions are filled, and other routes into supervision.",
    },
    {
      key: "conference-budgets",
      icon: "plane",
      group: "faq",
      title: "How are conference budgets allocated?",
      summary: "How the fixed travel budget is divided, and how much of it your conference plans take.",
    },
    {
      key: "research-day",
      group: "downloads",
      title: "Research day slides",
      summary: "All slides from the HRM&OB research afternoon of 15 September 2026.",
      blurb: "All 63 slides from the research afternoon of 15 September 2026.",
      format: "PDF",
      image: "resources/research-day-2026/preview.jpg",
      file: "resources/research-day-2026/hrmob-research-day-15-september-2026.pdf",
    },
    {
      key: "ai-in-research",
      group: "downloads",
      title: "Using AI well in research",
      hidden: true,
      summary: "My follow-up to the research day: what we want AI to do for our research, and where we need to be careful.",
      blurb: "Interactive follow-up to the research day on AI in our research.",
      format: "Presentation",
      image: "resources/ai-in-research/preview.webp",
    },
    {
      key: "grants",
      group: "downloads",
      title: "Grants",
      summary: "Our lunch meeting on grants: the calls in the coming year, help from colleagues, and what we concluded.",
      blurb: "Interactive presentation on grants, with what we concluded on 27 October 2026.",
      format: "Presentation",
      image: "resources/grants/preview.webp",
    },
    {
      key: "journal-scores",
      group: "downloads",
      title: "Journal scores",
      summary: "The average AIP workbook, 2020 to 2024, used for the dashboard comparisons.",
      blurb: "Average AIP score per journal, 2020 to 2024.",
      format: "Excel",
      file: "assets/downloads/aip-2020-2024-average.xlsx",
      direct: true,
    },
    {
      key: "funding-workbook",
      group: "downloads",
      title: "Funding opportunities workbook",
      blurb: "March 2026 planning archive; use the checked calls on Grants for current dates.",
      summary: "Funding opportunities and proposal notes from the planning workbook.",
      format: "Excel",
      file: "assets/downloads/hrmob-grant-opportunities-2026-2027.xlsx",
      direct: true,
    },
  ].filter((page) => !page.hidden); // hidden pages stay on the site but are not listed or routed

  const GROUPS = [
    { key: "faq", view: "faq", title: "Frequently asked questions about research in our department" },
    { key: "downloads", view: "resources", title: "Downloads" },
  ];
  // Each group lives on one top-level tab: the FAQ tab (#faq) or the Resources tab (#resources).
  const VIEWS = {
    faq: { root: "faq-root", eye: "Research in HRM&OB", title: "FAQ", crumb: "FAQ", intro: "Answers to common questions about research in our department." },
    resources: { root: "resources-root", eye: "Guidance", title: "Resources", crumb: "Resources", intro: "Presentations and downloads for our research." },
  };
  PAGES.forEach((page) => {
    page.view = GROUPS.find((group) => group.key === page.group).view;
  });

  // Grant application flow. Each node: kind (start, step, decision, branch, end), map label, title, body,
  // optional contact, and either next or answers [{label, next, record}].
  const GRANT_FLOW = {
    order: ["start", "supervisor", "funding", "teaching", "hiring", "checklist"],
    nodes: {
      start: {
        kind: "start",
        map: "You want to apply",
        title: "You want to apply for a grant",
        body: "Good. Most steps below take little time, but several people need to hear about your plans early. Walk through the questions to get a checklist of who to contact and what it means for your work.",
        next: "supervisor",
        nextLabel: "Start",
      },
      supervisor: {
        kind: "decision",
        map: "Discuss with your supervisor",
        title: "Discuss the idea with your supervisor",
        body: "Before you invest serious time, talk about the call, the fit with your research line, the timing, and what the application and the project would mean for your other tasks.",
        contact: "Your supervisor",
        question: "Does your supervisor support the application?",
        answers: [
          { label: "Yes", next: "funding", record: { supervisor: "yes" } },
          { label: "Not yet", next: "rework", record: { supervisor: "not-yet" } },
        ],
      },
      rework: {
        kind: "branch",
        parent: "supervisor",
        map: "Rework the plan",
        title: "Rework the plan first",
        body: "Use the feedback to sharpen the idea, pick a better-fitting call, or move to a later round. Most funders have several rounds per year, and the call calendar on the Grants page shows what is coming. Then discuss it again.",
        next: "supervisor",
        nextLabel: "Discuss again",
      },
      funding: {
        kind: "step",
        map: "Inform the funding officer",
        title: "Let the funding officer know",
        body: "For almost every grant you need the funding officer at some point, for example for the budget, the funder's rules, and the internal approval of the application. Contact them early, ideally when you start writing, so there is time to sort out the budget and any guarantees.",
        contact: "Lars van den Brink, FEB funding officer (FEB Research Office)",
        email: "l.h.van.den.brink@rug.nl",
        next: "teaching",
        nextLabel: "Next",
      },
      teaching: {
        kind: "decision",
        map: "Teaching reduction?",
        title: "Estimate the consequences: your teaching",
        body: "Many grants pay for part of your own time, which means that someone else has to take over part of your teaching.",
        question: "Does the grant involve a reduction of your own teaching?",
        answers: [
          { label: "Yes", next: "teachingYes", record: { teaching: "yes" } },
          { label: "No", next: "hiring", record: { teaching: "no" } },
          { label: "Not sure", next: "teachingYes", record: { teaching: "unsure" } },
        ],
      },
      teachingYes: {
        kind: "branch",
        parent: "teaching",
        map: "Talk to the scheduler",
        title: "Discuss the teaching reduction",
        body: "Teaching is planned well in advance. The hours in the grant budget determine how much teaching you hand over. Discuss with the scheduler or the teaching director which teaching that would be and from when, so the reduction can be planned if the grant is awarded. If you are not sure whether the grant pays for your own time, check the budget with the funding officer first.",
        contact: "Scheduler or teaching director",
        next: "hiring",
        nextLabel: "Next",
      },
      hiring: {
        kind: "decision",
        map: "New or extended positions?",
        title: "Estimate the consequences: positions",
        body: "Grants often pay for a PhD candidate or postdoc, or extend an existing temporary contract, including your own.",
        question: "Does the grant involve hiring new people or extending contracts?",
        answers: [
          { label: "Yes", next: "embedding", record: { hiring: "yes" } },
          { label: "No", next: "checklist", record: { hiring: "no" } },
        ],
      },
      embedding: {
        kind: "branch",
        parent: "hiring",
        map: "Embedding guarantee",
        title: "Arrange an embedding guarantee",
        body: "New or extended positions require an embedding guarantee: the faculty confirms that it can host the position. The funding officer drafts it and asks the department chair and the research director to confirm that they support the application before it goes for signature. Request it well before the deadline, and make sure the title matches your submission.",
        contact: "Lars van den Brink, FEB funding officer",
        email: "l.h.van.den.brink@rug.nl",
        next: "checklist",
        nextLabel: "Next",
      },
      checklist: {
        kind: "end",
        map: "Your checklist",
        title: "Your checklist",
      },
    },
  };

  // Research time: layers in the order they apply, then the department pool and an eligibility check.
  const TIME_GUIDE = {
    intro: "Your research time is built up in layers. Most of these you will already know from your appointment. The last layer, the department research pool, is the one we decide on within HRM&OB.",
    layers: [
      {
        key: "career",
        label: "Career track",
        who: "Your appointment",
        title: "The career track sets your time during the track",
        body: "The research profile of the career track comes with 50% research time during the track, about 10 percentage points more than the FEBRI Fellow level. After the track, your research time follows the FEBRI criteria. The education profile has a fixed 20% research time.",
      },
      {
        key: "febri",
        label: "FEBRI fellowship",
        who: "FEBRI",
        title: "Your FEBRI status sets your research time",
        body: "FEBRI, the FEB Research Institute, assigns a status based on your output over the past five years. Each journal article earns points according to the journal's AIP score, weighted by the number of authors. The Research Office checks the statuses every spring, and your status sets your research time for the next academic year.",
        facts: [
          ["Associate Fellow", "0.7 points, of which at least 0.4 from journal articles", "25%"],
          ["Fellow", "2.5 points, of which at least 1.5 from journal articles", "40%"],
        ],
        link: { label: "FEBRI criteria for output assessment", url: "https://www.rug.nl/research/feb-ri/organization/performance-criteria/?lang=en" },
      },
      {
        key: "grant",
        label: "Grants",
        who: "The funder",
        title: "A grant can buy out teaching",
        body: "Many grants pay for part of your time. The hours in the grant budget come off your teaching, not off your research time, for the duration of the project.",
        link: { label: "What steps do I take when applying for a grant?", page: "grant-steps" },
      },
      {
        key: "pool",
        label: "Department pool",
        who: "Research director",
        title: "The department research pool",
        body: "Every year the faculty gives the department an amount of research time (in FTE) based on how well we published as a department. The research director divides this among eligible colleagues.",
      },
    ],
    pool: {
      eligibility: "Regular staff whose teaching is not already reduced through a grant or the career track. PhD candidates and postdocs are not part of this scheme. Affiliated staff are not eligible either, because of their relatively small contracts with the department.",
      size: "The pool is usually modest. Depending on the total time available and the number of eligible colleagues, it has amounted to roughly 5 to 10% per person.",
      split: [
        { share: 50, label: "Equal share", body: "Divided equally among all eligible colleagues." },
        { share: 50, label: "Grant activity", body: "Divided among eligible colleagues who are working on a grant or a grant application." },
      ],
      why: "Grants matter and will matter more in the coming years, so I want to use this time to support grant work. Many departments let the research director allocate the pool based on prior performance. We do not do that at the moment, although we could consider it in the future.",
      review: "We evaluate the split every year and it may change. One option is to base the full pool on current and past grant work, so that colleagues on a grant without a teaching reduction are not discouraged from applying again.",
    },
    check: [
      {
        key: "role",
        question: "Are you a PhD candidate or a postdoc?",
        answers: [
          { label: "Yes", result: "na" },
          { label: "No", next: "grant" },
        ],
      },
      {
        key: "grant",
        question: "Does a grant already reduce your teaching?",
        answers: [
          { label: "Yes", result: "grant" },
          { label: "No", next: "career" },
        ],
      },
      {
        key: "career",
        question: "Are you in the career track?",
        answers: [
          { label: "Yes", result: "career" },
          { label: "No", result: "eligible" },
        ],
      },
    ],
    results: {
      na: { tone: "neutral", title: "Not part of the pool", body: "Your research time follows from your PhD or postdoc contract and project." },
      grant: { tone: "neutral", title: "Not eligible for the pool", body: "Your grant already reduces your teaching. If your grant does not come with a teaching reduction, answer No." },
      career: { tone: "neutral", title: "Not eligible for the pool", body: "The career track already sets your research time, at 50% for the research profile." },
      eligible: { tone: "good", title: "Eligible for the pool", body: "You receive an equal share of half of the pool. Working on a grant or a grant application adds a share of the other half." },
    },
  };

  const FAQ_DISCLAIMER = "These answers are based on Joost's memory only. They are not official policy, and the procedures change frequently, so check the details with the people mentioned before you act on them.";

  // Text answers: an intro, a sequence of steps, short cards, and a closing note with a contact.
  const MAILTO = "mailto:h.j.van.de.brake@rug.nl";
  const FAQ_ARTICLES = {
    "phd-supervision": {
      intro: "Most PhD candidates in our department come through the PhD positions that FEBRI funds every year. You can also become involved through grants and through your broader network.",
      layout: "routes",
      cardsTitle: "Ways to become involved",
      cards: [
        {
          title: "FEBRI PhD positions",
          body: "Join the supervision team of a candidate whose proposal fits your expertise. Fit with the candidate's interests decides who supervises.",
          stepsTitle: "How FEBRI PhD positions are filled",
          steps: [
            { title: "FEBRI funds a number of positions", body: "Every year FEBRI funds a set number of PhD positions for the whole faculty. In the last round there were 11." },
            { title: "Candidates apply with their own proposal", body: "The positions are open, and candidates apply with a research proposal. Hundreds apply every year. Students from our own research master can apply too, and they are interviewed first." },
            { title: "FEBRI makes a preselection", body: "FEBRI preselects candidates and discusses all eligible candidates with the research directors of the departments." },
            { title: "Interviews based on quality", body: "Based on quality, we decide who is invited for an interview." },
            { title: "Selection", body: "Candidates are selected and hired almost exclusively on quality. When candidates are equally qualified, we may try to spread them across departments. In practice, HRM&OB can hire between zero and two PhD candidates per year." },
            { title: "A supervision team is formed", body: "The team is formed around the candidate's proposal and preferred supervisor. Fit between your expertise and the candidate's interests is key. Where possible, we spread supervision across staff members." },
          ],
        },
        { title: "Grants", body: "Many grants let you hire a PhD candidate on your own project.", link: { label: "What steps do I take when applying for a grant?", page: "grant-steps" } },
        { title: "Your broader network", body: "Your network can also lead to PhD supervision, for example through co-supervision with colleagues elsewhere." },
      ],
      fact: "Supervision also counts for your FEBRI status: each defended thesis you supervised earns 0.25 points, up to 1.25 points per five years.",
      note: { title: "Want to supervise more?", body: "Contact me if you want to supervise more PhD candidates but feel you do not get enough opportunity to do so.", label: "Email the research director", href: `${MAILTO}?subject=PhD%20supervision` },
    },
    "conference-budgets": {
      layout: "flow",
      intro: "FEBRI gives the department a fixed travel budget each year, based on the number of colleagues in the career track or with FEBRI fellow status. I divide it among those who apply, with the management team. Next year the budget is 10% lower because of budget cuts.",
      stepsTitle: "How it works",
      steps: [
        { title: "Name your conferences", body: "Give realistic costs for specific conferences. A lump sum is not possible because of the faculty's CO2 limit." },
        { title: "I balance all requests", body: "In busy years everyone gets less, or colleagues who asked for little before get preference." },
        { title: "No news is good news", body: "One or two conferences within reasonable limits count as approved. I only contact you if plans must change." },
      ],
      visual: "travel-share",
      note: { title: "Own funds help everyone", body: "Paying for a conference from your own funds makes room for colleagues. You can build them through executive teaching, externally funded projects, and grants. Contact me with questions about your request or your own funds.", label: "Email the research director", href: `${MAILTO}?subject=Travel%20budget` },
    },
  };

  // Illustration only, with made-up numbers. 20 colleagues could apply, the budget pays for 16
  // European conferences, and a conference outside Europe costs about twice as much (2 units).
  // The total-budget calculator stacks a fixed mix of requests; the "your plans" block below it
  // uses the same budget and the same number of applicants.
  const TRAVEL = {
    eligible: 20,
    budget: 16,
    cut: 0.1,
    minApplicants: 2,
    defaultApplicants: 10,
    requests: [2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1],
    max: 3,
    trips: [
      { key: "europe", where: "in Europe", cost: 1 },
      { key: "outside", where: "outside Europe", cost: 2 },
    ],
  };

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const pageHref = (key) => {
    const page = PAGES.find((item) => item.key === key);
    return page ? `#${page.view}/${key}` : "#resources";
  };

  const state = {
    view: "resources",
    pages: {},
    grantPath: ["start"],
    grantRecord: {},
    checkPath: ["role"],
    checkResult: "",
    layer: "career",
    travelApplicants: TRAVEL.defaultApplicants,
    travelPlan: { europe: 1, outside: 0 },
    travelCut: false,
    journalRows: null,
    journalPromise: null,
    journalError: false,
    journalQuery: "",
    journalSelected: null,
  };

  const roots = {};
  let resourceData = {};
  const journalDataVersion = new URL(document.currentScript?.src || "resources/pages/resources.js", document.baseURI).searchParams.get("v");

  /* ---------- Landing page ---------- */

  function renderLanding(view) {
    const v = VIEWS[view];
    const groups = GROUPS.filter((group) => group.view === view).map((group) => {
      const pages = PAGES.filter((page) => page.group === group.key);
      const cards = pages.map((page, index) => (group.key === "downloads" ? downloadCard(page) : faqCard(page, index))).join("");
      return `<section class="rp-group rp-group-${group.key}"${view === "faq" ? "" : ` aria-labelledby="rp-group-${group.key}"`}>
        ${view === "faq" ? "" : `<h3 id="rp-group-${group.key}" class="overview-h3">${esc(group.title)}</h3>`}
        ${group.key === "faq" ? `<p class="rp-disclaimer">${esc(FAQ_DISCLAIMER)}</p>` : ""}
        <div class="rp-cards">${cards}</div>
      </section>`;
    }).join("");
    const share = view === "resources"
      ? `<div class="rg-note rp-share"><strong>Something to share?</strong><p>Let me know if you have a presentation, dataset, tool, or anything else that would be useful for colleagues.</p><a class="section-link" href="${MAILTO}?subject=Something%20to%20share%20on%20the%20dashboard">Email the research director</a></div>`
      : "";
    const news = view === "resources" ? `<section class="rp-group"><h3 class="overview-h3">Research News resources</h3>
      <div class="rp-cards">${(resourceData.researchNewsResources || []).map((item) => `<a class="rp-card" href="${esc(item.sourceUrl)}" target="_blank" rel="noopener"><span class="rp-card-text"><strong>${esc(item.name)}</strong><span>${esc(item.timing || item.sourceLabel)}</span></span></a>`).join("")}</div>
      <p><a class="section-link" href="#grants">Grant calls, opportunities and proposal tips</a></p></section>` : "";
    return `<div class="sec-head compact"><div><p class="eye">${esc(v.eye)}</p><h2 class="h2">${esc(v.title)}</h2></div></div>
      <p class="section-intro page-intro">${esc(v.intro)}</p>
      <div class="rp-landing rp-landing-${view}">${groups}</div>
      ${news}
      ${share}`;
  }

  // One consistent rounded-line set, with a quiet tint and equal optical weight.
  // The same topic icon appears on its FAQ card and question page.
  const ICONS = {
    clock: '<circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity=".06"/><path d="M12 6.5V12l3.5 2.2"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/>',
    grant: '<path d="M14 3H6a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V8.5Z" fill="currentColor" fill-opacity=".06"/><path d="M14 3v5.5h5.5M8 11h4M8 14h3M12 17l2 2 4-4"/>',
    cap: '<path d="m2 8.5 10-4.5 10 4.5L12 13Z" fill="currentColor" fill-opacity=".06"/><path d="M6 10.3v6.2c3.4 2.7 8.6 2.7 12 0v-6.2M22 8.5v7"/><circle cx="22" cy="17.5" r=".8" fill="currentColor" stroke="none"/>',
    plane: '<g transform="rotate(35 12 12)"><path d="M12 2.75c-.8 0-1.25.6-1.25 1.4v4.6L3 13.2v2l7.75-2.2v4.4L8.2 19v1.7l3.8-1 3.8 1V19l-2.55-1.6V13L21 15.2v-2l-7.75-4.45v-4.6c0-.8-.45-1.4-1.25-1.4Z" fill="currentColor" fill-opacity=".06"/></g>',
  };
  const icon = (name, cls = "rp-icon") => (ICONS[name]
    ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`
    : "");

  function faqCard(page, index) {
    const pending = page.status === "pending";
    return `<a class="rp-card${pending ? " is-pending" : ""}" href="${pageHref(page.key)}">
        <span class="rp-card-body">
          ${page.icon ? `<span class="rp-card-icon">${icon(page.icon)}</span>` : `<span class="rp-card-num" aria-hidden="true">${index + 1}</span>`}
          <span class="rp-card-text">
            <strong>${esc(page.title)}</strong>
            <span>${pending ? "Coming soon" : esc(page.summary)}</span>
          </span>
        </span>
      </a>`;
  }

  function downloadCard(page) {
    const funding = page.key === "funding-workbook";
    const thumb = page.image
      ? `<img class="rp-dl-thumb" src="${esc(page.image)}" width="160" height="90" alt="" loading="lazy">`
      : `<span class="rp-dl-thumb rp-dl-sheet" aria-hidden="true">
          <span class="rp-sheet-row rp-sheet-head"><i>${funding ? "Call" : "Journal"}</i><i>${funding ? "Stage" : "AIP"}</i></span>
          <span class="rp-sheet-row"><i></i><b>${funding ? "Early" : "99"}</b></span>
          <span class="rp-sheet-row"><i></i><b>${funding ? "Mid" : "96"}</b></span>
          <span class="rp-sheet-row"><i></i><b>${funding ? "Senior" : "91"}</b></span>
        </span>`;
    const href = page.direct ? esc(page.file) : pageHref(page.key);
    if (page.key === "journal-scores") {
      return `<article class="rp-dl rp-dl-journals">
        ${thumb}
        <div class="rp-dl-text">
          <strong>${esc(page.title)}</strong>
          <span>${esc(page.blurb)}</span>
          <div class="rp-dl-actions">
            <a class="rp-dl-excel" href="${href}" download>Excel</a>
            <a class="rp-journal-open" href="${pageHref(page.key)}">Journal finder <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </article>`;
    }
    return `<a class="rp-dl" href="${href}"${page.direct ? " download" : ""}>
        ${thumb}
        <span class="rp-dl-text">
          <strong>${esc(page.title)}</strong>
          <span>${esc(page.blurb)}</span>
          <em>${esc(page.format)}</em>
        </span>
      </a>`;
  }

  /* ---------- Subpages ---------- */

  function renderSubpage(page) {
    const journalFinder = page.key === "journal-scores";
    const group = GROUPS.find((item) => item.key === page.group);
    const groupPages = PAGES.filter((item) => item.group === page.group);
    const index = groupPages.indexOf(page);
    const next = groupPages[index + 1];
    const prev = groupPages[index - 1];
    let body = "";
    if (page.status === "pending") body = renderPending();
    else if (FAQ_ARTICLES[page.key]) body = renderArticle(FAQ_ARTICLES[page.key]);
    else if (page.key === "research-day") body = renderSlides(page);
    else if (page.key === "ai-in-research") body = renderAiPresentation();
    else if (page.key === "grants") body = renderGrants();
    else if (page.key === "research-time") body = renderTimeGuide();
    else if (page.key === "grant-steps") body = renderGrantGuide();
    else if (page.key === "journal-scores") body = renderJournalScores(page);
    const pager = !journalFinder && groupPages.length > 1
      ? `<nav class="rp-pager" aria-label="${esc(group.title)}">
          ${prev ? `<a href="${pageHref(prev.key)}"><span>Previous</span>${esc(prev.title)}</a>` : "<span></span>"}
          ${next ? `<a class="rp-pager-next" href="${pageHref(next.key)}"><span>Next</span>${esc(next.title)}</a>` : ""}
        </nav>`
      : "";
    const v = VIEWS[page.view];
    const back = page.view === "faq" ? "All questions" : "All resources";
    return `<a class="rp-back" href="#${page.view}"><span aria-hidden="true">&larr;</span> Back to ${esc(back.toLowerCase())}</a>
      <div class="sec-head compact rp-head"><div class="rp-head-title">${page.icon ? `<span class="rp-head-icon">${icon(page.icon)}</span>` : ""}<h2 class="h2">${journalFinder ? "Journal finder" : esc(page.title)}</h2></div></div>
      ${page.group === "faq" ? `<p class="rp-disclaimer">${esc(FAQ_DISCLAIMER)}</p>` : ""}
      <div class="rp-content">${body}</div>
      ${page.note ? `<p class="rg-status small-muted">${esc(page.note)}</p>` : ""}
      ${journalFinder ? "" : `<a class="rp-back rp-back-bottom" href="#${page.view}"><span aria-hidden="true">&larr;</span> Back to ${esc(back.toLowerCase())}</a>`}
      ${pager}`;
  }

  function renderPending() {
    return `<div class="rg-card rg-pending"><p class="eye">Coming soon</p><p class="rg-body">This answer is still being written. Questions in the meantime? Use the contact page.</p><a class="section-link" href="#contact">Open contact page</a></div>`;
  }

  function renderSteps(steps, extraClass = "") {
    return `<ol class="rp-steps${extraClass ? ` ${extraClass}` : ""}">${steps.map((step, index) => `<li>
        <span class="rp-step-num" aria-hidden="true">${index + 1}</span>
        <div><strong>${esc(step.title)}</strong><p>${esc(step.body)}</p></div>
      </li>`).join("")}</ol>`;
  }

  function renderArticleAside(article) {
    return `${article.fact ? `<p class="rp-fact">${esc(article.fact)}</p>` : ""}
      <div class="rg-note rp-note">
        <strong>${esc(article.note.title)}</strong>
        <p>${esc(article.note.body)}</p>
        <a class="section-link" href="${article.note.href}">${esc(article.note.label)}</a>
      </div>`;
  }

  function renderRoutes(article) {
    const routes = article.cards.map((card, index) => `<section class="rp-route" aria-labelledby="rp-route-${index}">
        <div class="rp-route-head">
          <span class="rp-card-num" aria-hidden="true">${index + 1}</span>
          <h4 id="rp-route-${index}">${esc(card.title)}</h4>
        </div>
        <p class="rp-route-body">${esc(card.body)}</p>
        ${card.link ? `<a class="section-link" href="${pageHref(card.link.page)}">${esc(card.link.label)}</a>` : ""}
        ${card.steps ? `<div class="rp-route-steps"><p class="rg-sub">${esc(card.stepsTitle)}</p>${renderSteps(card.steps)}</div>` : ""}
      </section>`).join("");
    return `<p class="rg-intro">${esc(article.intro)}</p>
      <div class="rp-article">
        <section class="rp-article-routes" aria-labelledby="rp-routes-title">
          <h3 id="rp-routes-title" class="overview-h3">${esc(article.cardsTitle)}</h3>
          <div class="rp-routes">${routes}</div>
        </section>
        <aside class="rp-article-cards">${renderArticleAside(article)}</aside>
      </div>`;
  }

  function renderArticle(article) {
    if (article.layout === "routes") return renderRoutes(article);
    if (article.layout === "flow") return renderFlow(article);
    const cards = article.cards.map((card) => `<article class="rp-info">
        <h4>${esc(card.title)}</h4>
        <p>${esc(card.body)}</p>
        ${card.link ? `<a class="section-link" href="${pageHref(card.link.page)}">${esc(card.link.label)}</a>` : ""}
      </article>`).join("");
    return `<p class="rg-intro">${esc(article.intro)}</p>
      <div class="rp-article">
        <section class="rp-article-steps" aria-labelledby="rp-steps-title">
          <h3 id="rp-steps-title" class="overview-h3">${esc(article.stepsTitle)}</h3>
          ${renderSteps(article.steps)}
        </section>
        <section class="rp-article-cards" aria-labelledby="rp-cards-title">
          <h3 id="rp-cards-title" class="overview-h3">${esc(article.cardsTitle)}</h3>
          <div class="rp-info-list">${cards}</div>
          ${renderArticleAside(article)}
        </section>
      </div>`;
  }

  function renderFlow(article) {
    return `<p class="rg-intro">${esc(article.intro)}</p>
      <section class="rp-flow" aria-labelledby="rp-steps-title">
        <h3 id="rp-steps-title" class="overview-h3">${esc(article.stepsTitle)}</h3>
        ${renderSteps(article.steps, "rp-steps-row")}
      </section>
      ${article.visual === "travel-share" ? renderTravelShare() : ""}
      <div class="rg-note rp-note rp-flow-note">
        <strong>${esc(article.note.title)}</strong>
        <p>${esc(article.note.body)}</p>
        <a class="section-link" href="${article.note.href}">${esc(article.note.label)}</a>
      </div>`;
  }

  function travelBudget() {
    return TRAVEL.budget * (state.travelCut ? 1 - TRAVEL.cut : 1);
  }

  function renderTravelShare() {
    return `<section class="rp-pool" aria-labelledby="rp-pool-title">
        <p class="rp-pool-tag">Illustration with made-up numbers</p>
        <h3 id="rp-pool-title" class="overview-h3">How the total budget shapes your share</h3>
        <p class="rp-pool-lead">In this example, ${TRAVEL.eligible} colleagues could apply and the budget pays for ${TRAVEL.budget} European conferences.</p>
        <div class="rp-pool-controls">
          <label class="rp-pool-slider">
            <span>How many colleagues apply? <strong id="rp-pool-count">${state.travelApplicants} of ${TRAVEL.eligible}</strong></span>
            <input type="range" min="${TRAVEL.minApplicants}" max="${TRAVEL.eligible}" step="1" value="${state.travelApplicants}" data-travel-applicants aria-describedby="rp-pool-readout">
          </label>
          <label class="switch rp-pool-cut">
            <input type="checkbox" data-travel-cut${state.travelCut ? " checked" : ""}>
            <span class="switch-copy"><span>Next year: 10% less</span></span>
          </label>
        </div>
        <div id="rp-pool-viz" class="rp-pool-viz">${renderTravelPoolViz()}</div>
        <section class="rp-mine" aria-labelledby="rp-mine-title">
          <h4 id="rp-mine-title">How much of the budget do your plans take?</h4>
          <div id="rp-mine-controls" class="rp-mine-controls">${renderTravelControls()}</div>
          <div id="rp-mine-viz">${renderTravelShareViz()}</div>
        </section>
      </section>`;
  }

  function renderTravelPoolViz() {
    const n = state.travelApplicants;
    const fullBudget = TRAVEL.budget;
    const budget = travelBudget();
    const requests = TRAVEL.requests.slice(0, n);
    const requested = requests.reduce((sum, value) => sum + value, 0);
    const scale = TRAVEL.requests.reduce((sum, value) => sum + value, 0);
    const pct = (value) => `${(value / scale) * 100}%`;
    const people = Array.from({ length: TRAVEL.eligible }, (_, i) => `<svg class="rp-person${i < n ? " is-applied" : ""}" viewBox="0 0 20 26" aria-hidden="true"><circle cx="10" cy="6" r="5"/><path d="M1 26c0-7 4-11 9-11s9 4 9 11z"/></svg>`).join("");
    let running = 0;
    const blocks = requests.map((value) => {
      running += value;
      const over = running > budget + 1e-9;
      return `<span class="rp-req rp-req-${value}${over ? " is-over" : ""}" style="width:${pct(value)}"></span>`;
    }).join("");
    const ratio = requested / budget;
    const used = Math.round(ratio * 100);
    let tone = "good";
    let message = used <= 80
      ? "All requests fit, and there is room for larger requests or a reserve for unforeseen costs."
      : "All requests fit within the budget and can be approved as asked.";
    if (ratio > 1) {
      tone = "neutral";
      message = "Requests slightly exceed the budget. Most are approved as asked; a few are reduced, or colleagues are asked to choose one conference.";
    }
    if (ratio > 1.25) {
      tone = "busy";
      message = "A busy year: everyone gets less, or the research director may give preference to colleagues who asked for little in previous years.";
    }
    const anyOver = running > budget + 1e-9;
    const count = document.getElementById("rp-pool-count");
    if (count) count.textContent = `${n} of ${TRAVEL.eligible}`;
    return `<div class="rp-people" aria-hidden="true">${people}</div>
      <div class="rp-req-track" aria-hidden="true">
        <span class="rp-budget-zone" style="width:${pct(budget)}"></span>
        ${state.travelCut ? `<span class="rp-cut-zone" style="left:${pct(budget)};width:${pct(fullBudget - budget)}"></span>` : ""}
        <span class="rp-req-blocks">${blocks}</span>
        <span class="rp-budget-line" style="left:${pct(budget)}"><span>Total budget${state.travelCut ? " after the 10% cut" : ""}</span></span>
      </div>
      <p class="rp-req-legend"><span class="rp-key rp-key-1"></span>One European conference <span class="rp-key rp-key-2"></span>Outside Europe, or two in Europe${anyOver ? ' <span class="rp-key rp-key-over"></span>Beyond the budget' : ""}</p>
      <p id="rp-pool-readout" class="rp-pool-readout rp-tone-${tone}" aria-live="polite"><strong>${n} applicants ask for ${used}% of the budget.</strong> ${esc(message)}</p>`;
  }

  function renderTravelControls() {
    return TRAVEL.trips.map((trip) => {
      const value = state.travelPlan[trip.key];
      return `<div class="rp-stepper" role="group" aria-labelledby="rp-trip-${trip.key}">
          <span id="rp-trip-${trip.key}" class="rp-stepper-label">Conferences ${esc(trip.where)}</span>
          <span class="rp-stepper-ctl">
            <button type="button" data-travel-trip="${trip.key}" data-travel-delta="-1" aria-label="Remove a conference ${esc(trip.where)}"${value <= 0 ? " disabled" : ""}>&minus;</button>
            <output aria-live="polite">${value}</output>
            <button type="button" data-travel-trip="${trip.key}" data-travel-delta="1" aria-label="Add a conference ${esc(trip.where)}"${value >= TRAVEL.max ? " disabled" : ""}>+</button>
          </span>
        </div>`;
    }).join("");
  }

  function renderTravelShareViz() {
    const full = TRAVEL.budget;
    const budget = travelBudget();
    const trips = TRAVEL.trips.flatMap((trip) => Array.from({ length: state.travelPlan[trip.key] }, () => trip));
    const used = trips.reduce((sum, trip) => sum + trip.cost, 0);
    const share = Math.round((used / budget) * 100);
    const others = state.travelApplicants - 1;
    const covered = Math.max(0, Math.min(others, Math.floor(budget - used + 1e-9)));
    const pct = (value) => `${(value / full) * 100}%`;
    const blocks = trips.map((trip) => `<span class="rp-share-mine" style="width:${pct(trip.cost)}"></span>`).join("");
    const allFit = covered >= others;
    const who = others === 1 ? "the other applicant asks" : `the other ${others} applicants each ask`;
    const result = allFit ? (others === 1 ? "pays for that too" : "pays for all of them") : `pays for ${covered} of them`;
    const large = !allFit && used >= 2 ? " A plan this size is only possible because colleagues ask for less." : "";
    const lead = used ? `Your plans take ${share}% of the budget.` : "Add a conference to see your share.";
    return `<p class="rp-share-stat" aria-hidden="true"><strong>${share}%</strong> <span>of the budget</span></p>
      <div class="rp-share-track" style="--cells:${full}" aria-hidden="true">
        ${state.travelCut ? `<span class="rp-cut-zone" style="left:${pct(budget)};width:${pct(full - budget)}"></span>` : ""}
        <span class="rp-share-blocks">${blocks}</span>
      </div>
      <p class="rp-req-legend" aria-hidden="true"><span class="rp-key rp-key-mine"></span>Your conferences <span class="rp-key rp-key-left"></span>Left for colleagues${state.travelCut ? ` <span class="rp-key rp-key-cut"></span>10% cut` : ""}</p>
      <p id="rp-mine-readout" class="rp-pool-readout rp-tone-${allFit ? "good" : "busy"}" aria-live="polite"><span class="visually-hidden">${esc(lead)} </span>If ${who} for one European conference, what is left ${result}.${esc(large)}</p>`;
  }

  function renderSlides(page) {
    return `<p class="rp-lead">${esc(page.summary)} Scroll through the slides below, or open them in a new tab.</p>
      <div class="rp-actions">
        <a class="ai-guidance-open" href="${esc(page.file)}" target="_blank" rel="noopener">Open the slides</a>
        <a class="section-link" href="${esc(page.file)}" download>Download PDF</a>
      </div>
      <iframe class="rp-pdf" src="${esc(page.file)}#view=FitH" title="Slides of the HRM&amp;OB research afternoon, 15 September 2026" loading="lazy"></iframe>`;
  }

  function renderAiPresentation() {
    return `<div class="ai-guidance rp-ai">
        <a class="ai-guidance-preview" href="resources/ai-in-research/" aria-label="Open the presentation Using AI well in research">
          <img src="resources/ai-in-research/preview.webp" width="960" height="540" alt="Opening slide of the presentation Using AI well in research" loading="lazy">
        </a>
        <div class="ai-guidance-copy">
          <p>A follow-up to the research day, in which I describe what we want AI to do for our research, how AI changes research along three dimensions, and where it helps most and where we need to be careful. At the end I ask for your input for FEB&rsquo;s plan for AI in research. The presentation is interactive, so you can click on its tabs, heatmap cells, and sources.</p>
          <div class="ai-guidance-actions">
            <a class="ai-guidance-open" href="resources/ai-in-research/">Open the presentation</a>
            <a class="section-link" href="mailto:h.j.van.de.brake@rug.nl?subject=Input%20on%20AI%20in%20research">Send your input</a>
          </div>
        </div>
      </div>`;
  }

  function renderGrants() {
    return `<div class="ai-guidance rp-ai">
        <a class="ai-guidance-preview" href="resources/grants/" aria-label="Open the presentation Helping each other with grants">
          <img src="resources/grants/preview.webp" width="960" height="540" alt="Opening slide of the presentation Helping each other with grants" loading="lazy">
        </a>
        <div class="ai-guidance-copy">
          <p>The presentation for our lunch meeting on grants after the research day. It starts with a short look back at what we discussed and agreed on 15 September. Most of it is about grants: what FEB&rsquo;s strategic plan asks of us, the calls in the coming year, our funding coordinator Lars van den Brink, and how we can help each other with applications. The discussion slides show what we concluded at the lunch on 27 October, with our notes, and the last slide summarises them.</p>
          <div class="ai-guidance-actions">
            <a class="ai-guidance-open" href="resources/grants/">Open the presentation</a>
            <a class="section-link" href="mailto:h.j.van.de.brake@rug.nl?subject=Grant%20plans">Tell me about your plans</a>
          </div>
        </div>
      </div>`;
  }

  function renderJournalScores(page) {
    return `<section class="jf" aria-label="Find a journal's AIP scores">
      <p class="jf-period">Average AIP <span aria-hidden="true">&middot;</span> 2020–2024</p>
      <label class="jf-label" for="journal-finder-input">Journal name</label>
      <div class="jf-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>
        <input id="journal-finder-input" data-journal-search type="search" autocomplete="off" spellcheck="false" placeholder="e.g. Academy of Management" value="${esc(state.journalQuery)}" aria-controls="journal-finder-results" aria-describedby="journal-finder-help journal-finder-status">
      </div>
      <p id="journal-finder-help" class="visually-hidden">Matching journals show their scores below. Use the down arrow to browse, Enter to select, and Escape to clear.</p>
      <p id="journal-finder-status" class="jf-status" role="status"></p>
      <div id="journal-finder-results"></div>
    </section>`;
  }

  function journalSearchKey(value) {
    return String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function journalScore(row) {
    return Number.isFinite(row.score) ? String(row.score) : "Not available";
  }

  function journalScoreTable(title, periods, scores) {
    return `<section class="jf-history"><h3>${esc(title)}</h3><table><thead><tr><th scope="col">${title === "Annual AIP" ? "Year" : "Period"}</th><th scope="col">AIP</th></tr></thead><tbody>${periods.map((period, i) => `<tr><th scope="row">${esc(period)}</th><td>${Number.isFinite(scores[i]) ? esc(String(scores[i])) : '<span class="jf-missing" aria-label="Not available">—</span>'}</td></tr>`).join("")}</tbody></table></section>`;
  }

  function updateJournalResults() {
    const results = document.getElementById("journal-finder-results");
    const status = document.getElementById("journal-finder-status");
    if (!results || !status) return;
    results.innerHTML = "";
    if (state.journalError) {
      status.textContent = "Journal scores could not load.";
      results.innerHTML = '<button type="button" class="jf-retry" data-journal-retry>Try again</button>';
      return;
    }
    if (!state.journalRows) {
      status.textContent = "Loading journal scores…";
      return;
    }
    const selected = state.journalSelected;
    if (selected) {
      status.textContent = "";
      results.innerHTML = `<div class="jf-selection" role="status"><strong>${esc(selected.name)}</strong><div><span>Average AIP · 2020–2024</span><b>${esc(journalScore(selected))}</b></div></div><div class="jf-history-grid">${journalScoreTable("Annual AIP", state.journalYears, selected.annual)}${journalScoreTable("Five-year averages", state.journalPeriods, selected.averages)}</div>`;
      return;
    }
    const query = journalSearchKey(state.journalQuery);
    if (!query) {
      status.textContent = "Start typing to find a journal.";
      return;
    }
    const words = query.split(" ");
    const matches = state.journalRows.filter((row) => words.every((word) => row.key.includes(word)))
      .sort((a, b) => Number(b.key.startsWith(query)) - Number(a.key.startsWith(query)) || a.name.localeCompare(b.name));
    status.textContent = !matches.length ? "No matching journals in this workbook." : `${matches.length.toLocaleString("en-GB")} matching journal${matches.length === 1 ? "" : "s"}${matches.length > 12 ? " · Keep typing to narrow the list." : ""}`;
    if (!matches.length) return;
    results.innerHTML = `<div class="jf-columns" aria-hidden="true"><span>Journal</span><span>Average AIP</span></div><ul class="jf-results" aria-label="Matching journals">${matches.slice(0, 12).map((row) => `<li><button type="button" class="jf-result" data-journal-index="${row.index}" aria-label="${esc(row.name)}, average AIP ${esc(journalScore(row))}"><span>${esc(row.name)}</span><b>${esc(journalScore(row))}</b></button></li>`).join("")}</ul>`;
  }

  function loadJournalData() {
    if (state.journalRows || state.journalPromise || state.journalError) return;
    const url = "data/journal-aip.json" + (journalDataVersion ? `?v=${encodeURIComponent(journalDataVersion)}` : "");
    state.journalPromise = fetch(url).then((response) => {
      if (!response.ok) throw new Error("Journal data unavailable");
      return response.json();
    }).then((payload) => {
      if (payload.schemaVersion !== 2 || !Array.isArray(payload.journals) || !payload.journals.length || !payload.annualYears?.length || !payload.averagePeriods?.length || payload.journals.some((row) => !Array.isArray(row[2]) || row[2].length !== payload.annualYears.length || !Array.isArray(row[3]) || row[3].length !== payload.averagePeriods.length)) throw new Error("Invalid journal index");
      state.journalYears = payload.annualYears;
      state.journalPeriods = payload.averagePeriods;
      state.journalRows = payload.journals.map(([title, score, annual, averages], index) => ({
        index, score, annual, averages, key: journalSearchKey(title), name: window.displayJournalName?.(title) || title,
      }));
    }).catch(() => { state.journalError = true; }).finally(() => {
      state.journalPromise = null;
      updateJournalResults();
    });
  }

  function selectJournal(index) {
    const row = state.journalRows?.[index];
    const input = document.getElementById("journal-finder-input");
    if (!row || !input) return;
    state.journalSelected = row;
    state.journalQuery = row.name;
    input.value = row.name;
    updateJournalResults();
    input.focus({ preventScroll: true });
  }

  function onJournalKeydown(event) {
    const input = document.getElementById("journal-finder-input");
    const isInput = event.target === input;
    const isResult = event.target.matches("[data-journal-index]");
    if (!input || (!isInput && !isResult)) return;
    const buttons = Array.from(document.querySelectorAll(".jf-result"));
    if (event.key === "Escape") {
      event.preventDefault();
      input.value = state.journalQuery = "";
      state.journalSelected = null;
      updateJournalResults();
      input.focus();
    } else if (event.key === "Enter" && isInput && buttons.length) {
      event.preventDefault();
      selectJournal(Number(buttons[0].dataset.journalIndex));
    } else if ((event.key === "ArrowDown" || event.key === "ArrowUp") && buttons.length) {
      event.preventDefault();
      const index = buttons.indexOf(event.target);
      const next = isInput ? (event.key === "ArrowDown" ? buttons[0] : buttons.at(-1)) : buttons[index + (event.key === "ArrowDown" ? 1 : -1)];
      (next || input).focus();
    }
  }

  /* ---------- Grant steps ---------- */

  function grantCurrent() {
    return state.grantPath[state.grantPath.length - 1];
  }

  function grantGo(next, record) {
    if (record) Object.assign(state.grantRecord, record);
    if (next === "supervisor") delete state.grantRecord.supervisor;
    state.grantPath.push(next);
    redraw("rg-grant-card");
  }

  function grantBackTo(index) {
    state.grantPath = state.grantPath.slice(0, index + 1);
    const record = {};
    for (let i = 0; i < state.grantPath.length - 1; i += 1) {
      const node = GRANT_FLOW.nodes[state.grantPath[i]];
      const nextId = state.grantPath[i + 1];
      const answer = (node.answers || []).find((item) => item.next === nextId);
      if (answer && answer.record) Object.assign(record, answer.record);
      if (nextId === "supervisor") delete record.supervisor;
    }
    state.grantRecord = record;
    redraw("rg-grant-card");
  }

  function mapNodeState(id) {
    const visitedIndex = state.grantPath.lastIndexOf(id);
    if (id === grantCurrent()) return { cls: "is-current", index: visitedIndex };
    if (visitedIndex >= 0) return { cls: "is-done", index: visitedIndex };
    return { cls: "is-todo", index: -1 };
  }

  function mapButton(node, status) {
    const label = esc(node.map);
    if (status.cls === "is-done") return `<button type="button" class="rg-map-link" data-grant-back="${status.index}" title="Go back to this step">${label}</button>`;
    return `<span class="rg-map-label"${status.cls === "is-current" ? ' aria-current="step"' : ""}>${label}</span>`;
  }

  function mapAnswer(id) {
    const value = state.grantRecord[id];
    if (!value) return "";
    const answer = (GRANT_FLOW.nodes[id].answers || []).find((item) => item.record && item.record[id] === value);
    return answer ? answer.label : "";
  }

  function renderGrantMap() {
    const items = GRANT_FLOW.order.map((id, position) => {
      const node = GRANT_FLOW.nodes[id];
      const status = mapNodeState(id);
      const branches = Object.entries(GRANT_FLOW.nodes)
        .filter(([, item]) => item.parent === id)
        .map(([branchId, item]) => {
          const branchState = mapNodeState(branchId);
          return branchState.index < 0 ? "" : `<li class="rg-map-branch ${branchState.cls}">${mapButton(item, branchState)}</li>`;
        })
        .join("");
      const answer = mapAnswer(id);
      return `<li class="rg-map-node rg-kind-${node.kind} ${status.cls}">
        <span class="rg-map-dot" aria-hidden="true"><span>${status.cls === "is-done" ? "&#10003;" : position + 1}</span></span>
        <div class="rg-map-copy">
          ${mapButton(node, status)}
          ${answer ? `<span class="rg-map-answer">${esc(answer)}</span>` : ""}
          ${branches ? `<ul class="rg-map-branches">${branches}</ul>` : ""}
        </div>
      </li>`;
    });
    return `<ol class="rg-map" aria-label="Steps in the grant application flow">${items.join("")}</ol>`;
  }

  function cardFoot(extra = "") {
    return `<div class="rg-card-foot"><button type="button" class="section-link" data-grant-back="${state.grantPath.length - 2}">Back</button><button type="button" class="section-link" data-grant-restart>Start over</button>${extra}</div>`;
  }

  function renderGrantCard() {
    const node = GRANT_FLOW.nodes[grantCurrent()];
    if (node.kind === "end") return renderChecklist();
    const kindLabel = { start: "Start here", decision: "Question", step: "Step", branch: "Then" }[node.kind] || "Step";
    const actions = node.answers
      ? `<p class="rg-question">${esc(node.question)}</p>
         <div class="rg-answers">${node.answers.map((answer, index) => `<button type="button" class="rg-answer" data-grant-answer="${index}">${esc(answer.label)}</button>`).join("")}</div>`
      : `<div class="rg-answers"><button type="button" class="rg-answer rg-primary" data-grant-next>${esc(node.nextLabel || "Next")}</button></div>`;
    return `<p class="eye">${kindLabel}</p>
      <h3 class="rg-card-title">${esc(node.title)}</h3>
      <p class="rg-body">${esc(node.body)}</p>
      ${node.contact ? `<p class="rg-contact"><span>Contact</span>${esc(node.contact)}${node.email ? ` <a class="rg-mail" href="mailto:${esc(node.email)}">${esc(node.email)}</a>` : ""}</p>` : ""}
      ${actions}
      ${state.grantPath.length > 1 ? cardFoot() : ""}`;
  }

  function renderChecklist() {
    const r = state.grantRecord;
    const items = [
      { done: true, who: "Your supervisor", what: "Supports the application." },
      { who: "Lars van den Brink, FEB funding officer", what: "Budget, funder rules, and internal approval. Contact him early.", email: "l.h.van.den.brink@rug.nl" },
    ];
    if (r.teaching === "yes") items.push({ who: "Scheduler or teaching director", what: "Plan the reduction of your teaching if the grant is awarded." });
    if (r.teaching === "unsure") items.push({ who: "Funding officer, then the scheduler", what: "Check whether the budget covers your own time. If it does, plan the teaching reduction with the scheduler or teaching director." });
    if (r.hiring === "yes") items.push({ who: "Funding officer, department chair, and research director", what: "Arrange an embedding guarantee for the new or extended positions, well before the deadline." });
    const timeNote = r.teaching === "yes"
      ? "If the grant is awarded and reduces your teaching, you are no longer eligible for the department research pool for that period, because the grant already buys your time."
      : "While you work on a grant, you count toward the grant-based half of the department research pool, provided you are eligible.";
    return `<p class="eye">Done</p>
      <h3 class="rg-card-title">Your checklist</h3>
      <ol class="rg-checklist">
        ${items.map((item) => `<li class="${item.done ? "is-done" : ""}"><span class="rg-check" aria-hidden="true">${item.done ? "&#10003;" : ""}</span><div><strong>${esc(item.who)}</strong><span>${esc(item.what)}${item.email ? ` <a class="rg-mail" href="mailto:${esc(item.email)}">${esc(item.email)}</a>` : ""}</span></div></li>`).join("")}
      </ol>
      <div class="rg-note">
        <strong>Research time</strong>
        <p>${esc(timeNote)} <a class="section-link" href="${pageHref("research-time")}">How is my research time determined?</a></p>
      </div>
      ${cardFoot('<a class="section-link" href="#grants">Browse open calls</a>')}`;
  }

  function renderGrantGuide() {
    return `<div class="rg-flow">
      <div class="rg-map-wrap">${renderGrantMap()}</div>
      <div class="rg-card" id="rg-grant-card" tabindex="-1" aria-live="polite">${renderGrantCard()}</div>
    </div>`;
  }

  /* ---------- Research time ---------- */

  function renderTimeGuide() {
    const g = TIME_GUIDE;
    const active = g.layers.find((layer) => layer.key === state.layer) || g.layers[0];
    const stack = g.layers.map((layer, index) => `<button type="button" class="rg-layer${layer.key === active.key ? " is-active" : ""}${layer.key === "pool" ? " rg-layer-pool" : ""}" data-layer="${layer.key}" aria-pressed="${layer.key === active.key}">
        <span class="rg-layer-num" aria-hidden="true">${index + 1}</span>
        <span class="rg-layer-label">${esc(layer.label)}</span>
        <span class="rg-layer-who">${esc(layer.who)}</span>
      </button>`).join("");
    const facts = active.facts
      ? `<table class="rg-table"><thead><tr><th scope="col">Status</th><th scope="col">Points in five years</th><th scope="col">Time</th></tr></thead><tbody>${active.facts.map((row) => `<tr><th scope="row">${esc(row[0])}</th><td>${esc(row[1])}</td><td class="rg-num">${esc(row[2])}</td></tr>`).join("")}</tbody></table>`
      : "";
    let link = "";
    if (active.link && active.link.page) link = `<p><a class="section-link" href="${pageHref(active.link.page)}">${esc(active.link.label)}</a></p>`;
    if (active.link && active.link.url) link = `<p><a class="section-link" href="${esc(active.link.url)}" target="_blank" rel="noopener">${esc(active.link.label)}</a></p>`;
    return `<p class="rg-intro">${esc(g.intro)}</p>
      <div class="rg-time">
        <div class="rg-stack" role="group" aria-label="Layers of research time">${stack}</div>
        <div class="rg-card" id="rg-time-card" tabindex="-1" aria-live="polite">
          <p class="eye">Layer ${g.layers.indexOf(active) + 1} &middot; decided by ${esc(active.who === "Your appointment" ? "your appointment" : active.who.toLowerCase() === "febri" ? "FEBRI" : active.who.toLowerCase())}</p>
          <h3 class="rg-card-title">${esc(active.title)}</h3>
          <p class="rg-body">${esc(active.body)}</p>
          ${facts}
          ${link}
          ${active.key === "pool" ? renderPoolDetail() : ""}
        </div>
      </div>`;
  }

  function renderPoolDetail() {
    const p = TIME_GUIDE.pool;
    const split = p.split.map((part) => `<div class="rg-split-part" style="flex:${part.share}"><strong>${part.share}%</strong><span>${esc(part.label)}</span></div>`).join("");
    const splitText = p.split.map((part) => `<li><strong>${esc(part.label)}.</strong> ${esc(part.body)}</li>`).join("");
    return `<p class="rg-sub">Who is eligible</p>
      <p class="rg-body">${esc(p.eligibility)}</p>
      ${renderCheck()}
      <p class="rg-sub">How much</p>
      <p class="rg-body">${esc(p.size)}</p>
      <p class="rg-sub">How the pool is currently divided</p>
      <div class="rg-split" aria-hidden="true">${split}</div>
      <ul class="rg-split-list">${splitText}</ul>
      <details class="rg-why">
        <summary>Why we do it this way</summary>
        <p>${esc(p.why)}</p>
        <p>${esc(p.review)}</p>
      </details>`;
  }

  function chosenAnswer(index) {
    const step = TIME_GUIDE.check.find((item) => item.key === state.checkPath[index]);
    const nextKey = state.checkPath[index + 1];
    if (nextKey) return step.answers.findIndex((answer) => answer.next === nextKey);
    return step.answers.findIndex((answer) => answer.result === state.checkResult);
  }

  function renderCheck() {
    const steps = state.checkPath.map((key) => TIME_GUIDE.check.find((item) => item.key === key));
    const rows = steps.map((step, index) => {
      const answered = index < steps.length - 1 || state.checkResult;
      return `<div class="rg-check-row">
        <span>${esc(step.question)}</span>
        <div class="rg-answers">${step.answers.map((answer, answerIndex) => {
          const chosen = Boolean(answered) && chosenAnswer(index) === answerIndex;
          return `<button type="button" class="rg-answer rg-small${chosen ? " is-chosen" : ""}" data-check-step="${index}" data-check-answer="${answerIndex}" aria-pressed="${chosen}">${esc(answer.label)}</button>`;
        }).join("")}</div>
      </div>`;
    }).join("");
    const result = state.checkResult ? TIME_GUIDE.results[state.checkResult] : null;
    return `<div class="rg-checker">
      <p class="rg-check-title">Check whether you are eligible</p>
      ${rows}
      ${result ? `<div class="rg-result rg-tone-${result.tone}" role="status"><strong>${esc(result.title)}</strong><span>${esc(result.body)}</span></div>` : ""}
    </div>`;
  }

  /* ---------- Rendering and events ---------- */

  function render(view, pageKey, data) {
    if (data) resourceData = data;
    // Backwards compatible: render(pageKey) renders the Resources tab.
    if (!VIEWS[view]) {
      pageKey = view;
      view = "resources";
    }
    const root = roots[view] || document.getElementById(VIEWS[view].root);
    if (!root) return;
    roots[view] = root;
    const page = PAGES.find((item) => item.key === pageKey && item.view === view) || null;
    const key = page ? page.key : "";
    const previous = state.pages[view];
    state.view = view;
    state.pages[view] = key;
    if (key === "journal-scores" && previous !== key) {
      state.journalQuery = "";
      state.journalSelected = null;
    }
    root.innerHTML = page ? renderSubpage(page) : renderLanding(view);
    if (previous !== undefined && previous !== key) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      const heading = root.querySelector("h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
    if (key === "journal-scores") {
      loadJournalData();
      updateJournalResults();
      if (previous !== key) document.getElementById("journal-finder-input")?.focus({ preventScroll: true });
    }
  }

  function redraw(focusId) {
    render(state.view, state.pages[state.view]);
    if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
  }

  function onClick(event) {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.hasAttribute("data-journal-index")) return selectJournal(Number(target.dataset.journalIndex));
    if (target.hasAttribute("data-journal-retry")) {
      state.journalError = false;
      loadJournalData();
      return updateJournalResults();
    }
    if (target.dataset.travelTrip) return changeTravelPlan(target.dataset.travelTrip, Number(target.dataset.travelDelta));
    if (target.hasAttribute("data-grant-next")) return grantGo(GRANT_FLOW.nodes[grantCurrent()].next);
    if (target.dataset.grantAnswer !== undefined) {
      const answer = GRANT_FLOW.nodes[grantCurrent()].answers[Number(target.dataset.grantAnswer)];
      return grantGo(answer.next, answer.record);
    }
    if (target.dataset.grantBack !== undefined) return grantBackTo(Number(target.dataset.grantBack));
    if (target.hasAttribute("data-grant-restart")) {
      state.grantPath = ["start"];
      state.grantRecord = {};
      return redraw("rg-grant-card");
    }
    if (target.dataset.layer) {
      state.layer = target.dataset.layer;
      return redraw("rg-time-card");
    }
    if (target.dataset.checkStep !== undefined) {
      const index = Number(target.dataset.checkStep);
      const step = TIME_GUIDE.check.find((item) => item.key === state.checkPath[index]);
      const answer = step.answers[Number(target.dataset.checkAnswer)];
      state.checkPath = state.checkPath.slice(0, index + 1);
      state.checkResult = "";
      if (answer.next) state.checkPath.push(answer.next);
      else state.checkResult = answer.result;
      redraw();
      document.querySelector(`[data-check-step="${index}"][data-check-answer="${target.dataset.checkAnswer}"]`)?.focus();
    }
  }

  function changeTravelPlan(key, delta) {
    state.travelPlan[key] = Math.max(0, Math.min(TRAVEL.max, state.travelPlan[key] + delta));
    const controls = document.getElementById("rp-mine-controls");
    const viz = document.getElementById("rp-mine-viz");
    if (controls) controls.innerHTML = renderTravelControls();
    if (viz) viz.innerHTML = renderTravelShareViz();
    const same = document.querySelector(`[data-travel-trip="${key}"][data-travel-delta="${delta}"]`);
    const other = document.querySelector(`[data-travel-trip="${key}"][data-travel-delta="${-delta}"]`);
    (same && !same.disabled ? same : other)?.focus();
  }

  function onInput(event) {
    const target = event.target;
    if (target.matches("[data-journal-search]")) {
      state.journalQuery = target.value;
      state.journalSelected = null;
      return updateJournalResults();
    }
    if (target.matches("[data-travel-applicants]")) state.travelApplicants = Number(target.value);
    else if (target.matches("[data-travel-cut]")) state.travelCut = target.checked;
    else return;
    const pool = document.getElementById("rp-pool-viz");
    const mine = document.getElementById("rp-mine-viz");
    if (pool) pool.innerHTML = renderTravelPoolViz();
    if (mine) mine.innerHTML = renderTravelShareViz();
  }

  function init() {
    Object.entries(VIEWS).forEach(([view, v]) => {
      const root = document.getElementById(v.root);
      if (!root) return;
      roots[view] = root;
      root.addEventListener("click", onClick);
      root.addEventListener("input", onInput);
      root.addEventListener("change", onInput);
      root.addEventListener("keydown", onJournalKeydown);
    });
  }

  window.HRMOBResources = { render, pages: PAGES };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
