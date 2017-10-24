import React, { Component } from "react";

import Input from "metabase/components/Input.jsx";
import TitleAndDescription from "metabase/components/TitleAndDescription.jsx";

import cx from "classnames";

export default class Header extends Component {

    static defaultProps = {
        buttons: null,
        className: "py1 lg-py2 xl-py3 wrapper",
        breadcrumb: null
    };

    render() {
        const { isEditing, name, description, breadcrumb, buttons, className, badge, result, card } = this.props;
        
        let titleAndDescription;
        if (isEditing) {
            titleAndDescription = (
                <div className="Header-title flex flex-column flex-full bordered rounded my1">
                    <Input className="AdminInput text-bold border-bottom rounded-top h3" type="text" value={name} onChange={(e) => this.props.setItemAttributeFn("name", e.target.value)} />
                    <Input className="AdminInput rounded-bottom h4" type="text" value={description} onChange={(e) => this.props.setItemAttributeFn("description", e.target.value)} placeholder="No description yet" />
                </div>
            );
        } else {
            if (name && description) {
                titleAndDescription = (
                    <TitleAndDescription
                        title={name}
                        description={description}
                    />
                );
            } else {
                titleAndDescription = (
                    <div className="flex align-baseline">
                        <h1 className="Header-title-name my1">{name}</h1> {breadcrumb}
                        {
                            card &&
                            card['creator'] && 
                            card['creator']['common_name'] &&
                            <div style={{
                                fontSize: 12,
                                color: 'rgb(198, 198, 198)',
                                paddingLeft: 15
                            }}>
                                {card['creator']['common_name']}
                            </div>
                        }
                        {
                            result &&
                            result['running_time'] &&
                            <div style={{
                                fontSize: '12px',
                                border: '1px solid #fff',
                                backgroundColor: '#509EE3',
                                padding: '2px 6px',
                                marginLeft: '20px',
                                borderRadius: '20px',
                                color:'#fff'
                            }}>{Number(result['running_time'] / 1000).toFixed(3)}s</div>
                        }
                    </div>
                );
            }
        }

        return (
            // TODO Atte Keinänen 5/16/17 Take care of the mobile layout with the multimetrics UI
            <div className={cx("QueryBuilder-section pt2 sm-pt2 flex align-center", className)}>
                <div className={cx("relative flex-full")}>
                    {titleAndDescription}
                    { badge &&
                    <div>{badge}</div>
                    }
                </div>
                {
                    this.props.children && 
                    <div className={cx("relative flex-full")}>{this.props.children}</div>
                }
                <div className="flex-align-right hide sm-show">
                    {buttons}
                </div>
            </div>
        );
    }
}
