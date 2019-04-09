import { element, by, ElementFinder } from 'protractor';

export class RecordComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-record div table .btn-danger'));
    title = element.all(by.css('jhi-record div h2#page-heading span')).first();

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

export class RecordUpdatePage {
    pageTitle = element(by.id('jhi-record-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    recordIdInput = element(by.id('field_recordId'));
    userIdSelect = element(by.id('field_userId'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setRecordIdInput(recordId) {
        await this.recordIdInput.sendKeys(recordId);
    }

    async getRecordIdInput() {
        return this.recordIdInput.getAttribute('value');
    }

    async userIdSelectLastOption() {
        await this.userIdSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userIdSelectOption(option) {
        await this.userIdSelect.sendKeys(option);
    }

    getUserIdSelect(): ElementFinder {
        return this.userIdSelect;
    }

    async getUserIdSelectedOption() {
        return this.userIdSelect.element(by.css('option:checked')).getText();
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

export class RecordDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-record-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-record'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
