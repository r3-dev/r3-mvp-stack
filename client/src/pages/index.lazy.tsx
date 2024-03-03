import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthProviderInfo } from "pocketbase";
import { createLazyFileRoute } from "@tanstack/react-router";
import { usePocketbase } from "@/hooks/pocketbase-hook";
import { useApi } from "@/hooks/api-hook";

export const Route = createLazyFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const pb = usePocketbase();
  const api = useApi();

  const [authProviders, setAuthProviders] = useState<AuthProviderInfo[]>([]);

  const { data: post, isSuccess: postSucces } = api.users.find("");

  useEffect(() => {
    if (!post) {
      return;
    }

    const userMutation = api.users.delete(post.id, {
      onSuccess: () => {
        console.log("User deleted");
      },
      onError: (error) => {
        console.error("Error deleting user", error);
      },
    });
  }, [post, api.users]);

  useEffect(() => {
    async function listAuthMethods() {
      try {
        const result = await pb.collection("users").listAuthMethods();
        setAuthProviders(result.authProviders);
      } catch (error) {
        console.error("Error listing auth methods", error);
      }
    }

    listAuthMethods();

    return () => {
      pb.cancelAllRequests();
    };
  }, [pb, setAuthProviders]);

  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-5xl">Vite + React</h1>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <h2>Auth Providers</h2>
        <ul>
          {authProviders.map((provider) => (
            <li key={provider.name}>
              <a href={provider.authUrl}>
                <Button>Login with {provider.name}</Button>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
