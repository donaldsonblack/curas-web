import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function DashboardTestCard() {
    return (
        <div className="h-full">
            <Card className="h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <CardTitle>
                        HEADER
                    </CardTitle>
                    <CardDescription>
                        DESCRIPTION
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    CONTENT
                </CardContent>
            </Card>
        </div>
    );
}