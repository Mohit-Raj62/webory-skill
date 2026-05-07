// Premium HTML Invoice Template
export function createInvoiceHTML(
  name: string,
  itemTitle: string,
  amount: number,
  transactionId: string,
  date: string,
  itemType: "course" | "internship",
  originalAmount?: number,
  userPhone?: string,
  couponCode?: string,
  couponDiscount?: number,
) {
  const invoiceNumber = "INV-" + transactionId.substring(4, 12).toUpperCase();
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Calculate discount
  const displayOriginalAmount = originalAmount || amount;
  const courseDiscountAmount = Math.max(0, displayOriginalAmount - amount - (couponDiscount || 0));
  const displayCouponDiscount = couponDiscount || 0;

  // Tax calculation (Assume 18% inclusive GST)
  const baseAmount = displayOriginalAmount / 1.18;
  const courseDiscountBeforeTax = courseDiscountAmount / 1.18;
  const couponDiscountBeforeTax = displayCouponDiscount / 1.18;
  
  const netBaseAmount = baseAmount - courseDiscountBeforeTax - couponDiscountBeforeTax;
  const taxAmount = amount - netBaseAmount;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice - Webory Skills</title>
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playwrite+AR+Guides&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', user-scalable=no, -webkit-user-select: none; 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155;">
  
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Invoice Card -->
        <table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 40px 50px; border-bottom: 2px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <h1 style="margin: 0; color: #0f172a; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Webory Skills</h1>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px; font-weight: 500;">Excellence in Education</p>
                  </td>
                  <td valign="middle" align="right">
                    <div style="background-color: #f1f5f9; padding: 8px 16px; border-radius: 8px; display: inline-block;">
                      <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Invoice Number</p>
                      <p style="margin: 2px 0 0 0; color: #0f172a; font-size: 14px; font-weight: 600; font-family: monospace;">#${invoiceNumber}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Billing Info Grid -->
          <tr>
            <td style="padding: 40px 50px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Bill From -->
                  <td width="55%" valign="top" style="padding-right: 20px;">
                    <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">ISSUED BY</p>
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #0f172a; font-weight: 700;">Webory Skills India</h3>
                    <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                      BR-01, janpara, patna<br>
                      Bihar, 841112<br>
                      <strong>GSTIN:</strong> 09AAFCH2214R1ZP
                    </p>
                  </td>
                  <!-- Bill To -->
                  <td width="45%" valign="top" style="padding-left: 20px; border-left: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">BILLED TO</p>
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #0f172a; font-weight: 700;">${name}</h3>
                    <p style="margin: 0 0 15px 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                      Valued Student${userPhone ? `<br><strong>Phone:</strong> ${userPhone}` : ""}
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="30%" style="color: #64748b; font-size: 11px;">Date:</td>
                        <td style="color: #0f172a; font-size: 12px; font-weight: 600;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td width="30%" style="color: #64748b; font-size: 11px; padding-top: 4px;">Status:</td>
                        <td style="padding-top: 4px; color: #16a34a; font-size: 11px; font-weight: 700; text-transform: uppercase;">Paid</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 50px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <!-- Table Header -->
                <tr style="background-color: #f8fafc;">
                  <th align="left" style="padding: 15px 20px; color: #475569; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0;">Description</th>
                  <th align="right" style="padding: 15px 20px; color: #475569; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0;">Total</th>
                </tr>
                <!-- Item Row -->
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
                    <p style="margin: 0 0 6px 0; font-size: 15px; color: #0f172a; font-weight: 700;">${itemTitle}</p>
                    <p style="margin: 0; font-size: 13px; color: #64748b;">
                      <span style="display: inline-block; padding: 2px 8px; background-color: #eff6ff; color: #2563eb; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-right: 6px;">${itemType}</span>
                      Lifetime access & Certification
                    </p>
                    ${courseDiscountAmount > 0 ? `<p style="margin: 6px 0 0 0; font-size: 11px; color: #16a34a; font-weight: 700; text-transform: uppercase;">Special Discount Applied</p>` : ""}
                  </td>
                  <td align="right" style="padding: 20px; border-bottom: 1px solid #e2e8f0; vertical-align: top; background-color: #ffffff;">
                    ${displayOriginalAmount > amount ? `
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; text-decoration: line-through;">₹${displayOriginalAmount.toLocaleString("en-IN")}</p>
                      <p style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 700;">₹${amount.toLocaleString("en-IN")}</p>
                    ` : `
                      <p style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 700;">₹${amount.toLocaleString("en-IN")}</p>
                    `}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary and Verification -->
          <tr>
            <td style="padding: 30px 50px 40px 50px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Verification QR -->
                  <td width="50%" valign="bottom">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://weboryskills.in/verify/${transactionId}" width="80" height="80" style="display: block; opacity: 0.6;">
                            </td>
                            <td style="padding-left: 15px; vertical-align: bottom;">
                                <p style="margin: 0; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Digital Verification</p>
                                <p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px;">Scan to verify authenticity</p>
                            </td>
                        </tr>
                    </table>
                  </td>
                  <!-- Totals -->
                  <td width="50%">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Subtotal</td>
                        <td align="right" style="padding: 6px 0; color: #0f172a; font-size: 13px; font-weight: 600;">₹${baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      ${courseDiscountAmount > 0 ? `
                      <tr>
                        <td style="padding: 6px 0; color: #16a34a; font-size: 13px;">Course Discount</td>
                        <td align="right" style="padding: 6px 0; color: #16a34a; font-size: 13px; font-weight: 700;">-₹${courseDiscountBeforeTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      ` : ""}
                      ${displayCouponDiscount > 0 ? `
                      <tr>
                        <td style="padding: 6px 0; color: #2563eb; font-size: 13px;">Coupon (${couponCode || 'PROMO'})</td>
                        <td align="right" style="padding: 6px 0; color: #2563eb; font-size: 13px; font-weight: 700;">-₹${couponDiscountBeforeTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Tax (GST 18%)</td>
                        <td align="right" style="padding: 6px 0; color: #0f172a; font-size: 13px; font-weight: 600;">₹${taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <div style="border-top: 2px solid #0f172a;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 15px; color: #0f172a; font-size: 14px; font-weight: 700; text-transform: uppercase;">Total Paid</td>
                        <td align="right" style="padding-top: 15px; color: #2563eb; font-size: 24px; font-weight: 800;">₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 40px 50px; border-top: 2px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="60%">
                        <p style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700;">Authorized Signatory</p>
                        <p style="margin: 0; font-family: 'Playwrite AR Guides', cursive; font-size: 24px; color: #0f172a; opacity: 0.9;">Mohit sinha</p>
                        <div style="margin-top: 5px; width: 150px; border-top: 1px solid #e2e8f0;"></div>
                    </td>
                    <td width="40%" align="right" style="vertical-align: bottom;">
                        <p style="margin: 0; color: #94a3b8; font-size: 11px;">© ${new Date().getFullYear()} Webory Skills India</p>
                        <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 11px;">www.weboryskills.in</p>
                    </td>
                </tr>
              </table>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0; color: #94a3b8; font-size: 10px; line-height: 1.6; text-transform: uppercase; letter-spacing: 0.5px;">
                  This is a system-generated document and does not require a physical signature.<br>
                  All disputes are subject to Dehradun (Uttarakhand) jurisdiction.
                </p>
              </div>
            </td>
          </tr>
        </table>
        
        <!-- Bottom Branding -->
        <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
          Sent with ❤️ by Webory Skills
        </p>
      </td>
    </tr>
  </table>
  
</body>
</html>
  `;
}
