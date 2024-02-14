'use client';
import {signOut, useSession} from 'next-auth/react';
import Image from 'next/image';
import React, {useEffect} from 'react';

type Props = {};

const BodyModalSettings = (props: Props) => {
  const {data} = useSession();

  return (
    <div className="flex-center flex-col">
      <img
        src={'/profile.png'}
        // width={120}
        // height={120}
        alt="profile"
        className="rounded-full bg-red-50 aspect-square w-20 object-cover mb-2"
      />
      <b>{data?.user?.name}</b>
      <p>{data?.user?.email}</p>
      <br />
      <button
        className="p-2 px-4 hover:bg-red-100 text-red-500 duration-300 rounded-full text-left"
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default BodyModalSettings;
