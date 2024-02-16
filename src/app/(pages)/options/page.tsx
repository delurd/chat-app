'use client';
import {authOptions} from '@/app/api/auth/[...nextauth]/action';
import {host} from '@/utils/variables';
import {getServerSession} from 'next-auth';
import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import socketClient, {socket} from '../action';
import {useSession} from 'next-auth/react';
import {AnimatePresence, motion} from 'framer-motion';
import {notFound} from 'next/navigation';

type Props = {};

const OptionsPage = (props: Props) => {
  if (true) {
    notFound();
  }

  const {data} = useSession();
  const [inputVal, setInputVal] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {}, []);

  const actionButon = async () => {};

  return (
    <div className="m-10 space-y-10">
      <h1>OptionsPage</h1>
      <div>
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
      <br />
      <button
        className="bg-green-200 p-3 active:scale-90 duration-200 rounded-xl relative overflow-hidden"
        onClick={() => setIsActive(!isActive)}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div
              key={'btn'}
              className="bg-orange-200 absolute z-0 -inset-1 "
              initial={{
                x: 140,
                y: 20,
                borderRadius: 60,
              }}
              animate={{
                x: 0,
                y: 0,
                borderRadius: 12,
              }}
              exit={{
                x: -140,
                y: 20,
                borderRadius: 60,
              }}
            ></motion.div>
          )}
        </AnimatePresence>
        <div className="z-10 relative">
          <p>TEST Button</p>
        </div>
      </button>
      <button
        className="bg-green-200 p-3 active:scale-90 duration-200 rounded-xl relative overflow-hidden"
        onClick={() => setIsActive(!isActive)}
      >
        <motion.div
          className="bg-orange-200 absolute z-0 -inset-1 "
          animate={isActive ? 'show' : 'hide'}
          variants={{
            show: {x: 0, y: 0, borderRadius: 12},
            hide: {x: 140, y: 20, borderRadius: 60},
          }}
        ></motion.div>

        <div className="z-10 relative">
          <p>TEST Button</p>
        </div>
      </button>
      <br />
      <AnimatePresence>
        {isActive ? (
          <motion.div
            key={'desc'}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20, transition: {ease: 'easeOut'}}}
            className="bg-orange-50 max-w-max p-4"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
            ipsa?
          </motion.div>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptionsPage;
