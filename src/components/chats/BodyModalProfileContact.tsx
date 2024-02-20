import {fetchBasic} from '@/hooks/fetch/useFetch';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import React, {useEffect} from 'react';
import Loader from '../ui/loader/Loader';

type Props = {
  username?: string;
  type?: 'personal' | 'group';
  chatId?: string;
};

const BodyModalProfileContact = (props: Props) => {
  const {data: dataSession} = useSession();

  const {
    data: dataGroup,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['group' + props.chatId],
    queryFn: async () =>
      fetchBasic('/api/group/' + props.chatId).then((res) => res?.data),
    enabled: false,
  });

  useEffect(() => {
    props.type == 'group' && refetch();
  }, [props.chatId]);

  const groupMember = dataGroup?.user;

  //   console.log(groupMember);

  return (
    <div className="flex-center flex-col">
      <img
        src={'/profile.png'}
        // width={120}
        // height={120}
        alt="profile"
        className="rounded-full bg-red-50 aspect-square w-20 object-cover mb-2"
      />
      <b>{props.username}</b>
      <p className="bg-[#F9F9F9] text-[grey] text-xs px-2 py-1 rounded-full my-1">
        {props.type == 'group' ? 'Group' : 'Personal'}
      </p>
      {/* <br /> */}
      {props.type == 'group' ? (
        <>
          {/* <button
            className="p-2 px-4 hover:bg-red-100 text-red-500 duration-300 rounded-full text-left"
            onClick={() => {}}
          >
            Leave group
          </button> */}
          <br />
          <div className="flex items-center gap-4 text-[grey] w-full text-sm">
            <p>Members of Group</p>
            <hr className="flex-1" />
          </div>
          <div className="max-h-40 overflow-y-auto my-4 w-full">
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
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BodyModalProfileContact;
