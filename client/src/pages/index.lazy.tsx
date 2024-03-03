import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PocketBase, { AuthProviderInfo } from "pocketbase";
import { createLazyFileRoute } from '@tanstack/react-router';
import { TypedPocketBase } from "@/types/pocketbase-types";


export const Route = createLazyFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const pb = new PocketBase("http://localhost:3000") as TypedPocketBase

  const [authProviders, setAuthProviders] = useState<AuthProviderInfo[]>([]);

  useEffect(() => {
    const init = async () => {
      const result = await pb.collection("users").listAuthMethods();
      console.log(result);
      setAuthProviders(result.authProviders);
    };

    init();
  }, []);

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

