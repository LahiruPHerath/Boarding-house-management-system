const paymentSuccessTemplate = (amount, boardingHouseName, currentMonth) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border: 1px solid #dddddd;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #28a745;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
    }
    .content .highlight {
      color: #28a745;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 10px;
      color: #777777;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Successful</h1>
    </div>
    <div class="content">
      <p>Dear Customer,</p>
      <p>We are pleased to inform you that your payment has been successfully processed.</p>
      <p>Details of your payment:</p>
      <ul>
        <li><strong>Amount Paid:</strong> <span class="highlight">Rs ${amount}</span></li>
        <li><strong>Boarding House:</strong> <span class="highlight">${boardingHouseName}</span></li>       
        <li><strong>Month:</strong> <span class="highlight">${currentMonth}</span></li>
      </ul>
      <p>Thank you for your payment. If you have any questions or need further assistance, please feel free to contact us.</p>
      <p>Best regards,</p>
      <p>The Boarding House Management Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Boarding House Management. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = paymentSuccessTemplate;
