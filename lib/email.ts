import { Resend } from 'resend';
import type { BookingInput } from '@/lib/validations/booking';
import type { ContactInput } from '@/lib/validations/contact';

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM ?? 'HS Luxury Quads <bookings@hsluxuryquads.com>';
const ownerEmail = process.env.OWNER_EMAIL ?? 'info@hsluxuryquads.com';
const whatsappNumber = process.env.WHATSAPP_NUMBER ?? '+212634857515';

function getResendClient() {
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  return new Resend(resendApiKey);
}

interface BookingEmailContext {
  booking: BookingInput & { reference: string };
  tourTitle: string;
  totalAmount: number;
}

export async function sendBookingConfirmationEmail(
  to: string,
  context: BookingEmailContext,
) {
  const resend = getResendClient();
  const locale = context.booking.locale ?? 'en';
  const isFrench = locale === 'fr';

  const subject = isFrench
    ? `Confirmation de demande — ${context.booking.reference}`
    : `Booking request received — ${context.booking.reference}`;

  const html = isFrench
    ? `
      <h2>Merci, ${context.booking.name}</h2>
      <p>Nous avons bien reçu votre demande de réservation pour <strong>${context.tourTitle}</strong>.</p>
      <p><strong>Référence:</strong> ${context.booking.reference}</p>
      <p><strong>Date souhaitée:</strong> ${context.booking.date}</p>
      <p><strong>Personnes:</strong> ${context.booking.guests}</p>
      <p><strong>Montant estimé:</strong> ${context.totalAmount} EUR</p>
      <p>Notre équipe vous contactera rapidement pour confirmer la disponibilité et organiser votre transfert privé.</p>
      <p>WhatsApp: ${whatsappNumber}</p>
    `
    : `
      <h2>Thank you, ${context.booking.name}</h2>
      <p>We have received your booking request for <strong>${context.tourTitle}</strong>.</p>
      <p><strong>Reference:</strong> ${context.booking.reference}</p>
      <p><strong>Preferred date:</strong> ${context.booking.date}</p>
      <p><strong>Guests:</strong> ${context.booking.guests}</p>
      <p><strong>Estimated total:</strong> ${context.totalAmount} EUR</p>
      <p>Our team will contact you shortly to confirm availability and arrange your private transfer.</p>
      <p>WhatsApp: ${whatsappNumber}</p>
    `;

  return resend.emails.send({
    from: emailFrom,
    to,
    subject,
    html,
  });
}

export async function sendBookingOwnerNotification(context: BookingEmailContext) {
  const resend = getResendClient();

  const html = `
    <h2>New booking request — ${context.booking.reference}</h2>
    <p><strong>Tour:</strong> ${context.tourTitle}</p>
    <p><strong>Customer:</strong> ${context.booking.name}</p>
    <p><strong>Email:</strong> ${context.booking.email}</p>
    <p><strong>Phone / WhatsApp:</strong> ${context.booking.phone}</p>
    <p><strong>Preferred date:</strong> ${context.booking.date}</p>
    <p><strong>Guests:</strong> ${context.booking.guests}</p>
    <p><strong>Pickup:</strong> ${context.booking.pickup || 'Not provided'}</p>
    <p><strong>Special requests:</strong> ${context.booking.message || 'None'}</p>
    <p><strong>Estimated total:</strong> ${context.totalAmount} EUR</p>
    <p><strong>Owner WhatsApp:</strong> ${whatsappNumber}</p>
  `;

  return resend.emails.send({
    from: emailFrom,
    to: ownerEmail,
    subject: `New booking: ${context.booking.reference} — ${context.tourTitle}`,
    html,
  });
}

export async function sendContactEmail(input: ContactInput) {
  const resend = getResendClient();
  const locale = input.locale ?? 'en';
  const isFrench = locale === 'fr';

  const customerSubject = isFrench
    ? 'Nous avons bien reçu votre message'
    : 'We received your message';

  const customerHtml = isFrench
    ? `
      <h2>Merci, ${input.name}</h2>
      <p>Nous avons bien reçu votre message et nous vous répondrons rapidement.</p>
      <p>WhatsApp: ${whatsappNumber}</p>
    `
    : `
      <h2>Thank you, ${input.name}</h2>
      <p>We have received your message and will get back to you shortly.</p>
      <p>WhatsApp: ${whatsappNumber}</p>
    `;

  const ownerHtml = `
    <h2>New contact message</h2>
    <p><strong>Name:</strong> ${input.name}</p>
    <p><strong>Email:</strong> ${input.email}</p>
    <p><strong>Phone:</strong> ${input.phone || 'Not provided'}</p>
    <p><strong>Message:</strong></p>
    <p>${input.message.replace(/\n/g, '<br />')}</p>
    <p><strong>Owner WhatsApp:</strong> ${whatsappNumber}</p>
  `;

  await Promise.all([
    resend.emails.send({
      from: emailFrom,
      to: input.email,
      subject: customerSubject,
      html: customerHtml,
    }),
    resend.emails.send({
      from: emailFrom,
      to: ownerEmail,
      subject: `Contact form: ${input.name}`,
      html: ownerHtml,
    }),
  ]);
}
