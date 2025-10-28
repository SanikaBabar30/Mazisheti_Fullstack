import React, { useEffect } from 'react';

const LanguageSelector = () => {
  useEffect(() => {
    const scriptId = 'google-translate-script';
    const elementId = 'google_translate_element';

    if (typeof window !== 'undefined') {
      // Check if the script is already added
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

        // Append the script to the body
        document.body.appendChild(script);

        // Set up the script loading callback
        script.onload = () => {
          // Initialize the Google Translate widget when the script has loaded
          window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
              new window.google.translate.TranslateElement(
                {
                  pageLanguage: 'en',  // Default language
                  includedLanguages: 'en,mr',  // Languages to support
                  layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,  // Inline dropdown layout
                },
                elementId
              );
            } else {
              console.error('Google Translate script failed to load properly.');
            }
          };
        };
      }
    }
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  return <div id="google_translate_element"></div>;  // This is where the Google Translate widget will appear
};
export default LanguageSelector;