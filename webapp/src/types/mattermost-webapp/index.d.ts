export interface PluginRegistry {
    [x: string]: any;
    registerPostTypeComponent(typeName: string, component: React.ElementType)

    // Add more if needed from https://developers.mattermost.com/extend/plugins/webapp/reference
}
