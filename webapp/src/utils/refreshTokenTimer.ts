import apiService from '../services/api.service.ts'

export default function startRefreshTimer() {
    const refreshInterval = 0.4 * 60 * 1000; // 14 minutes (access token expiry time - 1 minute buffer)
    const timer = setTimeout(() => {
        apiService.refreshToken();
    }, refreshInterval);
    return timer;
};