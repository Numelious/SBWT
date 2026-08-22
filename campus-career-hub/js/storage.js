/* ===========================================================
   Campus Career Hub — localStorage helpers
   Shared by index.html, my-career.html and contact.html
   =========================================================== */

const CCB_KEYS = {
  profile: 'ccb_profile',
  skills: 'ccb_skills',
  projects: 'ccb_projects',
  certifications: 'ccb_certifications',
  internships: 'ccb_internships',
  reviews: 'ccb_reviews',
  savedJobs: 'ccb_saved_jobs'
};

const CCBStorage = {
  get(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      if(raw === null) return fallback;
      return JSON.parse(raw);
    }catch(e){
      console.warn('CCBStorage.get failed for', key, e);
      return fallback;
    }
  },
  set(key, value){
    try{
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }catch(e){
      console.warn('CCBStorage.set failed for', key, e);
      return false;
    }
  },

  // ---- Profile ----
  getProfile(){ return this.get(CCB_KEYS.profile, {}); },
  setProfile(profile){ return this.set(CCB_KEYS.profile, profile); },

  // ---- Skills ----
  getSkills(){ return this.get(CCB_KEYS.skills, []); },
  setSkills(skills){ return this.set(CCB_KEYS.skills, skills); },

  // ---- Projects ----
  getProjects(){ return this.get(CCB_KEYS.projects, []); },
  setProjects(list){ return this.set(CCB_KEYS.projects, list); },

  // ---- Certifications ----
  getCertifications(){ return this.get(CCB_KEYS.certifications, []); },
  setCertifications(list){ return this.set(CCB_KEYS.certifications, list); },

  // ---- Internships ----
  getInternships(){ return this.get(CCB_KEYS.internships, []); },
  setInternships(list){ return this.set(CCB_KEYS.internships, list); },

  // ---- Saved Jobs ----
  getSavedJobs(){ return this.get(CCB_KEYS.savedJobs, []); },
  setSavedJobs(list){ return this.set(CCB_KEYS.savedJobs, list); },
  isJobSaved(jobId){
    const list = this.getSavedJobs();
    return list.some(j => String(j.id) === String(jobId));
  },
  toggleSavedJob(job){
    const list = this.getSavedJobs();
    const idx = list.findIndex(j => String(j.id) === String(job.id));
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(job);
    }
    this.setSavedJobs(list);
    return idx === -1; // true if now saved
  },

  // ---- Reviews ----
  getReviews(){
    const existing = this.get(CCB_KEYS.reviews, null);
    if(existing !== null) return existing;
    // seed with example student reviews with realistic avatars
    const seed = [
      { name: 'Aarav Sharma', avatar: 'images/avatar-1.png', rating: 5, text: 'Campus Career Hub helped me discover incredible software engineering internships! Super intuitive UI.', date: new Date().toISOString() },
      { name: 'Rahul Patel', avatar: 'images/avatar-2.png', rating: 5, text: 'Building my career profile and linking my projects in one place made campus placement prep a breeze.', date: new Date().toISOString() },
      { name: 'Priya Verma', avatar: 'images/avatar-3.png', rating: 4, text: 'Love the real-time filter search for tech jobs. Kept everything organised for my applications.', date: new Date().toISOString() }
    ];
    this.set(CCB_KEYS.reviews, seed);
    return seed;
  },
  addReview(review){
    const list = this.getReviews();
    list.unshift(review);
    this.set(CCB_KEYS.reviews, list);
    return list;
  }
};
