import { cn } from "@workspace/ui/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}
export const WidgetChildrenScreen = ({ children, className }: Props) => {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="px-6 py-10">
          <h2 className="text-3xl font-bold text-white">Hello there 👋</h2>
          <p className="text-white">What is in your mind 😃😃😃</p>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-y-4 p-4 w-full",
          className
        )}
      >
        {children}
      </div>
    </>
  );
};
