import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { LiveTVApp } from "./components/LiveTVApp";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Authenticated>
        <LiveTVApp />
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <header className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm h-16 flex justify-between items-center border-b border-white/10 px-4">
            <h2 className="text-xl font-bold text-white">Live TV Streaming</h2>
          </header>
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  مرحباً بك في منصة البث المباشر
                </h1>
                <p className="text-xl text-gray-300">
                  سجل دخولك للوصول إلى آلاف القنوات
                </p>
              </div>
              <SignInForm />
            </div>
          </main>
        </div>
      </Unauthenticated>
      
      <Toaster />
    </div>
  );
}
