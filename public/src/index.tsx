import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'react-toastify/dist/ReactToastify.min.css';
import 'storm-react-diagrams/dist/style.min.css';
import './styles/global.scss';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
