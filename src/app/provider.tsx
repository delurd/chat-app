'use client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SessionProvider} from 'next-auth/react';
import React, {ReactNode} from 'react';

type Props = {
  children: ReactNode;
  session: any;
};
const queryClient = new QueryClient();

const Provider = (props: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={props.session}>
        {props.children}
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Provider;
