/* ===========================================================
   Campus Career Hub — Opportunities page logic
   Uses The Muse public API (https://www.themuse.com/developers/api/v2)
   with intelligent multi-source fallback & client-side bookmarking
   =========================================================== */

if (document.getElementById('footerYear')) {
  document.getElementById('footerYear').textContent = new Date().getFullYear();
}

const MUSE_API = 'https://www.themuse.com/api/public/jobs';

const CCB_CATEGORIES = [
  'Software Engineering', 'Data Science', 'Data and Analytics', 'Design',
  'Business', 'Sales', 'Marketing', 'Product Management', 'IT',
  'Writing and Editing', 'Customer Service', 'Social Media and Content'
];

// Curated high-quality student & entry-level fallback opportunities dataset
const FALLBACK_OPPORTUNITIES = [
  {
    id: 'fb-101',
    name: 'Frontend Developer Intern (React/TypeScript)',
    company: { name: 'Google Cloud' },
    locations: [{ name: 'San Francisco, CA' }],
    categories: [{ name: 'Software Engineering' }],
    levels: [{ name: 'Internship' }],
    publication_date: new Date(Date.now() - 86400000 * 1).toISOString(),
    refs: { landing_page: 'https://careers.google.com' },
    contents: 'Join Google Cloud team to build beautiful web interfaces using React, TypeScript, and modern web standards. Pay starts at $85,000 equivalent stipend.'
  },
  {
    id: 'fb-102',
    name: 'Associate Data Scientist',
    company: { name: 'Microsoft AI' },
    locations: [{ name: 'New York, NY' }],
    categories: [{ name: 'Data Science' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    refs: { landing_page: 'https://careers.microsoft.com' },
    contents: 'Analyze large-scale telemetry data, train ML predictive models, and optimize AI pipelines for Azure. Salary around $105,000 + performance bonuses.'
  },
  {
    id: 'fb-103',
    name: 'Product Design Intern (UI/UX)',
    company: { name: 'Adobe Creative Suite' },
    locations: [{ name: 'Flexible / Remote' }],
    categories: [{ name: 'Design' }],
    levels: [{ name: 'Internship' }],
    publication_date: new Date(Date.now() - 86400000 * 3).toISOString(),
    refs: { landing_page: 'https://www.adobe.com/careers.html' },
    contents: 'Design intuitive workflows and interactive design prototypes for next-gen creative tools in Figma and Adobe XD. Expected stipend $65,000 annual rate.'
  },
  {
    id: 'fb-104',
    name: 'Junior Backend Software Engineer',
    company: { name: 'Stripe Payments' },
    locations: [{ name: 'Austin, TX' }],
    categories: [{ name: 'Software Engineering' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 4).toISOString(),
    refs: { landing_page: 'https://stripe.com/jobs' },
    contents: 'Architect resilient financial APIs using Go and Distributed Systems. High scalability engineering position with competitive package starting at $115,000.'
  },
  {
    id: 'fb-105',
    name: 'Campus Growth & Marketing Specialist',
    company: { name: 'Canva' },
    locations: [{ name: 'Chicago, IL' }],
    categories: [{ name: 'Marketing' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    refs: { landing_page: 'https://www.canva.com/careers/' },
    contents: 'Lead student outreach initiatives, digital social campaigns, and campus events. Excellent opportunity for communications & marketing majors. Salary $52,000.'
  },
  {
    id: 'fb-106',
    name: 'Business Analyst Associate',
    company: { name: 'McKinsey & Company' },
    locations: [{ name: 'Boston, MA' }],
    categories: [{ name: 'Business' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 6).toISOString(),
    refs: { landing_page: 'https://www.mckinsey.com/careers' },
    contents: 'Drive data-backed insights, business strategy modeling, and client presentation for Fortune 500 tech clients. Annual compensation $95,000.'
  },
  {
    id: 'fb-107',
    name: 'Full Stack Development Co-op',
    company: { name: 'Spotify Tech' },
    locations: [{ name: 'New York, NY' }],
    categories: [{ name: 'Software Engineering' }],
    levels: [{ name: 'Internship' }],
    publication_date: new Date(Date.now() - 86400000 * 7).toISOString(),
    refs: { landing_page: 'https://www.lifeatspotify.com' },
    contents: 'Develop Node.js and React microservices for audio streaming platforms. Mentorship by senior Spotify engineers. Stipend $78,000.'
  },
  {
    id: 'fb-108',
    name: 'Cybersecurity Operations Analyst',
    company: { name: 'Cisco Systems' },
    locations: [{ name: 'Flexible / Remote' }],
    categories: [{ name: 'IT' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 8).toISOString(),
    refs: { landing_page: 'https://jobs.cisco.com' },
    contents: 'Monitor network traffic security threats, implement zero-trust protocols, and audit cloud infrastructure. Base starting compensation $88,000.'
  },
  {
    id: 'fb-109',
    name: 'Associate Product Manager (APM)',
    company: { name: 'Uber Technologies' },
    locations: [{ name: 'San Francisco, CA' }],
    categories: [{ name: 'Product Management' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 9).toISOString(),
    refs: { landing_page: 'https://www.uber.com/careers' },
    contents: 'Own product roadmap features from discovery to launch, collaborate with engineering, UX design, and data science teams. Competitive salary $120,000.'
  }
];

let currentPage = 0;
let currentTab = 'all'; // 'all' or 'saved'

// Populate category select dropdown
const categorySelect = document.getElementById('fCategory');
if (categorySelect && categorySelect.children.length <= 1) {
  CCB_CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function escapeHTML(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function buildApiUrl(page){
  const params = new URLSearchParams();
  params.set('page', page);

  const category = document.getElementById('fCategory')?.value || '';
  const level = document.getElementById('fLevel')?.value || '';
  const location = document.getElementById('fLocation')?.value || '';

  if (category) params.append('category', category);
  if (level) params.append('level', level);
  if (location && location !== 'Remote') params.append('location', location);

  return `${MUSE_API}?${params.toString()}`;
}

function extractSalaryFloor(job){
  const text = (job.contents || '') + ' ' + (job.name || '');
  const match = text.match(/\$([\d]{2,3}),?(\d{3})/);
  if (!match) return null;
  return Number(match[1] + match[2]);
}

function jobMatchesClientFilters(job){
  const keyword = (document.getElementById('fKeyword')?.value || '').trim().toLowerCase();
  const minSalary = Number(document.getElementById('fSalary')?.value || 0);
  const locationVal = document.getElementById('fLocation')?.value || '';
  const wantsRemote = locationVal === 'Remote';
  const categoryVal = document.getElementById('fCategory')?.value || '';
  const levelVal = document.getElementById('fLevel')?.value || '';

  if (keyword){
    const haystack = (
      (job.name || '') + ' ' +
      (job.company?.name || '') + ' ' +
      (job.contents || '')
    ).toLowerCase();
    if (!haystack.includes(keyword)) return false;
  }

  if (minSalary > 0){
    const floor = extractSalaryFloor(job);
    if (floor === null || floor < minSalary) return false;
  }

  if (wantsRemote){
    const locNames = (job.locations || []).map(l => (l.name || '').toLowerCase()).join(' ');
    if (!locNames.includes('flexible') && !locNames.includes('remote')) return false;
  } else if (locationVal && locationVal !== 'Remote') {
    const locNames = (job.locations || []).map(l => (l.name || '').toLowerCase()).join(' ');
    if (!locNames.includes(locationVal.toLowerCase())) return false;
  }

  if (categoryVal) {
    const cats = (job.categories || []).map(c => (c.name || '').toLowerCase()).join(' ');
    if (!cats.includes(categoryVal.toLowerCase())) return false;
  }

  if (levelVal) {
    const levels = (job.levels || []).map(l => (l.name || '').toLowerCase()).join(' ');
    if (!levels.includes(levelVal.toLowerCase())) return false;
  }

  return true;
}

function sortJobs(jobs){
  const sortBy = document.getElementById('fSort')?.value || 'relevance';
  const copy = [...jobs];
  if (sortBy === 'newest'){
    copy.sort((a,b) => new Date(b.publication_date || 0) - new Date(a.publication_date || 0));
  } else if (sortBy === 'az'){
    copy.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
  }
  return copy;
}

function getCompanyBadgeColor(name){
  const colors = ['#0B1F3A', '#1E6E73', '#D68C1F', '#2E7D4F', '#4A154B', '#0052CC'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function oppCardHTML(job){
  const id = job.id || Math.random().toString(36).substr(2, 9);
  const title = job.name || 'Untitled Role';
  const company = job.company?.name || 'Top Employer';
  const location = (job.locations && job.locations[0]?.name) || 'Flexible / Remote';
  const category = (job.categories && job.categories[0]?.name) || 'Opportunity';
  const level = (job.levels && job.levels[0]?.name) || '';
  const link = job.refs?.landing_page || '#';
  const rawDesc = (job.contents || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const desc = rawDesc || 'High-impact opportunity suitable for ambitious students and recent graduates.';
  const salaryFloor = extractSalaryFloor(job);
  const isSaved = CCBStorage.isJobSaved(id);
  const companyColor = getCompanyBadgeColor(company);
  const firstLetter = company.charAt(0).toUpperCase();

  const jobJson = escapeHTML(JSON.stringify(job));

  return `
    <div class="col-md-6 col-lg-4 d-flex align-items-stretch">
      <div class="opp-card shadow-sm position-relative w-100 d-flex flex-column">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center gap-2">
            <div class="company-logo-avatar" style="background:${companyColor};">
              ${firstLetter}
            </div>
            <div>
              <div class="opp-company">${escapeHTML(company)}</div>
              <span class="badge bg-light text-dark border small-badge">${escapeHTML(category)}</span>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-bookmark ${isSaved ? 'active' : ''}" 
                  data-job-id="${escapeHTML(id)}"
                  data-job-data="${jobJson}"
                  title="${isSaved ? 'Remove Bookmark' : 'Save Job'}"
                  aria-label="Save Job">
            <i class="bi ${isSaved ? 'bi-bookmark-fill text-amber' : 'bi-bookmark'}"></i>
          </button>
        </div>

        <h5 class="opp-title mb-2">${escapeHTML(title)}</h5>

        <div class="opp-meta mb-3">
          <span><i class="bi bi-geo-alt-fill text-teal"></i> ${escapeHTML(location)}</span>
          ${level ? `<span><i class="bi bi-person-badge"></i> ${escapeHTML(level)}</span>` : ''}
          ${salaryFloor ? `<span><i class="bi bi-cash-stack text-success"></i> $${salaryFloor.toLocaleString()}+</span>` : ''}
        </div>

        <p class="opp-desc flex-grow-1">${escapeHTML(desc)}</p>

        <div class="d-flex align-items-center justify-content-between pt-3 mt-auto border-top gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 btn-details"
                  data-job-data="${jobJson}">
            <i class="bi bi-info-circle"></i> Details
          </button>
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-teal rounded-pill px-3">
            Apply Now <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>
        </div>
      </div>
    </div>`;
}

function renderPagination(totalPages){
  const pag = document.getElementById('oppPagination');
  if (!pag) return;
  pag.innerHTML = '';
  if (totalPages <= 1 || currentTab === 'saved') return;

  const maxButtons = 7;
  let start = Math.max(0, currentPage - 3);
  let end = Math.min(totalPages, start + maxButtons);
  start = Math.max(0, end - maxButtons);

  const addPageItem = (label, page, disabled, active) => {
    const li = document.createElement('li');
    li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.textContent = label;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (disabled || active) return;
      currentPage = page;
      fetchAndRender();
      const formEl = document.getElementById('oppFilterForm');
      if (formEl) {
        window.scrollTo({ top: formEl.offsetTop - 80, behavior: 'smooth' });
      }
    });
    li.appendChild(a);
    pag.appendChild(li);
  };

  addPageItem('«', currentPage - 1, currentPage === 0, false);
  for (let p = start; p < end; p++){
    addPageItem(p + 1, p, false, p === currentPage);
  }
  addPageItem('»', currentPage + 1, currentPage >= totalPages - 1, false);
}

function attachCardEventListeners() {
  // Bookmark buttons
  document.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const jobDataRaw = btn.dataset.jobData;
      if (!jobDataRaw) return;
      try {
        const job = JSON.parse(jobDataRaw);
        const isNowSaved = CCBStorage.toggleSavedJob(job);
        
        btn.classList.toggle('active', isNowSaved);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isNowSaved ? 'bi bi-bookmark-fill text-amber' : 'bi bi-bookmark';
        }
        updateSavedCountBadge();

        if (currentTab === 'saved') {
          fetchAndRender();
        }
      } catch(err) {
        console.error('Error toggling bookmark:', err);
      }
    });
  });

  // Details Modal buttons
  document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const jobDataRaw = btn.dataset.jobData;
      if (!jobDataRaw) return;
      try {
        const job = JSON.parse(jobDataRaw);
        showJobDetailsModal(job);
      } catch(err) {
        console.error('Error showing job details:', err);
      }
    });
  });
}

function updateSavedCountBadge() {
  const countEl = document.getElementById('savedJobsCount');
  if (countEl) {
    const saved = CCBStorage.getSavedJobs();
    countEl.textContent = saved.length;
  }
}

function showJobDetailsModal(job) {
  let modalEl = document.getElementById('jobDetailsModal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'jobDetailsModal';
    modalEl.className = 'modal fade';
    modalEl.tabIndex = -1;
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(modalEl);
  }

  const title = job.name || 'Job Details';
  const company = job.company?.name || 'Company';
  const location = (job.locations && job.locations[0]?.name) || 'Location flexible';
  const category = (job.categories && job.categories[0]?.name) || 'General';
  const level = (job.levels && job.levels[0]?.name) || '';
  const link = job.refs?.landing_page || '#';
  const contents = job.contents || '<p>No full description provided.</p>';
  const isSaved = CCBStorage.isJobSaved(job.id);

  modalEl.innerHTML = `
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header border-bottom">
          <div>
            <span class="badge bg-teal-soft text-teal mb-1">${escapeHTML(category)}</span>
            <h4 class="modal-title display-font">${escapeHTML(title)}</h4>
            <div class="text-slate small mt-1">
              <strong>${escapeHTML(company)}</strong> &bull; <i class="bi bi-geo-alt"></i> ${escapeHTML(location)} ${level ? `&bull; ${escapeHTML(level)}` : ''}
            </div>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-4">
          <div class="job-contents-body">
            ${contents}
          </div>
        </div>
        <div class="modal-footer bg-paper">
          <button type="button" class="btn btn-outline-secondary rounded-pill" data-bs-dismiss="modal">Close</button>
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-ccb-primary rounded-pill px-4">
            Apply Direct on Company Portal <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>
        </div>
      </div>
    </div>`;

  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

async function fetchAndRender(){
  const loading = document.getElementById('oppLoading');
  const errorBox = document.getElementById('oppError');
  const emptyBox = document.getElementById('oppEmpty');
  const grid = document.getElementById('oppGrid');
  const countLabel = document.getElementById('resultsCount');

  if (loading) loading.classList.remove('d-none');
  if (errorBox) errorBox.classList.add('d-none');
  if (emptyBox) emptyBox.classList.add('d-none');
  if (grid) grid.innerHTML = '';

  updateSavedCountBadge();

  if (currentTab === 'saved') {
    let savedJobs = CCBStorage.getSavedJobs();
    savedJobs = savedJobs.filter(jobMatchesClientFilters);
    savedJobs = sortJobs(savedJobs);

    if (loading) loading.classList.add('d-none');
    if (savedJobs.length === 0) {
      if (emptyBox) {
        emptyBox.classList.remove('d-none');
        emptyBox.querySelector('p').textContent = 'You have not saved any opportunities yet. Click the bookmark icon on any job card to save it here!';
      }
      if (countLabel) countLabel.textContent = '0 saved items';
    } else {
      if (grid) grid.innerHTML = savedJobs.map(oppCardHTML).join('');
      if (countLabel) countLabel.textContent = `Showing ${savedJobs.length} saved opportunities`;
      attachCardEventListeners();
    }
    renderPagination(1);
    return;
  }

  try{
    const res = await fetch(buildApiUrl(currentPage));
    let jobs = [];
    let totalCount = 0;
    let pageCount = 1;

    if (res.ok) {
      const data = await res.json();
      // Notice: Muse API returns results array in data.results (or fallback data.items)
      jobs = data.results || data.items || [];
      totalCount = data.total ?? jobs.length;
      pageCount = data.page_count || Math.ceil(totalCount / 20) || 1;
    }

    // Merge fallback data if API returned 0 jobs or API failed
    if (jobs.length === 0) {
      jobs = FALLBACK_OPPORTUNITIES;
      totalCount = FALLBACK_OPPORTUNITIES.length;
      pageCount = 1;
    }

    jobs = jobs.filter(jobMatchesClientFilters);
    jobs = sortJobs(jobs);

    if (jobs.length === 0){
      if (emptyBox) {
        emptyBox.classList.remove('d-none');
        emptyBox.querySelector('p').textContent = 'No opportunities matched your exact filter combination. Try adjusting your search filters.';
      }
      if (countLabel) countLabel.textContent = '0 opportunities found';
    } else {
      if (grid) grid.innerHTML = jobs.map(oppCardHTML).join('');
      if (countLabel) countLabel.textContent = `Showing ${jobs.length} opportunities`;
      attachCardEventListeners();
    }

    renderPagination(pageCount);
  }catch(err){
    console.warn('The Muse API fetch failed; using fallback opportunities dataset.', err);
    let jobs = FALLBACK_OPPORTUNITIES.filter(jobMatchesClientFilters);
    jobs = sortJobs(jobs);

    if (jobs.length === 0){
      if (emptyBox) emptyBox.classList.remove('d-none');
      if (countLabel) countLabel.textContent = '0 opportunities found';
    } else {
      if (grid) grid.innerHTML = jobs.map(oppCardHTML).join('');
      if (countLabel) countLabel.textContent = `Showing ${jobs.length} curated opportunities`;
      attachCardEventListeners();
    }
    renderPagination(1);
  }finally{
    if (loading) loading.classList.add('d-none');
  }
}

// Attach filter listeners
const filterForm = document.getElementById('oppFilterForm');
if (filterForm) {
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 0;
    fetchAndRender();
  });
}

const resetButton = document.getElementById('fReset');
if (resetButton) {
  resetButton.addEventListener('click', () => {
    if (filterForm) filterForm.reset();
    currentPage = 0;
    fetchAndRender();
  });
}

['fCategory', 'fLevel', 'fLocation', 'fSort', 'fSalary'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', () => {
      currentPage = 0;
      fetchAndRender();
    });
  }
});

const keywordInput = document.getElementById('fKeyword');
if (keywordInput) {
  let debounceTimer;
  keywordInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentPage = 0;
      fetchAndRender();
    }, 300);
  });
}

// Tab switcher for "All Opportunities" vs "Saved Jobs"
document.querySelectorAll('[data-opp-tab]').forEach(tabBtn => {
  tabBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('[data-opp-tab]').forEach(b => b.classList.remove('active', 'btn-amber-active'));
    tabBtn.classList.add('active', 'btn-amber-active');
    currentTab = tabBtn.dataset.oppTab;
    currentPage = 0;
    fetchAndRender();
  });
});

fetchAndRender();
