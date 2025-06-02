import CheckboxFlow from "../../Test-Flows/Checkbox-Flow.js";

describe('Check box page', () => {
    it('Should display correctly', async () => {
        await CheckboxFlow.openCheckboxPage();
        await CheckboxFlow.clickCheckBox1();
        await CheckboxFlow.verifyChecked();
        await CheckboxFlow.clickCheckBox2();
        await CheckboxFlow.verifyUnchecked();
    })
})