import User from '../types/User';
import * as _ from 'lodash';
import { Role } from '../types/Role';

export function isAdmin(user: User | null) {
    return hasRole(user, 'ADMIN');
}

export function isMethodist(user: User | null) {
    return hasRole(user, 'METHODIST');
}

export function isStudent(user: User | null) {
    return hasRole(user, 'STUDENT');
}

export function hasRole(user: User | null, role: Role) {
    return user != null && _.includes(user.roles, role);
}

export function hasOneOfRoles(user: User | null, roles: Role[]) {
    const value = user != null ? _.intersection(user.roles, roles) : null;
    return user != null && !_.isEmpty(value);
}

export const roleNames = {
    ADMIN: 'Администратор',
    METHODIST: 'Методист',
    STUDENT: 'Студент'
};