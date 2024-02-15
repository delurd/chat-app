'use client';
import React, {useEffect, useState} from 'react';
import ChatItem from './ChatItem';
import Image from 'next/image';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchBasic} from '@/hooks/fetch/useFetch';
import {useSession} from 'next-auth/react';
import socketClient, {socket} from '@/app/(pages)/action';

type Props = {selectedContact?: any};

const ChatSection = (props: Props) => {
  const queryClient = useQueryClient();
  const {data: dataSession} = useSession();
  const [messageInput, setMessageInput] = useState('');
  const [loadingSend, setLoadingSend] = useState(false);

  const {data: dataListChat, refetch} = useQuery({
    queryKey: ['chatList', props.selectedContact?.chatId ?? ''],
    queryFn: async () =>
      fetchBasic('/api/chat/' + props.selectedContact?.chatId, 'GET').then(
        (res) => res?.data
      ),
    enabled: false,
  });

  useEffect(() => {
    setMessageInput('');
    props.selectedContact?.chatId && refetch();
  }, [props.selectedContact]);

  useEffect(() => {
    return () => {
      socket.on('message:receive' + dataSession?.user?.name, (obj) => {
        const chatId = obj?.targetChatId;
        const messageData = obj?.message;

        console.log('Pesan -> ', obj);

        queryClient.setQueryData(['chatList', chatId], (old: any) => {
          if (old) return [...old, messageData];
          return [];
        });
      });
      socket.on('message:response' + dataSession?.user?.name, (res) => {
        console.log(res);
      });
    };
  }, []);

  const mutationSendChat = useMutation({
    mutationFn: async (message: string) =>
      fetchBasic(
        '/api/chat/' + props.selectedContact?.chatId,
        'POST',
        JSON.stringify({message})
      ).then((res) => res?.data),
  });

  const actionSendChat = async (formData: FormData) => {
    const message = (formData.get('message') as string) ?? '';

    if (props.selectedContact?.chatId && message) {
      const dataChat = {
        from: {
          id: dataSession?.user?.name,
          username: dataSession?.user?.name,
        },
        message,
        updateAt: new Date(),
        id: (+new Date()).toString(),
      };

      sendSocket(dataChat);
    }
  };

  const sendSocket = async (dataChat?: any) => {
    setLoadingSend(true);
    const _socket = socket;
    const res = await _socket.emitWithAck('message:send', {
      target: props.selectedContact?.chatName,
      message: dataChat,
      targetChatId: props.selectedContact?.chatId,
    });

    if (res?.message == 'success') {
      queryClient.setQueryData(
        ['chatList', props.selectedContact?.chatId],
        (old: any) => [...old, res?.data]
      );

      setMessageInput('');
    } else {
      console.log(res);
    }
    setLoadingSend(false);
  };

  return (
    <div className="relative min-h-[554px]">
      <div className="flex justify-end">
        <div className="bg-[#FED261] min-h-14 p-4 w-1/2 rounded-tl-[30px] flex-center">
          <b>{props.selectedContact?.chatName}</b>
        </div>
      </div>
      <div
        className="w-96 h-96 rounded-tl-[30px] overflow-y-scroll overflow-x-hidden flex flex-col-reverse"
        style={{
          backgroundImage: 'linear-gradient(#F9F9F9 50%, transparent 90%)',
        }}
      >
        {props.selectedContact?.chatName ? (
          <div className="p-6 space-y-4">
            {dataListChat?.map((item: any, idx: number) => {
              if (!item?.message) return <div key={item?.id ?? idx}></div>;
              return (
                <ChatItem
                  key={item?.id ?? idx}
                  data={item}
                  type={
                    item?.from?.username !== dataSession?.user?.name
                      ? 'in'
                      : 'out'
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="flex-center h-full">
            <Image src={'/icons/logo.png'} alt="" height={90} width={90} />
          </div>
        )}
      </div>
      {props.selectedContact?.chatName ? (
        <form
          action={actionSendChat}
          className="rounded-tl-[30px] rounded-br-[30px] overflow-hidden p-6 flex gap-6 relative z-50"
          style={{boxShadow: '0 13px 35px rgba(0, 0, 0, 0.1'}}
        >
          <textarea
            className="border rounded-[20px] p-2 min-h-16 flex-1 max-h-24"
            name="message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          ></textarea>
          <div className="flex flex-col justify-between">
            <span></span>
            <button
              className={
                'w-12 h-12 flex-center rounded-full duration-200 bg-[#FED261] ' +
                (messageInput.length ? 'active:scale-95 ' : 'opacity-70')
              }
              style={
                messageInput.length
                  ? {boxShadow: '0 10px 25px rgba(254, 210, 97, 0.6'}
                  : {}
              }
              type="submit"
              disabled={!messageInput.length}
            >
              {/* <b>{'>'}</b> */}
              {loadingSend ? (
                <b>...</b>
              ) : (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.165 6.56641C16.7435 7.27196 16.7435 9.51266 15.165 10.2182L2.91117 15.6954C1.0363 16.5335 -0.614451 14.4229 0.736396 12.8761C4.95939 8.04042 4.92085 8.89851 0.620785 3.87074C-0.709105 2.31579 0.944824 0.21024 2.8128 1.04519L15.165 6.56641Z"
                    fill="#414141"
                    fillOpacity="0.6"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default ChatSection;
