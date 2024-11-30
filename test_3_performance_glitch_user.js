const { Builder, By, Key, until } = require('selenium-webdriver');  

async function testLoginPerformanceGlitchUser() {  
    const driver = await new Builder().forBrowser('chrome').build();  

    try {  
        // Navigate to the login page  
        await driver.get('https://www.saucedemo.com/');  

        // Attempt to log in  
        await driver.wait(until.elementLocated(By.id('user-name')), 5000);  
        await driver.findElement(By.id('user-name')).sendKeys('performance_glitch_user');  
        await driver.findElement(By.id('password')).sendKeys('secret_sauce', Key.RETURN);  

        // Reset App State  
        await driver.wait(until.elementLocated(By.id('react-burger-menu-btn')), 5000);  
        await driver.findElement(By.id('react-burger-menu-btn')).click();  
        await driver.findElement(By.id('reset_sidebar_link')).click();  

        // Additional test steps...  

    } catch (error) {  
        console.error('Error occurred:', error);  
    } finally {  
        await driver.quit();  
    }  
}  

testLoginPerformanceGlitchUser();