'use client';
import ChatSection from '@/components/chats/ChatSection';
import ContactSection from '@/components/contacts/ContactSection';
import {useEffect, useState} from 'react';
import socketClient from './action';
import {host} from '@/utils/variables';

export default function Home() {
  const [selectedContact, setSelectedContact] = useState({});

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

  return (
    <main className="min-h-screen flex-center">
      <div className="flex relative">
        <ContactSection
          selectedContact={selectedContact}
          setSelectedContact={(e) => setSelectedContact(e)}
        />
        <ChatSection selectedContact={selectedContact} />
      </div>
    </main>
  );
}
