type AlertPayload = {
  title: string;
  message: string;
  context?: Record<string, unknown>;
};

export async function sendOpsAlert(payload: AlertPayload) {
  const webhook = process.env.ALERT_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `[AshrafLab Alert] ${payload.title}`,
        message: payload.message,
        context: payload.context ?? {},
      }),
    });
  } catch {
    // Alerts should not block request flow.
  }
}

