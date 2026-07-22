export const CMS_UPDATE_KEY = 'cbg-cms-last-updated';

export const signalCmsUpdated = () => {
  try {
    localStorage.setItem(CMS_UPDATE_KEY, String(Date.now()));
  } catch {
    // Ignore storage failures; this is only a best-effort sync signal.
  }
};
