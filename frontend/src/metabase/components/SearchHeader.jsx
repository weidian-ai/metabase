/* eslint "react/prop-types": "warn" */
import React from "react";
import PropTypes from "prop-types";
import S from "./SearchHeader.css";
import Icon from "metabase/components/Icon.jsx";
import cx from "classnames";

const SearchHeader = ({ searchText, setSearchText, autoFocus, inputRef, resetSearchText, placeholder, style }) =>
    <div className="flex align-center"  style={style}>
        <Icon className={S.searchIcon} name="search" size={18} />
        <input
            className={cx("input bg-transparent", S.searchBox)}
            type="text"
            placeholder={placeholder || "Filter this list..."}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus={!!autoFocus}
            ref={inputRef || (() => {})}
            style={style}
        />
        { resetSearchText && searchText !== "" &&
            <Icon
                name="close"
                className="cursor-pointer text-grey-2"
                size={18}
                onClick={resetSearchText}
            />
        }
    </div>

SearchHeader.propTypes = {
    searchText: PropTypes.string.isRequired,
    setSearchText: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    inputRef: PropTypes.func,
    resetSearchText: PropTypes.func
};

export default SearchHeader;
