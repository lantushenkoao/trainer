/// <reference path="./mxGraph.d.ts"/>

import './editor/styles/grapheditor.css';

import 'script-loader!./editor/deflate/pako.min.js';
import 'script-loader!./editor/deflate/base64.js';
import 'script-loader!./editor/jscolor/jscolor.js';
import 'script-loader!./editor/sanitizer/sanitizer.min.js';

import 'script-loader!./editor/js/Init.js';
import 'script-loader!@epicfaace/mxgraph/javascript/mxClient.js';

import 'script-loader!./editor/js/EditorUi.js';
import 'script-loader!./editor/js/Editor.js';
import 'script-loader!./editor/js/Sidebar.js';
import 'script-loader!./editor/js/Graph.js';
import 'script-loader!./editor/js/Format.js';
import 'script-loader!./editor/js/Shapes.js';
import 'script-loader!./editor/js/Actions.js';
import 'script-loader!./editor/js/Menus.js';
import 'script-loader!./editor/js/Toolbar.js';
import 'script-loader!./editor/js/Dialogs.js';

// Adds required resources (disables loading of fallback properties, this can only
// be used if we know that all keys are defined in the language specific file)
mxResources.loadDefaultBundle = false;
