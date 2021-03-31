import * as React from 'react';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';
import User from '../../../types/User';
import { CurrentUserContext } from '../../../App';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { routePatterns, routes } from '../../../util/routes';
import AbortingRequestTracker from '../../../util/abortingRequestTracker';
import { getUser, getUserStatistics } from '../../../util/api';
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { goTo } from '../../../util/history';
import { Route, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import EvaluationPage from './solution/EvaluationPage';
import SecuredRoute from '../../../util/SecuredRoute';
import './StudentStatisticsPage.scss';
import TopicStatistics from '../../../types/TopicStatistics';
import TaskStatistics from '../../../types/TaskStatistics';

library.add(faHourglassHalf);

interface StudentStatisticsPageState {
    topics: TopicStatistics[];
    user: User | null;
}

interface StudentStatisticsPageHOCProps {
    userId: number
}

interface StudentStatisticsPageProps extends StudentStatisticsPageHOCProps {
    currentUser: User;
}

class StudentStatisticsPage extends React.Component<StudentStatisticsPageProps, StudentStatisticsPageState> {

    requestTracker: AbortingRequestTracker;

    constructor(props: StudentStatisticsPageProps) {
        super(props);
        this.state = {
            topics: [],
            user: null
        };
        this.requestTracker = new AbortingRequestTracker();
    }

    componentDidMount() {
        if (this.isMyStatistics()) {
            this.requestTracker.add(getUserStatistics(this.props.currentUser.id))
                .then((topics) => this.setState({
                    topics,
                    user: this.props.currentUser
                }));
        } else {
            this.requestTracker.add(getUser(this.props.userId))
                .then((user) => this.setState({user}));
            this.requestTracker.add(getUserStatistics(this.props.userId))
                .then((topics) => this.setState({topics}))
        }
    }

    componentWillUnmount(){
        this.requestTracker.cancelAll();
    }

    isMyStatistics() {
        return this.props.userId === this.props.currentUser.id;
    }

    getMark(task: TaskStatistics) {
        return task.hasSolution
            ? task.mark || <FontAwesomeIcon icon="hourglass-half" size="lg" title="Ожидает проверки преподавателем"/>
            : '';
    }

    onOpenEvaluationPage(task: TaskStatistics) {
        const url = routes.SOLUTION_EVALUATION(this.props.userId as number, task.id);
        console.log(url);
        goTo(url);
    }

    getManageButton(task: TaskStatistics) {
        return task.hasSolution
            ? <button className="button"
                      onClick={() => this.onOpenEvaluationPage(task)}
                      disabled={!task.manualEvaluation}
                      title={task.manualEvaluation ? '' : 'Это задание оценивается в автоматическом режиме'}>
                Просмотреть
              </button>
            : null;
    }

    renderTaskRow(task: TaskStatistics) {
        return (
            <div key={task.index} styleName="topic-statistics__task-row">
                <div styleName="topic-statistics__task-row__index">{task.index}</div>
                <div styleName="topic-statistics__task-row__name" title={task.name}>
                    <span>{task.name}</span>
                </div>
                <div styleName="mark">
                    {this.getMark(task)}
                </div>
                {!this.isMyStatistics() &&
                    <div>
                        {this.getManageButton(task)}
                    </div>
                }
            </div>
        );
    }

    renderTopicStatistics(topic: TopicStatistics) {
        const statisticsTypeClass = this.isMyStatistics()
            ? 'topic-statistics--student'
            : 'topic-statistics--admin';
        return (
            <div key={topic.index} styleName={'topic-statistics ' + statisticsTypeClass}>
                <div styleName="topic-statistics__header">
                    <div styleName="topic-statistics__header__name" title={topic.name}>
                        <span styleName="topic-statistics__header__name__index">
                            {`Тема №${topic.index}`}
                        </span>
                        <span>{topic.name}</span>
                    </div>
                    <div styleName="mark">Оценка</div>
                </div>
                {topic.tasks.map((task) => this.renderTaskRow(task))}
                <div styleName="topic-statistics__summary">
                    <div styleName="topic-statistics__summary__title">
                        Общая оценка по теме
                    </div>
                    <div styleName="mark">
                        {this.calculateTopicAverageMark(topic)}
                    </div>
                </div>
            </div>
        );
    }

    calculateTopicAverageMark(topic: TopicStatistics) {
        const solvedTasks = topic.tasks.filter((task) => task.hasSolution && _.isNumber(task.mark));
        const mean = _.meanBy(solvedTasks, (task) => task.mark);
        return Number.isFinite(mean) ? mean.toFixed(2) : '';
    }

    getLeftBarTitle() {
        return this.isMyStatistics()
            ? 'Моя статистика'
            : `Статистика пользователя ${this.state.user ? this.state.user.name : ''}`;
    }

    render() {
        return (
            <ContentLayout leftBarContent={this.getLeftBarTitle()}>
                {this.state.topics.map((topic) => this.renderTopicStatistics(topic))}
            </ContentLayout>
        );
    }
}

const getEvaluationPage = (route: RouteComponentProps<{userId: number, taskId: number}>) =>
    <EvaluationPage userId={route.match.params.userId} taskId={route.match.params.taskId}/>;

export default (props: StudentStatisticsPageHOCProps) => (
    <CurrentUserContext.Consumer>
        {(currentUser: User) =>
            <div className="content">
                <BreadcrumbsItem
                    to={currentUser.id === props.userId
                            ? routes.MY_STATISTICS
                            : routes.USER_STATISTICS(props.userId)}>
                    Статистика
                </BreadcrumbsItem>
                <Switch>
                    <SecuredRoute path={routePatterns.SOLUTION_EVALUATION} roles={['ADMIN']}
                                  component={getEvaluationPage}/>
                    <Route component={() => <StudentStatisticsPage currentUser={currentUser} userId={props.userId}/>} />
                </Switch>
            </div>
        }
    </CurrentUserContext.Consumer>
);