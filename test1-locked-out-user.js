const { Builder, By, Key, until } = require('selenium-webdriver');  

(async function testLockedOutUser() {  
    let driver = await new Builder().forBrowser('chrome').build();  
    
    try {  
        await driver.get('https://www.saucedemo.com/');  
        await driver.findElement(By.id('user-name')).sendKeys('locked_out_user');  
        await driver.findElement(By.id('password')).sendKeys('secret_sauce', Key.RETURN);  
        
        let errorMessage = await driver.wait(until.elementLocated(By.css('.error-message-container')), 10000);  
        let errorText = await errorMessage.getText();  
        console.log('Error Message:', errorText); // Expect to be "Sorry, this user has been locked out."  

    } finally {  
        await driver.quit();  
    }  
})();