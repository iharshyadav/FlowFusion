import { connectToDB } from '@/lib/database/db';
import { User } from '@/lib/database/schema';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextApiRequest) {
  const { searchParams } = new URL(req.url!);
  const userId = searchParams.get('userId');

  if (typeof userId !== 'string') {
    return NextResponse.json({ status: 400, error: 'Invalid userId' });
  }

  const authorizationHeader = req.headers['access-token'] as string;
  if (!authorizationHeader || !authorizationHeader.startsWith('access ')) {
    return NextResponse.json({ status: 401, error: 'Token is missing or invalid' });
  }
  const token = authorizationHeader?.[1];

  console.log(token,"dgedrg")

  if (!token) {
    return NextResponse.json({ status: 401, error: 'Token is missing' });
  }


  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if(!decoded){
      return NextResponse.json({
        msg : "token doesn't matched"
    })
    }

    return NextResponse.json({
        status : 200,
        isAdmin : true
    })
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false });
  }
}