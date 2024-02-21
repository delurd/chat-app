import {fetchBasic} from '@/hooks/fetch/useFetch';
import {ContextSelectedContact} from '@/utils/contextList';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import React, {useContext, useState} from 'react';
import Loader from '../ui/loader/Loader';

type Props = {};

const SectionAddMemberGroup = (props: Props) => {
  const {selectedContact} = useContext(ContextSelectedContact);
  const {chatId} = selectedContact;
  const queryClient = useQueryClient();
  const [inputUsername, setInputUsername] = useState('');

  const mutationAddNewMember = useMutation({
    mutationFn: async (username: string) =>
      await fetchBasic(
        `/api/group/${chatId}/member`,
        'POST',
        JSON.stringify({username})
      ).then((res) => res?.data),
    onSuccess: async (data) => {
      queryClient.setQueryData(['group' + chatId], (old: any) => {
        const newUser = [...old?.user, data];
        old.user = newUser;

        return old;
      });

      setInputUsername('');
    },
  });

  const actionAddNewMember = (formData: FormData) => {
    const username = formData.get('username') as string;
    username && mutationAddNewMember.mutate(username);
  };

  return (
    <form action={actionAddNewMember}>
      <input
        required
        type="text"
        placeholder="Username"
        name="username"
        className="authInput w-full"
        value={inputUsername}
        onChange={(e) => setInputUsername(e.target.value)}
      />
      <p className="text-right text-red-400 text-sm">
        {mutationAddNewMember?.error?.message}
      </p>
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="rounded-full h-12 w-24 bg-[#FED261] active:scale-95 duration-200 flex-center"
        >
          {mutationAddNewMember.isPending ? <Loader size="small" /> : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default SectionAddMemberGroup;
