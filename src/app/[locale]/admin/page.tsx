"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

interface OverviewStats {
  totalQuests: number;
  totalTasks: number;
  totalSubmissions: number;
  totalUsers: number;
}

interface QuestStats {
  id: string;
  name: string;
  taskCount: number;
  submissionCount: number;
  uniqueSubmitters: number;
  lastSubmissionDate: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  // サンプルデータ（実際のFirestoreデータに置き換える）
  const [overviewStats] = useState<OverviewStats>({
    totalQuests: 12,
    totalTasks: 48,
    totalSubmissions: 324,
    totalUsers: 156,
  });

  const [questStats] = useState<QuestStats[]>([
    {
      id: "1",
      name: "DeFi基礎学習クエスト",
      taskCount: 5,
      submissionCount: 89,
      uniqueSubmitters: 67,
      lastSubmissionDate: "2024-01-15",
    },
    {
      id: "2",
      name: "NFT作成チャレンジ",
      taskCount: 3,
      submissionCount: 45,
      uniqueSubmitters: 32,
      lastSubmissionDate: "2024-01-14",
    },
    {
      id: "3",
      name: "スマートコントラクト入門",
      taskCount: 7,
      submissionCount: 123,
      uniqueSubmitters: 78,
      lastSubmissionDate: "2024-01-16",
    },
    {
      id: "4",
      name: "Web3ウォレット連携",
      taskCount: 4,
      submissionCount: 67,
      uniqueSubmitters: 45,
      lastSubmissionDate: "2024-01-13",
    },
  ]);

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      // TODO: Firestoreからデータを取得する処理を実装
      // 例：
      // const stats = await fetchOverviewStats()
      // const quests = await fetchQuestStats()
      // setOverviewStats(stats)
      // setQuestStats(quests)

      // 現在はサンプルデータの更新をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("データを更新しました");
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* ページタイトル */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          管理者ダッシュボード
        </h1>
        <p className="text-muted-foreground mt-2">
          Web3クエストシステムの統計情報
        </p>
      </div>

      {/* 手動更新ボタン */}
      <div className="flex justify-center">
        <Button
          onClick={handleRefreshData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          最新データを取得
        </Button>
      </div>

      {/* 概要カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">クエスト数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {overviewStats.totalQuests}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                全体のクエスト数
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">タスク数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {overviewStats.totalTasks}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                全クエストのタスク合計
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">提出数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {overviewStats.totalSubmissions}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                taskSubmissions 全件数
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ユーザー数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {overviewStats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                users コレクション数
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* クエストごとの統計テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>クエストごとの統計</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>クエスト名</TableHead>
                  <TableHead className="text-center">タスク数</TableHead>
                  <TableHead className="text-center">提出数</TableHead>
                  <TableHead className="text-center">
                    ユニーク提出ユーザー数
                  </TableHead>
                  <TableHead className="text-center">最終提出日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questStats.map((quest) => (
                  <TableRow key={quest.id}>
                    <TableCell className="font-medium">{quest.name}</TableCell>
                    <TableCell className="text-center">
                      {quest.taskCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {quest.submissionCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {quest.uniqueSubmitters}
                    </TableCell>
                    <TableCell className="text-center">
                      {quest.lastSubmissionDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
