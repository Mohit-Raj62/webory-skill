// Simple invoice template that works in all email clients
export const createInvoiceHTML = (
  name: string,
  itemTitle: string,
  amount: number,
  transactionId: string,
  date: string,
  itemType: "course" | "internship"
) => {
  const invoiceNumber = `INV-${transactionId.substring(4, 12)}`;
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #2563eb; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: bold;">INVOICE</h1>
              <p style="margin: 0 0 20px 0; color: #ffffff; font-size: 14px;">Payment Receipt</p>
              <table cellpadding="10" cellspacing="0" border="0" style="margin: 0 auto; background-color: rgba(255,255,255,0.2); border-radius: 6px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #ffffff; font-size: 10px; text-transform: uppercase;">Invoice Number</p>
                    <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: bold;">${invoiceNumber}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Company Info -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="70%">
                    <h2 style="margin: 0 0 5px 0; color: #1f2937; font-size: 22px; font-weight: bold;">Webory Skills</h2>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;">Excellence in Education</p>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;">www.weboryskill.in</p>
                  </td>
                  <td width="30%" align="right">
                    <div style="width: 50px; height: 50px; background-color: #2563eb; border-radius: 50%; text-align: center; line-height: 50px; color: white; font-size: 24px;">✓</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bill To & Invoice Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="48%" style="vertical-align: top; padding-right: 2%;">
                    <table width="100%" cellpadding="15" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 10px; text-transform: uppercase; font-weight: bold;">BILL TO</p>
                          <p style="margin: 0 0 5px 0; color: #1f2937; font-size: 14px; font-weight: bold;">${name}</p>
                          <p style="margin: 0; color: #6b7280; font-size: 12px;">Student Account</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="48%" style="vertical-align: top; padding-left: 2%;">
                    <table width="100%" cellpadding="15" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 10px; text-transform: uppercase; font-weight: bold;">INVOICE DETAILS</p>
                          <table width="100%" cellpadding="3" cellspacing="0" border="0">
                            <tr>
                              <td style="color: #6b7280; font-size: 12px;">Date:</td>
                              <td align="right" style="color: #1f2937; font-size: 12px; font-weight: bold;">${formattedDate}</td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; font-size: 12px;">Status:</td>
                              <td align="right">
                                <span style="background-color: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: bold;">✓ PAID</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 10px; text-transform: uppercase; font-weight: bold;">ITEM DETAILS</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 6px;">
                <tr style="background-color: #2563eb;">
                  <td style="padding: 12px 15px; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase;">DESCRIPTION</td>
                  <td align="right" style="padding: 12px 15px; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase;">AMOUNT</td>
                </tr>
                <tr>
                  <td style="padding: 20px 15px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 40px; height: 40px; background-color: #dbeafe; border-radius: 6px; text-align: center; line-height: 40px; font-size: 20px;">${
                            itemType === "course" ? "📚" : "💼"
                          }</div>
                        </td>
                        <td style="padding-left: 12px; vertical-align: top;">
                          <p style="margin: 0 0 4px 0; color: #1f2937; font-size: 15px; font-weight: bold;">${itemTitle}</p>
                          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Full Access • Lifetime Validity</p>
                          <p style="margin: 0; color: #9ca3af; font-size: 11px;">Includes: ${
                            itemType === "course"
                              ? "Videos, Quizzes, Assignments & Certificate"
                              : "Training, Projects & Certificate"
                          }</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="padding: 20px 15px; vertical-align: top;">
                    <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold;">₹${amount.toLocaleString(
                      "en-IN"
                    )}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Total Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="300" cellpadding="20" cellspacing="0" border="0" align="right" style="background-color: #dbeafe; border-radius: 8px; border: 2px solid #93c5fd;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="5" cellspacing="0" border="0">
                      <tr>
                        <td style="color: #4b5563; font-size: 13px;">Subtotal:</td>
                        <td align="right" style="color: #1f2937; font-size: 13px; font-weight: bold;">₹${amount.toLocaleString(
                          "en-IN"
                        )}</td>
                      </tr>
                      <tr>
                        <td style="color: #4b5563; font-size: 13px;">Tax (GST 18%):</td>
                        <td align="right" style="color: #1f2937; font-size: 13px; font-weight: bold;">₹0</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 10px 0; border-top: 2px solid #60a5fa;"></td>
                      </tr>
                      <tr>
                        <td style="color: #1f2937; font-size: 15px; font-weight: bold;">Total Amount:</td>
                        <td align="right" style="color: #2563eb; font-size: 20px; font-weight: bold;">₹${amount.toLocaleString(
                          "en-IN"
                        )}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Success Banner -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 6px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 5px 0; color: #065f46; font-size: 15px; font-weight: bold;">✅ Payment Successful</p>
                    <p style="margin: 0; color: #047857; font-size: 13px; line-height: 1.5;">Thank you for your payment. Your ${itemType} access has been activated and you can start learning immediately!</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Info -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="20" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; color: #1f2937; font-size: 13px; font-weight: bold;">Payment Information</p>
                    <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
                      This invoice confirms your enrollment in <strong>${itemTitle}</strong>. 
                      You now have lifetime access to all materials including ${
                        itemType === "course"
                          ? "videos, assignments, quizzes, and certificate upon completion"
                          : "training sessions, projects, and certificate upon completion"
                      }.
                    </p>
                    <p style="margin: 12px 0 0 0; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px;">
                      Transaction ID: <strong style="color: #6b7280;">${transactionId}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px;">This is an automated invoice from Webory Skills</p>
              <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 11px;">For any queries, contact us at <a href="mailto:support@weboryskill.com" style="color: #2563eb; text-decoration: none;">support@weboryskill.com</a></p>
              <p style="margin: 0; color: #d1d5db; font-size: 10px;">© ${new Date().getFullYear()} Webory Skills. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
