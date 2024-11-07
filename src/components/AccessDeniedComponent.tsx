"use client";
import React from 'react';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";


export type AccessNotPermittedProps = {
    accessName: string;
}

export function AccessNotPermitted({accessName}: AccessNotPermittedProps) {
    return (
        <Alert variant='destructive' className='my-4 box-border '>
            <AlertTitle className='font-bold'>Access not provided for {accessName} </AlertTitle>
            <AlertDescription>You do not have permissions to do this action.</AlertDescription>
        </Alert>
    )
}