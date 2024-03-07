import { A } from "@solidjs/router";

export function NavBar() {
  return (
    <nav class="flex gap-4">
      <A
        class="font-medium text-gray-900 transition-colors hover:text-gray-900/90 dark:text-gray-50 dark:hover:text-gray-50/90"
        href="/"
        activeClass="underline"
        end
      >
        Home
      </A>
      <A
        class="font-medium text-gray-900 transition-colors hover:text-gray-900/90 dark:text-gray-50 dark:hover:text-gray-50/90"
        activeClass="underline"
        href="/features"
        end
      >
        Features
      </A>
      <A
        class="font-medium text-gray-900 transition-colors hover:text-gray-900/90 dark:text-gray-50 dark:hover:text-gray-50/90"
        activeClass="underline"
        href="/pricing"
        end
      >
        404
      </A>
    </nav>
  );
}
