import React, {ReactNode} from 'react';
import Modal from './Modal';

type Props = {
  isModalOpen: boolean;
  closeModal(): void;
  setIsModalOpen?(e: boolean): void;
  children?: ReactNode;
  title?: string;
  width?: string;
};

const ModalTemplate = (props: Props) => {
  return (
    <Modal
      onClose={props.closeModal}
      show={props.isModalOpen}
      className="rounded-tr-[30px] p-4"
      width={props.width ? props.width : 'w-72'}
    >
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{props.title}</h1>
        <button
          onClick={props.closeModal}
          className="bg-[#f9f9f9] w-10 h-10 rounded-full rotate-45 text-xl active:scale-95 hover:shadow-lg duration-300"
        >
          <b>+</b>
        </button>
      </div>
      <>{props.children}</>
    </Modal>
  );
};

export default ModalTemplate;
