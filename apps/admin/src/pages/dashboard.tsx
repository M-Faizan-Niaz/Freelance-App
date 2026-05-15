import { ChevronRight, Download, Filter, Plus, Zap } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DISTRIBUTION = [
  { initials: "BN", name: "Binance Global", sub: "Digital Exchange", amount: "$38,120.45", bg: "bg-amber-100", text: "text-amber-700" },
  { initials: "PX", name: "Pakistan Stock Exchange", sub: "Equities Portfolio", amount: "$124,000.00", bg: "bg-green-100", text: "text-green-700" },
  { initials: "WS", name: "Wise Personal", sub: "Foreign Remittance", amount: "$12,450.00", bg: "bg-blue-100", text: "text-blue-700" },
  { initials: "PY", name: "Payoneer Business", sub: "Freelance Earnings", amount: "$4,520.00", bg: "bg-red-100", text: "text-red-700" },
];

const ASSETS = [
  { label: "TradFi Assets", amount: "$168,200", pct: 69, indicatorClassName: "bg-foreground" },
  { label: "Digital Assets", amount: "$42,890", pct: 18, indicatorClassName: "bg-blue-900" },
  { label: "Liquid Cash", amount: "$31,500", pct: 13, indicatorClassName: "bg-green-600" },
];

const WALLETS = [
  { initial: "S", name: "SADAPAY", amount: "Rs. 42,000", bg: "bg-teal-100", text: "text-teal-700" },
  { initial: "N", name: "NAYAPAY", amount: "Rs. 18,500", bg: "bg-blue-100", text: "text-blue-700" },
];

const TRANSACTIONS = [
  {
    desc: "Web App Milestone 2",
    category: "FREELANCE",
    catBg: "bg-green-100",
    catText: "text-green-700",
    platformInitials: "FV",
    platformBg: "bg-green-100",
    platformText: "text-green-700",
    amount: "+$1,850.00",
    amountColor: "text-green-600",
    date: "Today, 2:14 PM",
  },
  {
    desc: "USDT → Spot Wallet",
    category: "CRYPTO",
    catBg: "bg-orange-100",
    catText: "text-orange-700",
    platformInitials: "BN",
    platformBg: "bg-amber-100",
    platformText: "text-amber-700",
    amount: "−$420.00",
    amountColor: "text-red-500",
    date: "Yesterday",
  },
  {
    desc: "Dividend Payout - MCB",
    category: "EQUITY",
    catBg: "bg-blue-100",
    catText: "text-blue-700",
    platformInitials: "PX",
    platformBg: "bg-green-100",
    platformText: "text-green-700",
    amount: "+Rs. 12,400",
    amountColor: "text-green-600",
    date: "Sep 12, 2023",
  },
  {
    desc: "Subscription: Bloomberg",
    category: "INFO",
    catBg: "bg-gray-100",
    catText: "text-gray-600",
    platformInitials: "WS",
    platformBg: "bg-blue-100",
    platformText: "text-blue-700",
    amount: "−$29.99",
    amountColor: "text-red-500",
    date: "Sep 10, 2023",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
            Portfolio Overview
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Global Ledger</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Report
          </Button>
          <Button size="sm">
            <Plus className="size-4" />
            Add New Wallet
          </Button>
        </div>
      </div>

      {/* ── Top Row — 65 / 35 ── */}
      <div className="grid grid-cols-[65fr_35fr] gap-4">
        {/* Consolidated Net Worth */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                Consolidated Net Worth
              </p>
              <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
                <Zap className="size-3 text-green-600" />
                <span className="font-medium text-green-600">Market Pulse</span>
                <span>· Live Syncing</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-3">
                <span className="text-4xl font-bold tracking-tight">$242,590</span>
                <span className="text-2xl font-normal text-muted-foreground">.00</span>
              </div>
              <Badge className="border-0 bg-green-100 text-green-700 hover:bg-green-100">
                ↑ +14.2% vs last month
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {ASSETS.map((asset) => (
                <div key={asset.label} className="space-y-2">
                  <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                    {asset.label}
                  </p>
                  <p className="text-sm font-bold">{asset.amount}</p>
                  <Progress
                    value={asset.pct}
                    className="h-1.5"
                    indicatorClassName={asset.indicatorClassName}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strategic Distribution */}
        <Card>
          <CardHeader>
            <p className="font-semibold">Strategic Distribution</p>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="divide-y">
              {DISTRIBUTION.map((platform) => (
                <div key={platform.initials} className="flex items-center gap-3 py-3">
                  <Avatar className="size-9 rounded-md">
                    <AvatarFallback className={`rounded-md text-xs font-bold ${platform.bg} ${platform.text}`}>
                      {platform.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">{platform.sub}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold tabular-nums">{platform.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom Row — 50 / 50 ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Scattered Wallets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Scattered Wallets</p>
              <Badge variant="secondary" className="text-[10px] tracking-widest">
                3 NODES
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {WALLETS.map((wallet) => (
              <div
                key={wallet.name}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <Avatar className="size-9 rounded-md">
                  <AvatarFallback className={`rounded-md text-sm font-bold ${wallet.bg} ${wallet.text}`}>
                    {wallet.initial}
                  </AvatarFallback>
                </Avatar>
                <p className="flex-1 text-sm font-semibold">{wallet.name}</p>
                <p className="text-sm font-bold tabular-nums">{wallet.amount}</p>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ))}
            <div className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
              <Plus className="size-4" />
              Link Other Wallet
            </div>
          </CardContent>
        </Card>

        {/* Recent Intelligence */}
        <Card className="overflow-visible">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">Recent Intelligence</p>
              <div className="flex shrink-0 items-center gap-2">
                <Tabs defaultValue="all">
                  <TabsList className="h-7">
                    <TabsTrigger value="all" className="h-5 px-2 text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="incoming" className="h-5 px-2 text-xs">
                      Incoming
                    </TabsTrigger>
                    <TabsTrigger value="outgoing" className="h-5 px-2 text-xs">
                      Outgoing
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="ghost" size="icon" className="size-7">
                  <Filter className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow className="border-t">
                  <TableHead className="text-[10px] tracking-widest uppercase">Description</TableHead>
                  <TableHead className="text-[10px] tracking-widest uppercase">Category</TableHead>
                  <TableHead className="text-[10px] tracking-widest uppercase">Platform</TableHead>
                  <TableHead className="text-right text-[10px] tracking-widest uppercase">Amount</TableHead>
                  <TableHead className="text-right text-[10px] tracking-widest uppercase">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.desc}>
                    <TableCell className="font-medium">{tx.desc}</TableCell>
                    <TableCell>
                      <Badge
                        className={`border-0 px-1.5 py-0 text-[10px] ${tx.catBg} ${tx.catText}`}
                      >
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Avatar className="size-6 rounded-sm">
                        <AvatarFallback
                          className={`rounded-sm text-[9px] font-bold ${tx.platformBg} ${tx.platformText}`}
                        >
                          {tx.platformInitials}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className={`text-right font-medium tabular-nums ${tx.amountColor}`}>
                      {tx.amount}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {tx.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
