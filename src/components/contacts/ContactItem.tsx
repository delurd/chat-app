import Image from 'next/image';
import React from 'react';

type Props = {
  data?: any;
  selectedUser?: any;
  onClick?(): void;
};

const ContactItem = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`p-4 w-full rounded-[40px] rounded-br-[0] border-b text-left cursor-pointer flex items-center gap-2 duration-300 ${
        props.selectedUser == props.data?.username
          ? 'bg-[#FED261] relative z-10 border-transparent'
          : 'border-[#FED261]'
      }`}
      style={{
        boxShadow:
          props.selectedUser == props.data?.username
            ? '0 10px 25px rgba(254, 210, 97, 0.6'
            : 'none',
      }}
    >
      <img
        src={'/profile.png'}
        // width={50}
        // height={50}
        alt="profile"
        className="rounded-full bg-red-50 aspect-square w-10 object-cover"
      />
      <b>{props.data?.username}</b>
    </button>
  );
};

export default ContactItem;
