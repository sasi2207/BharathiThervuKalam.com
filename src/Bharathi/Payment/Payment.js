import React, { useEffect } from 'react';

const RazorpayCheckout = () => {
    useEffect(() => {
        // Initialize Razorpay once component is mounted
        const loadRazorpay = async () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };

        loadRazorpay();

        return () => {
            document.body.removeChild(document.body.getElementsByTagName('script')[0]);
        };
    }, []);

    const handlePayment = async () => {
        try {
            const response = await fetch("http://localhost:8080/payment/order", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: 1 }) // Fixed amount of 10 INR
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order ID');
            }

            const data = await response.json();

            const options = {
                key: "rzp_live_SrOakxuQjuZX6K",
                amount: 100, // 10 INR in paisa (1000 paisa = 10 INR)
                currency: "INR",
                name: "SasiKumar",
                description: "Test description",
                image: "https://example.com/logo.png", // Replace with your logo URL
                order_id: data.id,
                handler: function (response) {
                    console.log(response.razorpay_payment_id);
                    console.log(response.razorpay_order_id);
                    console.log(response.razorpay_signature);
                    alert("Payment successful!");
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                console.log(response.error);
                alert("Payment failed!");
            });
            rzp.open();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to initiate payment');
        }
    };

    return (
        <div>
           
            <button id="pay--btn" onClick={handlePayment}>Pay Now</button>
        </div>
    );
};





export default RazorpayCheckout;
