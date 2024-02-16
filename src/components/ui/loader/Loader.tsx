import React, {useEffect, useState} from 'react';

type Props = {
  size: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  color?: string;
};

const Loader = (props: Props) => {
  const [borderSize, setBorderSize] = useState('0px');
  const [loaderSize, setLoaderSize] = useState('0px');

  useEffect(() => {
    props.size == 'small' && (setBorderSize('2px'), setLoaderSize('14px'));
    props.size == 'medium' && (setBorderSize('3px'), setLoaderSize('21px'));
    props.size == 'large' && (setBorderSize('5px'), setLoaderSize('32px'));
  }, [props.size]);

  const loaderStyle: React.CSSProperties = {
    border: borderSize + ' solid transparent',
    borderRadius: '50%',
    borderTop:
      borderSize +
      ' solid ' +
      (props.color
        ? props.color
        : props.theme == 'light'
        ? 'white'
        : '#484848'),
    width: loaderSize,
    height: loaderSize,
    WebkitAnimation: 'spin 2s linear infinite' /* Safari */,
    animation: 'spin 2s linear infinite',
  };

  return <div style={loaderStyle} className={'animate-spin'}></div>;
};

export default Loader;
