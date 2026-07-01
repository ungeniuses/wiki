const SOCIAL_ICONS = {
  twitter: "𝕏",
  discord: "💬",
  website: "🔗",
  linkedin: "in",
  youtube: "▶"
};

async function loadMembers() {
  const base = document.querySelector("base")?.href || window.location.origin + "/";
  const res = await fetch(base + "data/members.json");
  return res.json();
}

function githubAvatar(username) {
  return `https://github.com/${username}.png?size=200`;
}

function socialLinks(socials) {
  return Object.entries(socials || {})
    .map(([key, url]) => `<a href="${url}" class="social-icon" title="${key}" target="_blank">${SOCIAL_ICONS[key] || key}</a>`)
    .join("");
}

async function renderMemberGrid() {
  const grid = document.getElementById("members-grid");
  if (!grid) return;
  const members = await loadMembers();
  grid.innerHTML = members.map(m => `
    <a class="member-card" href="../${m.id}/">
      <img src="${githubAvatar(m.github)}" class="member-avatar" alt="${m.name}">
      <div class="member-name">${m.name}</div>
      <div class="member-socials">${socialLinks(m.socials)}</div>
    </a>
  `).join("");
}

async function renderMemberHeader() {
  const header = document.getElementById("member-header");
  if (!header) return;
  const id = header.dataset.memberId;
  const members = await loadMembers();
  const m = members.find(x => x.id === id);
  if (!m) return;
  header.innerHTML = `
    <img src="${githubAvatar(m.github)}" class="member-avatar-large" alt="${m.name}">
    <h1>${m.name}</h1>
    <a href="https://github.com/${m.github}" target="_blank" class="github-link">@${m.github}</a>
    <div class="member-socials">${socialLinks(m.socials)}</div>
  `;
}

function initMembers() {
  renderMemberGrid();
  renderMemberHeader();
}

document.addEventListener("DOMContentLoaded", initMembers);
// re-run on instant-navigation (Material's SPA-style nav swaps content without full reload)
document$?.subscribe?.(initMembers);
