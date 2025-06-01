import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(usersFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data.users);
  } catch (error) {
    console.error('Error reading users file:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newUser = await req.json();

    // Read existing data
    const fileContents = fs.readFileSync(usersFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Find the maximum numeric ID and generate the next one
    let maxId = 0;
    data.users.forEach((user: any) => {
      const numericId = parseInt(user.id, 10);
      if (!isNaN(numericId) && numericId > maxId) {
        maxId = numericId;
      }
    });
    const newId = (maxId + 1).toString(); // Generate next ID and keep it as string

    // Add new user with generated ID
    data.users.push({ id: newId, ...newUser });

    // Write updated data back
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ message: 'User added successfully', user: { id: newId, ...newUser } }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ message: 'Error adding user' }, { status: 500 });
  }
} 