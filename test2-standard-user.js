const { Builder, By, until } = require('selenium-webdriver');  
const chrome = require('selenium-webdriver/chrome');  

// Function to pause execution  
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));  

(async function main() {  
    // Initialize Chrome driver  
    const options = new chrome.Options();  

    // Create the driver  
    const driver = new Builder()  
        .forBrowser('chrome')  
        .setChromeOptions(options)  
        .build();  

    try {  
        // 1. Login with standard_user  
        await driver.get('https://www.saucedemo.com/');  
        await driver.wait(until.elementLocated(By.id('user-name')), 10000).sendKeys('standard_user');  
        await driver.wait(until.elementLocated(By.id('password')), 10000).sendKeys('secret_sauce');  
        await driver.wait(until.elementLocated(By.id('login-button')), 10000).click();  

        // 2. Reset App State from hamburger menu  
        await driver.wait(until.elementLocated(By.id('react-burger-menu-btn')), 10000).click();  
        await driver.wait(until.elementLocated(By.id('reset_sidebar_link')), 10000).click();  
        await sleep(2000); // Pause after reset  

        // 3. Add items to cart  
        const addToCartSelectors = [  
            'add-to-cart-sauce-labs-backpack',  
            'add-to-cart-sauce-labs-bike-light',  
            'add-to-cart-sauce-labs-bolt-t-shirt'  
        ];  

        for (const selector of addToCartSelectors) {  
            await driver.wait(until.elementLocated(By.id(selector)), 10000).click();  
            await sleep(1000); // Pause after each click  
        }  

        // 4. Navigate to the cart  
        await driver.wait(until.elementLocated(By.className('shopping_cart_link')), 10000).click();  

        // 5. Proceed to checkout  
        await driver.wait(until.elementLocated(By.id('checkout')), 10000).click();  
        await sleep(1000); // Pause before filling the form  
        
        // 6. Fill in checkout information  
        await driver.wait(until.elementLocated(By.id('first-name')), 10000).sendKeys('John');  
        await driver.wait(until.elementLocated(By.id('last-name')), 10000).sendKeys('Doe');  
        await driver.wait(until.elementLocated(By.id('postal-code')), 10000).sendKeys('12345');  
        await driver.wait(until.elementLocated(By.id('continue')), 10000).click();  
        await sleep(1000); // Pause after continuing  

        // 7. Verify product names and total price  
        const productNames = await driver.findElements(By.className('inventory_item_name'));  
        const priceElements = await driver.findElements(By.className('inventory_item_price'));  

        let totalPrice = 0;  
        const expectedProducts = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];  
        for (let i = 0; i < productNames.length; i++) {  
            const name = await productNames[i].getText();  
            console.log(name);  // Print each product's name for verification  
            if (expectedProducts.includes(name)) {  
                const price = parseFloat(await priceElements[i].getText().replace('$', ''));  
                totalPrice += price;  
            }  
        }  

        const totalPriceText = await driver.findElement(By.className('summary_total_label')).getText();  
        const totalPriceValue = parseFloat(totalPriceText.replace('Total: $', ''));  
        if (totalPriceValue === totalPrice) {  
            console.log('Total price matches:', totalPriceValue);  
        } else {  
            console.log('Total price does not match!');  
        }  

        // 8. Finish purchase  
        await driver.wait(until.elementLocated(By.id('finish')), 10000).click();  
        await sleep(1000); // Pause after finishing  

        const successMessage = await driver.findElement(By.className('complete-header')).getText();  
        console.log(successMessage.includes('THANK YOU FOR YOUR ORDER') ? 'Purchase successful!' : 'Purchase failed.');  

        // 9. Reset the App State again  
        await driver.wait(until.elementLocated(By.id('react-burger-menu-btn')), 10000).click();  
        await driver.wait(until.elementLocated(By.id('reset_sidebar_link')), 10000).click();  
        await sleep(2000); // Pause after reset  

        // 10. Log out  
        await driver.wait(until.elementLocated(By.id('react-burger-menu-btn')), 10000).click();  
        await driver.wait(until.elementLocated(By.id('logout_sidebar_link')), 10000).click();  

    } catch (error) {  
        console.error('An error occurred:', error);  
    } finally {  
        await driver.quit();  
    }  
})();