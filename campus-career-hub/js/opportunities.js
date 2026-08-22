/* ===========================================================
   Campus Career Hub — Opportunities page logic
   Fetches top opportunities live from The Muse public API
   with instant fallback to ensure 6 job cards render immediately.
   =========================================================== */

if (document.getElementById('footerYear')) {
  document.getElementById('footerYear').textContent = new Date().getFullYear();
}

const MUSE_API = 'https://www.themuse.com/api/public/jobs?page=0';

// Fallback dataset (6 high-quality student & entry-level opportunity cards)
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
    contents: 'Join Google Cloud team to build next-generation responsive cloud web applications using React, TypeScript, and modern design systems.'
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
    contents: 'Analyze telemetry data, train ML predictive models, and optimize enterprise AI cloud pipelines for Azure.'
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
    contents: 'Design intuitive wireframes, interactive user journeys, and component design tokens in Figma and Adobe XD.'
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
    contents: 'Architect resilient financial APIs using Go and Distributed Systems for high-volume global payment operations.'
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
    contents: 'Lead student outreach initiatives, digital social campaigns, and creative campus brand events.'
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
    contents: 'Drive data-backed insights, business strategy modeling, and executive client presentations for technology clients.'
  }
];

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function getCompanyBadgeColor(name) {
  const colors = ['#0B1F3A', '#1E6E73', '#D68C1F', '#2E7D4F', '#4A154B', '#0052CC'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function oppCardHTML(job) {
  const title = job.name || 'Untitled Role';
  const company = job.company?.name || 'Top Employer';
  const location = (job.locations && job.locations[0]?.name) || 'Flexible / Remote';
  const category = (job.categories && job.categories[0]?.name) || 'Opportunity';
  const level = (job.levels && job.levels[0]?.name) || '';
  const link = job.refs?.landing_page || '#';
  const rawDesc = (job.contents || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const desc = rawDesc || 'High-impact opportunity suitable for ambitious students and recent graduates.';
  const companyColor = getCompanyBadgeColor(company);
  const firstLetter = company.charAt(0).toUpperCase();

  const jobJson = escapeHTML(JSON.stringify(job));

  return `
    <div class="col-md-6 col-lg-4 d-flex align-items-stretch">
      <div class="opp-card shadow-sm position-relative w-100 d-flex flex-column">
        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="company-logo-avatar" style="background:${companyColor};">
            ${firstLetter}
          </div>
          <div>
            <div class="opp-company">${escapeHTML(company)}</div>
            <span class="badge bg-teal-soft text-teal small-badge">${escapeHTML(category)}</span>
          </div>
        </div>

        <h5 class="opp-title mb-2">${escapeHTML(title)}</h5>

        <div class="opp-meta mb-3">
          <span><i class="bi bi-geo-alt-fill text-teal"></i> ${escapeHTML(location)}</span>
          ${level ? `<span><i class="bi bi-person-badge"></i> ${escapeHTML(level)}</span>` : ''}
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

function attachCardEventListeners() {
  document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const jobDataRaw = btn.dataset.jobData;
      if (!jobDataRaw) return;
      try {
        const job = JSON.parse(jobDataRaw);
        showJobDetailsModal(job);
      } catch (err) {
        console.error('Error showing job details:', err);
      }
    });
  });
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

async function loadOpportunities() {
  const loading = document.getElementById('oppLoading');
  const errorBox = document.getElementById('oppError');
  const grid = document.getElementById('oppGrid');

  if (loading) loading.classList.remove('d-none');
  if (errorBox) errorBox.classList.add('d-none');

  let jobs = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(MUSE_API, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      jobs = data.results || data.items || [];
    }
  } catch (err) {
    console.warn('API fetch skipped or timed out, rendering fallback opportunities dataset:', err);
  }

  if (!jobs || jobs.length === 0) {
    jobs = FALLBACK_OPPORTUNITIES;
  }

  const selectedJobs = jobs.slice(0, 6);

  if (grid) {
    grid.innerHTML = selectedJobs.map(oppCardHTML).join('');
    attachCardEventListeners();
  }

  if (loading) loading.classList.add('d-none');
}

document.addEventListener('DOMContentLoaded', loadOpportunities);
loadOpportunities();
