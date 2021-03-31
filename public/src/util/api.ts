import axios from 'axios';
import ErrorResponseData from '../types/ErrorResponse';
import * as _ from 'lodash';
import { toast } from 'react-toastify';
import CreateOrUpdateUser from '../types/EditUser';
import { clearSession, Session } from './session';
import User from '../types/User';
import Topic from '../types/Topic';
import Task from '../types/Task';
import Solution from '../types/Solution';
import { NodePaletteValue } from '../routes/schema/NodePaletteValue';
import { LinkPaletteValue } from '../routes/schema/LinkPaletteValue';
import TopicStatistics from '../types/TopicStatistics';
import TopicDto from '../types/TopicDto';

const USER_API_URL = '/api/user/';
const TOPIC_API_URL = '/api/topic/';
const TASK_API_URL = '/api/task/';
const SOLUTION_API_URL = '/api/solution/';

const GET = 'get';
const LIST = 'list';
const CREATE = 'create';
const UPDATE = 'update';
const DELETE = 'delete';
const STATISTICS = 'statistics';

const DEFAULT_ERROR_MESSAGE = 'Произошла ошибка.\nОбратитесь к администратору:\ninfo@mt-sevastopol.ru';


export const getSession = () => api<Session>(USER_API_URL + 'getSession', 'GET');

export const login = (username: string, password: string) => api<Session>('/login', 'POST', {username, password});

export const logout = () => api('/logout', 'GET');


export const getUser = (id: number) => api<User>(USER_API_URL + GET, 'GET', {id});

export const listUsers = () => api<User[]>(USER_API_URL + LIST, 'GET');

export const getUserStatistics = (id: number) => api<TopicStatistics[]>(USER_API_URL + STATISTICS, 'GET', {id});

export const createUser = (user: CreateOrUpdateUser) => api<User>(USER_API_URL + CREATE, 'POST', {...user});

export const updateUser = (user: CreateOrUpdateUser) => api<User>(USER_API_URL + UPDATE, 'POST', {...user});

export const deleteUser = (id: number) => api(USER_API_URL + DELETE, 'POST', {id});


export const getTopic = (id: number) => api<TopicDto>(TOPIC_API_URL + GET, 'GET', {id});

export const getTopicStatistics = (id: number) => api<TopicStatistics>(TOPIC_API_URL + STATISTICS, 'GET', {id});

export const listTopics = () => api<TopicDto[]>(TOPIC_API_URL + LIST, 'GET');

export const createTopic = (topic: Topic) => api<User>(TOPIC_API_URL + CREATE, 'POST', {...topic});

export const updateTopic = (topic: Topic) => api<User>(TOPIC_API_URL + UPDATE, 'POST', {...topic});

export const deleteTopic = (id: number) => api(TOPIC_API_URL + DELETE, 'POST', {id});


export const getTask = (id: number) => api<Task>(TASK_API_URL + GET, 'GET', {id});

export const getTaskWithStudentSolution = (taskId: number, studentId: number) =>
    api<Task>(TASK_API_URL + 'getWithStudentSolution', 'GET', {taskId, studentId});

export const getNextIndex = (topicId: number) => api<number>(TASK_API_URL + 'getNextIndex', 'GET', {topicId});

export const listTasks = (topicId: number) => api<Task[]>(TASK_API_URL + LIST, 'GET');

export const getInitialNodes = (id: number) =>
    api<{nodes: NodePaletteValue[], links: LinkPaletteValue[]}>(TASK_API_URL + 'getInitialNodes', 'GET', {id});

export const createTask = (task: Task) => api<User>(TASK_API_URL + CREATE, 'POST', {...task});

export const updateTask = (task: Task) => api<User>(TASK_API_URL + UPDATE, 'POST', {...task});

export const deleteTask = (id: number) => api(TASK_API_URL + DELETE, 'POST', {id});


export const createSolution = (solution: Solution) => api<Solution>(SOLUTION_API_URL + CREATE, 'POST', {...solution});

export const updateSolution = (solution: Solution) => api<Solution>(SOLUTION_API_URL + UPDATE, 'POST', {...solution});

export const deleteSolution = (id: number) => api(SOLUTION_API_URL + DELETE, 'POST', {id});

export const evaluateSolution = (solutionId: number, mark: number | null) =>
    api(SOLUTION_API_URL + 'evaluate', 'POST', {solutionId, mark});


function api<T>(url: string, method: 'GET' | 'POST', data?: object):Request<T> {
    const source = axios.CancelToken.source();
    const promise = new Promise<T>((resolve, reject) =>
        axios({
            url: url,
            method: method,
            data: {
                ...method === 'POST' ? data : {}
            },
            params: {
                ...method === 'GET' ? data : {}
            },
            cancelToken: source.token
        }).then(response =>
            resolve(response.data as T)
        ).catch(({response}) => {
            if (response) {
                if (response.status === 401 || response.status == 302) {
                    clearSession();
                }
                response.data && showErrorNotification(response.data);
            }
            reject(response);
        })
    );
    return {
        promise,
        cancel: source.cancel
    }
}

export interface Request<T> {
    promise: Promise<T>;
    cancel: (message?: string) => void
}

const showErrorNotification = (responseData?: ErrorResponseData | any) => {
    let message = '';
    if (responseData) {
        const errors = responseData.errors;
        const fieldErrors = responseData.fieldErrors;

        if (!_.isEmpty(errors)) {
            message = errors.join('\n');
        }
        if (!_.isEmpty(fieldErrors)) {
            message += _.keys(fieldErrors)
                .map(field => field + ': ' + fieldErrors[field].join('. '))
                .join('\n');
        }
    }
    toast(!_.isEmpty(message) ? message : DEFAULT_ERROR_MESSAGE, {type: toast.TYPE.ERROR, autoClose: false});
};