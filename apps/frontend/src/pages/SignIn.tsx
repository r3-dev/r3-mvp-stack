import { MainLayout } from "@/layouts/main-layout";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "ui-solid/components/ui/card";
import { Button } from "ui-solid/components/ui/button";
import {
  For,
  JSX,
  Match,
  Switch,
  createEffect,
  createResource,
} from "solid-js";
import { Api, authStore } from "@/App";
import { useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";

export function SignIn() {
  const navigate = useNavigate();

  // Redirect to home if user is already logged in
  createEffect(() => {
    if (authStore.isValid) {
      navigate("/");
    }
  });

  return (
    <>
      <MainLayout title="Sign In">
        <div class="container py-6 flex flex-col items-center justify-center gap-4 px-4 sm:gap-10 md:gap-16 md:px-6 lg:gap-20">
          <Card class="w-full max-w-sm bg">
            <CardHeader class="text-center">
              <CardTitle class="text-3xl">Sign In</CardTitle>
              <CardDescription>
                This app uses Discord for authentication, because nobody remembers passwords anymore.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex justify-center">
              <LoginWithDiscordButton />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </>
  );
}

async function fetchProviders() {
  const methods = await Api.collection("users").listAuthMethods();

  return methods.authProviders.map((provider) => provider.name);
}

function LoginWithDiscordButton() {
  const [providers] = createResource(fetchProviders);
  
  const auth = createMutation(() => {
    return {
      mutationKey: ["signin"],
      mutationFn: (provider: string) => {
        return Api.collection("users").authWithOAuth2({
          provider: provider,
        });
      }
    }
  })

  return (
    <div class="flex flex-col items-center gap-4">
      <Switch fallback={<div>Loading...</div>}>
        <Match when={providers.loading}>Loading...</Match>
        <Match when={providers.error}>Error: {providers.error.message}</Match>
        <Match when={providers()}>
          {(matchedProviders) => (
            <For each={matchedProviders()}>
              {(provider) => (
                <Button
                  class="w-[200px]"
                  variant="outline"
                  onClick={() => auth.mutate(provider)}
                  disabled={auth.isPending}
                >
                  <DiscIcon class="mr-2 h-4 w-4" />
                  Login with{" "}
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </Button>
              )}
            </For>
          )}
        </Match>
      </Switch>
    </div>
  );
}

function DiscIcon(
  props: JSX.IntrinsicAttributes & JSX.SvgSVGAttributes<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-Width="2"
      stroke-Linecap="round"
      stroke-Linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
