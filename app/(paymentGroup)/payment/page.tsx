import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-border/60 text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Payment Successful
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Your payment has been submitted successfully.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your booking will be confirmed after the payment is verified.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center pb-8 pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/tenant-dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
