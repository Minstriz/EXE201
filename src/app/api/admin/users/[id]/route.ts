import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updatedUserData = await req.json();

    // Read existing data
    const fileContents = fs.readFileSync(usersFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Find the user and update
    const userIndex = data.users.findIndex((user: any) => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    data.users[userIndex] = { ...data.users[userIndex], ...updatedUserData };

    // Write updated data back
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ message: 'User updated successfully', user: data.users[userIndex] });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Read existing data
    const fileContents = fs.readFileSync(usersFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Filter out the user to delete
    const initialLength = data.users.length;
    data.users = data.users.filter((user: any) => user.id !== id);

    if (data.users.length === initialLength) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Write updated data back
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
} 