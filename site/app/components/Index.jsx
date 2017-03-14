'use strict';

import React from 'react';
import {Link} from 'react-router-dom';

const Index = () => (
    <div>
        <h1>Home</h1>
        <Link to="/settings">Settings</Link>
    </div>
);

export default Index;