import {useDimension} from '@/hooks/useDimension';
import {AnimatePresence, motion} from 'framer-motion';
import Image from 'next/image';
import React, {useRef} from 'react';

type Props = {
  data?: any;
  selectedUser?: any;
  onClick?(): void;
};

const ContactItem = (props: Props) => {
  const buttonRef = useRef(null);
  const {width: buttonWidth} = useDimension(buttonRef);

  return (
    <button
      ref={buttonRef}
      onClick={props.onClick}
      className={`p-4 w-full rounded-[40px] rounded-br-[0] border-b text-left cursor-pointer duration-200 relative overflow-hidden border-[#FED261] ${
        props.selectedUser == props.data?.username
          ? 'relative z-10 scale-105'
          : ''
      }`}
      style={{
        boxShadow:
          props.selectedUser == props.data?.username
            ? '0 10px 25px rgba(254, 210, 97, 0.6'
            : 'none',
      }}
    >
      <AnimatePresence>
        {props.selectedUser == props.data?.username ? (
          <motion.div
            key={'btnbg'}
            className="bg-[#FED261] absolute z-0 -inset-1 "
            initial={{
              x: buttonWidth + 50,
              y: 50,
              // opacity: 0,
              // scale: 0,
              borderRadius: 100,
              borderBottomRightRadius: 100,
              inset: '10% 50% 10% 10%',
            }}
            animate={{
              x: 0,
              y: 0,
              // opacity: 1,
              // scale: 1,
              borderRadius: 40,
              borderBottomRightRadius: 0,
              inset: '-40% -4% -30% -4%',
            }}
            exit={{
              x: -(buttonWidth + 50),
              y: 50,
              // opacity: 0,
              borderRadius: 100,
              borderBottomRightRadius: 100,
            }}
            transition={{ease: 'easeOut', duration: 0.3}}
          ></motion.div>
        ) : null}
      </AnimatePresence>
      <div className="z-[10] flex items-center gap-2 relative">
        <img
          src={'/profile.png'}
          // width={50}
          // height={50}
          alt="profile"
          className="rounded-full bg-red-50 aspect-square w-10 object-cover"
        />
        <b>{props.data?.username}</b>
      </div>
    </button>
  );
};

export default ContactItem;
