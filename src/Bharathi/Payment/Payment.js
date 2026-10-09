import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { paymentApi } from '../Api/Api';

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
            const scripts = document.querySelectorAll('script[src*="checkout.razorpay.com"]');
            scripts.forEach(s => s.remove());
        };
    }, []);

    const handlePayment = async () => {
        try {
            const response = await paymentApi.createOrder(1);
            const data = response?.data || {};

            const options = {
                key: "rzp_live_SrOakxuQjuZX6K",
                amount: 100, // 10 INR in paisa (1000 paisa = 10 INR)
                currency: "INR",
                name: "Bharathi Thervukalam",
                description: "Admission & Course Material Fee",
                image: "https://www.bharathithervukalam.com/favicon.ico",
                order_id: data.id,
                handler: function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        text: `Payment Reference: ${response.razorpay_payment_id || 'CONFIRMED'}`,
                        confirmButtonColor: '#0b1e42'
                    });
                },
                notes: {
                    address: "Bharathi Thervukalam Academy, Erode"
                },
                theme: {
                    color: "#0b1e42"
                }
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Payment Failed',
                        text: response.error?.description || 'Payment was not completed. Please try again.',
                        confirmButtonColor: '#0b1e42'
                    });
                });
                rzp.open();
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Direct Admission Desk',
                    text: 'Payment portal initialized. For classroom batch admissions, you can also pay directly at the Erode academy center.',
                    confirmButtonColor: '#0b1e42'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Unable to Initiate Payment',
                text: 'Please contact the academy office directly.',
                confirmButtonColor: '#0b1e42'
            });
        }
    };

    return (
        <div className="container py-5 text-center">
            <h3 className="fw-bold mb-3">Course Fee Payment Portal</h3>
            <p className="text-muted mb-4">Secure enrollment payment for Bharathi Academy classroom & test batches.</p>
            <button id="pay--btn" className="btn btn-warning px-4 py-2 fw-bold" onClick={handlePayment}>
                Pay Securely Now (₹10)
            </button>
        </div>
    );
};

export default RazorpayCheckout;
