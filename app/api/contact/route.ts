import { NextRequest } from 'next/server';
import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { sendContactEmail } from '@/lib/email';
import { contactSchema } from '@/lib/validations/contact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    await sendContactEmail(data);

    return jsonSuccess(
      {
        message:
          data.locale === 'fr'
            ? 'Votre message a bien été envoyé.'
            : 'Your message has been sent successfully.',
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
