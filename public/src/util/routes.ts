export const routePatterns = {
    TOPIC_EDIT: '/topics/:topicId(\\d+)/edit',
    TASKS_LIST: '/topics/:topicId(\\d+)/tasks',
    TASK: '/topics/:topicId(\\d+)/tasks/:taskId(\\d+)',
    TASK_NEW: '/topics/:topicId(\\d+)/tasks/new',
    TASK_EDIT: '/topics/:topicId(\\d+)/:taskId(\\d+)/edit',
    USER_EDIT: '/users/:userId(\\d+)/edit',
    USER_STATISTICS: '/users/:userId(\\d+)/statistics',
    SOLUTION_EVALUATION:'/users/:userId(\\d+)/statistics/task/:taskId(\\d+)'
};

export const routes = {
    HOME: '/',
    LOGIN: '/login',
    PROFILE: '/profile',
    TOPICS_LIST: '/topics',
    TOPIC_NEW: '/topics/new',
    TOPIC_EDIT: (topicId: number) => `/topics/${topicId}/edit`,
    TASKS_LIST: (topicId: number) => `/topics/${topicId}/tasks`,
    TASK: (topicId: number, taskId: number) => `/topics/${topicId}/tasks/${taskId}`,
    TASK_NEW: (topicId: number) => `/topics/${topicId}/tasks/new`,
    TASK_EDIT: (topicId: number, taskId: number) => `/topics/${topicId}/tasks/${taskId}/edit`,
    USERS_LIST: '/users',
    USER_NEW: '/users/new',
    USER_EDIT: (userId: number) => `/users/${userId}/edit`,
    USER_STATISTICS: (userId: number) => `/users/${userId}/statistics`,
    SOLUTION_EVALUATION: (userId: number, taskId: number) => `/users/${userId}/statistics/task/${taskId}`,
    MY_STATISTICS: '/statistics',
    HELP: '/help',
    HELP_ELEMENTS: '/help/elements',
    HELP_SCHEME: '/help/scheme',
    HELP_LINKS: '/help/links',
    HELP_TREE: '/help/tree',
    HELP_ABOUT: '/help/about',
    LOGOUT: '/logout'
};