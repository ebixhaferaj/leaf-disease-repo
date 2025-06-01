import Header from "./Header";
import Footer from "./Footer";
import { Leaf, Database } from "lucide-react";

const ClassesDatabase = () => {
  const diseaseClasses = [
    { id: 1, name: "Corn Gray Leaf Spot", type: "Fungal", severity: "Moderate" },
    { id: 2, name: "Corn Northern Leaf Blight", type: "Fungal", severity: "High" },
    { id: 3, name: "Corn Healthy", type: "Normal", severity: "None" },
    { id: 4, name: "Grape Downy Mildew", type: "Fungal", severity: "Moderate" },
    { id: 5, name: "Grape Powdery Mildew", type: "Fungal", severity: "Low" },
    { id: 6, name: "Grape Healthy", type: "Normal", severity: "None" },
    { id: 7, name: "Olive Peacock Spot", type: "Fungal", severity: "Moderate" },
    { id: 8, name: "Olive Rust Mite", type: "Fungal", severity: "High" },
    { id: 9, name: "Olive Healthy", type: "Normal", severity: "None" },
    { id: 10, name: "Potato Early Blight", type: "Fungal", severity: "High" },
    { id: 11, name: "Potato Late Blight", type: "Fungal", severity: "High" },
    { id: 12, name: "Potato Healthy", type: "Normal", severity: "None" },
    { id: 13, name: "Tomato Early Blight", type: "Fungal", severity: "Moderate" },
    { id: 14, name: "Tomato Late Blight", type: "Fungal", severity: "High" },
    { id: 15, name: "Tomato Healthy", type: "Normal", severity: "None" },
    { id: 16, name: "Wheat Septoria", type: "Fungal", severity: "Moderate" },
    { id: 17, name: "Wheat Yellow Rust", type: "Fungal", severity: "High" },
    { id: 18, name: "Wheat Healthy", type: "Normal", severity: "None" },
    { id: 19, name: "Background (No Leaves)", type: "Background", severity: "None" }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      case "None": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Fungal": return "bg-purple-100 text-purple-800";
      case "Bacterial": return "bg-orange-100 text-orange-800";
      case "Normal": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Database className="h-12 w-12 text-green-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Disease Classes Database
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Explore all 19 plant disease classes that our AI model can detect and classify
            </p>
            <span className="inline-block bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded">
              {diseaseClasses.length} Total Classes
            </span>
          </div>
        </section>

        {/* Table Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Plant Disease Classification Database
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disease Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {diseaseClasses.map((disease) => (
                      <tr key={disease.id}>
                        <td className="px-6 py-4 font-medium text-gray-900">{disease.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{disease.name}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium px-2.5 py-1 rounded ${getTypeColor(disease.type)}`}>
                            {disease.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium px-2.5 py-1 rounded ${getSeverityColor(disease.severity)}`}>
                            {disease.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClassesDatabase;
