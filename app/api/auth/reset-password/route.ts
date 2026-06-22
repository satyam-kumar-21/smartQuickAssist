import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, otp, newPassword } = await request.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const trimmedEmail = email.trim().toLowerCase();

        const otpRecord = await OTP.findOne({ 
            email: trimmedEmail, 
            otp, 
            type: 'reset' 
        });

        if (!otpRecord) {
            return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
        }

        const user = await User.findOne({ email: trimmedEmail });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.password = newPassword;
        await user.save();

        await OTP.deleteOne({ _id: otpRecord._id });

        return NextResponse.json({ message: 'Password reset successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
