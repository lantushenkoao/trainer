import * as React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { routePatterns, routes } from '../../util/routes';
import TaskPage from './task/TaskPage';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import ContentLayout from '../../components/ContentLayout/ContentLayout';
import User from '../../types/User';
import { CurrentUserContext } from '../../App';
import * as api from '../../util/api';
import { isStudent } from '../../util/roleUtils';
import AbortingRequestTracker from '../../util/abortingRequestTracker';
import { toast } from 'react-toastify';
import { RouteComponentProps } from 'react-router';
import StudentTaskPage from './task/StudentTaskPage';
import { goTo } from '../../util/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { TASK_COMPLETION_MIN_MARK } from '../../util/constants';
import TopicStatistics from '../../types/TopicStatistics';
import TaskStatistics from '../../types/TaskStatistics';
import './TaskListPage.scss';

library.add(faHourglassHalf);

interface TaskLisPageState {
    topic: TopicStatistics | null;
}

interface TaskListPageHOCProps {
    topicId: number;
}

interface TaskListPageProps extends TaskListPageHOCProps {
    currentUser: User;
}

class TaskListPage extends React.Component<TaskListPageProps, TaskLisPageState> {

    requestTracker: AbortingRequestTracker;

    constructor(props: TaskListPageProps) {
        super(props);
        this.state = {
            topic: null
        };
        this.requestTracker = new AbortingRequestTracker();
    }

    isStudent() {
        return isStudent(this.props.currentUser);
    }

    componentDidMount() {
        this.loadTopic();
    }

    componentWillUnmount() {
        this.requestTracker.cancelAll();
    }

    loadTopic() {
        this.requestTracker.add(api.getTopicStatistics(this.props.topicId))
            .then(topic => this.setState({topic}));
    }

    getPageTitle() {
        return `Список заданий по теме${this.state.topic
            ? ` №${this.state.topic.index} "${this.state.topic.name}"`
            : ''}`
    }

    deleteTask(task: TaskStatistics) {
        confirm(`Внимание!\nПосле подтверждения, это действие отменить нельзя.\nУдалить задание "${task.name}"?`) &&
        this.requestTracker.add(api.deleteTask(task.id as number))
            .then(() => {
                toast("Задание удалено", {type: toast.TYPE.SUCCESS});
                this.loadTopic();
            })
    }

    getTaskButtonMessage(task: TaskStatistics, canSolve: boolean){
        if(task.hasSolution && task.mark && task.mark > TASK_COMPLETION_MIN_MARK){
            return "Решить заново";
        } else if (task.hasSolution && task.manualEvaluation){
            return "Ожидает проверки преподавателем";
        } else if (!task.hasSolution && canSolve){
            return "Решить";
        }  else {
            return "Недоступно. Решите предыдущие задания";
        }
    }

    canSolveTask(task: TaskStatistics) {
        const topic = this.state.topic as TopicStatistics;
        const prevTask = task.index as number > 1
            ? topic.tasks[task.index as number - 2]
            : null;

        return this.isSolvedSuccessfully(task) || !prevTask || this.isSolvedSuccessfully(prevTask);
    }

    isSolvedSuccessfully(task: TaskStatistics) {
        return task.hasSolution &&
                task.mark !== null &&
                (task.mark as number) >= TASK_COMPLETION_MIN_MARK;
    }

    renderTaskRow(task: TaskStatistics) {
        const topic = this.state.topic as TopicStatistics;
        const markValueClass = this.isSolvedSuccessfully(task)
            ? ''
            : ' tasks-table__cell-mark-value--fail';

        return (
            <tr key={task.id as number}>

                <td styleName="tasks-table__cell-index tasks-table__cell--bottom-border">
                    {task.index}
                </td>

                <td styleName="tasks-table__cell-name tasks-table__cell--bottom-border" title={task.name}>
                    {task.name}
                </td>

                {this.isStudent() &&
                    <td styleName="tasks-table__cell-mark tasks-table__cell--bottom-border">
                        {task.hasSolution
                            ? task.mark !== null
                                ? <span styleName={markValueClass}>{task.mark}</span>
                                : <FontAwesomeIcon icon="hourglass-half" size="lg" title="Ожидает проверки преподавателем"/>
                            : ''}
                    </td>
                }

                <td styleName="tasks-table__cell-buttons">
                    {!this.isStudent() &&
                        <NavLink to={routes.TASK(topic.id as number, task.id as number)}
                                 className="button">
                            Редактировать
                        </NavLink>
                    }
                    {!this.isStudent() &&
                        <button className="button button-delete" onClick={() => this.deleteTask(task)}>
                            Удалить
                        </button>
                    }
                    {this.isStudent() &&
                        <button className="button"
                                styleName="tasks-table__cell-buttons__button-solve"
                                onClick={() => goTo(routes.TASK(topic.id as number, task.id as number))}
                                disabled={!this.canSolveTask(task)}>
                            {this.getTaskButtonMessage(task, this.canSolveTask(task))}
                        </button>
                    }
                </td>
            </tr>
        );
    }



    renderTasks() {
        const topic = this.state.topic as TopicStatistics;

        return (
            <table styleName="tasks-table">
                <thead>
                    <tr>
                        <th styleName="tasks-table__cell-index">№</th>
                        <th styleName="tasks-table__cell-name">Название задания</th>
                        {this.isStudent() &&
                            <th styleName="tasks-table__cell-mark">Оценка</th>
                        }
                        <th styleName="tasks-table__cell-buttons"></th>
                    </tr>
                </thead>
                <tbody>
                    {topic.tasks.map((task) => this.renderTaskRow(task))}
                </tbody>
            </table>
        );
    }

    getPageContent() {
        const topic = this.state.topic as TopicStatistics;
        return (
            <div className="content" styleName="container">
                {!isStudent(this.props.currentUser) &&
                    <NavLink to={routes.TASK_NEW(topic.id as number)}
                             styleName="container__button-new" className="button button-new">
                        Создать новое задание
                    </NavLink>
                }
                {!isStudent(this.props.currentUser) ?
                    <div className="scrollbar-wrapper" styleName="container__table-wrapper">
                        {this.renderTasks()}
                    </div>
                    : this.renderTasks()
                }
            </div>
        );
    }


    render() {
        return (
            <ContentLayout leftBarContent={this.getPageTitle()}>
                {this.state.topic
                    ? this.getPageContent()
                    : <div>Загрузка...</div>
                }
            </ContentLayout>
        );
    }
}

export default (props: TaskListPageHOCProps) => (
    <CurrentUserContext.Consumer>
        {(currentUser: User) => {
            const getTaskPage = (routeProps: RouteComponentProps<any>) => isStudent(currentUser)
                ? <StudentTaskPage {...routeProps.match.params}/>
                : <TaskPage {...routeProps.match.params}/>;
            return (
                <div className="content">
                    <BreadcrumbsItem to={routes.TASKS_LIST(props.topicId)}>Задания</BreadcrumbsItem>
                    <Switch>
                        <Route exact path={routePatterns.TASK}
                               component={(routeProps: RouteComponentProps<any>) => getTaskPage(routeProps)}/>
                        <Route exact path={routePatterns.TASK_NEW}
                               component={(route: any) => <TaskPage topicId={route.match.params.topicId}/>}/>
                        <Route component={() => <TaskListPage {...{currentUser, ...props}}/>}/>
                    </Switch>
                </div>
            );
        }}
    </CurrentUserContext.Consumer>
);