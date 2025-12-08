// Simple invoice template that works in all email clients
// Professional HTML Invoice Template
export const createInvoiceHTML = (
  name: string,
  itemTitle: string,
  amount: number,
  transactionId: string,
  date: string,
  itemType: "course" | "internship"
) => {
  const invoiceNumber = `INV-${transactionId.substring(4, 12).toUpperCase()}`;
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Mock tax calculation (inclusive) for display
  const baseAmount = amount / 1.18;
  const taxAmount = amount - baseAmount;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - Webory Skills</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #374151; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Top Bar -->
    <div style="height: 6px; background: linear-gradient(90deg, #2563eb, #7c3aed);"></div>

    <div style="padding: 40px 40px 20px 40px;">
      <!-- Header Section -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="top">
            <h1 style="margin: 0; color: #1e3a8a; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Webory Skills</h1>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Excellence in Education</p>
          </td>
          <td valign="top" align="right">
            <h2 style="margin: 0; color: #374151; font-size: 24px; font-weight: bold; text-transform: uppercase;">Tax Invoice</h2>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">#${invoiceNumber}</p>
            <div style="margin-top: 10px; display: inline-block; padding: 4px 12px; background-color: #dcfce7; color: #166534; border-radius: 15px; font-size: 11px; font-weight: bold;">✓ PAID</div>
          </td>
        </tr>
      </table>

      <!-- Addresses Section -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
        <tr>
          <td width="55%" valign="top" style="padding-right: 20px;">
            <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">BILLED FROM</p>
            <p style="margin: 0 0 4px 0; font-weight: bold; font-size: 15px; color: #111827;">Webory Skills</p>
            <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">
              Online Learning Platform<br>
              www.weboryskills.in<br>
              support@weboryskills.in
            </p>
          </td>
          <td width="45%" valign="top">
            <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">BILLED TO</p>
            <p style="margin: 0 0 4px 0; font-weight: bold; font-size: 15px; color: #111827;">${name}</p>
            <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">
              Student / Valued Customer<br>
              India
            </p>
          </td>
        </tr>
      </table>

      <!-- Invoice Details Grid -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
        <tr>
          <td width="33%">
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 11px; text-transform: uppercase;">Invoice Date</p>
            <p style="margin: 0; font-weight: 600; font-size: 14px;">${formattedDate}</p>
          </td>
          <td width="33%">
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 11px; text-transform: uppercase;">Transaction ID</p>
            <p style="margin: 0; font-weight: 600; font-size: 14px; font-family: monospace;">${transactionId}</p>
          </td>
          <td width="33%">
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 11px; text-transform: uppercase;">Payment Method</p>
            <p style="margin: 0; font-weight: 600; font-size: 14px;">Online Payment</p>
          </td>
        </tr>
      </table>

      <!-- Line Items -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th align="left" style="padding: 12px 15px; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0;">Description</th>
            <th align="right" style="padding: 12px 15px; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 20px 15px; border-bottom: 1px solid #f1f5f9;">
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #1e293b; font-size: 15px;">${itemTitle}</p>
              <p style="margin: 0; font-size: 13px; color: #64748b;">
                Lifetime access to ${itemType} content • Full Certification included • 24/7 Support
              </p>
            </td>
            <td align="right" style="padding: 20px 15px; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-weight: bold; color: #1e293b;">
              ₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
        <tr>
          <td width="60%"></td>
          <td width="40%">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Subtotal</td>
                <td align="right" style="padding: 8px 0; color: #1e293b; font-weight: 500; font-size: 13px;">₹${baseAmount.toLocaleString(
                  "en-IN",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Tax (GST 18% included)</td>
                <td align="right" style="padding: 8px 0; color: #1e293b; font-weight: 500; font-size: 13px;">₹${taxAmount.toLocaleString(
                  "en-IN",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}</td>
              </tr>
              <tr>
                <td colspan="2" style="border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 12px;"></td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #0f172a; font-weight: bold; font-size: 16px;">Total Paid</td>
                <td align="right" style="padding: 5px 0; color: #2563eb; font-weight: 800; font-size: 20px;">₹${amount.toLocaleString(
                  "en-IN",
                  { minimumFractionDigits: 2 }
                )}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Terms & Footer -->
      <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
        <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #374151;">Terms & Conditions</h3>
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; line-height: 1.6;">
          1. This is a computer-generated invoice and does not require a signature.<br>
          2. All payments are non-refundable once the course/internship access has been granted.<br>
          3. For support queries, please email us at support@weboryskills.in
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
        <p style="font-size: 12px; color: #9ca3af;">Thank you for choosing Webory Skills!</p>
        <p style="font-size: 11px; color: #d1d5db; margin-top: 5px;">© ${new Date().getFullYear()} www.weboryskills.in</p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
};
