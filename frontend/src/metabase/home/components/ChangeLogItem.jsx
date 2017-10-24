import React, { Component } from "react";
import PropTypes from "prop-types";
import emoji from "node-emoji";

const styles = {
    title: {
        height: "30px",
        lineHeight: "30px",
        padding: "6px 0px 6px 6px"
    },
    fields:{
        fontSize: "13px",
        lineHeight: "24px",
        textIndent: "15px"
    },
    more: {
        paddingLeft: "6px",
        verticalAlign: 'baseline',
        color: '#509EE3'
    }
}

const renderFields = (title, arr) => {
    if(!Array.isArray(arr)) {
        return null
    }
    return (
        <div>
            <h4 style={styles['title']}>{title}<span style={{paddingLeft: "10px"}}>{emoji.get('grimacing')}</span></h4>
            <ul>
                {arr.map((value, index) => {
                    return (
                        <li style={styles['fields']} key={index}>{`${index + 1}. `}{value}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default class ChangeLogItem extends Component {
    static propTypes = {
        deveInfo: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props); 
        this.state = {
            show: false
        }
    }
    showSubFields () {
        this.setState({
            show: !this.state.show
        })
    }
    render() {
        const {title, description, added, fixed} = this.props.deveInfo
        const ADD_TITLE = "添加的功能"
        const FIX_TITLE = "修复的bug"
        
        return (
            <div className="block p3 no-decoration" 
                style={{
                    borderBottom:"1px solid rgb(229, 229, 229)",
                    cursor: "pointer"
                }}
                onClick={this.showSubFields.bind(this)}
            >
                <h4 className="text-brand text-bold">{title}<span style={{paddingLeft:"10px"}}>{emoji.get('rocket')}</span></h4>
                <p className="m0 mt1">{description}<small style={Object.assign({}, styles['more'], {
                    display: this.state.show ? 'none' : 'inline-block'
                })}>more...</small></p>
                <div className="subChangeItems" style={{display: this.state.show ? 'block' : 'none'}}>
                    {added && Array.isArray(added) && added.length && renderFields(ADD_TITLE, added)}
                    {fixed && Array.isArray(fixed) && fixed.length && renderFields(FIX_TITLE, fixed)}
                </div>
            </div>
        )
    }
}
