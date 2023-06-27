// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {createSelector} from 'reselect';

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {id as PluginId} from '../manifest';
import { GlobalState } from 'mattermost-redux/types/store';

const getPluginState = (state: { [x: string]: any; }) => state['plugins-' + PluginId] || {};

export const getPluginServerRoute = (state: GlobalState) => {
    const config = getConfig(state);

    let basePath = '';
    if (config && config.SiteURL) {
        basePath = new URL(config.SiteURL).pathname;

        if (basePath && basePath[basePath.length - 1] === '/') {
            basePath = basePath.substr(0, basePath.length - 1);
        }
    }

    return basePath + '/plugins/' + PluginId;
};

export const getCurrentUserLocale = createSelector(
    getCurrentUser,
    (user) => {
        let locale = 'en';
        if (user && user.locale) {
            locale = user.locale;
        }

        return locale;
    }
);

export const isConnectModalVisible = (state: any) => getPluginState(state).connectModalVisible;
export const isDisconnectModalVisible = (state: any) => getPluginState(state).disconnectModalVisible;

export const isCreateModalVisible = (state: any) => getPluginState(state).createModalVisible;

export const getCreateModal = (state: any) => getPluginState(state).createModal;

export const isAttachCommentToIssueModalVisible = (state: any) => getPluginState(state).attachCommentToIssueModalVisible;

export const getAttachCommentToIssueModalForPostId = (state: any) => getPluginState(state).attachCommentToIssueModalForPostId;

export const getChannelIdWithSettingsOpen = (state: any) => getPluginState(state).channelIdWithSettingsOpen;

export const getChannelSubscriptions = (state: any) => getPluginState(state).channelSubscriptions;

export const canUserConnect = (state: any) => getPluginState(state).userCanConnect;

export const getDefaultUserInstanceID = (state: any) => getPluginState(state).defaultUserInstanceID;

export const getPluginSettings = (state: any) => getPluginState(state).pluginSettings;