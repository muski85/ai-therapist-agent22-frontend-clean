import {NextResponse, NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
  const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';  
  const token = req.headers.get('Authorization');

  if (!token) {
    return NextResponse.json(
      { message : "No token provided" },
      { status: 401 }
    );
  }
  
  
  try { 
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: token,
      },
    })

    const data = await res.json();
    return NextResponse.json(data, {status: res.status});
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error}, 
      { status: 500 }
    );
  }
}
