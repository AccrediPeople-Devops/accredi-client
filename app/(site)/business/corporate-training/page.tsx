import Link from 'next/link';
import { HiArrowLeft, HiCheckCircle, HiUsers, HiTrendingUp, HiClock, HiCurrencyDollar, HiLocationMarker, HiHeart, HiCalendar } from 'react-icons/hi';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customized Corporate Training Solutions - AccrediPeople Certifications",
  description: "Transform your workforce with our customized corporate training solutions. On-site, cost-effective training programs designed for your organization's specific needs.",
  keywords: "corporate training, customized training, on-site training, workforce development, corporate solutions, business training",
  openGraph: {
    title: "Customized Corporate Training Solutions - AccrediPeople Certifications",
    description: "Transform your workforce with our customized corporate training solutions. On-site, cost-effective training programs designed for your organization's specific needs.",
    url: "https://accredipeoplecertifications.com/business/corporate-training",
    type: "website",
  },
};

export default function CorporateTrainingPage() {
  const keyBenefits = [
    {
      icon: HiCurrencyDollar,
      title: "Cost-Effective Corporate Pricing",
      description: "By guaranteeing a group of participants, you unlock access to reduced per-student rates — allowing us to pass significant cost savings directly on to you."
    },
    {
      icon: HiLocationMarker,
      title: "Convenient & Disruption-Free Delivery",
      description: "Hosting training onsite minimizes business interruptions and provides a comfortable, familiar environment for your team to learn and grow."
    },
    {
      icon: HiClock,
      title: "Eliminated Travel Expenses",
      description: "Forget airfare, hotels, per diems, and travel logistics. With in-house training, your team learns where they work — saving time and reducing costs."
    },
    {
      icon: HiHeart,
      title: "Stronger Team Collaboration",
      description: "Learning together strengthens team cohesion, fosters mutual trust, and encourages collective accountability — enhancing both morale and performance."
    },
    {
      icon: HiCalendar,
      title: "Customized Training Schedules",
      description: "You choose the timing. We work around your operational calendar to ensure training fits your company's unique workflow and availability."
    },
    {
      icon: HiUsers,
      title: "Business-Relevant Learning",
      description: "With your team in one place, training can directly relate to your industry, challenges, and objectives — making sessions more practical and immediately applicable."
    },
    {
      icon: HiUsers,
      title: "Aligned Leadership & Vision",
      description: "Our programs promote unified leadership thinking, helping executives and managers align strategy, execution, and communication."
    },
    {
      icon: HiTrendingUp,
      title: "Measurable Skill Development",
      description: "Track individual and team progress, monitor outcomes, and clearly demonstrate return on investment for every training initiative."
    }
  ];

  return (
    <div className="min-h-screen site-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="site-glass rounded-2xl p-8 mb-8 backdrop-blur-xl site-border">
          <Link 
            href="/" 
            className="inline-flex items-center site-text-secondary hover:site-text-primary transition-colors mb-6"
          >
            <HiArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4 mb-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-3 h-3 bg-blue-500 rounded-full "></div>
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">💼 For Business</span>
              <div className="w-3 h-3 bg-green-500 rounded-full  "></div>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Customized Corporate Training Solutions
              </span>
            </h1>

            <h2 className="text-2xl lg:text-3xl font-bold site-text-primary mb-8">
              Empower Your Workforce with Tailored Learning Experiences
            </h2>

            <p className="text-lg site-text-secondary max-w-4xl mx-auto leading-relaxed">
              At AccrediPeople Certifications, we specialize in delivering customized corporate training programs designed to meet your organization's unique needs. Our approach ensures that your team acquires the skills necessary to drive performance and achieve strategic objectives.
            </p>
          </div>
        </div>

        {/* Three-Step Approach Section */}
        <div className="site-glass rounded-2xl p-8 mb-8 backdrop-blur-xl site-border">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
              Our Three-Step Approach to <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Corporate Training Success</span>
            </h2>
          </div>

          <div className="space-y-12">
            {/* Step 1: Discover & Align */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-start mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                      <span className="text-blue-500 text-sm font-semibold uppercase tracking-wider">Step 1</span>
                    </div>
                    <h3 className="text-3xl font-black site-text-primary mb-4">Discover & Align</h3>
                  </div>
                </div>
                <div className="ml-7 site-text-secondary">
                  <p className="text-lg leading-relaxed">
                    We begin by conducting a comprehensive training needs assessment to understand your organization's goals, identify skill gaps, and align stakeholders. This foundational step ensures that our training solutions are strategically aligned with your business objectives.
                  </p>
                </div>
              </div>
              <div className="site-glass backdrop-blur-xl rounded-2xl p-8 h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <HiUsers className="w-10 h-10 text-white" />
                  </div>
                  <p className="site-text-secondary font-medium">Assessment & Planning</p>
                </div>
              </div>
            </div>

            {/* Step 2: Design & Deliver */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1 site-glass backdrop-blur-xl rounded-2xl p-8 h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <HiUsers className="w-10 h-10 text-white" />
                  </div>
                  <p className="site-text-secondary font-medium">Training Delivery</p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-start mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                      <span className="text-green-500 text-sm font-semibold uppercase tracking-wider">Step 2</span>
                    </div>
                    <h3 className="text-3xl font-black site-text-primary mb-4">Design & Deliver</h3>
                  </div>
                </div>
                <div className="ml-7 site-text-secondary space-y-4">
                  <p className="text-lg leading-relaxed">
                    Based on the assessment, we develop and deliver flexible training programs tailored to your team's requirements. Our delivery methods include:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Virtual Instructor-Led Training (VILT):</strong> Interactive online sessions led by experienced facilitators.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>On-Demand Training:</strong> Self-paced courses accessible anytime, allowing learners to progress at their convenience.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Immersive Experiences:</strong> Real-world scenarios and simulations that provide hands-on practice in a risk-free environment.
                      </div>
                    </li>
                  </ul>
                  <p className="text-lg leading-relaxed">
                    Our training is designed to be engaging and applicable, ensuring that participants can immediately apply new skills in their roles.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Sustain & Scale */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-start mb-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                      <span className="text-orange-500 text-sm font-semibold uppercase tracking-wider">Step 3</span>
                    </div>
                    <h3 className="text-3xl font-black site-text-primary mb-4">Sustain & Scale</h3>
                  </div>
                </div>
                <div className="ml-7 site-text-secondary space-y-4">
                  <p className="text-lg leading-relaxed">
                    Post-training, we focus on reinforcing learning to ensure long-term retention and application. This includes:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Post-Class Surveys:</strong> Gathering feedback to assess the impact of training and identify areas for improvement.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Performance Tracking:</strong> Monitoring individual and team progress to measure the effectiveness of the training.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Continuous Support:</strong> Providing ongoing resources and coaching to support the application of new skills in the workplace.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="site-glass backdrop-blur-xl rounded-2xl p-8 h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                    <HiTrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <p className="site-text-secondary font-medium">Performance Tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="site-glass rounded-2xl p-8 backdrop-blur-xl site-border">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
              Key Benefits for <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Your Organization</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-6 site-glass backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <HiCheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold site-text-primary mb-3 flex items-center gap-2">
                      <IconComponent className="w-5 h-5 text-blue-500" />
                      {benefit.title}
                    </h3>
                    <p className="site-text-secondary leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="site-glass rounded-2xl p-8 mt-8 backdrop-blur-xl site-border text-center">
          <h3 className="text-2xl font-bold site-text-primary mb-4">
            Ready to Transform Your Workforce?
          </h3>
          <p className="site-text-secondary text-lg mb-6">
            Partner with AccrediPeople Certifications to develop a skilled, agile, and high-performing workforce. Contact us today to learn more about our customized corporate training solutions.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Today
            <HiArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="site-text-secondary text-sm">
            Transform your organization with tailored corporate training solutions
          </p>
        </div>
      </div>
    </div>
  );
} 