import { Client4 } from 'mattermost-redux/client';
import { getPluginServerRoute } from '../selectors';
import ActionTypes from 'action_types';

export function setRhsVisible(payload) {
    return {
        type: ActionTypes.SET_RHS_VISIBLE,
        payload,
    }
}
export const callBoards = () => async (dispatch, getState) => {
    let resp;
    let data;
    try {
        resp = await fetch("http://mattermost.gclswhub.com/plugins/focalboard/api/v2/boards/b59dcgjxtx7dwme1o5udhfok4rc/blocks?all=true", Client4.getOptions({
            method: 'get',
        }))
        data = await resp.json();

        console.log(data.filter(item => item.parentId === item.boardId && item.title != "").map((item) => {
            return {
                id: item.id,
                title: item.title,
                createAt: new Date(item.createAt),
                updateAt: new Date(item.updateAt),
            }
        }));
    } catch (error) {
        console.log(error);
        return { error };
    }
    let actionType = ActionTypes.GET_LIST_DATA_;

    dispatch({
        type: actionType,
        payload: data,
    });

    return { data };
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