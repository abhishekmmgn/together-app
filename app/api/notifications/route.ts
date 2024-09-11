import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import { getDataFromToken } from "@/lib/getDataFromToken";
import type { NotificationType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const curUserId = await getDataFromToken(request);
    const user = await User.findOne({ _id: curUserId });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const notifications = user.notifications;

    return NextResponse.json({
      message: "Notifications found",
      data: notifications || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { message, destination } = await request.json();

    const curUserId = await getDataFromToken(request);
    const user = await User.findOne({ _id: curUserId });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const notification = {
      message,
      destination,
      read: false,
      createdBy: curUserId,
      createdAt: new Date(),
    };

    // send notifications to user's friends
    const friends = user.friends;

    for (let i = 0; i < friends.length; i++) {
      const friend = await User.findOne({ _id: friends[i] });

      friend.notifications.push(notification);

      await friend.save();
    }

    return NextResponse.json({
      message: "Notification sent",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { allRead } = await request.json();

    const curUserId = await getDataFromToken(request);
    const user = await User.findOne({ _id: curUserId });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // update notifications
    if (allRead) {
      // Set all notifications to read
      const updatedNotifications = user.notifications.map(
        (notification: NotificationType) => {
          notification.read = true;
          return notification;
        }
      );

      // Update the user's notifications in the database
      await User.findOneAndUpdate(
        { _id: curUserId },
        { notifications: updatedNotifications },
        { new: true }
      );
    }

    return NextResponse.json({
      message: "Updated notifications",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}
