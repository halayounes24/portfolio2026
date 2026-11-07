/**
 * Colour themes. To add one:
 *   1. add a `[data-theme="<id>"] { … }` block in public/styles.css
 *   2. add an entry below (swatch = the colour shown in the header circle)
 */
export interface Theme {
  id: string;
  label: string;
  swatch: string;
}

export const themes: Theme[] = [
  { id: "light", label: "Light", swatch: "#f6f4ef" },
  { id: "dark", label: "Dark", swatch: "#121212" },
];

const STORAGE_KEY = "theme";
const root = document.documentElement;

/** The theme in effect: the saved choice, or the device's light/dark setting. */
function currentTheme(): string {
  return (
    root.dataset.theme ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
}

function applyTheme(id: string): void {
  root.dataset.theme = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* storage unavailable (private mode etc.) — choice lasts for this page only */
  }
}

function mountThemeSwitch(container: HTMLElement): void {
  const buttons = themes.map((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-switch__option";
    button.style.setProperty("--swatch", theme.swatch);
    button.setAttribute("aria-label", `${theme.label} theme`);
    button.title = theme.label;
    button.dataset.themeId = theme.id;
    return button;
  });

  const sync = () => {
    const active = currentTheme();
    for (const b of buttons) b.setAttribute("aria-pressed", String(b.dataset.themeId === active));
  };

  container.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>(".theme-switch__option");
    if (!button?.dataset.themeId) return;
    applyTheme(button.dataset.themeId);
    sync();
  });

  // Keep the active circle right if the device setting changes and nothing is saved.
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", sync);

  container.replaceChildren(...buttons);
  sync();
}

const container = document.querySelector<HTMLElement>("#theme-switch");
if (container) mountThemeSwitch(container);
