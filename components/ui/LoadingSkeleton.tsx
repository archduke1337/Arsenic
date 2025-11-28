import { Card, CardBody, Skeleton } from "@heroui/react";

export function TableSkeleton() {
    return (
        <Card className="w-full bg-zinc-900/50 border border-white/10" radius="lg">
            <CardBody className="space-y-3">
                <Skeleton className="rounded-lg">
                    <div className="h-12 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                </div>
            </CardBody>
        </Card>
    );
}

export function CardSkeleton() {
    return (
        <Card className="space-y-5 p-4 bg-zinc-900/50 border border-white/10" radius="lg">
            <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
            </div>
        </Card>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="max-w-[300px] w-full flex items-center gap-3">
            <div>
                <Skeleton className="flex rounded-full w-12 h-12" />
            </div>
            <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
        </div>
    );
}
