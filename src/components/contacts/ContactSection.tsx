'use client';
import ContactItem from './ContactItem';
import MenuOptions from './MenuOptions';
import {useQuery} from '@tanstack/react-query';
import {fetchBasic} from '@/hooks/fetch/useFetch';
import {useSession} from 'next-auth/react';

type Props = {
  selectedContact?: any;
  setSelectedContact?(e: any): void;
};

const ContactSection = (props: Props) => {
  const {data: dataSession} = useSession();

  const {data: dataContact} = useQuery({
    queryKey: ['contact'],
    queryFn: async () =>
      fetchBasic('/api/contact', 'GET').then((res) => res?.data),
  });

  return (
    <div
      className="rounded-tr-[30px] flex flex-col w-60 max-h-[500px] relative"
      style={{
        backgroundImage: 'linear-gradient(#F9F9F9, transparent 50%)',
      }}
    >
      <div className="flex items-center justify-between p-6">
        <b>Chats</b>
        <MenuOptions />
      </div>
      <div
        className="flex-1 space-y-2 px-6 h-full overflow-y-scroll overflow-x-hidden"
        style={{
          maskImage: 'linear-gradient(white 70%, transparent 100%)',
        }}
      >
        {dataContact?.map((val: any, idx: number) => {
          const findTarget = val?.user?.find(
            (item: any) => item?.user?.username !== dataSession?.user?.name
          );
          const username = findTarget?.user?.username;
          const _data = {chatId: val?.id, chatName: username};

          return (
            <ContactItem
              onClick={() => {
                props.setSelectedContact && props.setSelectedContact(_data);
              }}
              key={idx}
              data={{
                username,
              }}
              selectedUser={props.selectedContact?.chatName}
            />
          );
        })}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default ContactSection;
