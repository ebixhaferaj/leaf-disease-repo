import Header from './Header';
import Footer from './Footer';
import { Upload, Brain, Search, FileText, Leaf, Users, Clock, Shield, ShieldCheck } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Upload,
      title: "Upload a leaf photo",
      description: "Take a clear photo of the plant leaf showing any symptoms or signs of disease.",
      color: "bg-blue-500"
    },
    {
      icon: Brain,
      title: "AI analyzes the image",
      description: "The AI model identifies visual patterns to classify the leaf as healthy or detect one of 12 common plant diseases.",
      color: "bg-purple-500"
    },
    {
      icon: Search,
      title: "Disease classification",
      description: "The AI model identifies patterns and classifies the leaf as healthy or diagnoses one of 12 different plant diseases.",
      color: "bg-leaf-500"
    },
    {
      icon: FileText,
      title: "Get detailed results",
      description: "Receive comprehensive results including disease name, confidence score, detailed description, and recommended treatments.",
      color: "bg-orange-500"
    }
  ];

  const features = [
    {
      icon: Leaf,
      title: "12 Disease Classes",
      description: "Our model can detect and classify 12 different plant diseases with high accuracy."
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get predictions in seconds using our optimized TensorFlow Serving infrastructure."
    },
    {
      icon: Shield,
      title: "High Accuracy",
      description: "Trained on almost 8,000 curated images for reliable classification."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-leaf-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Understanding our AI-powered plant disease detection system that helps farmers and researchers identify crop diseases quickly and accurately.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-leaf-50/50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple 4-Step Process</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined workflow makes plant disease detection accessible to everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-leaf-100 flex flex-col items-center text-center"
            >
              <div className="mb-5 p-3 bg-leaf-50 rounded-full relative">
                <step.icon className="w-8 h-8 text-leaf-500" />
                <span className="absolute -top-3 -right-3 bg-white border border-leaf-200 text-sm text-leaf-700 px-2 py-0.5 rounded-full shadow">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

        {/* Behind the Scenes */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Behind the Scenes</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The technology powering accurate plant disease detection
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                {/* Model Card */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Brain className="h-5 w-5 text-gray-600" />
                    Machine Learning Model
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Our deep learning model has been trained on thousands of carefully curated plant images.
                  </p>
                  <div className="flex justify-between"><span>Also Detects:</span> <span className="font-medium">Healthy Leaves</span></div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between"><span>Training Images:</span> <span className="font-medium">≈8,000</span></div>
                    <div className="flex justify-between"><span>Disease Classes:</span> <span className="font-medium">12</span></div>
                    <div className="flex justify-between"><span>Also Detects:</span> <span className="font-medium">6 Classes of healthy leaves</span></div>
                    <div className="flex justify-between"><span>Model Accuracy:</span> <span className="font-medium">94%</span></div>    
                  </div>
                </div>

                {/* TF Serving Card */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Clock className="h-5 w-5 text-leaf-600" />
                    TensorFlow Serving
                  </h3>
                  <p className="text-gray-600">
                    Predictions are generated in seconds using our optimized TensorFlow Serving infrastructure.
                  </p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="border-l-4 border-leaf-500 bg-white rounded-lg p-6">
                    <h4 className="flex items-center gap-3 text-lg font-semibold mb-2">
                      <feature.icon className="h-5 w-5 text-leaf-600" />
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why It Matters</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Early disease detection can make the difference between a healthy harvest and devastating crop loss
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="text-center bg-white p-6 border rounded-lg hover:shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-leaf-600"/>
                </div>
                <h3 className="font-semibold text-lg">Healthy Plant Detection</h3>
                <p className="text-gray-600 text-sm mt-2">
                    Not just diseases — the model also confirms when a plant is healthy, giving peace of mind to farmers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="text-center bg-white p-6 border rounded-lg hover:shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-leaf-600" />
                </div>
                <h3 className="font-semibold text-lg">Support Small Farmers</h3>
                <p className="text-gray-600 text-sm mt-2">
                    Our accessible technology helps small-scale farmers and enthusiasts who may not have access to experts.
                </p>
              </div>

              {/* Card 3 */}
              <div className="text-center bg-white p-6 border rounded-lg hover:shadow-lg">
                <div className="w-16 h-16 bg-leaf-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-leaf-600" />
                </div>
                <h3 className="font-semibold text-lg">Advance Research</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Researchers can use our platform to quickly analyze large datasets of plant images.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-leaf-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Try It?</h2>
            <p className="text-xl text-leaf-100 mb-8 max-w-2xl mx-auto">
              Experience the power of AI-driven plant disease detection for yourself
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-white text-leaf-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-lg shadow"
            >
              Start Detection
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
