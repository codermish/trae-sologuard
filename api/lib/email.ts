import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'sendgrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error('Failed to send email')
  }
}

export const sendBookingConfirmation = async (
  to: string,
  bookingDetails: {
    bookingId: string
    type: string
    totalAmount: number
    checkIn?: Date
    checkOut?: Date
    items: Array<{
      name: string
      price: number
      details: string
    }>
  }
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">Booking Confirmation</h1>
      <p>Dear Customer,</p>
      <p>Thank you for booking with TravelHub! Your booking has been confirmed.</p>
      
      <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Booking Details</h3>
        <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
        <p><strong>Type:</strong> ${bookingDetails.type}</p>
        <p><strong>Total Amount:</strong> $${bookingDetails.totalAmount}</p>
        ${bookingDetails.checkIn ? `<p><strong>Check-in:</strong> ${bookingDetails.checkIn.toLocaleDateString()}</p>` : ''}
        ${bookingDetails.checkOut ? `<p><strong>Check-out:</strong> ${bookingDetails.checkOut.toLocaleDateString()}</p>` : ''}
      </div>
      
      <div style="margin: 20px 0;">
        <h3>Booking Items</h3>
        ${bookingDetails.items.map(item => `
          <div style="border: 1px solid #E5E7EB; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <h4>${item.name}</h4>
            <p><strong>Price:</strong> $${item.price}</p>
            <p>${item.details}</p>
          </div>
        `).join('')}
      </div>
      
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The TravelHub Team</p>
    </div>
  `

  await sendEmail({
    to,
    subject: `Booking Confirmation - ${bookingDetails.bookingId}`,
    html,
  })
}