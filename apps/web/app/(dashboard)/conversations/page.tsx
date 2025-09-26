import Image from "next/image";

const Page = async () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2">
        <Image src="/logo.svg" alt="ai" height={40} width={40} />
        <div className="font-semibold text-xl">AI</div>
      </div>
    </div>
  );
};

export default Page;
