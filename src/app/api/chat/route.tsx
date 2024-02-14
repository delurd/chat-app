import {NextRequest, NextResponse} from 'next/server';
import {prisma, userSession} from '../action';

export const GET = async (req: NextRequest) => {
  const UserSession = await userSession();
  if (!UserSession)
    return NextResponse.json({message: 'not authorized!'}, {status: 403});

  try {
    const res = await prisma.connections.findMany({
      where: {
        user: {some: {userId: userSession?.id}},
        chats: {
          some: {
            OR: [{fromId: UserSession?.id, message: ''}, {message: {not: ''}}],
          },
        },
      },
      include: {
        user: {select: {user: {select: {username: true}}}},
      },
    });

    // console.log(res);

    return NextResponse.json({message: 'success', data: res});
  } catch (error) {
    return NextResponse.json(
      {message: 'something went wrong!', error},
      {status: 400}
    );
  }
};

export const POST = async (req: NextRequest) => {
  const UserSession = await userSession();
  if (!UserSession)
    return NextResponse.json({message: 'not authenticate!'}, {status: 401});

  const body = await req.json();
  const userId = UserSession?.id;
  const targetConnectionId = body?.chatId ?? '';

  const message = body?.message ?? '';

  try {
    if (!UserSession)
      return NextResponse.json(
        {message: 'something went wrong!', error: 'not authenticate!'},
        {status: 401}
      );

    const res = await prisma.chats.create({
      data: {
        toConnectionId: targetConnectionId,
        fromId: UserSession?.id,
        message,
      },
      select: {
        id: true,
        message: true,
        updateAt: true,
        from: {select: {id: true, username: true}},
      },
    });

    return NextResponse.json({message: 'success', data: res});
  } catch (error) {
    return NextResponse.json(
      {message: 'something went wrong!', error},
      {status: 400}
    );
  }
};
