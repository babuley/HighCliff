import { element, by, ElementFinder } from 'protractor';

export class ParameterComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-parameter div table .btn-danger'));
    title = element.all(by.css('jhi-parameter div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ParameterUpdatePage {
    pageTitle = element(by.id('jhi-parameter-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    minInput = element(by.id('field_min'));
    maxInput = element(by.id('field_max'));
    displayPrecisionInput = element(by.id('field_displayPrecision'));
    unitSelect = element(by.id('field_unit'));
    parameterNameInput = element(by.id('field_parameterName'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setMinInput(min) {
        await this.minInput.sendKeys(min);
    }

    async getMinInput() {
        return this.minInput.getAttribute('value');
    }

    async setMaxInput(max) {
        await this.maxInput.sendKeys(max);
    }

    async getMaxInput() {
        return this.maxInput.getAttribute('value');
    }

    async setDisplayPrecisionInput(displayPrecision) {
        await this.displayPrecisionInput.sendKeys(displayPrecision);
    }

    async getDisplayPrecisionInput() {
        return this.displayPrecisionInput.getAttribute('value');
    }

    async setUnitSelect(unit) {
        await this.unitSelect.sendKeys(unit);
    }

    async getUnitSelect() {
        return this.unitSelect.element(by.css('option:checked')).getText();
    }

    async unitSelectLastOption() {
        await this.unitSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async setParameterNameInput(parameterName) {
        await this.parameterNameInput.sendKeys(parameterName);
    }

    async getParameterNameInput() {
        return this.parameterNameInput.getAttribute('value');
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class ParameterDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-parameter-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-parameter'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
