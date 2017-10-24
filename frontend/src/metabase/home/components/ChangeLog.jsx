import React, { Component } from "react";
import emoji from "node-emoji";
import SidebarSection from "./SidebarSection.jsx";
import ChangeLogItem from "./ChangeLogItem.jsx";
import logFields from "resource/change.log";

const noneFieldsStyle = {
    padding: "15px",
    textAlign: "center",
    fontSize: "18px"
}

export default class ChangeLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            next: true
        }
    }
    render() {
        const { next } = this.state;
        if (next) {
            return (
                <SidebarSection title="DEVELOPMENT PROGRESS" icon="info">
                        {
                            logFields.length > 0 ? 
                            logFields.map((value, index) => <ChangeLogItem deveInfo={value} key={index} />) : 
                            (<p style={noneFieldsStyle}>
                                <span style={{paddingRight:"10px"}}>{emoji.get('sweat')}</span>
                                <span>暂无发版记录</span>
                            </p>)
                        }
                </SidebarSection>
            )
        } else {
            return <span className="hide" />
        }
    }
}
