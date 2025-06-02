import checkboxPage from "../../pageobjects/pages/checkbox.page.js";

class CheckboxFlow {
    async openCheckboxPage () {
        await checkboxPage.open();
        await expect(checkboxPage.checkbox1).toBeExisting();
        await expect(checkboxPage.checkbox1).not.toBeSelected();
        await expect(checkboxPage.checkbox2).toBeExisting();
        await expect(checkboxPage.checkbox2).toBeSelected();
    }

    async clickCheckBox1() {
        await checkboxPage.clickCheckbox1();
    }

    async clickCheckBox2() {
        await checkboxPage.clickCheckbox2();
    }

    async verifyChecked () {
        await expect(checkboxPage.checkbox1).toBeExisting();
        await expect(checkboxPage.checkbox1).toBeSelected();
    }

    async verifyUnchecked () {
        await expect(checkboxPage.checkbox2).toBeExisting();
        await expect(checkboxPage.checkbox2).not.toBeSelected();
    }
}

export default new CheckboxFlow();