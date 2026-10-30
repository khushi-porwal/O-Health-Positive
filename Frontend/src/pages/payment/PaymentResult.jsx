
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyPayment } from "../../services/paymentService";
import "./PaymentResult.css";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Verifying your payment...");

  const merchantOrderId =
    searchParams.get("merchantOrderId") ||
    searchParams.get("orderId");

  useEffect(() => {
    let cancelled = false;

    const checkPayment = async () => {
      if (!merchantOrderId) {
        setStatus("error");
        setMessage("Payment order ID is missing.");
        return;
      }

      try {
        const result = await verifyPayment(merchantOrderId);

        if (cancelled) return;

        if (result.status === "completed") {
          setStatus("success");
          setMessage("Thank you! Your donation has been received.");
        } else if (result.status === "failed") {
          setStatus("failed");
          setMessage("Your payment was not successful. Please try again.");
        } else {
          setStatus("pending");
          setMessage(
            "Your payment is still being processed. Please check again shortly."
          );
        }
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "We could not verify your payment right now."
        );
      }
    };

    checkPayment();

    return () => {
      cancelled = true;
    };
  }, [merchantOrderId]);

  return (
    <main className="payment-result-page">
      <section className="payment-result-card">
        <h1>
          {status === "checking" && "Checking Payment"}
          {status === "success" && "Thank You for Donating!"}
          {status === "failed" && "Payment Failed"}
          {status === "pending" && "Payment Processing"}
          {status === "error" && "Unable to Verify Payment"}
        </h1>

        <p role="status">{message}</p>

        {status === "pending" && (
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Check Again
          </button>
        )}

        <Link to="/donate" className="payment-result-link">
          Back to Donations
        </Link>
      </section>
    </main>
  );
};

export default PaymentResult;
