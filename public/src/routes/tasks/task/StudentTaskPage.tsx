import * as React from 'react';
import './StudentTaskPage.scss';
import Task from '../../../types/Task';
import User from '../../../types/User';
import AbortingRequestTracker from '../../../util/abortingRequestTracker';
import { CurrentUserContext } from '../../../App';
import { createSolution, getInitialNodes, getTask, updateSolution } from '../../../util/api';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { routes } from '../../../util/routes';
import { setStateWithPromise } from '../../../util/promiseWrappers';
import * as _ from 'lodash';
import Solution from '../../../types/Solution';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';
import Editor from "../../schema/Editor/Editor";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import {LinkPaletteValue} from "../../schema/LinkPaletteValue";
import Palette from "../../schema/Palette/Palette";
import ContentLayout from '../../../components/ContentLayout/ContentLayout';
import {NodePaletteValue} from "../../schema/NodePaletteValue";
import {DEFAULT_PALETTE_OPTION} from "../../schema/paletteValues";
import {isEqualSchema} from "../../../schema/isEqualSchemas";
import MxGraphEditor from "../../../components/MxGraphEditor/MxGraphEditor";

library.add(faInfoCircle);

interface StudentTaskPageState extends Task {
    showResultPopup: boolean,
    nodeOptions: NodePaletteValue[],
    linkOptions: LinkPaletteValue[],
    link: LinkPaletteValue | null,
    taskLoaded: boolean
}

interface StudentTaskPageHOCProps {
    topicId: number;
    taskId: number;
}

interface StudentTaskPageProps extends StudentTaskPageHOCProps {
    currentUser: User;
}

type PropType = StudentTaskPageProps & RouteComponentProps<{}>;

class StudentTaskPage extends React.Component<PropType, StudentTaskPageState> {

    requestTracker: AbortingRequestTracker;
    newSolution: Solution = {
        data: null,
        task: {
            id: this.props.taskId
        }
    };
    private reactEditor: Editor | null;
    private mxEditor: MxGraphEditor | null;
    private unblock: () => void;

    constructor(props: PropType) {
        super(props);
        this.state = {
            id: null,
            index: 1,
            name: '',
            description: '',
            complexity: 1,
            solutions: [this.newSolution],
            shouldComparePositionOnEvaluation: false,
            manualEvaluation: true,
            showResultPopup: false,
            link: null,
            nodeOptions: [],
            linkOptions: [],
            taskLoaded: false
        };
        this.requestTracker = new AbortingRequestTracker();
        this.reactEditor = null;
        this.mxEditor = null;
    }

    componentDidMount() {
        this.loadInitialNodes();
        this.loadTask().then(() => {
            const {solutions, manualEvaluation} = this.state;
            const data = !_.isEmpty(solutions)
                ? solutions[0].data
                : null;
            if(data !== null) {
                if (!manualEvaluation && this.reactEditor !== null) {
                    this.reactEditor.load(JSON.parse(data));
                }
                if (manualEvaluation && this.mxEditor !== null) {
                    // this.mxEditor.deserializeAndLoad(data);
                }
            }
        });

        this.unblock = this.props.history.block((location, action) => {
            if (this.reactEditor) {
                const serializedData = _.get(this.state.solutions, '[0].data', null);
                const savedSolutionData = serializedData !== null
                    ? JSON.parse(serializedData)
                    : null;
                const currentSolutionData = this.reactEditor.serialize();
                const isDiagramChanged = !isEqualSchema(savedSolutionData, currentSolutionData);
                if(!this.state.showResultPopup && isDiagramChanged) {
                    return "Решение сохраняется только после нажатия кнопки \"Проверить\".\nПокинуть страницу?";
                }
            }

            return undefined;
        });
    }

    componentWillUnmount() {
        this.unblock();
        this.requestTracker.cancelAll();
    }

    loadInitialNodes() {
        return this.requestTracker.add(getInitialNodes(this.props.taskId))
            .then(({nodes, links}) => {
                this.setState((prevState) => ({
                    nodeOptions: nodes,
                    linkOptions: links,
                    link: prevState.link !== null
                        ? prevState.link
                        : (links[0] || prevState.link)
                }));
            })
    }

    loadTask() {
        return this.requestTracker.add(getTask(this.props.taskId as number))
            .then((task) => {
                if (_.isEmpty(task.solutions)) {
                    task.solutions = [this.newSolution];
                }
                setStateWithPromise(this, {...task, taskLoaded: true});
            });
    }



    isNewSolution() {
        return _.isEmpty(this.state.solutions) || !this.state.solutions[0].id
    }

    onSaveSolution() {
        const solution = this.state.solutions[0];
        const {manualEvaluation} = this.state;
        solution.data = manualEvaluation
            ? this.mxEditor!.serialize()
            : JSON.stringify(this.reactEditor!.serialize());

        const request = this.isNewSolution()
            ? createSolution(solution)
            : updateSolution(solution);

        this.requestTracker.add(request)
            .then((solution) => this.setState({
                showResultPopup: true,
                solutions: [solution]
            }));
    }

    private handleChangeLink = (link: LinkPaletteValue) => this.setState({link});


    renderPopup() {
        return (
            <div>
                <div styleName="popup">
                    <div styleName="popup__header">
                        {!this.state.manualEvaluation && !this.state.solutions[0].mark
                            ? 'Решение неверно'
                            : 'Решение принято'}
                    </div>
                    {this.state.manualEvaluation
                        ? <div>Оценка станет доступна после проверки решения преподавателем</div>
                        : <div>{`Ваша оценка: ${this.state.solutions[0].mark}`}</div>
                    }

                    <div styleName="popup__buttons-container">
                        <div className="button" onClick={() => this.setState({showResultPopup: false})}>
                            Решить заново
                        </div>
                        <NavLink to={routes.TASKS_LIST(this.props.topicId)} className="button">
                            К списку заданий
                        </NavLink>
                    </div>
                </div>
                <div styleName="popup__backdrop"/>
            </div>
        );
    }

    renderActionButtons() {
        return (
            <>
                <div className="button" onClick={() => this.onSaveSolution()}>Проверить</div>
                <NavLink to={routes.HELP} target="_blank" className="button"
                         styleName="left-bar__bottom-menu__reference-link">
                    <span>Техники визуализации</span>
                    <FontAwesomeIcon icon="info-circle" size="lg"/>
                </NavLink>
            </>
        )
    }

    getLeftBarContent() {
        return (
            <div className="content" styleName="left-bar">
                <Palette
                    nodeOptions={this.state.nodeOptions}
                    linkOptions={this.state.linkOptions}
                    link={this.state.link}
                    onChangeLink={this.handleChangeLink}
                />
                <div styleName="left-bar__bottom-menu">
                    {this.renderActionButtons()}
                </div>
            </div>
        );
    }

    render() {
        if (!this.state.taskLoaded) {
            return null;
        }

        const taskDescription = (
            <div className="scrollbar-wrapper" dangerouslySetInnerHTML={{__html: this.state.description}}/>
        );
        const breadCrumbs = (
            <BreadcrumbsItem to={routes.TASK(this.props.topicId, this.props.taskId as number)}>
                {`№${this.state.index} "${this.state.name}"`}
            </BreadcrumbsItem>
        );

        if (this.state.manualEvaluation) {
            return (
                <AdvancedEditorLayout bottomContent={(
                    <div styleName="bottom">
                        <div styleName="bottom__buttons">
                            {this.renderActionButtons()}
                        </div>
                        <div styleName="bottom__description">
                            {taskDescription}
                        </div>
                    </div>
                    )}>
                    {breadCrumbs}
                    {this.state.showResultPopup && this.renderPopup()}
                    <MxGraphEditor
                        readOnly={false}
                        serializedModel={_.get(this.state.solutions, '[0].data', null)}
                        ref={(elem) => this.mxEditor = elem}
                    />
                </AdvancedEditorLayout>
            );
        } else {
            return (
                <ContentLayout
                    leftBarContent={this.getLeftBarContent()}
                    leftBarNoPadding={true}
                    contentNoPadding={true}
                    scrollableContent={false}>

                    {breadCrumbs}

                    {this.state.showResultPopup && this.renderPopup()}

                    <div styleName="content">
                        <div styleName="content__schema">
                            <Editor
                                isNodesResizable={false}
                                isNodesTextEditable={false}
                                ref={(elem) => this.reactEditor = elem}
                                link={this.state.link || DEFAULT_PALETTE_OPTION}
                            />
                        </div>
                        <div styleName="content__description">
                            {taskDescription}
                        </div>
                    </div>

                </ContentLayout>
            );
        }
    };
}

const StudentTaskPageWithRouter = withRouter(StudentTaskPage);

export default (props: StudentTaskPageHOCProps) => (
    <CurrentUserContext.Consumer>
        {(currentUser: User) => <StudentTaskPageWithRouter {...{currentUser, ...props}}/>}
    </CurrentUserContext.Consumer>

);

interface AdvancedEditorLayoutProps {
    bottomContent: React.ReactNode,
    children: React.ReactNode[]
}

const AdvancedEditorLayout = (props: AdvancedEditorLayoutProps) => (
    <div styleName="advanced-editor-layout">
        <div styleName="advanced-editor-layout__main">
            {props.children}
        </div>
        <div styleName="advanced-editor-layout__bottom">
            {props.bottomContent}
        </div>
    </div>
);
