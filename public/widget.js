/**
 * Contractor SaaS Widget Loader
 * This script can be embedded on contractor websites to display the estimator widget
 *
 * Usage:
 * <script src="https://yourapp.com/widget.js" data-contractor-id="CONTRACTOR_ID"></script>
 */

(function() {
  'use strict';

  // Configuration
  var WIDGET_BASE_URL = window.location.origin;
  var WIDGET_VERSION = '1.0.0';
  var DEFAULT_HEIGHT = 600;

  // Find the script element
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];

  // Get contractor ID from data attribute
  var contractorId = currentScript.getAttribute('data-contractor-id');

  if (!contractorId) {
    console.error('Contractor SaaS Widget: No contractor ID provided');
    return;
  }

  // Create container
  var container = document.createElement('div');
  container.id = 'contractor-widget-container';
  container.style.cssText = [
    'position: fixed',
    'bottom: 20px',
    'right: 20px',
    'z-index: 999999',
    'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  ].join('; ');

  // Create widget button
  var widgetButton = document.createElement('button');
  widgetButton.id = 'contractor-widget-button';
  widgetButton.style.cssText = [
    'width: 60px',
    'height: 60px',
    'border-radius: 30px',
    'background: #2563EB',
    'border: none',
    'box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3)',
    'cursor: pointer',
    'display: flex',
    'align-items: center',
    'justify-content: center',
    'transition: transform 0.2s, box-shadow 0.2s',
    'position: relative'
  ].join('; ');

  // Button hover effect
  widgetButton.onmouseenter = function() {
    this.style.transform = 'scale(1.05)';
    this.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
  };
  widgetButton.onmouseleave = function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
  };

  // Button icon (calculator icon)
  widgetButton.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="16" y2="18"/></svg>';

  // Create iframe container
  var iframeContainer = document.createElement('div');
  iframeContainer.id = 'contractor-widget-iframe-container';
  iframeContainer.style.cssText = [
    'position: absolute',
    'bottom: 70px',
    'right: 0',
    'width: 400px',
    'height: 600px',
    'max-height: calc(100vh - 100px)',
    'max-width: calc(100vw - 40px)',
    'border-radius: 16px',
    'overflow: hidden',
    'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15)',
    'display: none',
    'background: white'
  ].join('; ');

  // Create loading spinner
  var loadingSpinner = document.createElement('div');
  loadingSpinner.style.cssText = [
    'position: absolute',
    'top: 0',
    'left: 0',
    'right: 0',
    'bottom: 0',
    'display: flex',
    'align-items: center',
    'justify-content: center',
    'background: white'
  ].join('; ');
  loadingSpinner.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></svg>';

  // Create iframe
  var iframe = document.createElement('iframe');
 iframe.src = `https://esitmationstation.netlify.app/widget/${contractorId}`;
  iframe.style.cssText = [
    'width: 100%',
    'height: 100%',
    'border: none',
    'border-radius: 16px'
  ].join('; ');
  iframe.setAttribute('title', 'Get an Estimate');

  // Add iframe to container
  iframeContainer.appendChild(loadingSpinner);
  iframeContainer.appendChild(iframe);
  container.appendChild(iframeContainer);
  container.appendChild(widgetButton);

  // Insert container
  document.body.appendChild(container);

  // Handle iframe load
  iframe.onload = function() {
    loadingSpinner.style.display = 'none';
  };

  // Listen for messages from iframe
  window.addEventListener('message', function(event) {
    // Verify origin (in production, check against your domain)
    if (event.data && event.data.type === 'widget-resize') {
      var newHeight = event.data.height;
      if (newHeight && newHeight > 0) {
        iframeContainer.style.height = newHeight + 'px';
      }
    }
  });

  // Toggle widget
  var isOpen = false;
  widgetButton.onclick = function() {
    isOpen = !isOpen;
    iframeContainer.style.display = isOpen ? 'block' : 'none';

    if (isOpen) {
      // Rotate the button to show close icon
      widgetButton.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    } else {
      // Show calculator icon
      widgetButton.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="16" y2="18"/></svg>';
    }
  };

  // Expose API for customization
  window.ContractorWidget = {
    open: function() {
      if (!isOpen) {
        widgetButton.click();
      }
    },
    close: function() {
      if (isOpen) {
        widgetButton.click();
      }
    },
    setPrimaryColor: function(color) {
      widgetButton.style.background = color;
      widgetButton.style.boxShadow = '0 4px 12px ' + color + '40';
    }
  };

  console.log('Contractor SaaS Widget loaded (v' + WIDGET_VERSION + ')');
})();
