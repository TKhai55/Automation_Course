import Page from './page.js';

const LOGIN_FIELD= "#username";
const PASSWORD_FIELD= "#password";
const LOGIN_BTN= 'button[type="submit"]';
class LoginPage extends Page {
    get inputUsername() {
        return $(LOGIN_FIELD);
    }

    get inputPassword() {
        return $(PASSWORD_FIELD);
    }

    get btnSubmit() {
        return $(LOGIN_BTN);
    }
    
    async fillUsername (username) {
        await this.inputUsername.setValue(username);
    }

    async fillPassword (password) {
        await this.inputPassword.setValue(password);
    }

    async clickLogin () {
        await this.btnSubmit.click();
    }
    open () {
        return super.open('login');
    }
}

export default new LoginPage();
