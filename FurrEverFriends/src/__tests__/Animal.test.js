import React from 'react';
import { create } from 'react-test-renderer';
import Animal from '../Animal';

test('snapshot', () => {
  const c = create(<Animal />);
  expect(c.toJSON()).toMatchSnapshot();
});
