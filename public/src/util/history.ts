import { createBrowserHistory } from 'history';

class History {
    constructor(public history = createBrowserHistory()) {}
}

let instance = new History;

export const goTo = (url: string) => instance.history.push(url);

export default instance.history;