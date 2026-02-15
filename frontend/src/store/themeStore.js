import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'light',

    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'forest' : 'light';
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        return { theme: newTheme };
    }),

    initializeTheme: () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        set({ theme: savedTheme });
    }
}));
