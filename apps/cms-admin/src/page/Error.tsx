import { Link, useRouteError, isRouteErrorResponse } from 'react-router';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Button } from '@cms/ui/components/button';
import { AlertCircle } from 'lucide-react';

function ErrorPage() {
  const error = useRouteError();

  let title = 'Oops!';
  let description = 'An unexpected error occurred. Please try again later.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    description = error.data?.message || error.data || description;
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <main className="mx-auto w-[400px] my-32 flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader className="flex flex-col items-center gap-4">
            <div className="border-muted-foreground/70 mt-2 grid size-24 place-items-center rounded-full border border-dashed">
              <AlertCircle className="text-muted-foreground/70 size-10" aria-hidden="true" />
            </div>
            <CardTitle className="font-bold">{title}</CardTitle>
            <CardDescription className="text-md font-extrabold">{description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/">← Go back home</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default ErrorPage;
