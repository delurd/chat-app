import moment from 'moment';
import React, {useEffect} from 'react';

type Props = {
  data?: any;
  type: 'in' | 'out';
};

const ChatItem = (props: Props) => {
  return (
    <div
      className={`flex flex-col ${
        props.type == 'in' ? 'items-start' : 'items-end'
      }`}
    >
      <div className="flex justify-between gap-2">
        <p className="text-xs mb-1 text-[grey]">
          {props.type == 'out' ? 'you' : props.data?.from?.username}
        </p>
        <p className="text-xs mb-1 text-[grey]">
          {moment(props.data?.updateAt).format('YYYY-MM-DD') ==
          moment(new Date()).format('YYYY-MM-DD')
            ? 'today ' + moment(props.data?.updateAt).format('LT')
            : moment(props.data?.updateAt).format('DD/MM/YY LT')}
        </p>
      </div>
      <div
        className={`bg-[#FFEFC7] px-4 py-2 rounded-[30px] max-w-max overflow-hidden ${
          props.type == 'in' ? 'rounded-tl-none' : 'rounded-br-none'
        }`}
      >
        {props?.data?.message}
      </div>
    </div>
  );
};

export default ChatItem;
