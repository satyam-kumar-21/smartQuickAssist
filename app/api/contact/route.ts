import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type } = body;

        let subject, html, text, fromName, replyToEmail;

        if (type === 'return-exchange') {
            const { 
                email, 
                orderNumber, 
                reason, 
                resolution, 
                additionalDetails 
            } = body;

            if (!email || !orderNumber) {
                return NextResponse.json({ message: 'Please provide your email and order number' }, { status: 400 });
            }

            fromName = `Return Request - Order #${orderNumber}`;
            replyToEmail = email;
            subject = `Return/Exchange Request: Order #${orderNumber}`;
            text = `
Return/Exchange Request

Customer Email: ${email}

Order Information:
Order Number: ${orderNumber}

Reason for Return: ${reason || 'Not specified'}

Resolution Requested: ${resolution || 'Not specified'}

Additional Details:
${additionalDetails || 'None provided'}
                `;
            html = `
<h3>New Return/Exchange Request</h3>

<p><strong>Customer Email:</strong> ${email}</p>

<h4>Order Information</h4>
<p><strong>Order Number:</strong> ${orderNumber}</p>

<h4>Reason for Return</h4>
<p>${reason || 'Not specified'}</p>

<h4>Resolution Requested</h4>
<p><strong>${resolution || 'Not specified'}</strong></p>

<h4>Additional Details</h4>
<p>${(additionalDetails || 'None provided').replace(/\n/g, '<br>')}</p>
                `;
        } else {
            const { name, email, orderNumber, subject: reqSubject, message } = body;

            if (!name || !email || !reqSubject || !message) {
                return NextResponse.json({ message: 'Please fill in all required fields' }, { status: 400 });
            }

            fromName = name;
            replyToEmail = email;
            subject = `Contact Form: ${reqSubject} from ${name}`;
            text = `
Name: ${name}
Email: ${email}
Order Number: ${orderNumber || 'N/A'}
Subject: ${reqSubject}

Message:
${message}
                `;
            html = `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Order Number:</strong> ${orderNumber || 'N/A'}</p>
<p><strong>Subject:</strong> ${reqSubject}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
                `;
        }

        await sendEmail({
             to: process.env.CONTACT_RECEIVER_EMAIL || 'support@smartquickassist.com',
             subject,
             html,
             text,
             from: `"${fromName}" <${process.env.EMAIL_FROM || 'support@smartquickassist.com'}>`,
             replyTo: replyToEmail
        });

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error: any) {
        console.error('Contact email sending error:', error);
        return NextResponse.json({ message: error.message || 'Failed to send email. Please try again later.' }, { status: 500 });
    }
}
