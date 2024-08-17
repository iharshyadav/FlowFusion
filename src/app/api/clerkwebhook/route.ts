import { connectToDB } from '@/lib/database/db';
import { User } from '@/lib/database/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email_addresses, first_name, image_url } = body?.data;

    const email = email_addresses[0]?.email_address;
    console.log('✅', body);

    await connectToDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      await User.updateOne(
        { email },
        {
          $set: {
            clerkId: id,
            name: first_name || '',
            profileImage: image_url || ''
          }
        }
      );
      return new NextResponse('User updated in database successfully', {
        status: 200
      });
    } else {
      await User.create({
        clerkId: id,
        email,
        name: first_name || '',
        profileImage: image_url || ''
      });
      return new NextResponse('User created in database successfully', {
        status: 201
      });
    }
  } catch (error) {
    console.error('Error updating database:', error);
    return new NextResponse('Error updating database', {
      status: 500
    });
  }
}