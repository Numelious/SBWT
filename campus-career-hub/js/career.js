/* ===========================================================
   Campus Career Hub — My Career page logic
   =========================================================== */

document.getElementById('footerYear').textContent = new Date().getFullYear();

function escapeHTML(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function showSavedPill(){
  const pill = document.getElementById('savePill');
  pill.classList.add('show');
  clearTimeout(showSavedPill._t);
  showSavedPill._t = setTimeout(() => pill.classList.remove('show'), 1600);
}

/* ============================ PROFILE ============================ */
function loadProfile(){
  const profile = CCBStorage.getProfile();
  document.getElementById('pName').value = profile.name || '';
  document.getElementById('pEmail').value = profile.email || '';
  document.getElementById('pPhone').value = profile.phone || '';
  document.getElementById('pLocation').value = profile.location || '';
  document.getElementById('pCollege').value = profile.college || '';
  document.getElementById('pDegree').value = profile.degree || '';
  document.getElementById('pBranch').value = profile.branch || '';
  document.getElementById('pSemester').value = profile.semester || '';
}

document.getElementById('profileForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const profile = {
    name: document.getElementById('pName').value.trim(),
    email: document.getElementById('pEmail').value.trim(),
    phone: document.getElementById('pPhone').value.trim(),
    location: document.getElementById('pLocation').value.trim(),
    college: document.getElementById('pCollege').value.trim(),
    degree: document.getElementById('pDegree').value.trim(),
    branch: document.getElementById('pBranch').value.trim(),
    semester: document.getElementById('pSemester').value.trim()
  };
  CCBStorage.setProfile(profile);
  showSavedPill();
});

/* ============================ SKILLS ============================ */
function renderSkills(){
  const skills = CCBStorage.getSkills();
  const list = document.getElementById('skillsList');
  list.innerHTML = skills.length
    ? skills.map((skill, i) => `
        <span class="skill-tag">
          ${escapeHTML(skill)}
          <button type="button" data-index="${i}" aria-label="Remove ${escapeHTML(skill)}">&times;</button>
        </span>`).join('')
    : `<span class="text-slate small">No skills added yet — add your first skill above.</span>`;

  list.querySelectorAll('button[data-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      const updated = CCBStorage.getSkills();
      updated.splice(idx, 1);
      CCBStorage.setSkills(updated);
      renderSkills();
      showSavedPill();
    });
  });
}

document.getElementById('skillForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('skillInput');
  const value = input.value.trim();
  if (!value) return;

  const skills = CCBStorage.getSkills();
  if (skills.some(s => s.toLowerCase() === value.toLowerCase())){
    input.value = '';
    return;
  }
  skills.push(value);
  CCBStorage.setSkills(skills);
  input.value = '';
  renderSkills();
  showSavedPill();
});

/* ==================== GENERIC REPEATING SECTIONS ==================== */
/* Shared engine for Projects, Certifications, Internships */

function makeRepeatingSection({ getFn, setFn, listId, emptyId, fields, renderSummary }){
  function render(){
    const items = getFn();
    const container = document.getElementById(listId);
    const emptyBox = document.getElementById(emptyId);

    if (items.length === 0){
      container.innerHTML = '';
      emptyBox.classList.remove('d-none');
      return;
    }
    emptyBox.classList.add('d-none');

    container.innerHTML = items.map((item, index) => `
      <div class="entry-block" data-index="${index}">
        <button type="button" class="entry-remove" data-remove="${index}" aria-label="Remove entry">&times;</button>
        <div class="row g-3">
          ${fields.map(f => `
            <div class="col-md-${f.col || 6}">
              <label>${f.label}</label>
              ${f.type === 'textarea'
                ? `<textarea class="form-control" rows="2" data-field="${f.key}" data-index="${index}" placeholder="${f.placeholder || ''}">${escapeHTML(item[f.key] || '')}</textarea>`
                : `<input type="${f.type || 'text'}" class="form-control" data-field="${f.key}" data-index="${index}" placeholder="${f.placeholder || ''}" value="${escapeHTML(item[f.key] || '')}">`
              }
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // field change -> persist
    container.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = Number(el.dataset.index);
        const field = el.dataset.field;
        const items = getFn();
        items[idx][field] = el.value;
        setFn(items);
        showSavedPill();
      });
    });

    // remove button
    container.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.remove);
        const items = getFn();
        items.splice(idx, 1);
        setFn(items);
        render();
        showSavedPill();
      });
    });
  }

  function addEntry(){
    const items = getFn();
    const blank = {};
    fields.forEach(f => blank[f.key] = '');
    items.push(blank);
    setFn(items);
    render();
  }

  return { render, addEntry };
}

const projectsSection = makeRepeatingSection({
  getFn: () => CCBStorage.getProjects(),
  setFn: (v) => CCBStorage.setProjects(v),
  listId: 'projectsList',
  emptyId: 'projectsEmpty',
  fields: [
    { key: 'name', label: 'Project Name', col: 6, placeholder: 'e.g. Smart Lifestyle Risk Analyzer' },
    { key: 'link', label: 'Project Link', col: 6, placeholder: 'https://github.com/...' },
    { key: 'tech', label: 'Technologies Used', col: 12, placeholder: 'e.g. Java, MySQL, Swing' },
    { key: 'description', label: 'Description', col: 12, type: 'textarea', placeholder: 'What does this project do?' }
  ]
});

const certsSection = makeRepeatingSection({
  getFn: () => CCBStorage.getCertifications(),
  setFn: (v) => CCBStorage.setCertifications(v),
  listId: 'certsList',
  emptyId: 'certsEmpty',
  fields: [
    { key: 'name', label: 'Certification Name', col: 6, placeholder: 'e.g. Google Data Analytics' },
    { key: 'org', label: 'Issuing Organization', col: 6, placeholder: 'e.g. Coursera' },
    { key: 'date', label: 'Date', col: 6, type: 'month' },
    { key: 'link', label: 'Credential Link', col: 6, placeholder: 'https://...' }
  ]
});

const internsSection = makeRepeatingSection({
  getFn: () => CCBStorage.getInternships(),
  setFn: (v) => CCBStorage.setInternships(v),
  listId: 'internsList',
  emptyId: 'internsEmpty',
  fields: [
    { key: 'company', label: 'Company', col: 6, placeholder: 'e.g. Acme Corp' },
    { key: 'position', label: 'Position', col: 6, placeholder: 'e.g. Web Development Intern' },
    { key: 'duration', label: 'Duration', col: 12, placeholder: 'e.g. May 2026 – Jul 2026' },
    { key: 'description', label: 'Description', col: 12, type: 'textarea', placeholder: 'What did you work on?' }
  ]
});

document.getElementById('addProjectBtn').addEventListener('click', () => projectsSection.addEntry());
document.getElementById('addCertBtn').addEventListener('click', () => certsSection.addEntry());
document.getElementById('addInternBtn').addEventListener('click', () => internsSection.addEntry());

/* ============================ RESET ALL ============================ */
document.getElementById('resetAllBtn').addEventListener('click', () => {
  if (!confirm('This will permanently clear your profile, skills, projects, certifications and internships from this browser. Continue?')) return;
  CCBStorage.setProfile({});
  CCBStorage.setSkills([]);
  CCBStorage.setProjects([]);
  CCBStorage.setCertifications([]);
  CCBStorage.setInternships([]);
  loadProfile();
  renderSkills();
  projectsSection.render();
  certsSection.render();
  internsSection.render();
  showSavedPill();
});

/* ============================ INIT ============================ */
loadProfile();
renderSkills();
projectsSection.render();
certsSection.render();
internsSection.render();
