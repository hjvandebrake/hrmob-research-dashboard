/* Resources page: a landing page with one subpage per topic (#resources/<key>).
   Content lives in PAGES, GRANT_FLOW, and TIME_GUIDE so it can be edited without touching the renderer.
   Pages with status "pending" show a short placeholder. app.js calls HRMOBResources.render(page). */
(function () {
  "use strict";

  const PAGES = [
    {
      key: "research-time",
      group: "faq",
      title: "How is my research time determined?",
      summary: "Career track, FEBRI status, grants, and the department research pool.",
    },
    {
      key: "grant-steps",
      group: "faq",
      title: "What steps do I take when applying for a grant?",
      summary: "Who to contact, and what a grant means for your teaching and for new positions.",
      note: "I will refine these steps with the funding officer.",
    },
    {
      key: "phd-supervision",
      group: "faq",
      title: "How do I become involved in PhD supervision?",
      summary: "How FEBRI PhD positions are filled, and other routes into supervision.",
    },
    {
      key: "conference-budgets",
      group: "faq",
      title: "How are conference budgets allocated?",
      summary: "How the fixed travel budget is divided, why it depends on who applies, and the CO2 limit.",
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
      summary: "My follow-up to the research day: what we want AI to do for our research, and where we need to be careful.",
      blurb: "Interactive follow-up to the research day on AI in our research.",
      format: "Presentation",
      image: "resources/ai-in-research/preview.webp",
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
  ];

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
      intro: "FEBRI gives the department a fixed travel budget every year. As research director, I divide it among the colleagues who apply, in consultation with the management team.",
      stepsTitle: "How travel budgets are allocated",
      steps: [
        { title: "FEBRI sets the department budget", body: "The total is fixed and not negotiable. It depends on the number of eligible staff: colleagues in the career track or with a FEBRI fellow status." },
        { title: "You request a budget for specific conferences", body: "Name the conferences you plan to attend and estimate the costs realistically. Because of the CO2 limit, I cannot grant a lump sum to spend as you wish." },
        { title: "The research director balances the requests", body: "Individual amounts depend on the number of applicants and the total amount requested. In years with a lot of interest, everyone gets less, or I may give preference to colleagues who asked for little in previous years. I make the final decisions in consultation with the management team, and I correct unrealistically low requests upward so that your costs are covered." },
        { title: "The CO2 check", body: "The university works with a maximum CO2 budget per faculty. Approvals are final once the emissions for your destinations have been calculated and fit within that limit." },
        { title: "Approval", body: "If you applied for one or two conferences within reasonable limits, you will probably not hear from me: consider your request approved. I contact colleagues individually when plans need to change for financial or CO2 reasons." },
      ],
      visual: "travel-pool",
      cardsTitle: "Good to know",
      cards: [
        { title: "The budget is shared", body: "Because the total is fixed, a large request, such as two European conferences or one in the United States, is only possible because others request less. The budget would not even cover one large conference for every eligible colleague." },
        { title: "Next year's budget is 10% lower", body: "Because of budget cuts, the total travel budget for next year is 10% lower (as of October 2026). With the same number of applicants, that means less for everyone." },
        { title: "Own funds help everyone", body: "Colleagues who pay for conferences from their own funds make room for others to attend large international conferences. You can build your own funds through executive teaching, externally funded projects, and grants." },
      ],
      note: { title: "Questions?", body: "Contact me if you have questions about your request, or if you want to know more about generating your own funds.", label: "Email the research director", href: `${MAILTO}?subject=Travel%20budget` },
    },
  };

  // Illustration only. Requests in units: 1 = one European conference, 2 = one conference outside Europe
  // or two in Europe. The budget (16 units for 20 eligible colleagues) cannot pay for one conference
  // outside Europe for everyone, but usually covers the colleagues who actually apply.
  const TRAVEL_POOL = {
    eligible: 20,
    budget: 16,
    cut: 0.1,
    minApplicants: 2,
    defaultApplicants: 10,
    requests: [2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1],
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
    travelApplicants: TRAVEL_POOL.defaultApplicants,
    travelCut: false,
  };

  const roots = {};

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
    return `<div class="sec-head compact"><div><p class="eye">${esc(v.eye)}</p><h2 class="h2">${esc(v.title)}</h2></div></div>
      <p class="section-intro page-intro">${esc(v.intro)}</p>
      <div class="rp-landing rp-landing-${view}">${groups}</div>
      ${share}`;
  }

  function faqCard(page, index) {
    const pending = page.status === "pending";
    return `<a class="rp-card${pending ? " is-pending" : ""}" href="${pageHref(page.key)}">
        <span class="rp-card-body">
          <span class="rp-card-num" aria-hidden="true">${index + 1}</span>
          <span class="rp-card-text">
            <strong>${esc(page.title)}</strong>
            <span>${pending ? "Coming soon" : esc(page.summary)}</span>
          </span>
        </span>
      </a>`;
  }

  function downloadCard(page) {
    const thumb = page.image
      ? `<img class="rp-dl-thumb" src="${esc(page.image)}" width="160" height="90" alt="" loading="lazy">`
      : `<span class="rp-dl-thumb rp-dl-sheet" aria-hidden="true">
          <span class="rp-sheet-row rp-sheet-head"><i>Journal</i><i>AIP</i></span>
          <span class="rp-sheet-row"><i></i><b>99</b></span>
          <span class="rp-sheet-row"><i></i><b>96</b></span>
          <span class="rp-sheet-row"><i></i><b>91</b></span>
        </span>`;
    const href = page.direct ? esc(page.file) : pageHref(page.key);
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
    else if (page.key === "research-time") body = renderTimeGuide();
    else if (page.key === "grant-steps") body = renderGrantGuide();
    else if (page.key === "journal-scores") body = renderJournalScores(page);
    const pager = groupPages.length > 1
      ? `<nav class="rp-pager" aria-label="${esc(group.title)}">
          ${prev ? `<a href="${pageHref(prev.key)}"><span>Previous</span>${esc(prev.title)}</a>` : "<span></span>"}
          ${next ? `<a class="rp-pager-next" href="${pageHref(next.key)}"><span>Next</span>${esc(next.title)}</a>` : ""}
        </nav>`
      : "";
    const v = VIEWS[page.view];
    return `<nav class="rp-crumbs" aria-label="Breadcrumb"><a href="#${page.view}">${esc(v.crumb)}</a>${page.view === "faq" ? "" : `<span aria-hidden="true">/</span><span>${esc(group.title)}</span>`}</nav>
      <div class="sec-head compact rp-head"><div><h2 class="h2">${esc(page.title)}</h2></div></div>
      ${page.group === "faq" ? `<p class="rp-disclaimer">${esc(FAQ_DISCLAIMER)}</p>` : ""}
      <div class="rp-content">${body}</div>
      ${page.note ? `<p class="rg-status small-muted">${esc(page.note)}</p>` : ""}
      ${pager}`;
  }

  function renderPending() {
    return `<div class="rg-card rg-pending"><p class="eye">Coming soon</p><p class="rg-body">This answer is still being written. Questions in the meantime? Use the contact page.</p><a class="section-link" href="#contact">Open contact page</a></div>`;
  }

  function renderSteps(steps) {
    return `<ol class="rp-steps">${steps.map((step, index) => `<li>
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
      </div>
      ${article.visual === "travel-pool" ? renderTravelPool() : ""}`;
  }

  function renderTravelPool() {
    return `<section class="rp-pool" aria-labelledby="rp-pool-title">
        <div class="rp-pool-head">
          <h3 id="rp-pool-title" class="overview-h3">How the total budget shapes your share</h3>
          <p>Illustration, not actual amounts.</p>
        </div>
        <div class="rp-pool-controls">
          <label class="rp-pool-slider">
            <span>How many of the ${TRAVEL_POOL.eligible} eligible colleagues apply this year?</span>
            <input type="range" min="${TRAVEL_POOL.minApplicants}" max="${TRAVEL_POOL.eligible}" step="1" value="${state.travelApplicants}" data-travel-applicants aria-describedby="rp-pool-readout">
          </label>
          <label class="switch rp-pool-cut">
            <input type="checkbox" data-travel-cut${state.travelCut ? " checked" : ""}>
            <span class="switch-copy"><span>Next year: 10% less</span><small>Budget cuts</small></span>
          </label>
        </div>
        <div id="rp-pool-viz" class="rp-pool-viz">${renderTravelPoolViz()}</div>
      </section>`;
  }

  function renderTravelPoolViz() {
    const n = state.travelApplicants;
    const fullBudget = TRAVEL_POOL.budget;
    const budget = fullBudget * (state.travelCut ? 1 - TRAVEL_POOL.cut : 1);
    const requests = TRAVEL_POOL.requests.slice(0, n);
    const requested = requests.reduce((sum, value) => sum + value, 0);
    const scale = TRAVEL_POOL.requests.reduce((sum, value) => sum + value, 0);
    const pct = (value) => `${(value / scale) * 100}%`;
    const people = Array.from({ length: TRAVEL_POOL.eligible }, (_, i) => `<svg class="rp-person${i < n ? " is-applied" : ""}" viewBox="0 0 20 26" aria-hidden="true"><circle cx="10" cy="6" r="5"/><path d="M1 26c0-7 4-11 9-11s9 4 9 11z"/></svg>`).join("");
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
    return `<div class="rp-people" aria-hidden="true">${people}</div>
      <p class="rp-people-legend"><span class="is-applied">${n} apply</span><span>${TRAVEL_POOL.eligible - n} do not apply this year</span></p>
      <div class="rp-req-track" aria-hidden="true">
        <span class="rp-budget-zone" style="width:${pct(budget)}"></span>
        ${state.travelCut ? `<span class="rp-cut-zone" style="left:${pct(budget)};width:${pct(fullBudget - budget)}"></span>` : ""}
        <span class="rp-req-blocks">${blocks}</span>
        <span class="rp-budget-line" style="left:${pct(budget)}"><span>Total budget${state.travelCut ? " after the 10% cut" : ""}</span></span>
      </div>
      <p class="rp-req-legend"><span class="rp-key rp-key-1"></span>One European conference <span class="rp-key rp-key-2"></span>A conference outside Europe, or two in Europe <span class="rp-key rp-key-over"></span>Beyond the budget</p>
      <p id="rp-pool-readout" class="rp-pool-readout rp-tone-${tone}" aria-live="polite"><strong>${n} applicants ask for ${used}% of the budget.</strong> ${esc(message)}</p>`;
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

  function renderJournalScores(page) {
    return `<p class="rp-lead">${esc(page.summary)}</p>
      <div class="download-list rp-download">
        <a class="download-card" href="${esc(page.file)}" download>
          <strong>Average AIP workbook, 2020-2024</strong>
          <span>Excel workbook with the journal scores.</span>
        </a>
      </div>`;
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
      ${node.contact ? `<p class="rg-contact"><span>Contact</span>${esc(node.contact)}</p>` : ""}
      ${actions}
      ${state.grantPath.length > 1 ? cardFoot() : ""}`;
  }

  function renderChecklist() {
    const r = state.grantRecord;
    const items = [
      { done: true, who: "Your supervisor", what: "Supports the application." },
      { who: "Lars van den Brink, FEB funding officer", what: "Budget, funder rules, and internal approval. Contact him early." },
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
        ${items.map((item) => `<li class="${item.done ? "is-done" : ""}"><span class="rg-check" aria-hidden="true">${item.done ? "&#10003;" : ""}</span><div><strong>${esc(item.who)}</strong><span>${esc(item.what)}</span></div></li>`).join("")}
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

  function render(view, pageKey) {
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
    root.innerHTML = page ? renderSubpage(page) : renderLanding(view);
    if (previous !== undefined && previous !== key) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      const heading = root.querySelector("h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  }

  function redraw(focusId) {
    render(state.view, state.pages[state.view]);
    if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
  }

  function onClick(event) {
    const target = event.target.closest("button");
    if (!target) return;
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

  function onInput(event) {
    const target = event.target;
    if (target.matches("[data-travel-applicants]")) state.travelApplicants = Number(target.value);
    else if (target.matches("[data-travel-cut]")) state.travelCut = target.checked;
    else return;
    const viz = document.getElementById("rp-pool-viz");
    if (viz) viz.innerHTML = renderTravelPoolViz();
  }

  function init() {
    Object.entries(VIEWS).forEach(([view, v]) => {
      const root = document.getElementById(v.root);
      if (!root) return;
      roots[view] = root;
      root.addEventListener("click", onClick);
      root.addEventListener("input", onInput);
      root.addEventListener("change", onInput);
    });
  }

  window.HRMOBResources = { render, pages: PAGES };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
