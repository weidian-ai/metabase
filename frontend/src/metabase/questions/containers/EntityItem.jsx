/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Item from "../components/Item.jsx";

import { setItemSelected, setFavorited, setArchived } from "../questions";
import { makeGetItem } from "../selectors";
import {getUser} from "metabase/selectors/user";

const makeMapStateToProps = () => {
    const getItem = makeGetItem()
    const mapStateToProps = (state, props) => {
        return {
            item: getItem(state, props),
            user: getUser(state)
        };
    };
    return mapStateToProps;
}

const mapDispatchToProps = {
    setItemSelected,
    setFavorited,
    setArchived
};

@connect(makeMapStateToProps, mapDispatchToProps)
export default class EntityItem extends Component {
    static propTypes = {
        item:               PropTypes.object.isRequired,
        setItemSelected:    PropTypes.func.isRequired,
        setFavorited:       PropTypes.func.isRequired,
        setArchived:        PropTypes.func.isRequired,
        editable:           PropTypes.bool,
        showCollectionName: PropTypes.bool,
        onEntityClick:      PropTypes.func,
        onMove:             PropTypes.func,
        user:               PropTypes.object
    };

    render() {
        let { item, editable, setItemSelected, setFavorited, setArchived, onMove, onEntityClick, showCollectionName,entityId,user } = this.props;
        
        return (
            <li className="relative" style={{ display: item.visible ? undefined : "none" }} data-buried="true" data-ec="question" data-ea={entityId}>
                <Item
                    setItemSelected={editable ? setItemSelected : null}
                    setFavorited={editable ? setFavorited : null}
                    setArchived={editable ? setArchived : null}
                    onMove={editable ? onMove : null}
                    onEntityClick={onEntityClick}
                    showCollectionName={showCollectionName}
                    entity={item}
                    user={user}
                    {...item}
                />
            </li>
        )
    }
}
