import { connect } from 'react-redux'
import Root from './root';

const mapState2Props = (state: any) => ({
    visiable: true
})

export default connect(mapState2Props)(Root);
