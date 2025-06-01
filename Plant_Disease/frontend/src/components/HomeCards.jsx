import { motion } from 'framer-motion';

const userFeatures = [
  'Upload single plant images for disease analysis',
  'Save your disease analyses',
  'Get quick disease detection results'
];

const farmerFeatures = [
  'Upload multiple plant images at once',
  'Generate detailed farm-wide reports',
  'Receive pesticide and treatment suggestions',
  'Access a detailed learning programm',
  'Save and review past analysis reports',
];

const HomeCards = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-leaf-50/50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4  tracking-wide">
            Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what we offer for everyday users and professional farmers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[{ title: 'User Features', list: userFeatures }, { title: 'Farmer Features', list: farmerFeatures }].map(
            (card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-leaf-100 text-center flex flex-col items-center"
              >
                <div className="mb-5 p-3 bg-leaf-50 rounded-full">
                  <svg
                    className="w-10 h-10 text-leaf-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-leaf-900">{card.title}</h3>
                <ul className="list-disc list-inside text-muted-foreground text-left">
                  {card.list.map((item, i) => (
                    <li key={i} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeCards;
