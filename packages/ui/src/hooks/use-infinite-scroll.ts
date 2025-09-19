import { useCallback, useEffect, useRef } from "react";

interface infiniteScrollProps {
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  loadSize: number;
  observerEnable?: boolean;
}

export const useInfiniteScroll = ({
  loadMore,
  loadSize,
  status,
  observerEnable,
}: infiniteScrollProps) => {
  const topElementRef = useRef<HTMLDivElement>(null);
  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(loadSize);
    }
  }, [status, loadMore, loadSize]);

  useEffect(() => {
    const topElement = topElementRef.current;
    if (!(topElement && observerEnable)) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(topElement);
    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, observerEnable]);

  return {
    topElementRef,
    handleLoadMore,
    canLoadMore: status === "CanLoadMore",
    isLoadingMore: status === "LoadingMore",
    isLoadingFirstPage: status === "LoadingFirstPage",
    isExhausted: status === "Exhausted",
  };
};
