import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseLocalStorage } from "./use-local-storage";

interface ISearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

export function useSearchHistory() {
  const [history, setHistory] = UseLocalStorage<ISearchHistoryItem[]>(
    "search-history",
    []
  );

  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: () => history,
    initialData: history,
  });
  const addToHistory = useMutation({
    mutationFn: async (
      search: Omit<ISearchHistoryItem, "id" | "searchedAt">
    ) => {
      const newSearch: ISearchHistoryItem = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now}`,
        searchedAt: Date.now(),
      };
      const filteredHistory = history.filter(
        (item) => !(item.lat === search.lat && item.lon === search.lon)
      );
      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);
      setHistory(newHistory);
      return newHistory;
    },
    onSuccess: (newHistory) => {
      queryClient.setQueryData(["search-history"], newHistory);
    },
  });
  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], []);
    },
  });

  return { history: historyQuery.data ?? [], addToHistory, clearHistory };
}
