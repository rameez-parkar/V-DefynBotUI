import { AppPage } from './app.po';
import { element, browser, protractor } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should Check the title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('US Bank');
  });
  
  it('Check default message', () => {
    page.navigateTo();
    expect(page.getTextBubble()).not.toBe('');
  });
  
  it('should enter  text in textbox', () => {
    page.navigateTo();
    page.getTextBox().sendKeys("cgaksjcbasncjanclakmclaskcmakcnjccsancka");
    
    
  });
  it('should enter  text in textbox and click send', () => {
    page.navigateTo();
    browser.manage().window().setSize(1600,1000);
    page.getTextBox().sendKeys("cgaksjcbasncjanclakmclaskcmakcnjccsancka");
    //page.sendText().click();
    
    browser.actions().mouseMove(page.sendText()).click().perform();
    
    
  });

  it('Happy Flow',()=>{
    page.navigateTo();
    browser.manage().window().setSize(375,667);
    page.getBookATableButton().click();
    
    var EC = protractor.ExpectedConditions;
    page.getTextBox().sendKeys("pune");
    
    
    browser.actions().mouseMove(page.sendText()).click().perform();
    browser.wait(EC.presenceOf(page.getCorousal()), 10000);
    browser.actions().mouseMove(page.getCorousal()).click().perform();
    browser.wait(EC.presenceOf(page.getCard()), 10000);
    page.getCard().click();
    page.getCourousalAgain().click();
    page.getRightArrow().click();
    browser.actions().mouseMove(page.getCorousal()).click().perform();
    
    
      page.getCourousalAgain().click();
      page.getLeftArrow().click();
    
    
     
      
  });

  it('should click Order food button',()=>{
    page.navigateTo();
    page.getOrderFoodButton().click();
    
  });
});
