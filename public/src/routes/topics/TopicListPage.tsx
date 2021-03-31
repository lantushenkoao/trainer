import * as React from 'react';
import ContentLayout from '../../components/ContentLayout/ContentLayout';
import { routePatterns, routes } from '../../util/routes';
import TaskListPage from '../tasks/TaskListPage';
import { NavLink, Route, Switch } from 'react-router-dom';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import User from '../../types/User';
import { CurrentUserContext } from '../../App';
import * as api from '../../util/api';
import { toast } from 'react-toastify';
import TopicPage from './topic/TopicPage';
import { isStudent } from '../../util/roleUtils';
import SecuredRoute from '../../util/SecuredRoute';
import AbortingRequestTracker from '../../util/abortingRequestTracker';
import { RouteComponentProps } from 'react-router';
import TopicDto from '../../types/TopicDto';
import './TopicListPage.scss';

interface TopicLisPageState {
    topics: TopicDto[];
}

interface TopicListPageHOCProps {}

interface TopicListPageProps extends TopicListPageHOCProps {
    currentUser: User;
}

class TopicListPage extends React.Component<TopicListPageProps, TopicLisPageState> {

    requestTracker: AbortingRequestTracker;

    constructor(props: TopicListPageProps) {
        super(props);
        this.state = {
            topics: []
        };
        this.requestTracker = new AbortingRequestTracker();
    }

    componentDidMount() {
        this.loadTopicList();
    }

    componentWillUnmount(){
        this.requestTracker.cancelAll();
    }

    loadTopicList() {
        this.requestTracker.add(api.listTopics())
            .then(topics => this.setState({topics}));
    }

    onDeleteTopic(topic: TopicDto) {
        confirm(`Внимание!\nПосле подтверждения, это действие отменить нельзя.\nУдалить тему ${topic.name}?`) &&
        this.requestTracker.add(api.deleteTopic(topic.id as number))
            .then(() => {
                toast('Тема удалёна', {type: toast.TYPE.SUCCESS});
                this.loadTopicList();
            });
    }

    renderTopicRow(topic: TopicDto) {
        return (
            <div key={topic.id as number} styleName="container__scrollbar-wrapper__topics__row">
                <div styleName="container__scrollbar-wrapper__topics__row__index">
                    {topic.index}
                </div>
                <div styleName="container__scrollbar-wrapper__topics__row__topic">
                    <div styleName="container__scrollbar-wrapper__topics__row__topic__header">
                        {topic.name}
                    </div>
                    <span>{topic.description}</span>
                </div>
                <div styleName="container__scrollbar-wrapper__topics__row__buttons">
                    <NavLink to={routes.TASKS_LIST(topic.id as number)}
                             className="button">
                        {isStudent(this.props.currentUser) ? 'Решать задания' : 'Задания'}
                    </NavLink>
                    {!isStudent(this.props.currentUser) &&
                        <NavLink to={routes.TOPIC_EDIT(topic.id as number)}
                                 className="button">
                            Редактировать
                        </NavLink>
                    }
                    {!isStudent(this.props.currentUser) &&
                        <button className="button button-delete"
                                onClick={() => this.onDeleteTopic(topic)}
                                disabled={topic.hasTasks}
                                title={topic.hasTasks ? 'Тема содержит задания' : ''}>
                            Удалить
                        </button>
                    }
                </div>
            </div>
        );
    }

    renderTopics() {
        return (
            <div styleName="container__scrollbar-wrapper__topics">
                {this.state.topics.map((topic) => this.renderTopicRow(topic))}
            </div>
        );
    }

    render() {
        return (
            <ContentLayout leftBarContent="Список тем для решения заданий по дисциплине «Обучение навыкам визуализации»">
                <div className="content" styleName="container">
                    {!isStudent(this.props.currentUser) &&
                        <NavLink to={routes.TOPIC_NEW} className="button button-new"
                                 styleName="container__new-topic-button">
                            Создать новую тему
                        </NavLink>
                    }

                    {!isStudent(this.props.currentUser) ?
                        <div className="scrollbar-wrapper" styleName="container__scrollbar-wrapper">
                            {this.renderTopics()}
                        </div>
                        : this.renderTopics()
                    }
                </div>
            </ContentLayout>
        );
    }
}

export default () => (
    <CurrentUserContext.Consumer>
        {(currentUser: User) =>
            <div className="content">
                <BreadcrumbsItem to={routes.TOPICS_LIST}>Темы</BreadcrumbsItem>
                <Switch>
                    <SecuredRoute exact path={routes.TOPIC_NEW} roles={['ADMIN', 'METHODIST']}
                           component={() => <TopicPage/>}/>
                    <SecuredRoute exact path={routePatterns.TOPIC_EDIT} roles={['ADMIN', 'METHODIST']}
                           component={(route: RouteComponentProps<{topicId: number}>) =>
                               <TopicPage topicId={route.match.params.topicId}/>}/>
                    <Route path={routePatterns.TASKS_LIST} roles={['ADMIN', 'METHODIST']}
                           component={(route: RouteComponentProps<{topicId: number}>) =>
                               <TaskListPage topicId={route.match.params.topicId}/>}/>
                    <Route component={() => <TopicListPage currentUser={currentUser}/>}/>
                </Switch>
            </div>
        }
    </CurrentUserContext.Consumer>
);
