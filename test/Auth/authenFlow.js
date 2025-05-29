import loginPage from "../pageobjects/login.page.js";
import securePage from "../pageobjects/secure.page.js";

class AuthenFlow {

    async openLoginPage() {
        await loginPage.open();
    }

    async login(username, password) {
        console.log(`Login with username: ${username} and password: ${password}`)
        await this.openLoginPage();
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

    async verifyLoginFailed(expectedMessage) {
        await expect(loginPage.flashAlert).toBeExisting();
        await expect(loginPage.flashAlert).toHaveText(
            expect.stringContaining(expectedMessage)
        );
    }
}

export default new AuthenFlow();