import { WifiNetwork } from '../hooks/useWifiNetworks';

const NETWORKS_KEY = 'wifi_manager_networks';
const USERS_KEY = 'wifi_manager_users';
const SESSION_KEY = 'wifi_manager_session';

export interface LocalUser {
    id: string;
    email: string;
    password?: string;
}

export const storage = {
    // Networks
    getNetworks: (userId: string): WifiNetwork[] => {
        const data = localStorage.getItem(NETWORKS_KEY);
        if (!data) return [];
        const allNetworks: (WifiNetwork & { user_id: string })[] = JSON.parse(data);
        return allNetworks.filter(n => n.user_id === userId);
    },

    saveNetworks: (networks: (WifiNetwork & { user_id: string })[]) => {
        localStorage.setItem(NETWORKS_KEY, JSON.stringify(networks));
    },

    addNetwork: (userId: string, network: WifiNetwork) => {
        const data = localStorage.getItem(NETWORKS_KEY);
        const allNetworks = data ? JSON.parse(data) : [];
        allNetworks.push({ ...network, user_id: userId });
        localStorage.setItem(NETWORKS_KEY, JSON.stringify(allNetworks));
    },

    updateNetwork: (userId: string, id: string, updates: Partial<WifiNetwork>) => {
        const data = localStorage.getItem(NETWORKS_KEY);
        if (!data) return;
        let allNetworks: (WifiNetwork & { user_id: string })[] = JSON.parse(data);
        allNetworks = allNetworks.map(n =>
            (n.id === id && n.user_id === userId) ? { ...n, ...updates, updated_at: new Date().toISOString() } : n
        );
        localStorage.setItem(NETWORKS_KEY, JSON.stringify(allNetworks));
    },

    deleteNetwork: (userId: string, id: string) => {
        const data = localStorage.getItem(NETWORKS_KEY);
        if (!data) return;
        let allNetworks: (WifiNetwork & { user_id: string })[] = JSON.parse(data);
        allNetworks = allNetworks.filter(n => !(n.id === id && n.user_id === userId));
        localStorage.setItem(NETWORKS_KEY, JSON.stringify(allNetworks));
    },

    // Users
    getUsers: (): LocalUser[] => {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveUser: (user: LocalUser) => {
        const users = storage.getUsers();
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    // Session
    getSession: (): LocalUser | null => {
        const data = localStorage.getItem(SESSION_KEY);
        return data ? JSON.parse(data) : null;
    },

    setSession: (user: LocalUser | null) => {
        if (user) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    }
};
