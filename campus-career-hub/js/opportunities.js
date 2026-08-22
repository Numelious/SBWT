/* ===========================================================
   Campus Career Hub — Opportunities page
   =========================================================== */

if (document.getElementById('footerYear')) {
  document.getElementById('footerYear').textContent =
    new Date().getFullYear();
}

const MUSE_API = 'https://www.themuse.com/api/public/jobs';

const CCB_CATEGORIES = [
  'Software Engineering',
  'Data Science',
  'Data and Analytics',
  'Design',
  'Business',
  'Sales',
  'Marketing',
  'Product Management',
  'IT',
  'Writing and Editing',
  'Customer Service',
  'Social Media and Content'
];

/* ---------- FALLBACK DATA ---------- */

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
    contents:
      'Build web applications using React, TypeScript and modern web technologies. Salary $85,000.'
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
    contents:
      'Analyze data, train machine learning models and work with AI pipelines. Salary $105,000.'
  },

  {
    id: 'fb-103',
    name: 'Product Design Intern (UI/UX)',
    company: { name: 'Adobe' },
    locations: [{ name: 'Flexible / Remote' }],
    categories: [{ name: 'Design' }],
    levels: [{ name: 'Internship' }],
    publication_date: new Date(Date.now() - 86400000 * 3).toISOString(),
    refs: { landing_page: 'https://www.adobe.com/careers.html' },
    contents:
      'Design user interfaces, wireframes and prototypes using Figma and Adobe XD. Salary $65,000.'
  },

  {
    id: 'fb-104',
    name: 'Junior Backend Software Engineer',
    company: { name: 'Stripe' },
    locations: [{ name: 'Austin, TX' }],
    categories: [{ name: 'Software Engineering' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 4).toISOString(),
    refs: { landing_page: 'https://stripe.com/jobs' },
    contents:
      'Build backend APIs using Go and distributed systems. Salary $115,000.'
  },

  {
    id: 'fb-105',
    name: 'Campus Marketing Specialist',
    company: { name: 'Canva' },
    locations: [{ name: 'Chicago, IL' }],
    categories: [{ name: 'Marketing' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    refs: { landing_page: 'https://www.canva.com/careers/' },
    contents:
      'Work on student outreach, social media campaigns and campus events. Salary $52,000.'
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
    contents:
      'Analyze business data, prepare strategies and create client presentations. Salary $95,000.'
  },

  {
    id: 'fb-107',
    name: 'Full Stack Development Intern',
    company: { name: 'Spotify' },
    locations: [{ name: 'New York, NY' }],
    categories: [{ name: 'Software Engineering' }],
    levels: [{ name: 'Internship' }],
    publication_date: new Date(Date.now() - 86400000 * 7).toISOString(),
    refs: { landing_page: 'https://www.lifeatspotify.com' },
    contents:
      'Develop applications using Node.js and React. Work with senior software engineers. Salary $78,000.'
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
    contents:
      'Monitor network security threats and audit cloud infrastructure. Salary $88,000.'
  },

  {
    id: 'fb-109',
    name: 'Associate Product Manager',
    company: { name: 'Uber' },
    locations: [{ name: 'San Francisco, CA' }],
    categories: [{ name: 'Product Management' }],
    levels: [{ name: 'Entry Level' }],
    publication_date: new Date(Date.now() - 86400000 * 9).toISOString(),
    refs: { landing_page: 'https://www.uber.com/careers' },
    contents:
      'Manage product features and collaborate with engineering, design and data science teams. Salary $120,000.'
  }
];

/* ---------- VARIABLES ---------- */

let currentPage = 0;
let currentTab = 'all';

/* ---------- CATEGORY DROPDOWN ---------- */

const categorySelect = document.getElementById('fCategory');

if (categorySelect && categorySelect.children.length <= 1) {
  CCB_CATEGORIES.forEach(function(category) {
    const option = document.createElement('option');

    option.value = category;
    option.textContent = category;

    categorySelect.appendChild(option);
  });
}

/* ---------- HELPER FUNCTIONS ---------- */

function escapeHTML(str) {
  const div = document.createElement('div');

  div.textContent = str ?? '';

  return div.innerHTML;
}

function buildApiUrl(page) {
  const params = new URLSearchParams();

  params.set('page', page);

  const category =
    document.getElementById('fCategory')?.value || '';

  const level =
    document.getElementById('fLevel')?.value || '';

  const location =
    document.getElementById('fLocation')?.value || '';

  if (category) {
    params.append('category', category);
  }

  if (level) {
    params.append('level', level);
  }

  if (location && location !== 'Remote') {
    params.append('location', location);
  }

  return `${MUSE_API}?${params.toString()}`;
}

/* ---------- SALARY ---------- */

function extractSalaryFloor(job) {
  const text =
    (job.contents || '') + ' ' + (job.name || '');

  const match =
    text.match(/\$([\d]{2,3}),?(\d{3})/);

  if (!match) {
    return null;
  }

  return Number(match[1] + match[2]);
}

/* ---------- SEARCH + FILTER ---------- */

function jobMatchesClientFilters(job) {

  const keyword =
    (document.getElementById('fKeyword')?.value || '')
      .trim()
      .toLowerCase();

  const minSalary =
    Number(document.getElementById('fSalary')?.value || 0);

  const locationVal =
    document.getElementById('fLocation')?.value || '';

  const categoryVal =
    document.getElementById('fCategory')?.value || '';

  const levelVal =
    document.getElementById('fLevel')?.value || '';

  /* SEARCH */

  if (keyword) {

    const haystack =
      (job.name || '') + ' ' +
      (job.company?.name || '') + ' ' +
      (job.contents || '');

    if (!haystack.toLowerCase().includes(keyword)) {
      return false;
    }
  }

  /* SALARY */

  if (minSalary > 0) {

    const salary = extractSalaryFloor(job);

    if (salary === null || salary < minSalary) {
      return false;
    }
  }

  /* LOCATION */

  if (locationVal === 'Remote') {

    const locations =
      (job.locations || [])
        .map(function(location) {
          return (location.name || '').toLowerCase();
        })
        .join(' ');

    if (
      !locations.includes('remote') &&
      !locations.includes('flexible')
    ) {
      return false;
    }

  } else if (locationVal) {

    const locations =
      (job.locations || [])
        .map(function(location) {
          return (location.name || '').toLowerCase();
        })
        .join(' ');

    if (
      !locations.includes(locationVal.toLowerCase())
    ) {
      return false;
    }
  }

  /* CATEGORY */

  if (categoryVal) {

    const categories =
      (job.categories || [])
        .map(function(category) {
          return (category.name || '').toLowerCase();
        })
        .join(' ');

    if (
      !categories.includes(categoryVal.toLowerCase())
    ) {
      return false;
    }
  }

  /* LEVEL */

  if (levelVal) {

    const levels =
      (job.levels || [])
        .map(function(level) {
          return (level.name || '').toLowerCase();
        })
        .join(' ');

    if (
      !levels.includes(levelVal.toLowerCase())
    ) {
      return false;
    }
  }

  return true;
}

/* ---------- SORT ---------- */

function sortJobs(jobs) {

  const sortBy =
    document.getElementById('fSort')?.value || 'relevance';

  const copy = [...jobs];

  if (sortBy === 'newest') {

    copy.sort(function(a, b) {
      return new Date(b.publication_date || 0) -
             new Date(a.publication_date || 0);
    });

  } else if (sortBy === 'az') {

    copy.sort(function(a, b) {
      return (a.name || '').localeCompare(
        b.name || ''
      );
    });
  }

  return copy;
}

/* ---------- COMPANY COLOR ---------- */

function getCompanyBadgeColor(name) {

  const colors = [
    '#0B1F3A',
    '#1E6E73',
    '#D68C1F',
    '#2E7D4F',
    '#4A154B',
    '#0052CC'
  ];

  let hash = 0;

  for (let i = 0; i < (name || '').length; i++) {
    hash =
      name.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/* ---------- JOB CARD ---------- */

function oppCardHTML(job) {

  const id =
    job.id ||
    Math.random().toString(36).substr(2, 9);

  const title =
    job.name || 'Untitled Role';

  const company =
    job.company?.name || 'Top Employer';

  const location =
    job.locations &&
    job.locations[0]?.name
      ? job.locations[0].name
      : 'Flexible / Remote';

  const category =
    job.categories &&
    job.categories[0]?.name
      ? job.categories[0].name
      : 'Opportunity';

  const level =
    job.levels &&
    job.levels[0]?.name
      ? job.levels[0].name
      : '';

  const link =
    job.refs?.landing_page || '#';

  const rawDesc =
    (job.contents || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const desc =
    rawDesc ||
    'Opportunity suitable for students and recent graduates.';

  const salary =
    extractSalaryFloor(job);

  const isSaved =
    CCBStorage.isJobSaved(id);

  const companyColor =
    getCompanyBadgeColor(company);

  const firstLetter =
    company.charAt(0).toUpperCase();

  const jobJson =
    escapeHTML(JSON.stringify(job));

  return `
    <div class="col-md-6 col-lg-4 d-flex align-items-stretch">

      <div class="opp-card shadow-sm position-relative w-100 d-flex flex-column">

        <div class="d-flex align-items-center justify-content-between mb-3">

          <div class="d-flex align-items-center gap-2">

            <div
              class="company-logo-avatar"
              style="background:${companyColor};"
            >
              ${firstLetter}
            </div>

            <div>

              <div class="opp-company">
                ${escapeHTML(company)}
              </div>

              <span class="badge bg-light text-dark border small-badge">
                ${escapeHTML(category)}
              </span>

            </div>

          </div>

          <button
            type="button"
            class="btn btn-sm btn-bookmark ${isSaved ? 'active' : ''}"
            data-job-id="${escapeHTML(id)}"
            data-job-data="${jobJson}"
            title="${isSaved ? 'Remove Bookmark' : 'Save Job'}"
          >

            <i class="bi ${
              isSaved
                ? 'bi-bookmark-fill text-amber'
                : 'bi-bookmark'
            }"></i>

          </button>

        </div>

        <h5 class="opp-title mb-2">
          ${escapeHTML(title)}
        </h5>

        <div class="opp-meta mb-3">

          <span>
            <i class="bi bi-geo-alt-fill text-teal"></i>
            ${escapeHTML(location)}
          </span>

          ${
            level
              ? `
                <span>
                  <i class="bi bi-person-badge"></i>
                  ${escapeHTML(level)}
                </span>
              `
              : ''
          }

          ${
            salary
              ? `
                <span>
                  <i class="bi bi-cash-stack text-success"></i>
                  $${salary.toLocaleString()}+
                </span>
              `
              : ''
          }

        </div>

        <p class="opp-desc flex-grow-1">
          ${escapeHTML(desc)}
        </p>

        <div class="d-flex align-items-center justify-content-between pt-3 mt-auto border-top gap-2">

          <button
            type="button"
            class="btn btn-sm btn-outline-secondary rounded-pill px-3 btn-details"
            data-job-data="${jobJson}"
          >
            <i class="bi bi-info-circle"></i>
            Details
          </button>

          <a
            href="${link}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm btn-teal rounded-pill px-3"
          >
            Apply Now
            <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>

        </div>

      </div>

    </div>
  `;
}

/* ---------- PAGINATION ---------- */

function renderPagination(totalPages) {

  const pagination =
    document.getElementById('oppPagination');

  if (!pagination) {
    return;
  }

  pagination.innerHTML = '';

  if (
    totalPages <= 1 ||
    currentTab === 'saved'
  ) {
    return;
  }

  const maxButtons = 7;

  let start =
    Math.max(0, currentPage - 3);

  let end =
    Math.min(totalPages, start + maxButtons);

  start =
    Math.max(0, end - maxButtons);

  function addPageItem(
    label,
    page,
    disabled,
    active
  ) {

    const li =
      document.createElement('li');

    li.className =
      `page-item ${
        disabled ? 'disabled' : ''
      } ${
        active ? 'active' : ''
      }`;

    const link =
      document.createElement('a');

    link.className = 'page-link';

    link.href = '#';

    link.textContent = label;

    link.addEventListener('click', function(e) {

      e.preventDefault();

      if (disabled || active) {
        return;
      }

      currentPage = page;

      fetchAndRender();
    });

    li.appendChild(link);

    pagination.appendChild(li);
  }

  addPageItem(
    '«',
    currentPage - 1,
    currentPage === 0,
    false
  );

  for (let p = start; p < end; p++) {

    addPageItem(
      p + 1,
      p,
      false,
      p === currentPage
    );
  }

  addPageItem(
    '»',
    currentPage + 1,
    currentPage >= totalPages - 1,
    false
  );
}

/* ---------- BUTTON EVENTS ---------- */

function attachCardEventListeners() {

  /* SAVE JOB */

  document
    .querySelectorAll('.btn-bookmark')
    .forEach(function(button) {

      button.addEventListener(
        'click',
        function(e) {

          e.preventDefault();

          const jobData =
            button.dataset.jobData;

          if (!jobData) {
            return;
          }

          try {

            const job =
              JSON.parse(jobData);

            const saved =
              CCBStorage.toggleSavedJob(job);

            button.classList.toggle(
              'active',
              saved
            );

            const icon =
              button.querySelector('i');

            if (icon) {

              icon.className =
                saved
                  ? 'bi bi-bookmark-fill text-amber'
                  : 'bi bi-bookmark';
            }

            updateSavedCountBadge();

            if (currentTab === 'saved') {
              fetchAndRender();
            }

          } catch (error) {

            console.error(
              'Error saving job:',
              error
            );
          }
        }
      );
    });

  /* DETAILS */

  document
    .querySelectorAll('.btn-details')
    .forEach(function(button) {

      button.addEventListener(
        'click',
        function() {

          const jobData =
            button.dataset.jobData;

          if (!jobData) {
            return;
          }

          try {

            const job =
              JSON.parse(jobData);

            showJobDetailsModal(job);

          } catch (error) {

            console.error(
              'Error showing details:',
              error
            );
          }
        }
      );
    });
}

/* ---------- SAVED COUNT ---------- */

function updateSavedCountBadge() {

  const count =
    document.getElementById('savedJobsCount');

  if (count) {

    const saved =
      CCBStorage.getSavedJobs();

    count.textContent =
      saved.length;
  }
}

/* ---------- DETAILS MODAL ---------- */

function showJobDetailsModal(job) {

  let modal =
    document.getElementById('jobDetailsModal');

  if (!modal) {

    modal =
      document.createElement('div');

    modal.id =
      'jobDetailsModal';

    modal.className =
      'modal fade';

    modal.tabIndex = -1;

    modal.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.appendChild(modal);
  }

  const title =
    job.name || 'Job Details';

  const company =
    job.company?.name || 'Company';

  const location =
    job.locations &&
    job.locations[0]?.name
      ? job.locations[0].name
      : 'Location flexible';

  const category =
    job.categories &&
    job.categories[0]?.name
      ? job.categories[0].name
      : 'General';

  const level =
    job.levels &&
    job.levels[0]?.name
      ? job.levels[0].name
      : '';

  const link =
    job.refs?.landing_page || '#';

  const contents =
    job.contents ||
    '<p>No full description provided.</p>';

  modal.innerHTML = `

    <div class="modal-dialog modal-lg modal-dialog-scrollable">

      <div class="modal-content">

        <div class="modal-header border-bottom">

          <div>

            <span class="badge bg-teal-soft text-teal mb-1">
              ${escapeHTML(category)}
            </span>

            <h4 class="modal-title display-font">
              ${escapeHTML(title)}
            </h4>

            <div class="text-slate small mt-1">

              <strong>
                ${escapeHTML(company)}
              </strong>

              &bull;

              <i class="bi bi-geo-alt"></i>

              ${escapeHTML(location)}

              ${
                level
                  ? `&bull; ${escapeHTML(level)}`
                  : ''
              }

            </div>

          </div>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>

        </div>

        <div class="modal-body py-4">

          <div class="job-contents-body">
            ${contents}
          </div>

        </div>

        <div class="modal-footer bg-paper">

          <button
            type="button"
            class="btn btn-outline-secondary rounded-pill"
            data-bs-dismiss="modal"
          >
            Close
          </button>

          <a
            href="${link}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ccb-primary rounded-pill px-4"
          >
            Apply Direct on Company Portal
            <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>

        </div>

      </div>

    </div>
  `;

  const bsModal =
    new bootstrap.Modal(modal);

  bsModal.show();
}

/* ---------- MAIN FUNCTION ---------- */

async function fetchAndRender() {

  const loading =
    document.getElementById('oppLoading');

  const errorBox =
    document.getElementById('oppError');

  const emptyBox =
    document.getElementById('oppEmpty');

  const grid =
    document.getElementById('oppGrid');

  const countLabel =
    document.getElementById('resultsCount');

  if (loading) {
    loading.classList.remove('d-none');
  }

  if (errorBox) {
    errorBox.classList.add('d-none');
  }

  if (emptyBox) {
    emptyBox.classList.add('d-none');
  }

  if (grid) {
    grid.innerHTML = '';
  }

  updateSavedCountBadge();

  /* ---------- SAVED JOBS ---------- */

  if (currentTab === 'saved') {

    let jobs =
      CCBStorage.getSavedJobs();

    jobs =
      jobs.filter(jobMatchesClientFilters);

    jobs =
      sortJobs(jobs);

    if (loading) {
      loading.classList.add('d-none');
    }

    if (jobs.length === 0) {

      if (emptyBox) {

        emptyBox.classList.remove(
          'd-none'
        );

        emptyBox.querySelector('p').textContent =
          'You have not saved any opportunities yet.';
      }

      if (countLabel) {
        countLabel.textContent =
          '0 saved items';
      }

    } else {

      if (grid) {
        grid.innerHTML =
          jobs.map(oppCardHTML).join('');
      }

      if (countLabel) {
        countLabel.textContent =
          `Showing ${jobs.length} saved opportunities`;
      }

      attachCardEventListeners();
    }

    renderPagination(1);

    return;
  }

  /* ---------- API ---------- */

  try {

    const res =
      await fetch(buildApiUrl(currentPage));

    /*
      Important:
      fetch() does not automatically throw
      for HTTP errors like 404 or 500.
    */

    if (!res.ok) {
      throw new Error(
        'API request failed: ' + res.status
      );
    }

    const data =
      await res.json();

    let jobs =
      data.results ||
      data.items ||
      [];

    let totalCount =
      data.total ||
      jobs.length;

    let pageCount =
      data.page_count ||
      Math.ceil(totalCount / 20) ||
      1;

    /* ---------- FALLBACK ---------- */

    if (jobs.length === 0) {

      jobs =
        FALLBACK_OPPORTUNITIES;

      totalCount =
        jobs.length;

      pageCount = 1;
    }

    /* ---------- SEARCH/FILTER ---------- */

    jobs =
      jobs.filter(
        jobMatchesClientFilters
      );

    /* ---------- SORT ---------- */

    jobs =
      sortJobs(jobs);

    /* ---------- DISPLAY ---------- */

    if (jobs.length === 0) {

      if (emptyBox) {

        emptyBox.classList.remove(
          'd-none'
        );

        emptyBox.querySelector('p').textContent =
          'No opportunities matched your search. Try another keyword or filter.';
      }

      if (countLabel) {
        countLabel.textContent =
          '0 opportunities found';
      }

    } else {

      if (grid) {

        grid.innerHTML =
          jobs
            .map(oppCardHTML)
            .join('');
      }

      if (countLabel) {

        countLabel.textContent =
          `Showing ${jobs.length} opportunities`;
      }

      attachCardEventListeners();
    }

    renderPagination(pageCount);

  } catch (error) {

    /* ---------- API FAILED ---------- */

    console.warn(
      'API unavailable. Using fallback opportunities.',
      error
    );

    let jobs =
      FALLBACK_OPPORTUNITIES.filter(
        jobMatchesClientFilters
      );

    jobs =
      sortJobs(jobs);

    if (jobs.length === 0) {

      if (emptyBox) {

        emptyBox.classList.remove(
          'd-none'
        );

        emptyBox.querySelector('p').textContent =
          'No opportunities matched your search.';
      }

      if (countLabel) {
        countLabel.textContent =
          '0 opportunities found';
      }

    } else {

      if (grid) {

        grid.innerHTML =
          jobs
            .map(oppCardHTML)
            .join('');
      }

      if (countLabel) {

        countLabel.textContent =
          `Showing ${jobs.length} curated opportunities`;
      }

      attachCardEventListeners();
    }

    renderPagination(1);

  } finally {

    if (loading) {
      loading.classList.add('d-none');
    }
  }
}

/* ---------- FORM SEARCH ---------- */

const filterForm =
  document.getElementById('oppFilterForm');

if (filterForm) {

  filterForm.addEventListener(
    'submit',
    function(e) {

      e.preventDefault();

      currentPage = 0;

      fetchAndRender();
    }
  );
}

/* ---------- RESET ---------- */

const resetButton =
  document.getElementById('fReset');

if (resetButton) {

  resetButton.addEventListener(
    'click',
    function() {

      if (filterForm) {
        filterForm.reset();
      }

      currentPage = 0;

      fetchAndRender();
    }
  );
}

/* ---------- FILTERS ---------- */

[
  'fCategory',
  'fLevel',
  'fLocation',
  'fSort',
  'fSalary'
].forEach(function(id) {

  const element =
    document.getElementById(id);

  if (element) {

    element.addEventListener(
      'change',
      function() {

        currentPage = 0;

        fetchAndRender();
      }
    );
  }
});

/* ---------- SEARCH INPUT ---------- */

const keywordInput =
  document.getElementById('fKeyword');

if (keywordInput) {

  let debounceTimer;

  keywordInput.addEventListener(
    'input',
    function() {

      clearTimeout(debounceTimer);

      debounceTimer =
        setTimeout(function() {

          currentPage = 0;

          fetchAndRender();

        }, 300);
    }
  );
}

/* ---------- TAB SWITCH ---------- */

document
  .querySelectorAll('[data-opp-tab]')
  .forEach(function(tabButton) {

    tabButton.addEventListener(
      'click',
      function(e) {

        e.preventDefault();

        document
          .querySelectorAll('[data-opp-tab]')
          .forEach(function(button) {

            button.classList.remove(
              'active',
              'btn-amber-active'
            );
          });

        tabButton.classList.add(
          'active',
          'btn-amber-active'
        );

        currentTab =
          tabButton.dataset.oppTab;

        currentPage = 0;

        fetchAndRender();
      }
    );
  });

/* ---------- INITIAL LOAD ---------- */

fetchAndRender();
