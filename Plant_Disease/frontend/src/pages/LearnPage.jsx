import React, { useState } from 'react';
import { 
  BookOpen, Play, Download, ExternalLink, AlertTriangle, Leaf, Camera, Calendar, Shield, Loader2 
} from 'lucide-react';
import useLearnData from '../hooks/useLearnData';
import Card from '../components/Card';

const LearnPage = () => {
  const [activeTab, setActiveTab] = useState("intro");
  const { diseaseProfiles, seasonalTips, treatmentData, cropDiseaseInfo, loading, error } = useLearnData();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading learning content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading content. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
      </div>

      <div className="bg-gradient-to-r from-leaf-700 to-leaf-700/80 text-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">Learning Center</h2>
        <p className="text-white/90">
          Learn to identify, prevent, and treat plant diseases for healthier crops and better yields
        </p>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="grid grid-cols-4 gap-1 mb-4">
          {["intro", "profiles", "treatments", "imaging"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs py-2 rounded-md transition 
                ${activeTab === tab ? 'bg-leaf-700 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              {tab === "intro" && "Introduction"}
              {tab === "profiles" && "Disease Profiles"}
              {tab === "treatments" && "Treatments"}
              {tab === "imaging" && "Image Tips"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "intro" && (
          <section className="space-y-6">
            <div className="border rounded-lg shadow p-4">
              <header className="flex items-center gap-2 mb-4 font-bold text-lg">
                <BookOpen className="w-5 h-5 text-leaf-700" />
                Introduction
              </header>
              <div>
                <div>
                <Card>
                  <h4 className="font-semibold mb-2">  
                Our plant disease classification system is built on a MobileNetV2 model, pretrained on ImageNet 
                and fine-tuned on a custom dataset of 19 plant classes. The selected crops, such as corn, 
                grape, olive, potato, tomato, and wheat, represent some of the most widely cultivated plants in the 
                territory of Albania. The disease classes focus on the most common leaf diseases found across Europe. 
                Our goal is to assist users, particularly farmers, in early detection of plant diseases through image 
                classification. This page provides detailed information about each disease class, including descriptions, 
                sample images, and recommended treatments.
                </h4>
                </Card>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">

                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800">Importance of Early Detection</h4>
                </div>
                <p className="text-sm text-amber-700">
                  Early detection can prevent 70-90% of crop losses. Most diseases are easier and cheaper to treat 
                  when caught in their initial stages. Regular monitoring and quick action are your best defenses.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "profiles" && (
          <section>
            <div className="border rounded-lg shadow p-4">
              <header className="flex items-center gap-2 mb-4 font-bold text-lg">
                <Leaf className="w-5 h-5 text-leaf-700" />
                Disease Profiles
              </header>
              <div className="space-y-2">
                {(diseaseProfiles || []).map((disease, index) => (
                  <details key={index} className="border border-gray-300 rounded mb-2">
                    <summary className="cursor-pointer px-4 py-2 font-medium bg-gray-100">
                      {disease.name}
                    </summary>
                    <div className="px-4 py-3 grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <h4 className="font-medium mb-1">Symptoms</h4>
                        <p className="mb-3">{disease.symptoms}</p>

                        <h4 className="font-medium mb-1">Causes & Transmission</h4>
                        <p>{disease.causes}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Treatment Options</h4>
                        <p className="mb-3">{disease.treatment}</p>

                        <h4 className="font-medium mb-1">Yield Impact</h4>
                        <p className="text-red-600 font-medium">{disease.impact}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

{activeTab === "treatments" && (
  <section className="grid md:grid-cols-2 gap-6">
    {/* Chemical Treatments */}
    <div className="border rounded-lg shadow p-4">
      <header className="flex items-center gap-2 mb-4 font-bold text-lg">
        <Shield className="w-5 h-5 text-leaf-700" />
        Chemical Treatments
      </header>
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-medium mb-2">Fungicides</h4>
          <ul className="space-y-1 list-disc list-inside">
            {(treatmentData?.fungicides || []).map((f, i) => (
              <li key={i}>
                <strong>{f.name}:</strong> {f.description}
                {f.used_for && f.used_for.length > 0 && (
                  <div className="text-xs text-gray-600 mt-1">
                    <em>Used for:</em> {f.used_for.join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <h5 className="font-medium text-red-800 mb-1">Safety Guidelines</h5>
          <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
            {(treatmentData?.safety_guidelines || []).map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Organic & Alternative Methods */}
    <div className="border rounded-lg shadow p-4">
      <header className="flex items-center gap-2 mb-4 font-bold text-lg text-leaf-600">
        <Leaf className="w-5 h-5" />
        Organic & Alternative Methods
      </header>
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-medium mb-2">Organic Treatments</h4>
          <ul className="space-y-1 list-disc list-inside">
            {(treatmentData?.organic_treatments || []).map((ot, i) => (
              <li key={i}>
                <strong>{ot.method}:</strong> {ot.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
)}
        {activeTab === "imaging" && (
          <section>
            <div className="border rounded-lg shadow p-4">
              <header className="flex items-center gap-2 mb-4 font-bold text-lg">
                <Camera className="w-5 h-5 text-leaf-700" />
                Imaging Tips for Accurate Diagnosis
              </header>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {[
                  "Use natural light, preferably early morning or late afternoon.",
                  "Avoid shadows or reflections on leaves.",
                  "Capture close-up shots focusing on affected areas.",
                  "Use a neutral background for clarity."
                ].map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
