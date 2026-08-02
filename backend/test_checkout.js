

async function runTest() {
    console.log("=== Testing AWS Event-Driven Checkout Flow ===");
    
    // 1. Create a dummy user and login to get auth token
    const randomNum = Math.floor(Math.random() * 100000);
    const signupData = {
        username: `awstestuser${randomNum}`,
        email: `awstest${randomNum}@example.com`,
        password: "password123"
    };

    try {
        console.log("1. Signing up dummy user...");
        const signupRes = await fetch("http://localhost:4000/signup", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });
        const signupJson = await signupRes.json();
        
        if (!signupJson.success) {
            console.error("Signup failed:", signupJson.errors);
            return;
        }
        
        const token = signupJson.token;
        console.log("-> Success! Got auth token.");

        // 2. Trigger the checkout endpoint!
        console.log("2. Calling /checkout endpoint to trigger AWS SNS...");
        const checkoutRes = await fetch("http://localhost:4000/checkout", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({ totalAmount: 500 }) // Dummy total amount
        });
        
        const checkoutJson = await checkoutRes.json();
        if (checkoutJson.success) {
            console.log("-> Success! Backend responded with order placed.");
        } else {
            console.error("-> Failed! Backend returned error:", checkoutJson);
        }

    } catch (e) {
        console.error("Test script failed to connect.", e);
    }
}

runTest();
