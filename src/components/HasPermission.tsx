import {AwaitedReactNode} from "react";
import {AccessDenied} from "@/components/AccessDenied";

export type HasPermissionProps = {
    permission: boolean;
    renderFallback: boolean;
    fallbackMessage?: string;
    children: AwaitedReactNode;
}

export default function HasPermission({permission, renderFallback, fallbackMessage, children}: HasPermissionProps) {
    if (permission) {
        return <>{children}</>
    }

    if (renderFallback && fallbackMessage) {
        return (
            <AccessDenied fallbackMessage={fallbackMessage}/>
        )
    }


    return null

}
