import React, {Component} from 'react'

export default class TimeDown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startTime: 0,
            endTime: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        const {isRunnable, isRunning, isDirty} = nextProps
        
        if (isRunning) {
            this.setState({
                startTime: Date.now()
            })
        } else if (isRunnable && isDirty && !isRunning) {
            this.setState({
                endTime: Date.now()
            })
        } else if (isRunnable && !isDirty) {
            this.setState({
                endTime: Date.now()
            })
        }
    }

    render() {
        const {startTime, endTime} = this.state
        return (
            <div style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                color: '#ccc'
            }}>{startTime > 0 && (endTime - startTime) > 0 && (Number((endTime - startTime)/1000).toFixed(3) + 's')}</div>
        )
    }
}
