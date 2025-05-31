import Page from './page.js';
/**
 * sub page containing specific selectors and methods for a specific page
 */
const FLASH_ALERT = '#flash';
class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    get flashAlert () {
        return $(FLASH_ALERT);
    }
}

export default new SecurePage();
