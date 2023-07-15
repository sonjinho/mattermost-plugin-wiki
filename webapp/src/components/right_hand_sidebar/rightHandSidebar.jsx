import * as React from 'react';
import TreeMenu from 'react-simple-tree-menu';
import '../../../node_modules/react-simple-tree-menu/dist/main.css';
import './rightHandSidebar.css'
export const RightHandSideBar = (props) => {

    let menuData = props.listData;
    console.log(menuData)

    return (
        <>
            <div className="rightHandSidebarWiki">
                <TreeMenu data={menuData}
                    onClickItem={({ key, label, url, ...props }) => {
                        window.open(url, '_blank'); // user defined prop
                    }}
                />
            </div >
        </>


    );
}


export default RightHandSideBar