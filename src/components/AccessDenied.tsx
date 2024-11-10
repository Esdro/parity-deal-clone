"use client";
import React from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";


export type AccessNotPermittedProps = {
    fallbackMessage: string;
}

export  function AccessDenied({fallbackMessage}: AccessNotPermittedProps) {
    return (
        <Card  className='my-4 bg-destructive text-destructive-foreground '>
            <CardHeader>
            <CardTitle className='font-bold'>Permission denied </CardTitle>
            </CardHeader>
            <CardContent>
                {fallbackMessage}
            </CardContent>
            <CardFooter>
                <Button asChild>
                    <Link href={'/dashboard/subscriptions'}>Upgrade Account</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}