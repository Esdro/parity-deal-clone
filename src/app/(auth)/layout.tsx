import React, { ReactNode } from 'react';

type AuthLayoutProps = {
    children: ReactNode
};
function AuthLayout({children}: AuthLayoutProps) {
    return (
        <div className='min-h-screen flex flex-col py-10 justify-center items-center'>
            {children}
        </div>
    );
}

export default AuthLayout;