import * as React from 'react';
import './TopicPage.scss';
import { routes } from '../../../util/routes';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import Topic from '../../../types/Topic';
import * as api from '../../../util/api';
import { toast } from 'react-toastify';
import { goTo } from '../../../util/history';
import AbortingRequestTracker from '../../../util/abortingRequestTracker';

interface TopicPageProps {
    topicId?: number;
}

interface TopicPageState extends Topic {
    initialName: string;
}

const newTopic: Topic = {
    id: null,
    name: '',
    description: '',
    tasks: []
};

export default class TopicPage extends React.Component<TopicPageProps, TopicPageState> {

    requestTracker: AbortingRequestTracker;

    constructor(props: TopicPageProps) {
        super(props);
        this.state = {
            ...newTopic,
            initialName: ''
        };
        this.requestTracker = new AbortingRequestTracker();
    }

    componentDidMount() {
        this.loadTopic();
    }

    componentWillUnmount(){
        this.requestTracker.cancelAll();
    }

    loadTopic() {
        this.isNewTopic()
            ? this.setState(newTopic)
            : this.requestTracker.add(api.getTopic(this.props.topicId as number))
                .then(topicDto => {
                    const {id, name, description} = topicDto;
                    this.setState({
                        id,
                        name,
                        description,
                        tasks: [],
                        initialName: topicDto.name
                    })
                });
    }

    isNewTopic() {
        return !this.props.topicId;
    }

    changeName(name: string) {
        this.setState({name});
    }

    changeDescription(description: string) {
        this.setState({description});
    }

    getPageBreadcrumb() {
        return this.isNewTopic()
            ? 'Создание новой темы'
            : 'Редактирование темы';
    }

    getPageTitle() {
        return this.getPageBreadcrumb() + (!this.isNewTopic() ? ` "${this.state.initialName}"` : '');
    }

    onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const request = this.isNewTopic()
            ? api.createTopic(this.state)
            : api.updateTopic(this.state);
        this.requestTracker.add(request).then(() => {
            const message = this.isNewTopic()
                ? 'Тема создана'
                : 'Изменения сохранены';
            toast(message, {type: toast.TYPE.SUCCESS});
            goTo(routes.TOPICS_LIST);
        })
    }

    render() {
        return (
            <ContentLayout leftBarContent={this.getPageTitle()}>
                <BreadcrumbsItem to={routes.TOPIC_NEW}>{this.getPageBreadcrumb()}</BreadcrumbsItem>
                <form styleName="topic-form" onSubmit={(e) => this.onSubmit(e)}>
                    <label htmlFor="topic-name">Название</label>
                    <input name="topic-name"
                           id="topic-name"
                           className="input"
                           value={this.state.name}
                           onChange={(e) => this.changeName(e.target.value)}
                           required={true}
                           maxLength={100}/>

                    <label styleName="topic-form__label-description" htmlFor="description">Краткое описание</label>
                    <textarea styleName="topic-form__description-input"
                              className="input"
                              name="description"
                              id="description"
                              value={this.state.description}
                              onChange={(e) => this.changeDescription(e.target.value)}
                              required={true}
                              maxLength={500}/>

                    <div styleName="topic-form__buttons-container">
                        <input type="submit" className="button" value={this.isNewTopic() ? 'Создать' : 'Сохранить'}/>
                    </div>
                </form>
            </ContentLayout>
        );
    }
}
