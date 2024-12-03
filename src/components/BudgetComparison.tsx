import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface BudgetComparisonProps {
  originalBudget: any;
  targetBudget: any;
}

export const BudgetComparison = ({
  originalBudget,
  targetBudget,
}: BudgetComparisonProps) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 border border-gray-200 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Budget Analysis</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Changes
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Changes Detected
            </h3>
            <p className="text-2xl font-semibold text-mint-600">0</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Impact
            </h3>
            <p className="text-2xl font-semibold text-gray-900">$0.00</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              AI Confidence
            </h3>
            <p className="text-2xl font-semibold text-gray-900">N/A</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-4">
            The machine learning model is currently in training. As you process more
            budgets, it will learn to recognize patterns in your adjustments.
          </div>
        </div>
      </div>
    </Card>
  );
};