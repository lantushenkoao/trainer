import * as React from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { routes } from '../../../util/routes';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';
import './TaskPage.scss';
import User from '../../../types/User';
import Task from '../../../types/Task';
import { CurrentUserContext } from '../../../App';
import { createTask, getTask, updateTask } from '../../../util/api';
import AbortingRequestTracker from '../../../util/abortingRequestTracker';
import Solution from '../../../types/Solution';
import {Editor} from '@tinymce/tinymce-react';
import {toast} from 'react-toastify';
import {goTo} from '../../../util/history';
import * as _ from 'lodash';
import SchemaEditor from "../../schema/Editor/Editor";
import { setStateWithPromise } from '../../../util/promiseWrappers';
import {LinkPaletteValue} from "../../schema/LinkPaletteValue";
import {DEFAULT_PALETTE_OPTION, LINK_PALETTE_OPTIONS, NODE_PALETTE_OPTIONS} from "../../schema/paletteValues";
import Palette from "../../schema/Palette/Palette";
import {RouteComponentProps, withRouter} from 'react-router';
import {isEqualSchema} from "../../../schema/isEqualSchemas";
import { TASK_MAX_COMPLEXITY, MARK_MAX_VALUE } from '../../../util/constants';

interface TaskPageState {
    task: Task;
    initialTask: Task;
    link: LinkPaletteValue;
    taskSaved: boolean;
}

interface TaskPageHOCProps {
    topicId: number;
    taskId?: number;
}

interface TaskPageProps extends TaskPageHOCProps {
    currentUser: User;
}

type PageProps = TaskPageProps & RouteComponentProps<{}>;

const MAX_SOLUTIONS_COUNT = 5;
const DESCRIPTION_MAX_LENGTH = 5000;
const EVALUATION_TYPES = {
    MANUAL: 'Вручную',
    AUTO: 'Автоматически'
};

class TaskPage extends React.Component<PageProps, TaskPageState> {

    requestTracker: AbortingRequestTracker;
    formRef: React.RefObject<HTMLFormElement>;
    descriptionHiddenInputRef: React.RefObject<HTMLInputElement>;
    private editors: { [key: string]: SchemaEditor } = {};
    private unblock: () => void;

    constructor(props: PageProps) {
        super(props);
        const newTask: Task = {
            id: null,
            name: '',
            description: '',
            complexity: 1,
            topic: {
                id: Number(this.props.topicId)
            },
            solutions: [],
            shouldComparePositionOnEvaluation: false,
            manualEvaluation: true
        };
        this.state = {
            task: newTask,
            initialTask: newTask,
            link: DEFAULT_PALETTE_OPTION,
            taskSaved: false
        };
        this.requestTracker = new AbortingRequestTracker();
        this.formRef = React.createRef();
        this.descriptionHiddenInputRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.taskId) {
            this.loadTask();
        }
        this.unblock = this.props.history.block((location, action) => {
            if (!this.state.taskSaved && (this.taskFieldsChanged() || this.isSolutionsChanged())) {
                return "Есть несохранённые изменения.\nПокинуть страницу?";
            } else {
                return undefined;
            }
        });
    }

    componentDidUpdate(prevProps: PageProps, prevState: TaskPageState) {
        if (!this.state.task.manualEvaluation && prevState.task.manualEvaluation) {
            this.initializeSolutions();
        }
    }

    loadTask() {
        this.requestTracker.add(getTask(this.props.taskId as number))
            .then((task) => setStateWithPromise(this, {
                task,
                initialTask: task
            }))
            .then(() => this.initializeSolutions());
    }

    initializeSolutions() {
        _.forEach(this.editors, (editor, idx) => {
            const solution = this.state.task.solutions[Number(idx)];
            if(solution) {
                editor.load(JSON.parse(solution.data as string));
            }
        });
    }

    componentWillUnmount() {
        this.unblock();
        this.requestTracker.cancelAll();
    }

    private isSolutionsChanged() {
        if(this.state.initialTask.solutions.length === this.state.task.solutions.length) {
            return this.state.initialTask.solutions.map((solution, idx) => ({
                saved: solution.data !== null ? JSON.parse(solution.data) : null,
                current: this.editors[idx].serialize()
            })).some(
                ({saved, current}) => {return !isEqualSchema(saved, current)}
            );
        } else {
            return true;
        }
    }

    onChangeName(name: string) {
        this.setState(prevState => ({
            task: {...prevState.task, name}
        }));
    }

    onChangeDescription(description: string) {
        const input = this.descriptionHiddenInputRef.current;
        if (input !== null && !input.checkValidity()) {
            input.setCustomValidity('');
        }
        this.setState(prevState => ({
            task: {...prevState.task, description}
        }));
    }

    onChangeComplexity(complexity: number) {
        this.setState(prevState => ({
            task: {...prevState.task, complexity}
        }));
    }

    onChangeShouldComparePositionOnEvaluation(compare: boolean) {
        this.setState(prevState => ({
            task: {...prevState.task, shouldComparePositionOnEvaluation: compare}
        }));
    }

    onChangeEvaluationType(evaluationType: String) {
        const manualEvaluation = evaluationType === EVALUATION_TYPES.MANUAL;
        if (manualEvaluation && !this.state.task.manualEvaluation && this.state.task.solutions.length) {
            const confirmed = confirm('Внимание!\nВы собираетесь изменить способ проверки решений на ручной. ' +
                'Все имеющиеся варианты решений будут удалены после сохранения задания. Продолжиь?');
            if (!confirmed) {
                return;
            }
        }
        this.setState(prevState => ({
            task: {...prevState.task, manualEvaluation}
        }));
    }

    updateSolutionInState(index: number, solution: Solution) {
        this.setState(prevState => {
            const solutions = [
                ...prevState.task.solutions.slice(0, index),
                solution,
                ...prevState.task.solutions.slice(index + 1)
            ];
            return {
                task: {...prevState.task, solutions}
            };
        });
    }

    onDeleteSolution(index: number) {
        confirm(`Внимание!\nПосле сохранения задания, это решение будет нельзя восстановить.\nУдалить решение № ${index + 1}?`) &&
        this.setState(prevState => {
            const solutions = [
                ...prevState.task.solutions.slice(0, index),
                ...prevState.task.solutions.slice(index + 1)
            ];
            return {
                task: {...prevState.task, solutions}
            };
        });
    }

    addNewSolutionToState() {
        this.setState(prevState => {
            const solutions = [
                ...prevState.task.solutions,
                {
                    data: '',
                    mark: 1,
                    index: prevState.task.solutions.length + 1
                }
            ];
            return {
                task: {...prevState.task, solutions}
            };
        });
    }

    onChangeSolutionMark(index: number, mark: number) {
        const solution = {...this.state.task.solutions[index], mark};
        this.updateSolutionInState(index, solution);
    }

    isNewTask() {
        return !this.props.taskId;
    }

    getDescriptionPlainText(value: string) {
        const holder = document.createElement('div');
        holder.innerHTML = value;
        return holder.innerText || holder.textContent || '';
    }

    validateDescriptionLength() {
        const descriptionHiddenInput = this.descriptionHiddenInputRef.current as HTMLInputElement;

        if (descriptionHiddenInput.value.length > DESCRIPTION_MAX_LENGTH) {
            descriptionHiddenInput.setCustomValidity(`Описание должно быть не более ${DESCRIPTION_MAX_LENGTH} символов.`
                + `Текущая длина: ${descriptionHiddenInput.value.length}`);
            return false;
        } else {
            descriptionHiddenInput.setCustomValidity('');
            return true;
        }
    }

    validateTask() {
        const descriptionForm = this.formRef.current as HTMLFormElement;

        this.validateDescriptionLength();
        if(!descriptionForm.checkValidity()) {
            descriptionForm.reportValidity();
            return false;
        } else if (!this.state.task.manualEvaluation && _.isEmpty(this.state.task.solutions)) {
            toast('Добавьте решения', {type: toast.TYPE.ERROR});
            return false;
        }

        return true;
    }

    onSaveTask() {
        const valid = this.validateTask();

        if(valid) {
            const task = this.state.task as Task;
            task.solutions = this.state.task.manualEvaluation
                ? []
                : task.solutions.map((solution, index) => {
                    return {
                        ...solution,
                        data: JSON.stringify(this.editors[index].serialize()),
                        task: {
                            id: this.props.taskId as number
                        }
                    };
                });

            const request = this.state.task.id
                ? updateTask(task)
                : createTask(task);

            this.requestTracker.add(request).then(() => {
                const message = this.isNewTask()
                    ? 'Задание создано'
                    : 'Изменения сохранены';
                toast(message, {type: toast.TYPE.SUCCESS});
            }).then(() => setStateWithPromise(this, {taskSaved: true})
            ).then(() => goTo(routes.TASKS_LIST(this.props.topicId)));
        }

    }

    private handleChangeLink = (link: LinkPaletteValue) => this.setState({link});

    getEvaluationTypeValue() {
        return this.state.task.manualEvaluation
            ? EVALUATION_TYPES.MANUAL
            : EVALUATION_TYPES.AUTO;
    }

    renderDescriptionForm() {
        return (
            <form ref={this.formRef} styleName="description-form" noValidate={true}>
                <div styleName="header">Описание задания</div>
                <label htmlFor="name">Название</label>
                <input className="input"
                       name="name"
                       value={this.state.task.name}
                       required={true}
                       maxLength={100}
                       onChange={(e) => this.onChangeName(e.target.value)}/>

                <label styleName="description-form__label-description" htmlFor="description">
                    Текст задания
                </label>
                {this.renderEditor()}

                <label htmlFor="complexity">Сложность задания</label>
                <select styleName="description-form__complexity-select"
                        className="input"
                        name="complexity"
                        id="complexity"
                        value={this.state.task.complexity}
                        onChange={(e) => this.onChangeComplexity(Number(e.target.value))}>
                    {Array.from({length: TASK_MAX_COMPLEXITY}, (x, i) => i).map(key => (
                        <option key={key + 1} value={key + 1}>{key + 1}</option>
                    ))}
                </select>

                <label htmlFor="evaluationType">
                    Способ проверки решения
                </label>
                <select styleName="description-form__evaluation-type"
                        className="input"
                        name="evaluation-type"
                        id="evaluationType"
                        value={this.getEvaluationTypeValue()}
                        onChange={(e) => this.onChangeEvaluationType(e.target.value)}>
                    {_.keys(EVALUATION_TYPES).map((key) =>
                        <option key={key}>{EVALUATION_TYPES[key]}</option>
                    )}
                </select>

                {!this.state.task.manualEvaluation &&
                    <label htmlFor="shouldComparePositionOnEvaluation">
                        Проверка расположения блоков
                    </label>
                }
                {!this.state.task.manualEvaluation &&
                    <input
                        type="checkbox"
                        name="shouldComparePositionOnEvaluation"
                        id="shouldComparePositionOnEvaluation"
                        checked={this.state.task.shouldComparePositionOnEvaluation}
                        onChange={(e) => this.onChangeShouldComparePositionOnEvaluation(e.target.checked)}
                    />
                }
            </form>
        );
    }

    renderEditor() {
        return (
            <div styleName="description-form__description">
                <input styleName="description-form__description__hidden-input"
                       value={this.getDescriptionPlainText(this.state.task.description)}
                       ref={this.descriptionHiddenInputRef}
                       required={true}
                       onChange={(e) => this.onChangeDescription(e.target.value)}/>
                <input name="image" type="file" id="upload" className="hidden" style={{display: 'none'}}/>
                <Editor
                    id="description"
                    apiKey='6ug3u3cn15ezc5linmdd151tu8dgf3jl5hvqh89xecno3zue'
                    init={{
                        branding: false,
                        statusbar: false,
                        height: 300,
                        language_url: 'https://olli-suutari.github.io/tinyMCE-4-translations/ru.js',
                        plugins: ['advlist autolink lists link image charmap preview hr anchor',
                            'insertdatetime save table contextmenu directionality',
                            'paste textcolor colorpicker'],
                        image_advtab: true,
                        file_picker_callback: (callback: any, value: any, meta: any) => {
                            if (meta.filetype === 'image') {
                                const upload = document.getElementById('upload') as HTMLElement;
                                upload.click();
                                upload.addEventListener('change', (e) => {
                                    const input = e.target as HTMLInputElement;
                                    const files = input.files as FileList;
                                    const file = files[0];
                                    const reader = new FileReader();
                                    reader.onload = (e: any) => {
                                        callback(e.target.result, {
                                            alt: ''
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                });
                            }
                        },
                    }}
                    value={this.state.task.description}
                    onEditorChange={this.onChangeDescription.bind(this)}
                />
            </div>

        );
    }

    renderSolution = (solution: Solution, index: number) => {
        const {manualEvaluation} = this.state.task;
        return (
            <div key={solution.id || index} styleName="solution-container">
                <div styleName="header">
                    {`Решение задания, вариант № ${index + 1}`}
                </div>
                <div styleName="solution-container__palette-container">
                    <Palette
                        nodeOptions={NODE_PALETTE_OPTIONS}
                        linkOptions={LINK_PALETTE_OPTIONS}
                        link={this.state.link}
                        onChangeLink={this.handleChangeLink}
                    />
                </div>
                <div styleName="solution-container__editor-container">
                    <SchemaEditor
                        isNodesResizable={true}
                        isNodesTextEditable={true}
                        ref={(elem) => {
                            if (elem !== null) {
                                this.editors[index] = elem;
                            } else {
                                delete this.editors[index];
                            }
                        }}
                        link={this.state.link}
                    />
                </div>
                <label htmlFor={`solution_${index}_mark`} styleName="solution-container__mark">Оценка</label>
                <div styleName="solution-container__bottom-menu">
                    <div styleName="solution-container__bottom-menu__mark-container">
                        <select styleName="solution-container__mark"
                                className="input"
                                id={`solution_${index}_mark`}
                                value={solution.mark as number}
                                onChange={e => this.onChangeSolutionMark(index, Number(e.target.value))}>
                            {Array.from({length: MARK_MAX_VALUE}, (x, i) => i).map(key => (
                                <option key={key + 1} value={key + 1}>{key + 1}</option>
                            ))}
                        </select>
                    </div>

                    <button className="button button-delete" styleName="solution-container__delete"
                            onClick={() => this.onDeleteSolution(index)}>
                        Удалить решение
                    </button>
                </div>
            </div>
        );
    };

    maxSolutionsReached() {
        return this.state.task.solutions.length >= MAX_SOLUTIONS_COUNT;
    }

    getLeftBarTitle() {
        return this.isNewTask()
            ? 'Создание нового задания'
            : `Редактирование задания ${this.state.initialTask.name
                ? `№${this.state.initialTask.index || ''} "${this.state.initialTask.name}"`
                :''}`;
    }

    taskFieldsChanged() {
        return !_.isEqual(this.state.initialTask, this.state.task);
    }

    render() {
        return (
            <ContentLayout leftBarContent={this.getLeftBarTitle()}>
                <div styleName="container">
                    <BreadcrumbsItem to={routes.TASK_NEW(this.props.topicId)}>
                        {this.isNewTask()
                            ? 'Создание нового задания'
                            : 'Редактирование задания'
                        }
                    </BreadcrumbsItem>

                    {this.renderDescriptionForm()}

                    {!this.state.task.manualEvaluation && this.state.task.solutions.map(this.renderSolution)}

                    <div styleName="buttons-container">
                        <button className="button" onClick={() => this.onSaveTask()}>
                            Сохранить задание
                        </button>
                        {!this.state.task.manualEvaluation &&
                            <button className="button button-new"
                                    disabled={this.maxSolutionsReached()}
                                    title={this.maxSolutionsReached()
                                        ? `Задание может содержать не более ${MAX_SOLUTIONS_COUNT} решений`
                                        : ''}
                                    onClick={() => this.addNewSolutionToState()}>
                                Добавить решение
                            </button>
                        }
                    </div>
                </div>
            </ContentLayout>
        );
    }
}

const TaskPageWithRouter = withRouter(TaskPage);

export default (props: TaskPageHOCProps) => (
    <CurrentUserContext.Consumer>
        {(currentUser: User) => <TaskPageWithRouter {...{currentUser, ...props}}/>}
    </CurrentUserContext.Consumer>

);