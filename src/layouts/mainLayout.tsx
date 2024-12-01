import React, { useRef, useEffect, ReactNode } from 'react';
import Header from '../pages/dashboard/header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../pages/dashboard/sidebar';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <div className="flex h-screen w-screen flex-col">
                <ToastContainer />
                <Header />

                <div className="flex w-full h-[90vh]">
                    <Sidebar width={200} />

                    <div className="flex-1 bg-gray-50 w-full h-[89vh] border border-slate-400 p-2 m-1 rounded-lg overflow-hidden box-border">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}


export default MainLayout;
