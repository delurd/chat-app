import {Popover, Transition} from '@headlessui/react';
import React, {Fragment, useState} from 'react';
import ModalTemplate from '../ui/modal/ModalTemplate';
import BodyModalSettings from './BodyModalSettings';
import BodyModalAddContact from './BodyModalAddContact';
import BodyModalCreateGroup from './BodyModalCreateGroup';

type Props = {};

const MenuOptions = (props: Props) => {
  const [isShowModalSetting, setIsShowModalSetting] = useState(false);
  const [isShowModalAddContact, setIsShowModalAddContact] = useState(false);
  const [isShowModalCreateGroup, setIsShowModalCreateGroup] = useState(false);

  return (
    <>
      <Popover className="relative">
        {({open}) => (
          <>
            <Popover.Button
              className={`bg-white w-10 h-10 rounded-full active:scale-95 hover:shadow-lg duration-300 ${
                open ? 'shadow-lg' : ''
              }`}
            >
              <b>+</b>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute max-sm:right-0 z-40 mt-2 bg-white overflow-hidden rounded-2xl p-4 shadow-lg min-w-max">
                <div>
                  <button
                    className="w-full p-2 hover:bg-slate-50 rounded-md text-left"
                    onClick={() => setIsShowModalAddContact(true)}
                  >
                    Add Contact
                  </button>
                </div>
                <div>
                  <button
                    className="w-full p-2 hover:bg-slate-50 rounded-md text-left"
                    onClick={() => setIsShowModalCreateGroup(true)}
                  >
                    Create Group
                  </button>
                </div>
                <div>
                  <button
                    className="w-full p-2 hover:bg-slate-50 rounded-md text-left"
                    onClick={() => setIsShowModalSetting(true)}
                  >
                    Settings
                  </button>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <ModalTemplate
        isModalOpen={isShowModalSetting}
        closeModal={() => setIsShowModalSetting(false)}
        title="Settings"
      >
        <BodyModalSettings />
      </ModalTemplate>
      <ModalTemplate
        isModalOpen={isShowModalAddContact}
        closeModal={() => setIsShowModalAddContact(false)}
        title="Add Contact"
      >
        <BodyModalAddContact />
      </ModalTemplate>
      <ModalTemplate
        isModalOpen={isShowModalCreateGroup}
        closeModal={() => setIsShowModalCreateGroup(false)}
        title="Create Group"
      >
        <BodyModalCreateGroup />
      </ModalTemplate>
    </>
  );
};

export default MenuOptions;
