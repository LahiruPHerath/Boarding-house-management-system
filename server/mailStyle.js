const emailTemplate = (amount, boardingHouseName, currentMonth) => `
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
      background-color: #007bff;
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
      color: #007bff;
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
      <h1>Payment Reminder</h1>
    </div>
    <div class="content">
      <p>Dear Customer,</p>
      <p>This is a friendly reminder to pay your boarding fee of <span class="highlight">Rs ${amount}</span> for <span class="highlight">${currentMonth}</span> for the boarding house <span class="highlight">${boardingHouseName}</span>.</p>
      <p>Please make sure to complete your payment at the earliest convenience.</p>
      <p>Thank you for your attention to this matter.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Boarding House Management. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = emailTemplate;
