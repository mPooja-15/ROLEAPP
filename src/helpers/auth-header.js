import { authenticationService } from '../services';

export function authHeader() {
    const currentUser = authenticationService.currentUserValue;
    return currentUser && currentUser.token ? { Authorization: `Bearer ${currentUser.token}` } : {};
}
