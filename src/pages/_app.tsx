import { Header } from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";

import "../globals.css";
import { OnboardNewUserModal } from "@/components/OnboardNewUserModal";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <ClerkProvider>
        <Header />
        <OnboardNewUserModal />
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
}
