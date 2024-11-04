"use client";
import React from 'react';
import { Button } from '@/components/ui/button';

type ClientActionButtonProps = {
    text: string;
    action?: () => Promise<void>;
};


/**
 * Client Button component that can make a call to a server function  
 *
 * @param {ClientActionButtonProps} param0
 * @param {string} param0.text
 * @param {() => Promise<void>} param0.action
 * @returns {*}
 */
function ClientActionButton({text, action}: ClientActionButtonProps): JSX.Element {
    return (
        <Button variant={'accent'} onClick={action}>
            {text}
        </Button>
    );
}

export default ClientActionButton;