import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const userId = searchParams.get('userId');

  if(userId === null){
    return NextResponse.json({ status: 400, error: 'missing userId' });
  }

  if (typeof userId !== 'string') {
    return NextResponse.json({ status: 400, error: 'Invalid userId' });
  }

  const authorizationHeader = req.headers.get('authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return NextResponse.json({ status: 401, error: 'Authorization header is missing or invalid' });
  }

  // Extract the token from the Authorization header
  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return NextResponse.json({ status: 401, error: 'Token is missing' });
  }


  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded || typeof decoded !== 'object' || decoded.clerkId !== userId) {
      return NextResponse.json({ status: 401, error: "Token doesn't match userId" });
    }

    return NextResponse.json({
        status : 200,
        isAdmin : true
    })
  } catch (error) {
    // console.error("Error checking admin status:", error);
    return NextResponse.json({status : 201, isAdmin: false });
  }
}