'use client';
import ChatSection from '@/components/chats/ChatSection';
import ContactSection from '@/components/contacts/ContactSection';
import {useEffect, useState} from 'react';
import socketClient from './action';
import {host} from '@/utils/variables';
import {useWindowSize} from '@/hooks/useWindowSize';
import {AnimatePresence, motion} from 'framer-motion';

export default function Home() {
  const [selectedContact, setSelectedContact] = useState({});
  const {windowWidth} = useWindowSize();
  const [minimizeChat, setMinimizeChat] = useState(true);

  const socketActivation = async () => {
    await fetch(host + '/api/socket');

    socketClient();
  };

  useEffect(
    () => () => {
      socketActivation();
    },
    []
  );

  useEffect(() => {
    // windowWidth > 640 && setMinimizeChat(true);
  }, [windowWidth]);

  useEffect(() => {
    //@ts-ignore
    selectedContact?.chatId ? setMinimizeChat(false) : setMinimizeChat(true);
  }, [selectedContact]);

  return (
    <main className="min-h-screen relative flex-center flex-col">
      <div className="flex-center relative  max-sm:w-full max-sm:flex-col flex-1 ">
        {/* <AnimatePresence> */}
        {windowWidth < 640 && !minimizeChat && (
          <button
            key={'btnBack'}
            className="bg-[#F9F9F9] p-2 px-4 m-2 rounded-full"
            onClick={() => setSelectedContact({})}
          >
            {'<-'}
          </button>
        )}
        {(windowWidth > 639 || minimizeChat) && (
          <ContactSection
            key={'contactSection'}
            selectedContact={selectedContact}
            setSelectedContact={(e) => setSelectedContact(e)}
          />
        )}
        {(windowWidth > 639 || !minimizeChat) && (
          <motion.div
            key={'chatSection'}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
          >
            <ChatSection selectedContact={selectedContact} />
          </motion.div>
        )}
        {/* </AnimatePresence> */}
      </div>
      {/* <div className="sm:absolute bottom-0 right-4 mb-4 py-2 px-4 text-[grey] shadow-xl rounded-full max-sm:inset-x-0">
        Real-time chat is not available due to hosting limitations
      </div> */}
    </main>
  );
}
