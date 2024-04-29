import { h } from 'preact';
import { useContext, useState, useMemo, useEffect } from 'preact/hooks';
import cn from 'classnames';
import style from './subscriptionPopUp.css';
import { ConfigContext, ServiceContext, GlobalsContext } from '../AppContext';
import { useIsMounted } from '../hooks';
import { RouteLink, RouterContext } from '../layout/Router';
import IconMail from '../components/icons/IconMail';
import IconBells from '../components/icons/IconBells';
import IconAngleDoubleDown from '../components/icons/IconAngleDoubleDown';
import IconAngleDoubleUp from '../components/icons/IconAngleDoubleUp';
import IconCellphoneText from '../components/icons/IconCellphoneText';
import IconBell from '../components/icons/IconBell';
import IconCloseCircle from '../components/icons/IconCloseCircle';
import IconGraphDownArrow from '../components/icons/IconGraphDownArrow';


const SubscriptionPopUp = () => {
  const config = useContext(ConfigContext);
  const service = useContext(ServiceContext);
  const router = useContext(RouterContext);
  const mounted = useIsMounted();


  const { widgetOpen, setWidgetOpen , widgetVars } = useContext(GlobalsContext);



  const [originalPrice, setOriginalPrice] = useState(100.00);
  const [currentPrice, setCurrentPrice] = useState(100.00);

  const changePrice = (direction: string) => {
    // Calculate delta based on direction
    const delta = direction === 'up' ? 10 : -10;

    // Calculate new price
    let newPrice = currentPrice + delta;

    // Ensure new price doesn't exceed original price
    if (direction === 'up' && newPrice > originalPrice) {
      newPrice = originalPrice;
    }

    // Ensure new price doesn't go below zero
    if (newPrice > 0) {
      setCurrentPrice(newPrice);
    }



  };

  useEffect(() => {

    console.log('widgetVars', widgetVars);
  
    setOriginalPrice(widgetVars.topic_value );
   // setCurrentPrice(widgetVars.currentPrice);
  } , [widgetVars]);


  const handleClosePopup = () => {
    setWidgetOpen(false);
  };


  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] = useState('email');

  // Function to handle changes in the subscription method
  const handleSubscriptionMethodChange = (event: any) => {
    // Update the selected subscription method state
    setSelectedSubscriptionMethod(event.target.value);
  };

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [emailValue, setEmailValue] = useState('');


  const subscribe = async () => {
    setSubmitting(true);
    // Get user input
    const requestBody = { mainInput: emailValue, subscriptionMethod: selectedSubscriptionMethod };
    // Reset messages
    setServerError('');
    // Perform input validation
    if (selectedSubscriptionMethod === "email") {
      // Check if the email is empty
      if (emailValue.trim() === "") {
        setServerError("Please enter your email.");
        setSubmitting(false);
        return;
      }
      // Check if the email format is valid
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailValue)) {
        setServerError("Please enter a valid email address.");
        setSubmitting(false);
        return;
      }
    }

    if (selectedSubscriptionMethod === "sms" && emailValue === "") {
      setServerError("Please enter your phone number.");
      setSubmitting(false);
      return;
    }

    // Show loader
    // Loader display handled in JSX based on submitting state

    try {
      const response = await fetch('https://api.pushbells-labs.com/v1/spaces/:sid/widgets/:wid/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Subscription failed
        setServerError("Subscription failed. Please try again later.");
      } else {
        // Subscription successful
        setServerError("Thank you for subscribing!");
        // Hide price block and subscription options
        // priceBlock.style.display = "none";
        // formBlock.style.display = "none";
        // upButton.classList.add('hide'); // Disable up button
        // downButton.classList.add('hide'); // Disable down button
        // Close popup after 3 seconds (for demonstration)
        // setTimeout(closePopup, 3000);
      }
    } catch (error) {
      // Handle network errors
      setServerError("An error occurred. Please try again later.");
    }

    setSubmitting(false);
  };




  // Define classes for up and down buttons based on current and original prices
  const upButtonClass = currentPrice >= originalPrice ? `${style.pointer} ${style.disabled}` : style.pointer;
  const downButtonClass = currentPrice <= 0 ? `${style.pointer} ${style.disabled}` : style.pointer;

  return (
    <div>
      {/* Popup Overlay */}
      {widgetOpen && widgetVars.topic_value && (
        <div className={cn(style.overlay, { [style.active]: true })}>
          {/* Popup Content */}
          <div className={style.popup}>
            {/* Close Button */}

            <IconCloseCircle className={cn('fas fa-times', style['close-btn'])} onClick={handleClosePopup} />

            {/* Title */}
            <div className={style.title}><IconBells /> Track deals and discounts!</div> {/* Use the IconMail component here */}

            {/* Marketing Message */}
            <p className={style['marketing-message']}>Tailor your notifications and receive exclusive offers by selecting your desired price!</p>

            {/* Price Display */}
            <div className={cn(style.row, style['price-block'])}>
              {/* Up Button */}
              <span className={upButtonClass} onClick={() => changePrice('up')}><IconAngleDoubleUp /></span>
              <div className={style.price}>
                {/* Hidden input fields to store prices */}

                <span className={style['original-price']}>${originalPrice}<IconGraphDownArrow /></span>
                <span className={style['new-price']} id="displayedPrice">${currentPrice.toFixed(2)}</span>
              </div>
              {/* Down Button */}
              <span className={downButtonClass} onClick={() => changePrice('down')}><IconAngleDoubleDown /></span>
            </div>

            {/* Confirmation Message */}
            <div className={cn(style.row, style['confirmation-message'])} id="confirmationMessage"></div>

            {/* Bottom Form Block */}
            <div className={cn(style.bottom, style['form-block'])}>


              {/* Subscription Options */}
              <div className={style['subscription-options']}>
                <label className={style['subscription-option']}>
                  <input type="radio" name="subscriptionMethod" value="email" checked={selectedSubscriptionMethod === 'email'} onChange={handleSubscriptionMethodChange} />
                  <IconMail style={{ color: selectedSubscriptionMethod === 'email' ? '#000' : '' }} /> Email
                </label>
                <label className={style['subscription-option']}>
                  <input type="radio" name="subscriptionMethod" value="sms" checked={selectedSubscriptionMethod === 'sms'} onChange={handleSubscriptionMethodChange} />
                  <IconCellphoneText style={{ color: selectedSubscriptionMethod === 'sms' ? '#000' : '' }} /> SMS
                </label>
                <label className={style['subscription-option']}>
                  <input type="radio" name="subscriptionMethod" value="push" checked={selectedSubscriptionMethod === 'push'} onChange={handleSubscriptionMethodChange} />
                  <IconBell style={{ color: selectedSubscriptionMethod === 'push' ? '#000' : '' }} /> Push
                </label>
              </div>

              {/* Main Input */}
              {selectedSubscriptionMethod !== 'push' && (
                <div className={style['input-icons']}>
                  <input type="text" value={emailValue}
                    onChange={(e) => setEmailValue((e.target as HTMLInputElement).value)} // Cast e.target to HTMLInputElement
                    className={style.input} placeholder="Enter your email" id="mainInput" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Please enter a valid email address" />
                </div>
              )}

              {/* Subscribe Button */}
              <button className={style['subscribe-btn']} onClick={subscribe}>
                <span className="subscribeBtnText">Subscribe</span>
                {selectedSubscriptionMethod === 'email' && <IconMail />}
                {selectedSubscriptionMethod === 'sms' && <IconCellphoneText />}
                {selectedSubscriptionMethod === 'push' && <IconBell />}
                <div className={style.loader} id="loader"></div>
              </button>
              {/* Error Message */}
              <div className={style['error-message']} id="errorMessage">{serverError}</div>
            </div>
          </div>
        </div>
      )}
    </div>);
};

export default SubscriptionPopUp;
