import { authenticationService } from '../services';

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const isUnauthorizedOrForbidden = [401, 403].includes(response.status);
            if (isUnauthorizedOrForbidden) {
                authenticationService.logout();
                window.location.reload(true);
            }
            const error = data && data.message || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
