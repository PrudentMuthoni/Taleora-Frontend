// Runs before the first paint so the page never flashes the wrong theme.
export const themeScript = `(function(){try{var t=localStorage.getItem('taleora-theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;
