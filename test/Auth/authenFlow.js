import loginPage from "../pageobjects/login.page.js";
import securePage from "../pageobjects/secure.page.js";

class AuthenFlow {
    async login(username, password) {
        await loginPage.open();
        await loginPage.fillUsername(username);
        await loginPage.fillPassword(password);
        await loginPage.clickLogin();
    }
    
    async verifyLoginSuccessfully(expectedMessage) {
        await expect(securePage.flashAlert).toBeExisting();
        await expect(securePage.flashAlert).toHaveText(
            expect.stringContaining(expectedMessage)
        );
    }
}

export default new AuthenFlow();