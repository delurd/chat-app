'use client';
import ContactItem from './ContactItem';
import MenuOptions from './MenuOptions';
import {useQuery} from '@tanstack/react-query';
import {fetchBasic} from '@/hooks/fetch/useFetch';
import {useSession} from 'next-auth/react';
import {Variants, motion} from 'framer-motion';
import Loader from '../ui/loader/Loader';

type Props = {
  selectedContact?: any;
  setSelectedContact?(e: any): void;
};

const contactVarian: Variants = {
  show: {opacity: 1, y: 0, transition: {ease: 'easeOut'}},
  hide: {opacity: 0, y: 20},
};

const contactContainerVarian: Variants = {
  show: {transition: {delayChildren: 0.3, staggerChildren: 0.05}},
  hide: {},
};

const ContactSection = (props: Props) => {
  const {data: dataSession} = useSession();

  const {data: dataContact, isLoading: loadingContact} = useQuery({
    queryKey: ['contact'],
    queryFn: async () =>
      fetchBasic('/api/contact', 'GET').then((res) => res?.data),
  });

  return (
    <div
      className="rounded-tr-[30px] flex flex-col w-full max-w-[400px] sm:w-60 h-[554px] relative"
      style={{
        backgroundImage: 'linear-gradient(#F9F9F9, transparent 50%)',
      }}
    >
      <div className="flex items-center justify-between p-6">
        <b>Chats</b>
        <MenuOptions />
      </div>
      <div
        className="flex-1 px-6 h-full overflow-y-scroll overflow-x-hidden"
        style={{
          maskImage: 'linear-gradient(white 70%, transparent 100%)',
        }}
      >
        {loadingContact ? (
          <div className="flex-center">
            <Loader size="medium" />
          </div>
        ) : (
          <motion.div
            className="space-y-2 pt-1"
            variants={contactContainerVarian}
            initial="hide"
            animate="show"
          >
            {dataContact?.map((val: any, idx: number) => {
              const findTarget = val?.user?.find(
                (item: any) => item?.user?.username !== dataSession?.user?.name
              );
              const username = val?.name
                ? val.name
                : findTarget?.user?.username;
              const _data = {
                chatId: val?.id,
                chatName: username,
                type: val?.type,
              };

              return (
                <motion.div variants={contactVarian} key={idx}>
                  <ContactItem
                    onClick={() => {
                      props.setSelectedContact &&
                        props.setSelectedContact(_data);
                    }}
                    data={{
                      username,
                    }}
                    selectedUser={props.selectedContact?.chatName}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default ContactSection;
