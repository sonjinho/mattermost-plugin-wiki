import { callList } from 'actions';
import SidebarRight from 'components/right_hand_sidebar';
import Root from 'components/root/root';
import reducers from 'reducers';


export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    async initialize(registry, store) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        // const { toggleRHSPlugin, showRHSPlugin } = registry.registerRightHandSidebarComponent(SidebarRight, 'Todo List');
        registry.registerReducer(reducers)
        registry.registerRootComponent(Root)
        const { toggleRHSPlugin, showRHSPlugin } = registry.registerRightHandSidebarComponent(SidebarRight, 'Navigation')
        registry.registerChannelHeaderButtonAction(
            // icon - JSX element to use as the button's icon
            <i className='icon fa fa-book' />,
            // action - a function called when the button is clicked, passed the channel and channel member as arguments
            // null,
            () => {
                store.dispatch(callList());
                store.dispatch(toggleRHSPlugin);
            },
            // dropdown_text - string or JSX element shown for the dropdown button description
            "Wiki.js Navigation",
        );


    }
}

