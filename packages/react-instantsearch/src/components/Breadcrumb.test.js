import PropTypes from 'prop-types';
/* eslint-env jest, jasmine */

import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Breadcrumb from './Breadcrumb';
import Link from './Link';
describe('Breadcrumb', () => {
  it('outputs the default breadcrumb', () => {
    const tree = renderer
      .create(
        <Breadcrumb
          cx={(...x) => x.join(' ')}
          refine={() => null}
          createURL={() => '#'}
          items={[
            {
              value: 'white',
              label: 'white',
            },
            {
              value: 'white > white1',
              label: 'white1',
            },
            {
              value: 'white > white1 > white1.1',
              label: 'white1.1',
            },
          ]}
          canRefine={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('refines its value on change', () => {
    const refine = jest.fn();
    const wrapper = mount(
      <Breadcrumb
        cx={(...x) => x.join(' ')}
        refine={refine}
        createURL={() => '#'}
        items={[
          {
            value: 'white',
            label: 'white',
          },
          {
            value: 'white > white1',
            label: 'white1',
          },
          {
            value: 'white > white1 > white1.1',
            label: 'white1.1',
          },
        ]}
        canRefine={true}
      />
    );

    const breadcrumb = wrapper.find('.list');

    expect(breadcrumb.children()).toHaveLength(4);

    breadcrumb
      .children()
      .first()
      .find(Link)
      .simulate('click');
    expect(refine.mock.calls).toHaveLength(1);
    expect(refine.mock.calls[0][0]).toEqual();

    breadcrumb
      .children()
      .at(1)
      .find(Link)
      .simulate('click');
    expect(refine.mock.calls).toHaveLength(2);
    expect(refine.mock.calls[1][0]).toEqual('white');

    breadcrumb
      .children()
      .at(2)
      .find(Link)
      .simulate('click');
    expect(refine.mock.calls).toHaveLength(3);
    expect(refine.mock.calls[2][0]).toEqual('white > white1');

    const lastItem = breadcrumb
      .children()
      .at(3)
      .find(Link);

    expect(lastItem).toHaveLength(0);

    wrapper.unmount();
  });

  it('has a rootURL prop', () => {
    const refine = jest.fn();
    const rootLink = 'www.algolia.com';

    const wrapper = mount(
      <Breadcrumb
        cx={(...x) => x.join(' ')}
        refine={refine}
        createURL={() => '#'}
        rootURL={rootLink}
        items={[
          {
            value: 'white',
            label: 'white',
          },
          {
            value: 'white > white1',
            label: 'white1',
          },
          {
            value: 'white > white1 > white1.1',
            label: 'white1.1',
          },
        ]}
        canRefine={true}
      />
    );

    const breadcrumb = wrapper.find('.list');

    expect(breadcrumb.children()).toHaveLength(4);

    breadcrumb
      .children()
      .first()
      .find(Link)
      .simulate('click');
    expect(refine.mock.calls).toHaveLength(0);
    expect(
      wrapper
        .find('a')
        .first()
        .prop('href')
    ).toEqual('www.algolia.com');

    wrapper.unmount();
  });

  it('has a separator prop that can be a custom component', () => {
    const tree = renderer
      .create(
        <Breadcrumb
          cx={(...x) => x.join(' ')}
          refine={() => null}
          createURL={() => '#'}
          separator={<span>🔍</span>}
          items={[
            {
              value: 'white',
              label: 'white',
            },
            {
              value: 'white > white1',
              label: 'white1',
            },
            {
              value: 'white > white1 > white1.1',
              label: 'white1.1',
            },
          ]}
          canRefine={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('has customizable translations', () => {
    const tree = renderer
      .create(
        <Breadcrumb
          cx={(...x) => x.join(' ')}
          refine={() => null}
          createURL={() => '#'}
          translations={{
            rootLabel: 'ROOT_LABEL',
          }}
          items={[
            {
              value: 'white',
              label: 'white',
            },
            {
              value: 'white > white1',
              label: 'white1',
            },
            {
              value: 'white > white1 > white1.1',
              label: 'white1.1',
            },
          ]}
          canRefine={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
