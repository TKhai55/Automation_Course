import AddRemoveFlow from "../../Test-Flows/Add-Remove-Flow.js";

describe("Add & Remove button", async () => {
    beforeEach (async () => {
        await AddRemoveFlow.openAddRemovePage();
    })

    it("Click add button 1 times", async() => {
        await AddRemoveFlow.clickAddButton();
        await AddRemoveFlow.verifyClickAddButton1time();
        await AddRemoveFlow.clickRemoveButton(1);
        await AddRemoveFlow.verifyClickRemoveButton(1);
    })

    it("Click add button many times", async() => {
        const index = 5;
        for (let i = 0; i < index; i++) {
            await AddRemoveFlow.clickAddButton();
        }
        await AddRemoveFlow.verifyClickAddButtonManytimes(index);
        for (let i = 5; i >= index; i--) {
            await AddRemoveFlow.clickRemoveButton(i);
            await AddRemoveFlow.verifyClickRemoveButton(i);
        }
    })

})