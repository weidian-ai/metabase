/* @flow weak */

import React, {Component} from "react";
import {connect} from "react-redux";
import intl from "wd-react-intl-universal";
import _ from "underscore";
import http from "metabase/lib/http";

import Navbar from "metabase/nav/containers/Navbar.jsx";

import UndoListing from "metabase/containers/UndoListing";

import NotFound from "metabase/components/NotFound.jsx";
import Unauthorized from "metabase/components/Unauthorized.jsx";
import Archived from "metabase/components/Archived.jsx";
import IntlUniversal from "metabase/intl/IntlUniversal.jsx";

// const mapStateToProps = (state, props) => ({
//     errorPage: state.app.errorPage
// });

const mapStateToProps = (state, props) => {
    if(state.currentUser) {
        localStorage.setItem("user", `${state.currentUser['first_name']}${state.currentUser['last_name']}`)
    }
    return {
        errorPage: state.app.errorPage
    }
}

const getErrorComponent = ({status, data, context}) => {
    if (status === 403) {
        return <Unauthorized />
    } else if (data && data.error_code === "archived" && context === "dashboard") {
        return <Archived entityName="dashboard" linkTo="/dashboards/archive" />
    } else if (data && data.error_code === "archived" && context === "query-builder") {
        return <Archived entityName="question" linkTo="/questions/archive" />
    } else {
        return <NotFound />
    }
}

const SUPPOER_LOCALES = [
    {
        name: "ENGLISH",
        value: "en-US",
        title: "EN"
    },
    {
        name: "简体中文",
        value: "zh-CN",
        title: "中"
    }
];

@connect(mapStateToProps)
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initDone: false
        }
    }
    componentWillMount() {
        //  set a global var
        // window.intlUniversal = intl
        if(!localStorage.getItem('currentLocale')){
            localStorage.setItem('currentLocale', 'en-US')
        }
    }
    componentDidMount() {
        this.loadLocales();
    }
    loadLocales() {
        let currentLocale = intl.determineLocale({
            urlLocaleKey: "lang",
            cookieLocaleKey: "lang",
            localStorageKey: "currentLocale"
        });
        
        if (!_.find(SUPPOER_LOCALES, { value: currentLocale })) {
            currentLocale = "en-US";
        }

        http
            .get(`app/assets/locales/${currentLocale}.json?t=${Date.now()}`)
            .then(res => {
                // init method will load CLDR locale data according to currentLocale
                return intl.init({
                    currentLocale,
                    locales: {
                        [currentLocale]: res
                    }
                });
            })
            .then(() => {
                this.setState({ initDone: true })
            });
    }
    render() {
        const { children, location, errorPage } = this.props;
        return (
            this.state.initDone &&
            <div className="spread flex flex-column">
                <IntlUniversal SUPPOER_LOCALES={SUPPOER_LOCALES} className="z2 absolute bottom right"/>
                {/* {intl.getHTML('TIP')} */}
                <Navbar location={location} className="flex-no-shrink"/>
                { errorPage ? getErrorComponent(errorPage) : children }
                <UndoListing />
            </div>
        )
    }
}
