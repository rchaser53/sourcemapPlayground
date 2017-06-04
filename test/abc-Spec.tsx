import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { shallow, mount, render } from 'enzyme'
import App from '../src/app'

describe('add関数のテスト', () => {
  it('1 + 2 は 3', () => {
    expect(1 + 2).toBe(3);
  });

  it('should render App', () => {
    const app = shallow(<App />);
    expect(app.length).toBe(1);
  });
});
