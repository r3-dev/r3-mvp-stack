import { MainLayout } from "@/layouts/main-layout";
import { A } from "@solidjs/router";

export function NotFound() {
  return (
    <>
      <MainLayout>
        <div class="container py-6 flex flex-col items-center justify-center gap-4 px-4 sm:gap-10 md:gap-16 md:px-6 lg:gap-20">
          <div class="space-y-2 text-center">
            <h1 class="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              404 - Page Not Found
            </h1>
            <p class="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Oops! Looks like you've hit a dead end. Let's get you back on
              track.
            </p>
          </div>
          <div class="flex gap-4">
            <A
              class="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              href="/"
            >
              Go Home
            </A>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
