import {fetchBasic} from '@/hooks/fetch/useFetch';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import React from 'react';

type Props = {};

const BodyModalAddContact = (props: Props) => {
  const queryClient = useQueryClient();

  const mutationAddContact = useMutation({
    mutationFn: async (username: string) =>
      fetchBasic('/api/contact', 'POST', JSON.stringify({username})).then(
        (res) => res?.data
      ),
    onSuccess: async (data) => {
      queryClient.setQueryData(['contact'], (old: any[]) => [...old, data]);
    },
    onError: async (error) => 'gagal',
  });
  const mutationAddContactError = mutationAddContact.error as any;

  const actionAddContact = async (formData: FormData) => {
    const username = (formData.get('username') as string) ?? '';

    username && mutationAddContact.mutate(username);
  };

  return (
    <div>
      <form action={actionAddContact}>
        <div className="mb-4">
          <input
            required
            type="text"
            placeholder="Username"
            name="username"
            className="authInput w-full"
            onChange={() => {}}
          />
          {mutationAddContactError?.error ? (
            <p className="text-right text-sm text-red-400 mt-1">
              username not found
            </p>
          ) : null}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full px-6 py-3 bg-[#FED261] active:scale-95 duration-200"
          >
            {mutationAddContact.isPending ? '...' : 'Add'}
          </button>
        </div>
      </form>
      {/* <div className="flex items-center gap-4 my-8 text-[grey]">
        <p>Invite friend</p>
        <hr className="flex-1" />
      </div>
      <div>
        <div className="mb-4">
          <input
            required
            type="text"
            placeholder="Email"
            name="Email"
            className="authInput w-full"
            onChange={() => {}}
          />
        </div>
        <div className="flex justify-end">
          <button className="rounded-full px-6 py-3 bg-[#F9F9F9] hover:bg-[#FED261] active:scale-95 duration-200">
            Invite
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default BodyModalAddContact;
