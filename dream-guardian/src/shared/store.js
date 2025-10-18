// Simple local store for users, onimojis, community, atlas maturation, and notifications
// Backed by localStorage for this prototype. All functions are pure and defensive.

const KEYS = {
  user: 'og_user_v1',
  onimojis: 'og_onimojis_v1', // array of {id, ownerId, emojis:string, title, contributors:Array<userId>, matured:boolean, shares:number}
  community: 'og_community_v1', // array of {id, onimojiId, userId, text, ts}
  notifications: 'og_notifications_v1', // array of {id, ts, type, payload}
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write issues (quota/permissions)
  }
}

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

// User
export function getCurrentUser() {
  const u = read(KEYS.user, null);
  if (u && u.id) return u;
  const created = { id: uid('user'), name: 'Voyageur', handle: 'voyageur' };
  write(KEYS.user, created);
  return created;
}

export function setCurrentUser(user) {
  if (!user || !user.id) return;
  write(KEYS.user, user);
}

// Onimojis
export function listOnimojis() {
  return read(KEYS.onimojis, []);
}

export function saveOnimojis(items) {
  write(KEYS.onimojis, items);
}

export function upsertOnimoji({ ownerId, emojis, title }) {
  const trimmed = (emojis || '').trim();
  if (!ownerId || !trimmed) return null;
  const items = listOnimojis();
  const existing = items.find((i) => i.ownerId === ownerId && i.emojis === trimmed);
  if (existing) {
    if (title && !existing.title) existing.title = title;
    saveOnimojis(items);
    return existing;
  }
  const item = {
    id: uid('oni'),
    ownerId,
    emojis: trimmed,
    title: title || '',
    contributors: [],
    matured: false,
    shares: 0,
  };
  items.push(item);
  saveOnimojis(items);
  return item;
}

export function addContributor(onimojiId, userId) {
  const items = listOnimojis();
  const it = items.find((i) => i.id === onimojiId);
  if (!it) return null;
  if (!it.contributors.includes(userId)) it.contributors.push(userId);
  saveOnimojis(items);
  return it;
}

export function incrementShare(onimojiId) {
  const items = listOnimojis();
  const it = items.find((i) => i.id === onimojiId);
  if (!it) return null;
  it.shares += 1;
  // maturation rule: 3+ unique contributors and 3+ shares
  const uniqueContribs = new Set(it.contributors);
  if (!it.matured && uniqueContribs.size >= 3 && it.shares >= 3) {
    it.matured = true;
    notify({ type: 'atlas:matured', payload: { onimojiId } });
  }
  saveOnimojis(items);
  return it;
}

// Community echoes
export function listCommunity() {
  return read(KEYS.community, []);
}

export function addCommunityEcho({ onimojiId, userId, text }) {
  const items = listCommunity();
  const entry = { id: uid('echo'), onimojiId, userId, text: (text || '').trim(), ts: Date.now() };
  items.push(entry);
  write(KEYS.community, items);
  if (onimojiId && userId) addContributor(onimojiId, userId);
  return entry;
}

// Notifications
export function listNotifications() {
  return read(KEYS.notifications, []);
}

export function notify({ type, payload }) {
  const items = listNotifications();
  items.push({ id: uid('ntf'), ts: Date.now(), type, payload });
  write(KEYS.notifications, items);
}

export function clearNotifications(predicate) {
  if (!predicate) {
    write(KEYS.notifications, []);
    return;
  }
  const items = listNotifications();
  write(KEYS.notifications, items.filter((n) => !predicate(n)));
}

// Helpers
export function generateDreamTitle({ emojis, guideLabel }) {
  const e = (emojis || '').split(/\s+/).filter(Boolean);
  const base = guideLabel ? `${guideLabel}` : 'Rêve';
  if (e.length === 3) return `${base} — ${e[0]} ${e[1]} ${e[2]}`;
  if (e.length > 0) return `${base} — ${e.slice(0, 3).join(' ')}`;
  return `${base} — Écho de la nuit`;
}

export function getMyAtlas(userId) {
  const items = listOnimojis().filter((i) => i.ownerId === userId);
  return items;
}

export function getMyDreamteam(userId) {
  const mine = getMyAtlas(userId);
  const ids = new Set();
  for (const oni of mine) {
    for (const c of oni.contributors) ids.add(c);
  }
  return Array.from(ids);
}
