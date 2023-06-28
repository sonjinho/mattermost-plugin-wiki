import { Client4 } from 'mattermost-redux/client';
import { getPluginServerRoute } from '../selectors';
import ActionTypes from 'action_types';

export function setRhsVisible(payload) {
    return {
        type: ActionTypes.SET_RHS_VISIBLE,
        payload,
    }
}

export const callList = () => async (dispatch, getState) => {
    let resp;
    let data;
    try {
        resp = await fetch(getPluginServerRoute(getState()) + '/list', Client4.getOptions({
            method: 'get',
            credentials: 'include'
        }));
        data = await resp.json();
        data = data.pages;
    } catch (error) {
        return { error };
    }

    let actionType = ActionTypes.GET_LIST_DATA;

    dispatch({
        type: actionType,
        payload: data,
    });

    return { data };
};

export function setShowRHSAction(showRHSPluginAction) {
    return {
        type: RECEIVED_SHOW_RHS_ACTION,
        payload: showRHSPluginAction,
    };
}