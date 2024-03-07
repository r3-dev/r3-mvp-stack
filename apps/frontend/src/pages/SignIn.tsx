import { MainLayout } from "@/layouts/main-layout";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JSX, createEffect } from "solid-js";
import { Api, authStore } from "@/App";
import { useNavigate } from "@solidjs/router";

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
      <MainLayout>
        <div class="container py-6 flex flex-col items-center justify-center gap-4 px-4 sm:gap-10 md:gap-16 md:px-6 lg:gap-20">
          <Card class="w-full max-w-sm">
            <CardHeader class="text-center">
              <CardTitle class="text-3xl">Sign In</CardTitle>
              <CardDescription>
                This app uses Discord for authentication.
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

function LoginWithDiscordButton() {
  async function handleLogin() {
    await Api.collection("users").authWithOAuth2({
      provider: "discord",
    });
  }

  return (
    <Button class="w-[200px]" variant="outline" onClick={handleLogin}>
      <DiscIcon class="mr-2 h-4 w-4" />
      Login with Discord
    </Button>
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
