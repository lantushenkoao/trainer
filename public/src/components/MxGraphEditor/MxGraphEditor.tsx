import * as React from 'react';
import './mxClientApi';
import styles from './MxGraphEditor.scss';
import {toast} from "react-toastify";

interface Props {
    serializedModel: string | null,
    readOnly: boolean
}

export default class MxGraphEditor extends React.Component<Props, {}> {

    private container: HTMLDivElement | null;
    private model: any;
    private graph: any;
    private editor: any;
    private serialized: string | null = null;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        if (mxClient.isBrowserSupported()) {
            this._setUpEditor();
        } else {
            mxUtils.error('Browser is not supported!', 200, false);
        }
    }

    componentDidUpdate(prevProps: Props) {
        if(prevProps.serializedModel !== this.props.serializedModel && this.model !== null) {
            this.deserializeAndLoadImpl();
        }
    }

    componentWillUnmount() {
        this.graph.destroy();
    }

    /**
     * copy-paste from mxGraph 'grapheditor' examples
     * */
    _setUpEditor() {
        const bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
            mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

        // Fixes possible asynchronous requests
        mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], (xhr: any) => {
            // Adds bundle text to resources
            mxResources.parse(xhr[0].getText());

            // Configures the default graph theme
            const themes = {[Graph.prototype.defaultThemeName]: xhr[1].getDocumentElement()};

            // Main
            this.model = new mxGraphModel();
            const editor = new Editor(false, themes, this.model);
            this.editor = new EditorUi(editor, this.container);
            this.graph = editor.graph;

            if(this.props.readOnly) {
                this.graph.setEnabled(false);
            }

            if(this.props.serializedModel !== null) {
                this.deserializeAndLoadImpl();
            }
        }, () => {
            toast('Failed to load resource files', {type: toast.TYPE.ERROR});
        });
    }

    private deserializeAndLoadImpl() {
        const  {serializedModel} = this.props;
        const doc = mxUtils.parseXml(serializedModel);
        const codec = new mxCodec(doc);
        codec.decode(doc.documentElement, this.model);
        this.graph.refresh();
    }

    serialize(): string {
        const encoder = new mxCodec();
        const result = encoder.encode(this.model);
        return mxUtils.getXml(result);
    }

    render() {
        return (
            <div className={['wrapper', this.props.readOnly ? 'wrapper--read-only' : 'wrapper--editable'].map(s => styles[s]).join(' ')}>
                <div ref={(elem) => this.container = elem} style={{flexGrow: 1, position: 'relative'}}>

                </div>
            </div>
        )
    }
}
