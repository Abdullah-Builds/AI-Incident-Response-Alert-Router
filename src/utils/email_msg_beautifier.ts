type IncidentPayload = {
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  summary: string;
  recommended_action: string[];
};

export function BeautifyEmailContent(payload: IncidentPayload): string {
  const severityColor = {
    Low: "#22c55e",
    Medium: "#eab308",
    High: "#f97316",
    Critical: "#ef4444",
  }[payload.severity];

  const actions = payload.recommended_action
    .map((action) => `<li>${action}</li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:8px;padding:32px;">

          <tr>
            <td>
              <h2 style="margin:0 0 20px;color:#111827;">
                🚨 Incident Notification
              </h2>
            </td>
          </tr>

          <tr>
            <td>
              <span style="
                background:${severityColor};
                color:white;
                padding:8px 14px;
                border-radius:20px;
                font-weight:bold;
              ">
                Severity: ${payload.severity}
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding-top:24px;">
              <h3 style="margin-bottom:8px;color:#111827;">Summary</h3>
              <p style="color:#4b5563;line-height:1.6;">
                ${payload.summary}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:16px;">
              <h3 style="margin-bottom:8px;color:#111827;">
                Recommended Actions
              </h3>

              <ul style="color:#4b5563;line-height:1.8;">
                ${actions}
              </ul>
            </td>
          </tr>

          <tr>
            <td style="
              padding-top:32px;
              border-top:1px solid #e5e7eb;
              color:#9ca3af;
              font-size:12px;
            ">
              Generated automatically by the Incident Monitoring System
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
