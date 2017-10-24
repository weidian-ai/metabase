import React, {Component} from 'react'
import Icon from "metabase/components/Icon";
import OnClickOutsideWrapper from "metabase/components/OnClickOutsideWrapper";
import _ from "underscore";
import cx from "classnames";

const CIRCLE_SIZE = 36;
const POPOVER_WIDTH = 150;

export default class IntlUniversal extends Component {
    constructor(props) {
        super(props);
        this.onSelectLocale = this.onSelectLocale.bind(this);
        this.state = {
             langIndex: localStorage.getItem('currentIndex') || 0,
             iconIsVisible: false,
             popoverIsOpen: false,
             isClosing: false,
             selectedActionIndex: null
        }
    }
    componentWillMount() {
        this.SUPPOER_LOCALES = this.props.SUPPOER_LOCALES;
        window.addEventListener("mousemove", this.handleMouseMoved, false);
    }

    componentWillUnmount() {
        window.removeEventListener("mousemove", this.handleMouseMoved, false);
    }

    handleMouseMoved = () => {
        // Don't auto-show or auto-hide the icon if popover is open
        if (this.state.popoverIsOpen) return;

        if (!this.state.iconIsVisible) {
            this.setState({ iconIsVisible: true });
        }
        this.handleMouseStoppedMoving();
    };

    handleMouseStoppedMoving = _.debounce(
        () => {
            if (this.state.iconIsVisible) {
                this.setState({ iconIsVisible: false });
            }
        },
        1000
    );
    close = () => {
        this.setState({ isClosing: true, popoverIsOpen: false, selectedActionIndex: null });
        // Needed because when closing the action widget by clicking compass, this is triggered first
        // on mousedown (by OnClickOutsideWrapper) and toggle is triggered on mouseup
        setTimeout(() => this.setState({ isClosing: false }), 600);
    };

    toggle = () => {
        if (this.state.isClosing) return;
        this.setState({
            popoverIsOpen: !this.state.popoverIsOpen
        });
    };
    
    onSelectLocale(index) {
        let lang = ""
        try{
            lang = this.SUPPOER_LOCALES[index]['value']
        }catch (e){

        }
        this.setState({
            langIndex: index
        })
        localStorage.setItem('currentLocale', lang)
        localStorage.setItem('currentIndex', index)
        location.reload()
    }

    render() {
        const { className } = this.props;
        const { popoverIsOpen, iconIsVisible } = this.state;
        return (
            <div className={cx(className, "relative")} style={{bottom:"60px", position:"fixed"}}>
                <div
                    className="circular bg-brand flex layout-centered m3 cursor-pointer"
                    style={{
                        width: CIRCLE_SIZE,
                        height: CIRCLE_SIZE,
                        transition: "opacity 300ms ease-in-out",
                        opacity: popoverIsOpen || iconIsVisible ? 1 : 0,
                        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)"
                    }}
                    onClick={this.toggle}
                >
                    <span style={{color:"#fff", fontWeight:"bold"}}>{this.SUPPOER_LOCALES[this.state.langIndex]['title']}</span>
                </div>
                {popoverIsOpen &&
                    <OnClickOutsideWrapper handleDismissal={() => {
                        this.close();
                    }}>
                        <div
                            className="absolute bg-white rounded bordered shadowed py1"
                            style={{
                                width: POPOVER_WIDTH,
                                bottom: "50%",
                                right: "50%",
                                zIndex: -1
                            }}
                        >
                            {this.SUPPOER_LOCALES.map((lang, index) => (
                                <div
                                    key={index}
                                    className="p2 flex align-center text-grey-4 brand-hover cursor-pointer"
                                    onClick={() =>
                                        this.onSelectLocale(index)}
                                >
                                    {lang.icon &&
                                        <Icon
                                            name={lang.value}
                                            className="mr1 flex-no-shrink"
                                            size={16}
                                        />}
                                    <div>
                                        {lang.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </OnClickOutsideWrapper>}
            </div>
        );
    }
}