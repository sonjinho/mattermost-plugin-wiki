import * as React from 'react';
import { TreeItem, TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderTree, { testData } from 'react-folder-tree';
import Demo from './demo';


export interface IRightHandSideViewProps {
}
export default class RightHandSideView extends React.Component<IRightHandSideViewProps> {
    onTreeStateChange = (state: any, event: any) => console.log(state, event);

    public render() {
        const style = {
            rhs: {
                padding: '10px',
            },
        };

        return (
            <Demo />
        );
    }
}
