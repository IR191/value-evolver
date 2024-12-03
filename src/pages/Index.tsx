import { useState } from "react";
import { FileUpload } from "../components/FileUpload";
import { BudgetComparison } from "../components/BudgetComparison";
import { toast } from "../components/ui/use-toast";
import { Card } from "../components/ui/card";

const Index = () => {
  const [originalBudget, setOriginalBudget] = useState<any>(null);
  const [targetBudget, setTargetBudget] = useState<any>(null);

  const handleFileUpload = (type: "original" | "target", file: File) => {
    // In a real app, we would process the Excel file here
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Simulate file processing for demo
        const data = {
          fileName: file.name,
          timestamp: new Date().toISOString(),
          // In reality, we would parse the Excel file here
          data: []
        };
        
        if (type === "original") {
          setOriginalBudget(data);
          toast({
            title: "Original budget uploaded",
            description: "Successfully processed original budget file.",
          });
        } else {
          setTargetBudget(data);
          toast({
            title: "Target budget uploaded",
            description: "Successfully processed target budget file.",
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
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-mint-100 text-mint-800 text-sm font-medium">
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
            <h2 className="text-xl font-semibold mb-4">Original Budget</h2>
            <FileUpload
              onFileSelect={(file) => handleFileUpload("original", file)}
              accept=".xlsx,.xls"
              fileType="original budget"
            />
            {originalBudget && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Uploaded: {originalBudget.fileName}
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/80 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Target Budget</h2>
            <FileUpload
              onFileSelect={(file) => handleFileUpload("target", file)}
              accept=".xlsx,.xls"
              fileType="target budget"
            />
            {targetBudget && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Uploaded: {targetBudget.fileName}
                </p>
              </div>
            )}
          </Card>
        </div>

        {originalBudget && targetBudget && (
          <BudgetComparison
            originalBudget={originalBudget}
            targetBudget={targetBudget}
          />
        )}
      </div>
    </div>
  );
};

export default Index;