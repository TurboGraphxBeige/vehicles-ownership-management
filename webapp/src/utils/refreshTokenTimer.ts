import apiService from '../services/api.service.ts'

export default function startRefreshTimer() {
    const refreshInterval = 0.5 * 60 * 1000;
    const timer = setTimeout(() => {
        apiService.refreshToken();
    }, refreshInterval);
    return timer;
};