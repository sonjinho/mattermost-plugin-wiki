// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.


import ActionTypes from 'action_types';
import { combineReducers } from 'redux';


function isRhsVisible(state = false, action) {
    switch (action.type) {
        case ActionTypes.SET_RHS_VISIBLE:
            return action.payload;
        default:
            return state;
    }
}

const list = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.GET_LIST_DATA:
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({
    isRhsVisible,
    list,
})