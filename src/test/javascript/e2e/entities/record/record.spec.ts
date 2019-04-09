/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RecordComponentsPage, RecordDeleteDialog, RecordUpdatePage } from './record.page-object';

const expect = chai.expect;

describe('Record e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let recordUpdatePage: RecordUpdatePage;
    let recordComponentsPage: RecordComponentsPage;
    let recordDeleteDialog: RecordDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Records', async () => {
        await navBarPage.goToEntity('record');
        recordComponentsPage = new RecordComponentsPage();
        await browser.wait(ec.visibilityOf(recordComponentsPage.title), 5000);
        expect(await recordComponentsPage.getTitle()).to.eq('highcliffApp.record.home.title');
    });

    it('should load create Record page', async () => {
        await recordComponentsPage.clickOnCreateButton();
        recordUpdatePage = new RecordUpdatePage();
        expect(await recordUpdatePage.getPageTitle()).to.eq('highcliffApp.record.home.createOrEditLabel');
        await recordUpdatePage.cancel();
    });

    it('should create and save Records', async () => {
        const nbButtonsBeforeCreate = await recordComponentsPage.countDeleteButtons();

        await recordComponentsPage.clickOnCreateButton();
        await promise.all([recordUpdatePage.setRecordIdInput('5'), recordUpdatePage.userIdSelectLastOption()]);
        expect(await recordUpdatePage.getRecordIdInput()).to.eq('5');
        await recordUpdatePage.save();
        expect(await recordUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await recordComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Record', async () => {
        const nbButtonsBeforeDelete = await recordComponentsPage.countDeleteButtons();
        await recordComponentsPage.clickOnLastDeleteButton();

        recordDeleteDialog = new RecordDeleteDialog();
        expect(await recordDeleteDialog.getDialogTitle()).to.eq('highcliffApp.record.delete.question');
        await recordDeleteDialog.clickOnConfirmButton();

        expect(await recordComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
