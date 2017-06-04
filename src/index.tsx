import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './app'

interface Hoge {
  abc: string;
}

ReactDOM.render(<App />, document.querySelector('#root'))