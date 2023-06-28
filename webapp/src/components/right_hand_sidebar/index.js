import { connect } from 'react-redux'
import RightHandSideBar from './rightHandSidebar'
import { bindActionCreators } from 'redux'
import { getList, getPluginServerRoute } from 'selectors'
import { callList } from '../../actions'

const mapStateToProps = (state, ownProps) => {
    return {
        data: getPluginServerRoute(state),
        listData: getList(state),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({

        }, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RightHandSideBar)