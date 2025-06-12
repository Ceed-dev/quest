"use client";

import { useEffect, useState } from "react";
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
import { fetchAdminStats } from "@/lib/admin";

interface OverviewStats {
  totalQuests: number;
  totalTasks: number;
  totalSubmissions: number;
  totalUsers: number;
}

interface QuestStats {
  id: string;
  name: string;
  projectName: string;
  taskCount: number;
  submissionCount: number;
  uniqueSubmitters: number;
  lastSubmissionDate: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(
    null,
  );
  const [questStats, setQuestStats] = useState<QuestStats[]>([]);

  // Manually fetch data from Firestore
  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const { overview, quests } = await fetchAdminStats();
      setOverviewStats(overview);
      setQuestStats(quests);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on page load
  useEffect(() => {
    handleRefreshData();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of Web3 Quest System statistics
        </p>
      </div>

      {/* Manual Refresh Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleRefreshData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      {overviewStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {overviewStats.totalQuests}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All registered quests
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {overviewStats.totalTasks}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sum of all tasks
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {overviewStats.totalSubmissions}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total task submissions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {overviewStats.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All registered users
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quest Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quest-Level Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quest Name</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead className="text-center">Task Count</TableHead>
                  <TableHead className="text-center">
                    Submission Count
                  </TableHead>
                  <TableHead className="text-center">
                    Unique Submitters
                  </TableHead>
                  <TableHead className="text-center">Last Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questStats.map((quest) => (
                  <TableRow key={quest.id}>
                    <TableCell className="font-medium">{quest.name}</TableCell>
                    <TableCell className="font-medium">{quest.projectName}</TableCell>
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
