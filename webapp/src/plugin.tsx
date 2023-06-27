import { Store, Action } from 'redux';

import { GlobalState } from '@mattermost/types/lib/store';

import { id as pluginId } from './manifest';

import { PluginRegistry } from './types/mattermost-webapp';
import React from 'react';
import Root from 'components/root/root';
import left_sidebar_header from 'components/left_sidebar_header';
import RightHandSideView from 'components/right_hand_sidebar/RightHandSideView';

const Icon = () => <i className='icon fa fa-plug' />

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        // const { toggleRHSPlugin, showRHSPlugin } = registry.registerRightHandSidebarComponent(SidebarRight, 'Todo List');
        registry.registerRootComponent(Root)
        registry.registerLeftSidebarHeaderComponent(left_sidebar_header)
        const { toggleRHSPlugin } = registry.registerRightHandSidebarComponent(RightHandSideView, <p>hello</p>)
        registry.registerMainMenuAction(
            "Hello world",
            () => {
                alert(pluginId)
            },
            <Icon />
        )
        registry.registerChannelHeaderButtonAction(
            // icon - JSX element to use as the button's icon
            <Icon />,
            // action - a function called when the button is clicked, passed the channel and channel member as arguments
            // null,
            () => store.dispatch(toggleRHSPlugin),
            // dropdown_text - string or JSX element shown for the dropdown button description
            "Hello World",
        );
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin(pluginId, new Plugin());
