const KEY = 'panic-guardian-v1';

const defaults = {
  contacts: [
    { name: 'Emergency contact', phone: '', note: 'Primary' },
  ],
  countdownSec: 15,
  fallDetect: true,
  includeEmergencyServicesConfirm: true,
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaults);
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaults);
  }
}

export function saveSettings(settings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
