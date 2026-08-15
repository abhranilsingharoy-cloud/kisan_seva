import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Create your KisanSeva Account</h2>
      </div>
      <SignUp />
    </div>
  );
}
