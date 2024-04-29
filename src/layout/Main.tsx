import { h } from 'preact';
import style from './main.css';

import ThankYou from '../routes/ThankYou';
import { useContext, useState } from 'preact/hooks';
import { ConfigContext, GlobalsContext } from '../AppContext';
import clsx from 'clsx';
import TitleBar from '../components/TitleBar';
import Faq from '../routes/Faq';
import { Router, RouteComponent } from './Router';
import SubscriptionPopUp from '../routes/SubscriptionPopUp';

const Main = () => {
    const config = useContext(ConfigContext);
    const { widgetOpen } = useContext(GlobalsContext);

    const [title, setTitle] = useState('');
    const getTitle = (route: string) => {
        switch (route) {
            case '/thankyou':
                return config.text.thankYouTitle ?? 'Thank You';
            case '/faq':
                return config.text.faqTitle ?? 'FAQ';
            case '/':
            default:
                return config.text.formTitle ?? ' TTTTT';
        }
    };

    return (
        <div className={clsx(style.root, { [style.noDark]: config.disableDarkMode })}>
            <div>
                <TitleBar routeTitle={title} />
                <div className={clsx(
                    style.container,
                    { [style.minimized]: !widgetOpen },
                    config.styles.classNameContainer)}>
                    <Router
                        onChange={(r) => setTitle(getTitle(r))}
                        routes={{
                            '/': <RouteComponent component={SubscriptionPopUp} />,
                            '/thankyou': <RouteComponent component={ThankYou} />,
                            '/faq': <RouteComponent component={Faq} />
                        }} />
                </div>
            </div>
        </div >);
};

export default Main;
