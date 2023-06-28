import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem, {
    useTreeItem
} from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import { Button, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import * as React from 'react';
const CustomContent = React.forwardRef(function CustomContent(
    props,
    ref,
) {

    const [assigneeModal, setAssigneeModal] = React.useState(false);
    const {
        classes,
        className,
        label,
        nodeId,
        icon: iconProp,
        expansionIcon,
        displayIcon,
    } = props;

    const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        handleSelection,
        preventSelection,
    } = useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;

    const handleMouseDown = (event) => {
        preventSelection(event);
    };

    const handleExpansionClick = (event) => {
        handleExpansion(event);
    };

    const handleSelectionClick = (event) => {
        handleSelection(event);
    };

    const toggleAssigneeModal = (value) => {
        setAssigneeModal(value);
    }

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            onMouseDown={handleMouseDown}
            ref={ref}
        >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={handleExpansionClick} className={classes.iconContainer}>
                {icon}
            </div>
            <Typography
                onClick={handleSelectionClick}
                component="div"
                className={classes.label}
                style={{ fontSize: '2rem' }}
            >

                <a href={nodeId} target="_blank" style={{ textAlign: 'left' }}  >{label}</a>

            </Typography>
        </div>
    );
});


function CustomTreeItem(props) {
    return <TreeItem ContentComponent={CustomContent} {...props} />;
}

export const RightHandSideBar = (props) => {
    let menuData = props.listData;
    let url = props.data;
    menuData = menuData.sort(function (a, b) {
        if (a.locale != b.locale) {
            return a.locale.localeCompare(b.locale);
        }

        return a.path.localeCompare(b.path);

    })

    const folderStruct = new Map();
    console.log(menuData);
    menuData.forEach((item) => {
        if (!folderStruct.has(item.locale)) {
            folderStruct.set(item.locale, []);
            folderStruct.get(item.locale).push(item.path);
        } else {
            folderStruct.get(item.locale).push(item.path);
        }
    });

    console.log(folderStruct);
    const innerComponent = menuData.map((item) => {
        return (<CustomTreeItem nodeId={url + "/" + item.locale + "/" + item.path} label={item.title} />)
    });

    console.log(innerComponent)

    let prev;

    for (let index = 0; index < menuData.length; index++) {
        const element = menuData[index];

    }
    return (
        <TreeView
            aria-label='icon expansion'
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
        >



            <CustomTreeItem nodeId={"0" + "_1"} label={"item.path"} >
                {
                    innerComponent
                }
            </CustomTreeItem>
            {/* 
            <CustomTreeItem nodeId="1" label="Applications">

                
            </CustomTreeItem>
            <CustomTreeItem nodeId="2" label="Calendar" /> */}
        </TreeView>
    )
}


export default RightHandSideBar