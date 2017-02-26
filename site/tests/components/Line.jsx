'use strict';

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Line from '../../app/components/Line.jsx';

describe('<Line />', function() {
    it('sets a h1 with the line name', function() {
        const name = 'Distract Line';
        const line = {
            urlKey: 'distract-line',
            name: name
        };

        expect(shallow(<Line line={line} />).find('h1').text()).to.equal(name);
    });
});