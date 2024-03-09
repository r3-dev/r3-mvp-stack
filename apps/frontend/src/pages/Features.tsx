import { MainLayout } from "@/layouts/main-layout";

export function Features() {
  return (
    <>
      <MainLayout>
        <div class="container py-6 flex flex-col items-center justify-center gap-4 px-4 sm:gap-10 md:gap-16 md:px-6 lg:gap-20">
          <div class="space-y-2 text-left">
            <h1 class="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Features
            </h1>
            <div class="">
              <p class="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Those are the feautres of our amazing mvp stack:
              </p>
              <ul class="list-disc list-inside text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                <li>Fast</li>
                <li>Reliable</li>
                <li>Secure</li>
                <li>Modern</li>
                <li>Scalable</li>
                <li>Open Source</li>
              </ul>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
