import { Request } from './api';

export default class AbortingRequestTracker {

    requests: Request<any>[] = [];

    add<T>(request: Request<T>): Promise<T>  {
        this.requests.push(request);
        return request.promise
    }

    cancelAll() {
        this.requests.forEach(request => request.cancel());
    }
}
