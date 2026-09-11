import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const NAIRA_PER_USDT = 1580;
export const TBAY_POINTS_PER_USDT = 100;

export interface Txn {
  id: string;
  source: "Cardgoal" | "Tbay";
  kind: "naira_swap" | "points_swap";
  summary: string;
  nairaAmount: number | null;
  pointsAmount: number | null;
  usdtAmount: number;
  rate: number;
  status: "success" | "pending";
  date: string; // ISO
}

interface Balances {
  cardgoalNaira: number;
  tbayPoints: number;
  usdt: number;
}

interface CobitState extends Balances {
  authed: boolean;
  userName: string;
  transactions: Txn[];
  loginWithCardgoal: () => void;
  logout: () => void;
  swapCardgoalNaira: (naira: number) => Txn;
  swapTbayPoints: (points: number) => Txn;
  getTxn: (id: string) => Txn | undefined;
}

const seedTransactions: Txn[] = [
  {
    id: "CG-20241120-8841",
    source: "Cardgoal",
    kind: "naira_swap",
    summary: "Cardgoal Naira swapped successfully",
    nairaAmount: 50000,
    pointsAmount: null,
    usdtAmount: 31.65,
    rate: 1580,
    status: "success",
    date: "2024-11-20T14:32:00.000Z",
  },
  {
    id: "TB-20241118-2210",
    source: "Tbay",
    kind: "points_swap",
    summary: "Tbay points swapped successfully",
    nairaAmount: null,
    pointsAmount: 2500,
    usdtAmount: 25,
    rate: 100,
    status: "success",
    date: "2024-11-18T09:05:00.000Z",
  },
  {
    id: "CG-20241112-5307",
    source: "Cardgoal",
    kind: "naira_swap",
    summary: "Cardgoal Naira swapped successfully",
    nairaAmount: 125000,
    pointsAmount: null,
    usdtAmount: 79.11,
    rate: 1580,
    status: "success",
    date: "2024-11-12T17:48:00.000Z",
  },
];

const defaults: Balances = {
  cardgoalNaira: 245600,
  tbayPoints: 8340,
  usdt: 412.86,
};

const STORAGE_KEY = "cobit-demo-state-v1";

interface Persisted {
  authed: boolean;
  balances: Balances;
  transactions: Txn[];
}

const CobitContext = createContext<CobitState | null>(null);

export function CobitProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [balances, setBalances] = useState<Balances>(defaults);
  const [transactions, setTransactions] = useState<Txn[]>(seedTransactions);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Persisted;
      setAuthed(parsed.authed);
      setBalances(parsed.balances);
      setTransactions(parsed.transactions);
    } catch {
      // ignore corrupt demo state
    }
  }, []);

  const persist = useCallback(
    (next: Persisted) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable in demo
      }
    },
    [],
  );

  const loginWithCardgoal = useCallback(() => {
    setAuthed(true);
    persist({ authed: true, balances, transactions });
  }, [balances, transactions, persist]);

  const logout = useCallback(() => {
    setAuthed(false);
    persist({ authed: false, balances, transactions });
  }, [balances, transactions, persist]);

  const recordSwap = useCallback(
    (txn: Txn, nextBalances: Balances) => {
      const nextTxns = [txn, ...transactions];
      setBalances(nextBalances);
      setTransactions(nextTxns);
      persist({ authed: true, balances: nextBalances, transactions: nextTxns });
      return txn;
    },
    [transactions, persist],
  );

  const swapCardgoalNaira = useCallback(
    (naira: number) => {
      const usdtAmount = Math.round((naira / NAIRA_PER_USDT) * 100) / 100;
      const txn: Txn = {
        id: `CG-${Date.now().toString(36).toUpperCase()}`,
        source: "Cardgoal",
        kind: "naira_swap",
        summary: "Cardgoal Naira swapped successfully",
        nairaAmount: naira,
        pointsAmount: null,
        usdtAmount,
        rate: NAIRA_PER_USDT,
        status: "success",
        date: new Date().toISOString(),
      };
      return recordSwap(txn, {
        ...balances,
        cardgoalNaira: balances.cardgoalNaira - naira,
        usdt: Math.round((balances.usdt + usdtAmount) * 100) / 100,
      });
    },
    [balances, recordSwap],
  );

  const swapTbayPoints = useCallback(
    (points: number) => {
      const usdtAmount = Math.round((points / TBAY_POINTS_PER_USDT) * 100) / 100;
      const txn: Txn = {
        id: `TB-${Date.now().toString(36).toUpperCase()}`,
        source: "Tbay",
        kind: "points_swap",
        summary: "Tbay points swapped successfully",
        nairaAmount: null,
        pointsAmount: points,
        usdtAmount,
        rate: TBAY_POINTS_PER_USDT,
        status: "success",
        date: new Date().toISOString(),
      };
      return recordSwap(txn, {
        ...balances,
        tbayPoints: balances.tbayPoints - points,
        usdt: Math.round((balances.usdt + usdtAmount) * 100) / 100,
      });
    },
    [balances, recordSwap],
  );

  const getTxn = useCallback(
    (id: string) => transactions.find((t) => t.id === id),
    [transactions],
  );

  const value = useMemo<CobitState>(
    () => ({
      authed,
      userName: "Amara O.",
      ...balances,
      transactions,
      loginWithCardgoal,
      logout,
      swapCardgoalNaira,
      swapTbayPoints,
      getTxn,
    }),
    [
      authed,
      balances,
      transactions,
      loginWithCardgoal,
      logout,
      swapCardgoalNaira,
      swapTbayPoints,
      getTxn,
    ],
  );

  return <CobitContext.Provider value={value}>{children}</CobitContext.Provider>;
}

export function useCobit() {
  const ctx = useContext(CobitContext);
  if (!ctx) throw new Error("useCobit must be used inside CobitProvider");
  return ctx;
}

export function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatUsdt(n: number) {
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
