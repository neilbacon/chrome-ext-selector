# chrome-ext-selector

## Introduction
This is a trail of using a Chrome browser [extension](https://developer.chrome.com/extensions) to find CSS selectors to extract information elements from web pages.

## Installation
Drag the `chrome-ext-selector` directory onto the browser's [Extensions](chrome://extensions/) page (which you can open from the previous link or with `menu` > `More tools` > `Extensions`).

## Usage
Intended usage:
1. open web page of interest
2. click on the extension icon to show its popup
3. in the popup select the name of the information element you wish to extract (e.g. Price)
4. in the page of interest click on an example of the information element (e.g. a price). With the popup activated links in the page are disabled, making it possible to select a link without opening it.
5. The popup displays a CSS selector that uniquely selects the element that was chosen and the element matching the selector is shown with a red border.
6. manually edit the selector in the popup to perhaps simplify it or generalise it to match multiple prices and lose the focus on the edited item (e.g. select another editable item in the popup)
7. Elements matching the edited selector are shown with a red border.
8. Once the user is happy with the selector it can be used in a crawler/parser to automatically extract information in bulk.

At the moment it only works with the Extension open in Developer tools:
1. click on the extension icon to show its popup
2. on the extension icon `right-click`  > `Inspect popup`

The popup's javascript may need to be moved to a `background page` to fix this.

