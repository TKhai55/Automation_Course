import Page from "./page.js";

const CHECKBOX1 = '//*[@id="checkboxes"]/input[1]';
const CHECKBOX2 = '//*[@id="checkboxes"]/input[2]';

class CheckboxPage extends Page {
    get checkbox1 () {
        return $(CHECKBOX1);
    }
    get checkbox2 () {
        return $(CHECKBOX2);
    }

    async clickCheckbox1 () {
        await this.checkbox1.click();
    }
    async clickCheckbox2 () {
        await this.checkbox2.click();
    }

    async open () {
        return super.open('checkboxes');
    }
}

export  default new CheckboxPage();