document.getElementById('ageForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const d = parseInt(document.getElementById('day').value);
  const m = parseInt(document.getElementById('month').value) - 1;
  const y = parseInt(document.getElementById('year').value);
  
  const birthDate = new Date(y, m, d);
  const now = new Date();
  
  // Basic Logic
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Animate the results
  animateValue(document.getElementById('years'), years, 1000);
  animateValue(document.getElementById('months'), months, 1000);
  animateValue(document.getElementById('days'), days, 1000);
});

function animateValue(el, target, duration) {
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}