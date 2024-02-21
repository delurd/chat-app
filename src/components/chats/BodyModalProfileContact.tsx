import {fetchBasic} from '@/hooks/fetch/useFetch';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import React, {useContext, useEffect, useState} from 'react';
import Loader from '../ui/loader/Loader';
import {ContextSelectedContact} from '@/utils/contextList';
import SectionAddMemberGroup from './SectionAddMemberGroup';

type Props = {
  closeModal?(): void;
};

const BodyModalProfileContact = (props: Props) => {
  const {data: dataSession} = useSession();
  const queryClient = useQueryClient();
  const {selectedContact, setSelectedContact} = useContext(
    ContextSelectedContact
  );
  const {chatName, chatId, type} = selectedContact;

  const [isAddNewMember, setIsAddNewMember] = useState(false);

  const {
    data: dataGroup,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['group' + chatId],
    queryFn: async () =>
      fetchBasic('/api/group/' + chatId).then((res) => res?.data),
    enabled: false,
  });

  useEffect(() => {
    type == 'group' && refetch();
  }, [chatId]);

  const groupMember = dataGroup?.user;

  const mutationLeaveGroup = useMutation({
    mutationFn: async () =>
      await fetchBasic(`/api/group/${chatId}/leave`, 'PUT'),
    onSuccess: async (data) => {
      queryClient.setQueryData(['contact'], (old: any[]) =>
        old.filter((item) => item?.id !== chatId)
      );

      props.closeModal && props.closeModal();
      setSelectedContact({});
    },
  });

  return (
    <div className="flex-center flex-col">
      <img
        src={'/profile.png'}
        // width={120}
        // height={120}
        alt="profile"
        className="rounded-full bg-red-50 aspect-square w-20 object-cover mb-2"
      />
      <b>{chatName}</b>
      <p className="bg-[#F9F9F9] text-[grey] text-xs px-2 py-1 rounded-full my-1">
        {type == 'group' ? 'Group' : 'Personal'}
      </p>
      {type == 'group' ? (
        <>
          <button
            className="h-10 w-32 hover:bg-red-100 text-red-500 duration-300 rounded-full flex-center"
            onClick={() => mutationLeaveGroup.mutate()}
          >
            {mutationLeaveGroup.isPending ? (
              <Loader size="small" color="rgb(239 68 68)" />
            ) : (
              ' Leave group'
            )}
          </button>
          <br />
          <div className="flex items-center gap-4 text-[grey] w-full text-sm">
            <p>{isAddNewMember ? 'Add New Member' : 'Members of Group'}</p>
            <hr className="flex-1" />
            <button
              title="Add new member"
              className={
                'bg-[#F9F9F9] w-8 h-8 rounded-full hover:bg-[#FED261] hover:text-black ' +
                (isAddNewMember ? 'rotate-45' : '')
              }
              onClick={() => setIsAddNewMember(!isAddNewMember)}
            >
              +
            </button>
          </div>
          <div className="max-h-40 min-h-12 overflow-y-auto my-4 w-full">
            {isAddNewMember ? (
              <SectionAddMemberGroup />
            ) : (
              <ul className="space-y-1">
                {isLoading ? (
                  <div className="flex-center">
                    <Loader size="small" />
                  </div>
                ) : (
                  groupMember?.map((val: any, idx: number) => {
                    const username = val?.user?.username;
                    const id = val?.user?.id;

                    return (
                      <li
                        className="bg-[#F9F9F9] px-4 py-2 rounded-full border border-transparent hover:border-[#f2f2f2]"
                        key={idx}
                      >
                        {username == dataSession?.user?.name ? 'you' : username}
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BodyModalProfileContact;
