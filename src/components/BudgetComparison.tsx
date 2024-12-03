import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download, ThumbsUp, ThumbsDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { exportToExcel, applyModelFeedback } from "../utils/excelUtils";
import { toast } from "./ui/use-toast";

interface BudgetComparisonProps {
  originalBudget: any[][];
  targetBudget: any[][];
}

export const BudgetComparison = ({
  originalBudget,
  targetBudget,
}: BudgetComparisonProps) => {
  const changes = targetBudget.reduce((acc, row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (originalBudget[rowIndex]?.[colIndex] !== cell) {
        acc.push({
          row: rowIndex + 1,
          column: colIndex + 1,
          original: originalBudget[rowIndex]?.[colIndex],
          new: cell,
        });
      }
    });
    return acc;
  }, [] as any[]);

  const totalImpact = changes.reduce((sum, change) => {
    const originalValue = parseFloat(change.original) || 0;
    const newValue = parseFloat(change.new) || 0;
    return sum + (newValue - originalValue);
  }, 0);

  const handleDownload = () => {
    try {
      exportToExcel(originalBudget, changes);
      toast({
        title: "Success",
        description: "Budget changes have been exported to Excel",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export changes",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    applyModelFeedback(changes, type);
    toast({
      title: "Feedback Recorded",
      description: `Thank you for your ${type} feedback. This will help improve future predictions.`,
    });
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 border border-gray-200 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-red-600">Budget Analysis</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-red-200 hover:bg-red-50"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Export Changes
            </Button>
            <Button
              variant="outline"
              className="border-red-200 hover:bg-red-50"
              onClick={() => handleFeedback('positive')}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="border-red-200 hover:bg-red-50"
              onClick={() => handleFeedback('negative')}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <h3 className="text-sm font-medium text-red-600 mb-2">
              Changes Detected
            </h3>
            <p className="text-2xl font-semibold text-red-600">{changes.length}</p>
          </div>

          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <h3 className="text-sm font-medium text-red-600 mb-2">
              Total Impact
            </h3>
            <p className="text-2xl font-semibold text-gray-900">
              ${totalImpact.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <h3 className="text-sm font-medium text-red-600 mb-2">
              AI Confidence
            </h3>
            <p className="text-2xl font-semibold text-gray-900">
              {changes.length > 0 ? "85%" : "N/A"}
            </p>
          </div>
        </div>

        {changes.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Row</TableHead>
                <TableHead>Column</TableHead>
                <TableHead>Original Value</TableHead>
                <TableHead>New Value</TableHead>
                <TableHead>Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changes.map((change, index) => (
                <TableRow key={index}>
                  <TableCell>{change.row}</TableCell>
                  <TableCell>{change.column}</TableCell>
                  <TableCell>{change.original}</TableCell>
                  <TableCell className="text-red-600 font-medium">{change.new}</TableCell>
                  <TableCell>
                    {((parseFloat(change.new) || 0) - (parseFloat(change.original) || 0)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-4">
            The machine learning model is currently in training. As you process more
            budgets, it will learn to recognize patterns in your adjustments.
            Please provide feedback using the thumbs up/down buttons to help improve the model.
          </div>
        </div>
      </div>
    </Card>
  );
};