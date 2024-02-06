
import React, { Dispatch, SetStateAction } from 'react';

const Modal = ({children, title, setShowModal} : {children: React.ReactNode, title: string, setShowModal: Dispatch<SetStateAction<string | null>>}) => {
    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className="bg-slate-400 p-3 rounded-md min-w-60 w-4/5 max-w-2xl">
                    <h1 className="text-3xl font-sans font-bold text-center mb-2 flex justify-between align-center">
                        {title}
                        <button onClick={() => setShowModal(null)}>x</button>
                    </h1>
                    {children}
                </div>
            </div>
        </div>
    );
};


export default Modal