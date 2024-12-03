import { useState } from "react";
import { FileUpload } from "../components/FileUpload";
import { BudgetComparison } from "../components/BudgetComparison";
import { toast } from "../components/ui/use-toast";
import { Card } from "../components/ui/card";

const Index = () => {
  const [originalBudget, setOriginalBudget] = useState<any>(null);
  const [targetBudget, setTargetBudget] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any[][]>([]);
  const [targetData, setTargetData] = useState<any[][]>([]);

  const handleFileUpload = (type: "original" | "target", file: File, data: any[][]) => {
    try {
      if (type === "original") {
        setOriginalBudget(file);
        setOriginalData(data);
        toast({
          title: "Original budget uploaded",
          description: `Successfully processed ${data.length} rows of data.`,
        });
      } else {
        setTargetBudget(file);
        setTargetData(data);
        toast({
          title: "Target budget uploaded",
          description: `Successfully processed ${data.length} rows of data.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please ensure you're uploading a valid Excel file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
            Budget Analysis Tool
          </div>
          <h1 className="text-4xl font-semibold text-gray-900">
            Smart Budget Comparison
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your hospital budget files and let our AI analyze the changes,
            learning from your adjustment patterns over time.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 backdrop-blur-sm bg-white/80 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Original Budget</h2>
            <FileUpload
              onFileSelect={(file, data) => handleFileUpload("original", file, data)}
              accept=".xlsx,.xls"
              fileType="original budget"
            />
            {originalBudget && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Uploaded: {originalBudget.name}
                </p>
                <p className="text-sm text-gray-600">
                  Rows: {originalData.length}
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/80 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Target Budget</h2>
            <FileUpload
              onFileSelect={(file, data) => handleFileUpload("target", file, data)}
              accept=".xlsx,.xls"
              fileType="target budget"
            />
            {targetBudget && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Uploaded: {targetBudget.name}
                </p>
                <p className="text-sm text-gray-600">
                  Rows: {targetData.length}
                </p>
              </div>
            )}
          </Card>
        </div>

        {originalData.length > 0 && targetData.length > 0 && (
          <BudgetComparison
            originalBudget={originalData}
            targetBudget={targetData}
          />
        )}
      </div>
    </div>
  );
};

export default Index;