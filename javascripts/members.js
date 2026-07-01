function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function profileLinks(github, socials) {
  const links = [
    { key: "Github", url: `https://github.com/${github}` },
    ...Object.entries(socials || {}).map(([k, url]) => ({ key: titleCase(k), url }))
  ];
  return links
    .map(({ key, url }) => `
      <div class="profile-link">
        <span class="profile-link-key">${key}</span>
        <span class="profile-link-sep"> : </span>
        <a href="${url}" target="_blank" class="profile-link-url">${url}</a>
      </div>`)
    .join("");
}

async function loadMembers() {
  // __md_scope is set by MkDocs Material to the site root on every page
  const base = window.__md_scope?.href || (window.location.origin + "/");
  const url = new URL("data/members.json", base).href;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load members.json: ${res.status} ${res.statusText}`);
  return res.json();
}

function githubAvatar(username) {
  return `https://github.com/${username}.png?size=200`;
}

async function renderMemberGrid() {
  const grid = document.getElementById("members-grid");
  if (!grid) return;
  const members = await loadMembers();
  grid.innerHTML = members.map(m => `
    <div class="member-card">
      <a class="member-card-link" href="${m.id}/">
        <img src="${githubAvatar(m.github)}" class="member-avatar" alt="${m.name}">
        <div class="member-name">${m.name}</div>
      </a>
    </div>
  `).join("");
}

async function renderMemberHeader() {
  const header = document.getElementById("member-header");
  if (!header) return;
  const id = header.dataset.memberId;
  if (!id) return; // guard: missing or empty data-member-id attribute
  const members = await loadMembers();
  const m = members.find(x => x.id === id);
  if (!m) return;
  header.innerHTML = `
    <img src="${githubAvatar(m.github)}" class="member-avatar-large" alt="${m.name}">
    <span class="member-name-large">${m.name}</span>
    <div class="member-links">${profileLinks(m.github, m.socials)}</div>
  `;
}

function initMembers() {
  renderMemberGrid().catch(err => console.error("[members] grid error:", err));
  renderMemberHeader().catch(err => console.error("[members] header error:", err));
}

document.addEventListener("DOMContentLoaded", initMembers);
// re-run on instant-navigation (Material's SPA-style nav swaps content without full reload)
document$?.subscribe?.(initMembers);
