// https://intense-manatee-communal.ngrok-free.app (THIS IS THE FORWARDING URL OF NGROK)
// when running ngrok, make sure you are on HOTSPOT!!! (school wifi blocks cus it works w a proxy)
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server'

const webhookSecret = process.env.WEBHOOK_SECRET;

export async function POST(req: Request) {
  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  if (!webhookSecret) {
    console.error("missing webhook secret");
    return new Response("error occured - missing webhook secret", {
      status: 400
    });
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // wen there is a new user, add "role: user" to their public metadata
  const client = await clerkClient();
  if (evt.type === "user.created") {
    try {
      await client.users.updateUserMetadata(evt.data.id, {
        publicMetadata: { role: "user" },
      })
      console.log("user was created + applied user role to new user");
    } catch (error) {
      console.error("user was created but update failed: ", error)
    }
  }

  return new Response('Webhook received', { status: 200 })
}