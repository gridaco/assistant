///
/// Onboarding data shall be stored on local storage. the onboarding proc is required once per install. (unlike filekey setup)
///

const _key = "assistant-live-onboarding-proc-done";

export function needToShowOnboarding(): boolean {
  const shown = localStorage.getItem(_key) === "true";
  return !shown;
}

export function setOnboardingShown(): void {
  window.localStorage.setItem(_key, "true");
}
