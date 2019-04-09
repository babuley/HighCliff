import { element, by, ElementFinder } from 'protractor';

export class ObservationComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-observation div table .btn-danger'));
    title = element.all(by.css('jhi-observation div h2#page-heading span')).first();

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

export class ObservationUpdatePage {
    pageTitle = element(by.id('jhi-observation-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    statusSelect = element(by.id('field_status'));
    commentInput = element(by.id('field_comment'));
    floatValueInput = element(by.id('field_floatValue'));
    booleanValueInput = element(by.id('field_booleanValue'));
    intValueInput = element(by.id('field_intValue'));
    stringValueInput = element(by.id('field_stringValue'));
    recordedWhenInput = element(by.id('field_recordedWhen'));
    parameterSelect = element(by.id('field_parameter'));
    recordSelect = element(by.id('field_record'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setStatusSelect(status) {
        await this.statusSelect.sendKeys(status);
    }

    async getStatusSelect() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    async statusSelectLastOption() {
        await this.statusSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async setCommentInput(comment) {
        await this.commentInput.sendKeys(comment);
    }

    async getCommentInput() {
        return this.commentInput.getAttribute('value');
    }

    async setFloatValueInput(floatValue) {
        await this.floatValueInput.sendKeys(floatValue);
    }

    async getFloatValueInput() {
        return this.floatValueInput.getAttribute('value');
    }

    getBooleanValueInput() {
        return this.booleanValueInput;
    }
    async setIntValueInput(intValue) {
        await this.intValueInput.sendKeys(intValue);
    }

    async getIntValueInput() {
        return this.intValueInput.getAttribute('value');
    }

    async setStringValueInput(stringValue) {
        await this.stringValueInput.sendKeys(stringValue);
    }

    async getStringValueInput() {
        return this.stringValueInput.getAttribute('value');
    }

    async setRecordedWhenInput(recordedWhen) {
        await this.recordedWhenInput.sendKeys(recordedWhen);
    }

    async getRecordedWhenInput() {
        return this.recordedWhenInput.getAttribute('value');
    }

    async parameterSelectLastOption() {
        await this.parameterSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async parameterSelectOption(option) {
        await this.parameterSelect.sendKeys(option);
    }

    getParameterSelect(): ElementFinder {
        return this.parameterSelect;
    }

    async getParameterSelectedOption() {
        return this.parameterSelect.element(by.css('option:checked')).getText();
    }

    async recordSelectLastOption() {
        await this.recordSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async recordSelectOption(option) {
        await this.recordSelect.sendKeys(option);
    }

    getRecordSelect(): ElementFinder {
        return this.recordSelect;
    }

    async getRecordSelectedOption() {
        return this.recordSelect.element(by.css('option:checked')).getText();
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

export class ObservationDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-observation-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-observation'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
