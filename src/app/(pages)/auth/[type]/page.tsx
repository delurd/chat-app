'use client';
import {fetchBasic} from '@/hooks/fetch/useFetch';
import {useMutation} from '@tanstack/react-query';
import {motion} from 'framer-motion';
import {signIn, useSession} from 'next-auth/react';
import Link from 'next/link';
import {notFound, useRouter} from 'next/navigation';
import React, {useState} from 'react';

type Props = {};

const AuthPage = ({params}: {params: {type: string}}) => {
  if (params.type !== 'login' && params.type !== 'register') {
    notFound();
  }

  const {data} = useSession();
  // console.log(data);

  const router = useRouter();
  const [regisError, setRegisError] = useState<any[]>([]);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const actionLogin = async (formData: FormData, fromRegis = false) => {
    if (isLoading && !fromRegis) return;

    const rawFormData = {
      username: formData.get('username') ?? '',
      password: formData.get('password') ?? '',
    };

    setIsLoading(true);

    if (rawFormData.username && rawFormData.password) {
      signIn('login', {...rawFormData, redirect: false}).then((res) => {
        // console.log(res);
        if (res?.ok) {
          router.replace('/');
          return;
        }
        setLoginError(true);
        setIsLoading(false);
      });
    }
  };

  const mutationRegister = useMutation({
    mutationFn: async (formData: FormData) =>
      await fetchBasic('/api/auth/register', 'POST', formData)
        .then(async (res) => {
          await actionLogin(formData, true);
        })
        .catch((error) => {
          const errorTarget = error?.error?.meta?.target;
          const errmsg = `${JSON.stringify(error?.error?.meta)}`;

          errorTarget && setRegisError([errorTarget]);
          setIsLoading(false);
        }),
  });

  const actionRegister = async (formData: FormData) => {
    if (isLoading) return;

    const rawFormData = {
      username: formData.get('username') ?? '',
      email: formData.get('email') ?? '',
      password: formData.get('password') ?? '',
    };

    if (rawFormData.email && rawFormData.password && rawFormData.username) {
      setIsLoading(true);
      mutationRegister.mutate(formData);
    }
  };

  return (
    <main className="min-h-screen flex-center">
      <form
        action={params.type == 'login' ? actionLogin : actionRegister}
        className="relative"
      >
        <motion.div
          className={`bg-[#FED261] p-6 w-3/5 absolute -top-16 h-24 rounded-tl-[30px]`}
          // style={{...position}}
          initial={{translateX: params.type !== 'register' ? '153px' : '0'}}
          animate={{translateX: params.type == 'register' ? '153px' : '0'}}
          transition={{ease: 'easeOut'}}
        >
          <b>Citchat</b>
        </motion.div>
        <div className="bg-[#F9F9F9] p-8 min-h-[420px] w-96 relative flex flex-col justify-between rounded-tl-[30px] rounded-br-[30px]">
          <>
            {params.type == 'login' ? (
              <motion.div
                className="space-y-8"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
              >
                <h1 className="font-bold text-2xl text-[grey]">
                  Start Citchat
                </h1>
                <input
                  required
                  type="text"
                  placeholder="Username / email"
                  name="username"
                  className={
                    'authInput w-full' + (loginError ? ' border-red-400' : '')
                  }
                  onChange={() => {
                    loginError && setLoginError(false);
                  }}
                />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  name="password"
                  className={
                    'authInput w-full' + (loginError ? ' border-red-400' : '')
                  }
                  onChange={() => {
                    loginError && setLoginError(false);
                  }}
                />
                {loginError && (
                  <p className="text-sm text-red-400  p-2 rounded-full">
                    Invalid email or password!
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="space-y-8"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
              >
                <h1 className="font-bold text-2xl text-[grey]">
                  Join to Citchat
                </h1>
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Username"
                    name="username"
                    className="authInput w-full"
                    onChange={() => {
                      regisError.find((item) => item?.includes('username')) &&
                        setRegisError(
                          regisError.filter(
                            (item) => !item?.includes('username')
                          )
                        );
                    }}
                  />
                  <p className="text-right text-sm text-red-400 mt-1">
                    {regisError.find((item) => item?.includes('username')) &&
                      'username not available'}
                  </p>
                </div>
                <div>
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    name="email"
                    className="authInput w-full"
                    onChange={() => {
                      regisError.find((item) => item == 'email') &&
                        setRegisError(
                          regisError.filter((item) => item !== 'email')
                        );
                    }}
                  />
                  <p className="text-right text-sm text-red-400 mt-1">
                    {regisError.find((item) => item == 'email') &&
                      'email has been used'}
                  </p>
                </div>
                <input
                  required
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="authInput w-full"
                />
              </motion.div>
            )}
          </>
          <motion.div
            className={`flex ${
              params.type == 'login' ? 'justify-end' : 'justify-start'
            }`}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
          >
            <Link
              href={
                isLoading ? '' : params.type == 'login' ? 'register' : 'login'
              }
              className="text-gray-400 hover:text-gray-500"
            >
              {params.type == 'login' ? (
                <p>Go to Register ➔</p>
              ) : (
                <p>
                  <span className="rotate-180 inline-block">➔</span> Back to
                  Login
                </p>
              )}
            </Link>
          </motion.div>
        </div>
        <motion.div
          className={`absolute -bottom-6`}
          initial={{translateX: params.type !== 'register' ? '208px' : '0'}}
          animate={{translateX: params.type == 'register' ? '208px' : '0'}}
        >
          <button
            type="submit"
            className="active:scale-95 duration-200 bg-[#FED261] h-16 w-44 flex-center rounded-tl-[30px] rounded-br-[30px]"
            style={{boxShadow: '0 13px 25px rgba(254, 210, 97, 0.4'}}
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <b>
                {params.type
                  .split('')
                  .map((char, idx) => (idx == 0 ? char.toUpperCase() : char))}
              </b>
            )}
          </button>
        </motion.div>
      </form>
    </main>
  );
};

export default AuthPage;
