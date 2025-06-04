import addRemovePage from "../../pageobjects/pages/add-remove.page.js";

class AddRemoveFlow {
    async openAddRemovePage() {
        await addRemovePage.open();
    }

    async clickAddButton() {
        await addRemovePage.clickAddButton();
    }

    async clickRemoveButton(index) {
        await addRemovePage.clickRemoveButton(index);
    }

    async verifyClickAddButton1time() {
        await addRemovePage.verifyClickAddButton1time();
    }

    async verifyClickAddButtonManytimes(index) {
        await addRemovePage.verifyClickAddButtonManytimes(index);
    }

    async verifyClickRemoveButton(index) {
        await addRemovePage.verifyClickRemoveButton(index);
    }
}

export default new AddRemoveFlow();