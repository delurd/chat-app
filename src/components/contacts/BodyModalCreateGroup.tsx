'use client';
import {fetchBasic} from '@/hooks/fetch/useFetch';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import React, {useState} from 'react';
import Loader from '../ui/loader/Loader';

type Props = {};

const BodyModalCreateGroup = (props: Props) => {
  const {data: dataSession} = useSession();
  const queryClient = useQueryClient();

  const [groupName, setGroupName] = useState('');
  const [memberList, setMemberList] = useState<string[]>([]);

  const {data: dataContact, isLoading: loadingContact} = useQuery({
    queryKey: ['contact'],
    queryFn: async () =>
      fetchBasic('/api/contact', 'GET').then((res) => res?.data),
  });

  const filterPersonalContact = dataContact
    ? dataContact?.filter((item: any) => item?.type == 'personal')
    : [];

  const mutationCreateGroup = useMutation({
    mutationFn: async (body: any) =>
      await fetchBasic('/api/group', 'POST', JSON.stringify(body)).then(
        (res) => res?.data
      ),
    onSuccess: async (data) => {
      queryClient.setQueryData(['contact'], (old: any[]) => [...old, data]);
      setMemberList([]);
      setGroupName('');
      console.log('success');
    },
  });

  const actionCreateGroup = async () => {
    const body = {groupName, userIdList: memberList};
    mutationCreateGroup.mutate(body);
  };

  return (
    <div>
      <input
        required
        type="text"
        placeholder="Group Name"
        name="groupName"
        className="authInput w-full"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <br />
      <br />
      <div className="flex items-center gap-4 text-[grey]">
        <p>Members of Group</p>
        <hr className="flex-1" />
      </div>
      <div className="h-40 overflow-y-auto my-4">
        <ul className="space-y-1">
          {filterPersonalContact?.map((val: any, idx: number) => {
            const findTarget = val?.user?.find(
              (item: any) => item?.user?.username !== dataSession?.user?.name
            );
            const username = findTarget?.user?.username;
            const id = findTarget?.user?.id;

            return (
              <li
                className="bg-[#F9F9F9] px-4 py-2 rounded-full flex justify-between items-center cursor-pointer border border-transparent hover:border-[#f2f2f2]"
                key={idx}
                onClick={() => {
                  memberList?.find((item) => item == id)
                    ? setMemberList((prev) =>
                        prev?.filter((item) => item !== id)
                      )
                    : setMemberList((prev) => [...prev, id]);
                }}
              >
                {username}
                <div className="w-3 h-3 p-0.5  bg-white">
                  {memberList?.find((item) => item == id) && (
                    <div className="w-full h-full bg-[#FED261]"></div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-end">
        <button
          onClick={actionCreateGroup}
          className="rounded-full h-12 w-28 bg-[#FED261] active:scale-95 duration-200 flex-center"
        >
          {mutationCreateGroup.isPending ? <Loader size="small" /> : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default BodyModalCreateGroup;
