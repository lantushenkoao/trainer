import * as React from 'react';
import './EvaluationPage.scss';
import Task from '../../../../types/Task';
import User from '../../../../types/User';
import AbortingRequestTracker from '../../../../util/abortingRequestTracker';
import * as api from '../../../../util/api';
import { getTaskWithStudentSolution } from '../../../../util/api';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { routes } from '../../../../util/routes';
import ContentLayout from '../../../../components/ContentLayout/ContentLayout';
import * as _ from 'lodash';
import { goTo } from '../../../../util/history';
import { toast } from 'react-toastify';
import { MARK_MAX_VALUE } from '../../../../util/constants';
import MxGraphEditor from "../../../../components/MxGraphEditor/MxGraphEditor";


interface EvaluationPageState {
    task: Task | null;
    user: User | null;
}

interface EvaluationPageProps {
    userId: number;
    taskId: number;
}

const MARK_EMPTY = 'Выберите оценку';

class EvaluationPage extends React.Component<EvaluationPageProps, EvaluationPageState> {

    requestTracker: AbortingRequestTracker;

    constructor(props: EvaluationPageProps) {
        super(props);
        this.state = {
            task: null,
            user: null
        };
        this.requestTracker = new AbortingRequestTracker();
    }

    componentDidMount() {
        this.loadTask();
        this.loadUser();
    }

    componentWillUnmount() {
        this.requestTracker.cancelAll();
    }

    loadTask() {
        this.requestTracker.add(getTaskWithStudentSolution(this.props.taskId as number, this.props.userId))
            .then((task) => {
                if (task.manualEvaluation) {
                    this.setState({task});
                } else {
                    toast('Это решение нельзя просмотреть, т.к. оно оценивается в автоматическом режиме',
                        {type: toast.TYPE.SUCCESS});
                }
            });
    }

    loadUser() {
        this.requestTracker.add(api.getUser(this.props.userId))
            .then(user => this.setState({user}));
    }

    onChangeMark(mark: string) {
        const markAsNumber = Number(mark);

        this.setState(prevState => {
            const task = prevState.task as Task;
            return {
                ...prevState,
                task: {
                    ...task,
                    solutions: [{
                        ...task.solutions[0],
                        mark: _.isNumber(markAsNumber) ? markAsNumber : null
                    }]
                }
            };
        });
    }

    onSave() {
        const solution = (this.state.task as Task).solutions[0];
        const request = api.evaluateSolution(solution.id as number, solution.mark as number);
        this.requestTracker.add(request)
            .then(() => {
                toast('Оценка сохранена', {type: toast.TYPE.SUCCESS});
                goTo(routes.USER_STATISTICS(this.props.userId));
            });
    }

    getLeftBarContent() {
        return (
            <div className="content" styleName="left-bar">
                <h1>
                    {this.state.user && this.state.task
                        ? `Решение пользователя ${this.state.user.name} для задания №${this.state.task.index} ${this.state.task.name}`
                        : 'Загрузка...'}
                </h1>
                {this.state.task &&
                    <div styleName="left-bar__bottom-menu">
                        <label htmlFor="mark">Оценка:</label>
                        <select className="input"
                                id="mark"
                                value={this.state.task.solutions[0].mark as number || MARK_EMPTY}
                                onChange={e => this.onChangeMark(e.target.value)}>
                            <option>{MARK_EMPTY}</option>
                            {Array.from({length: MARK_MAX_VALUE}, (x, i) => i).map(key => (
                                <option key={key + 1}>{key + 1}</option>
                            ))}
                        </select>
                        <button className="button" onClick={() => this.onSave()}>Сохранить</button>
                    </div>
                }
            </div>
        );
    }

    render() {
        return (
            <ContentLayout leftBarContent={this.getLeftBarContent()}
                           leftBarNoPadding={true}
                           contentNoPadding={true}
                           scrollableContent={false}>
                <BreadcrumbsItem to={routes.SOLUTION_EVALUATION(this.props.userId, this.props.taskId)}>
                    Решение задания
                </BreadcrumbsItem>

                <div styleName="content">
                    <div styleName="content__schema">
                        <MxGraphEditor
                            readOnly
                            serializedModel={_.get(this.state.task, 'solutions[0].data', '')}
                        />
                    </div>

                    <div styleName="content__description">
                        {this.state.task &&
                            <div className="scrollbar-wrapper"
                                 dangerouslySetInnerHTML={{__html: this.state.task.description}}/>
                        }
                    </div>
                </div>
            </ContentLayout>
        );
    }
}

export default EvaluationPage;
