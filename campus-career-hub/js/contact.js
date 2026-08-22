/* ===========================================================
   Campus Career Hub — Contact & Feedback page logic
   =========================================================== */

document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ============================ CONTACT FORM ============================ */
const contactForm = document.getElementById('contactForm');
const cName = document.getElementById('cName');
const cEmail = document.getElementById('cEmail');
const cSubject = document.getElementById('cSubject');
const cMessage = document.getElementById('cMessage');

function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFieldValidity(input, valid){
  input.classList.toggle('is-invalid', !valid);
  input.classList.toggle('is-valid', valid);
}

function validateContactForm(){
  let valid = true;

  const nameOk = cName.value.trim().length > 0;
  setFieldValidity(cName, nameOk);
  if (!nameOk) valid = false;

  const emailOk = isValidEmail(cEmail.value.trim());
  setFieldValidity(cEmail, emailOk);
  if (!emailOk) valid = false;

  const subjectOk = cSubject.value.trim().length > 0;
  setFieldValidity(cSubject, subjectOk);
  if (!subjectOk) valid = false;

  const messageOk = cMessage.value.trim().length >= 20;
  setFieldValidity(cMessage, messageOk);
  if (!messageOk) valid = false;

  return valid;
}

[cName, cEmail, cSubject, cMessage].forEach(input => {
  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')){
      validateContactForm();
    }
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const successBox = document.getElementById('contactSuccess');
  successBox.classList.add('d-none');

  if (!validateContactForm()) return;

  // No backend in this project — simply acknowledge the message.
  successBox.classList.remove('d-none');
  contactForm.reset();
  [cName, cEmail, cSubject, cMessage].forEach(i => {
    i.classList.remove('is-valid', 'is-invalid');
  });

  setTimeout(() => successBox.classList.add('d-none'), 5000);
});

/* ============================ STAR RATING ============================ */
const stars = document.querySelectorAll('#starRating .star');
const ratingInput = document.getElementById('ratingValue');

function paintStars(value){
  stars.forEach(star => {
    const starValue = Number(star.dataset.value);
    star.classList.toggle('filled', starValue <= value);
    star.setAttribute('aria-checked', starValue === value ? 'true' : 'false');
  });
}

stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = Number(star.dataset.value);
    ratingInput.value = value;
    paintStars(value);
    document.getElementById('ratingFeedback').style.display = 'none';
  });
  star.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      star.click();
    }
  });
  star.addEventListener('mouseenter', () => paintStars(Number(star.dataset.value)));
});
document.getElementById('starRating').addEventListener('mouseleave', () => {
  paintStars(Number(ratingInput.value));
});

/* ============================ REVIEW FORM ============================ */
const reviewForm = document.getElementById('reviewForm');
const rName = document.getElementById('rName');
const rText = document.getElementById('rText');

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const successBox = document.getElementById('reviewSuccess');
  successBox.classList.add('d-none');

  let valid = true;

  const rating = Number(ratingInput.value);
  const ratingOk = rating >= 1 && rating <= 5;
  document.getElementById('ratingFeedback').style.display = ratingOk ? 'none' : 'block';
  if (!ratingOk) valid = false;

  const nameOk = rName.value.trim().length > 0;
  setFieldValidity(rName, nameOk);
  if (!nameOk) valid = false;

  const textOk = rText.value.trim().length >= 10;
  setFieldValidity(rText, textOk);
  if (!textOk) valid = false;

  if (!valid) return;

  CCBStorage.addReview({
    name: rName.value.trim(),
    rating,
    text: rText.value.trim(),
    date: new Date().toISOString()
  });

  successBox.classList.remove('d-none');
  reviewForm.reset();
  paintStars(0);
  ratingInput.value = 0;
  [rName, rText].forEach(i => i.classList.remove('is-valid', 'is-invalid'));

  setTimeout(() => successBox.classList.add('d-none'), 5000);
});
