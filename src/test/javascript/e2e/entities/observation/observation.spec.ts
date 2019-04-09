/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ObservationComponentsPage, ObservationDeleteDialog, ObservationUpdatePage } from './observation.page-object';

const expect = chai.expect;

describe('Observation e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let observationUpdatePage: ObservationUpdatePage;
    let observationComponentsPage: ObservationComponentsPage;
    let observationDeleteDialog: ObservationDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Observations', async () => {
        await navBarPage.goToEntity('observation');
        observationComponentsPage = new ObservationComponentsPage();
        await browser.wait(ec.visibilityOf(observationComponentsPage.title), 5000);
        expect(await observationComponentsPage.getTitle()).to.eq('highcliffApp.observation.home.title');
    });

    it('should load create Observation page', async () => {
        await observationComponentsPage.clickOnCreateButton();
        observationUpdatePage = new ObservationUpdatePage();
        expect(await observationUpdatePage.getPageTitle()).to.eq('highcliffApp.observation.home.createOrEditLabel');
        await observationUpdatePage.cancel();
    });

    it('should create and save Observations', async () => {
        const nbButtonsBeforeCreate = await observationComponentsPage.countDeleteButtons();

        await observationComponentsPage.clickOnCreateButton();
        await promise.all([
            observationUpdatePage.statusSelectLastOption(),
            observationUpdatePage.setCommentInput('comment'),
            observationUpdatePage.setFloatValueInput('5'),
            observationUpdatePage.setIntValueInput('5'),
            observationUpdatePage.setStringValueInput('stringValue'),
            observationUpdatePage.setRecordedWhenInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            observationUpdatePage.parameterSelectLastOption(),
            observationUpdatePage.recordSelectLastOption()
        ]);
        expect(await observationUpdatePage.getCommentInput()).to.eq('comment');
        expect(await observationUpdatePage.getFloatValueInput()).to.eq('5');
        const selectedBooleanValue = observationUpdatePage.getBooleanValueInput();
        if (await selectedBooleanValue.isSelected()) {
            await observationUpdatePage.getBooleanValueInput().click();
            expect(await observationUpdatePage.getBooleanValueInput().isSelected()).to.be.false;
        } else {
            await observationUpdatePage.getBooleanValueInput().click();
            expect(await observationUpdatePage.getBooleanValueInput().isSelected()).to.be.true;
        }
        expect(await observationUpdatePage.getIntValueInput()).to.eq('5');
        expect(await observationUpdatePage.getStringValueInput()).to.eq('stringValue');
        expect(await observationUpdatePage.getRecordedWhenInput()).to.contain('2001-01-01T02:30');
        await observationUpdatePage.save();
        expect(await observationUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await observationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Observation', async () => {
        const nbButtonsBeforeDelete = await observationComponentsPage.countDeleteButtons();
        await observationComponentsPage.clickOnLastDeleteButton();

        observationDeleteDialog = new ObservationDeleteDialog();
        expect(await observationDeleteDialog.getDialogTitle()).to.eq('highcliffApp.observation.delete.question');
        await observationDeleteDialog.clickOnConfirmButton();

        expect(await observationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
