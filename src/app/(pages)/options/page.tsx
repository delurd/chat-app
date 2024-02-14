'use client';
import {authOptions} from '@/app/api/auth/[...nextauth]/action';
import {host} from '@/utils/variables';
import {getServerSession} from 'next-auth';
import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import socketClient, {socket} from '../action';
import {useSession} from 'next-auth/react';

type Props = {};

const OptionsPage = (props: Props) => {
  const {data} = useSession();
  const [inputVal, setInputVal] = useState('');

  const socketOn = async () => {
    await fetch(host + '/api/socket');

    socketClient(data?.user?.name ?? '');
  };

  useEffect(() => {
    console.log('awal');
    
    socketOn();
  }, []);

  const actionButon = async () => {
    console.log('on click');
    const _socket = socket;
    _socket.emit('message:send', {
      target: inputVal,
      message: 'pesan dari ' + data?.user?.name,
      targetChatId: '',
    });
  };

  return (
    <div className="m-10 space-y-10">
      <h1>OptionsPage</h1>
      <input
        type="text"
        placeholder="to username"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      <button
        className="bg-green-200 p-3 active:scale-90"
        onClick={actionButon}
      >
        TEST
      </button>
    </div>
  );
};

export default OptionsPage;
