/* ===========================================================
   Campus Career Hub — Home page logic
   =========================================================== */

if (document.getElementById('footerYear')) {
  document.getElementById('footerYear').textContent = new Date().getFullYear();
}

const CCB_CATEGORIES = [
  'Software Engineering', 'Data Science', 'Data and Analytics', 'Design',
  'Business', 'Sales', 'Marketing', 'Product Management', 'IT',
  'Writing and Editing', 'Customer Service', 'Social Media and Content'
];

const MUSE_API = 'https://www.themuse.com/api/public/jobs';

// Fallback dataset for home page featured opportunities
const FALLBACK_FEATURED = [
  {
    id: 'fb-101',
    name: 'Frontend Developer Intern (React/TypeScript)',
    company: { name: 'Google Cloud' },
    locations: [{ name: 'San Francisco, CA' }],
    categories: [{ name: 'Software Engineering' }],
    levels: [{ name: 'Internship' }],
    refs: { landing_page: 'https://careers.google.com' },
    contents: 'Build next-generation responsive cloud web applications with React, TypeScript, and modern design systems.'
  },
  {
    id: 'fb-102',
    name: 'Associate Data Scientist',
    company: { name: 'Microsoft AI' },
    locations: [{ name: 'New York, NY' }],
    categories: [{ name: 'Data Science' }],
    levels: [{ name: 'Entry Level' }],
    refs: { landing_page: 'https://careers.microsoft.com' },
    contents: 'Analyze telemetry, train ML predictive models, and optimize enterprise AI cloud pipelines.'
  },
  {
    id: 'fb-103',
    name: 'Product Design Intern (UI/UX)',
    company: { name: 'Adobe Creative Suite' },
    locations: [{ name: 'Flexible / Remote' }],
    categories: [{ name: 'Design' }],
    levels: [{ name: 'Internship' }],
    refs: { landing_page: 'https://www.adobe.com/careers.html' },
    contents: 'Design intuitive wireframes, interactive user journeys, and component design tokens in Figma.'
  }
];

function starString(rating){
  const r = Math.round(rating);
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

function escapeHTML(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function reviewCardHTML(review){
  const date = review.date ? new Date(review.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '';
  const avatarSrc = review.avatar || 'images/avatar-1.png';
  const initial = (review.name || 'S').charAt(0).toUpperCase();

  return `
    <div class="col-md-4 d-flex align-items-stretch">
      <div class="review-card shadow-sm w-100 d-flex flex-column">
        <div class="d-flex align-items-center gap-3 mb-3">
          <img src="${escapeHTML(avatarSrc)}" alt="${escapeHTML(review.name)}" class="review-avatar" 
               onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${initial}&background=0B1F3A&color=F2A93B';">
          <div>
            <div class="review-name fw-bold">${escapeHTML(review.name)}</div>
            <div class="stars small">${starString(review.rating)}</div>
          </div>
        </div>
        <p class="mb-3 flex-grow-1 text-slate">"${escapeHTML(review.text)}"</p>
        ${date ? `<div class="text-slate small mt-auto pt-2 border-top"><i class="bi bi-calendar3"></i> ${date}</div>` : ''}
      </div>
    </div>`;
}

function renderReviews(){
  const reviews = CCBStorage.getReviews();

  // latest 3 on home page
  const latest = reviews.slice(0, 3);
  const latestGrid = document.getElementById('latestReviewsGrid');
  if (latestGrid) {
    latestGrid.innerHTML = latest.length
      ? latest.map(reviewCardHTML).join('')
      : `<div class="empty-state">No reviews yet — be the first to leave one!</div>`;
  }

  // full list in modal
  const allList = document.getElementById('allReviewsList');
  if (allList) {
    allList.innerHTML = reviews.length
      ? reviews.map(reviewCardHTML).join('')
      : `<div class="empty-state">No reviews yet.</div>`;
  }

  // average rating stat
  const avg = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length)
    : 0;
  const statRatingEl = document.getElementById('statRating');
  if (statRatingEl) {
    statRatingEl.textContent = reviews.length ? avg.toFixed(1) + ' / 5' : '—';
  }
}

function renderSkillsStat(){
  const skills = CCBStorage.getSkills();
  const statSkillsEl = document.getElementById('statSkills');
  if (statSkillsEl) {
    statSkillsEl.textContent = skills.length;
  }
}

function getCompanyBadgeColor(name){
  const colors = ['#0B1F3A', '#1E6E73', '#D68C1F', '#2E7D4F', '#4A154B', '#0052CC'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function oppCardHTML(job){
  const id = job.id || Math.random().toString(36).substr(2, 9);
  const title = job.name || 'Untitled role';
  const company = job.company?.name || 'Unknown company';
  const location = (job.locations && job.locations[0]?.name) || 'Location flexible';
  const category = (job.categories && job.categories[0]?.name) || 'General';
  const level = (job.levels && job.levels[0]?.name) || '';
  const link = job.refs?.landing_page || '#';
  const desc = (job.contents || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const companyColor = getCompanyBadgeColor(company);
  const firstLetter = company.charAt(0).toUpperCase();

  return `
    <div class="col-md-4 d-flex align-items-stretch">
      <div class="opp-card shadow-sm w-100 d-flex flex-column">
        <div class="d-flex align-items-center gap-2 mb-2">
          <div class="company-logo-avatar" style="background:${companyColor};">${firstLetter}</div>
          <div>
            <div class="opp-company">${escapeHTML(company)}</div>
            <span class="badge bg-teal-soft text-teal small-badge">${escapeHTML(category)}</span>
          </div>
        </div>
        <h5 class="opp-title mb-2">${escapeHTML(title)}</h5>
        <div class="opp-meta mb-2">
          <span><i class="bi bi-geo-alt"></i> ${escapeHTML(location)}</span>
          ${level ? `<span><i class="bi bi-person-badge"></i> ${escapeHTML(level)}</span>` : ''}
        </div>
        <p class="opp-desc flex-grow-1">${escapeHTML(desc) || 'No description provided.'}</p>
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-teal rounded-pill mt-3 align-self-start">
          View Opportunity <i class="bi bi-box-arrow-up-right ms-1"></i>
        </a>
      </div>
    </div>`;
}

async function loadFeaturedOpportunities(){
  const loading = document.getElementById('featuredOppLoading');
  const errorBox = document.getElementById('featuredOppError');
  const grid = document.getElementById('featuredOppGrid');
  const statOppEl = document.getElementById('statOpportunities');

  if (loading) loading.classList.remove('d-none');
  if (errorBox) errorBox.classList.add('d-none');

  try{
    const res = await fetch(`${MUSE_API}?page=0`);
    let jobs = [];
    let totalCount = 0;

    if (res.ok) {
      const data = await res.json();
      // Correct parser for The Muse API: data.results
      jobs = (data.results || data.items || []);
      totalCount = data.total ?? jobs.length;
    }

    if (jobs.length === 0) {
      jobs = FALLBACK_FEATURED;
      totalCount = 500;
    }

    const featured = jobs.slice(0, 3);
    if (grid) {
      grid.innerHTML = featured.map(oppCardHTML).join('');
    }

    if (statOppEl) {
      statOppEl.textContent = totalCount ? totalCount.toLocaleString() : '500+';
    }
  }catch(err){
    console.warn('Failed to load featured opportunities live from API, using fallback featured dataset:', err);
    if (grid) {
      grid.innerHTML = FALLBACK_FEATURED.map(oppCardHTML).join('');
    }
    if (statOppEl) {
      statOppEl.textContent = '500+';
    }
  }finally{
    if (loading) loading.classList.add('d-none');
  }
}

const statCatEl = document.getElementById('statCategories');
if (statCatEl) statCatEl.textContent = CCB_CATEGORIES.length;

renderReviews();
renderSkillsStat();
loadFeaturedOpportunities();
