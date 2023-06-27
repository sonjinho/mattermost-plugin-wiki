import { any } from 'prop-types';
import * as React from 'react';
import { connect } from 'react-redux'

export interface ILeftSideBarHeaderProps {
}

class LeftSideBarHeader extends React.Component<ILeftSideBarHeaderProps> {
    public render() {
        const iconStyle = {
            display: 'inline-block',
            margin: '0 7px 0 1px',
        };
        const style = {
            margin: '.5em 0 .5em',
            padding: '0 12px 0 15px',
            color: 'rgba(255,255,255,0.6)',
        };
        return (
            <div style={style}>
                <i
                    className='icon fa fa-plug'
                    style={iconStyle}
                    onClick={() => { alert("onclick") }}
                />
            </div>
        );
    }
}

const mapState2Props = (state: any) => {
    return {
    };
}

export default connect(mapState2Props)(LeftSideBarHeader);
