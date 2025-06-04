import Page from "./page.js";

const ADD_BUTTON = '//*[@id="content"]/div/button';
const REMOVE_BUTTON = (index) => `//*[@id="elements"]/button[${index}]`;

class AddRemovePage extends Page {
    get addButton() {
        return $(ADD_BUTTON);
    }
    removeButton(index) {
        return $(REMOVE_BUTTON(index)); 
    }

    async clickAddButton() {
        await this.addButton.click();
    }

    async clickRemoveButton(index) {
        await this.removeButton(index).click();
    }

    async verifyClickAddButton1time() {
        await expect(this.removeButton(1)).toBeDisplayed();
    }

    async verifyClickAddButtonManytimes(index) {
        for (let i = 1; i <= index; i++) {
            await expect(this.removeButton(index)).toBeDisplayed();
        }
    }

    async verifyClickRemoveButton(index) {
        await expect(this.removeButton(index)).not.toBeDisplayed();
    }

    async open() {
        return super.open('add_remove_elements/');
    }
}

export default new AddRemovePage();