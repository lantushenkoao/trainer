import axios from 'axios';
import * as _ from 'lodash';
import User from '../types/User';

export const SESSION_LOCAL_STORAGE_KEY = 'trainerSession';

export interface Session {
    currentUser: User | null;
    csrfToken: string | null;
}

export const saveSessionToLocalStorage = (session: Session) => {
    setDefaultCsrfHeader(session.csrfToken as string);
    localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(session));
    const storageEvent = new StorageEvent('storage', {key: SESSION_LOCAL_STORAGE_KEY, url: window.location.href});
    window.dispatchEvent(storageEvent);
    return session;
};

export const setDefaultCsrfHeader = (csrfToken: string | null) => {
    Object.assign(axios.defaults, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
};

export const clearSession = () => {
    saveSessionToLocalStorage({
        currentUser: null,
        csrfToken: null
    })
};