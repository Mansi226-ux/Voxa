import { Link } from "react-router-dom";
import { useAnimations } from "../hooks/useAnimations.js";
import AnimatedCard from "../hooks/AnimatedCard.js";
const LandingPage = () => {
  const { slideRight, slideLeft } = useAnimations();
  const features = [
    {
      icon: "✍️",
      title: "Rich Text Editor",
      description:
        "Create beautiful blog posts with our advanced rich text editor powered by React Quill.",
    },
    {
      icon: "👥",
      title: "Social Features",
      description:
        "Follow other bloggers, like posts, and engage with the community through comments.",
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description:
        "Find content easily with our powerful search and category filtering system.",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description:
        "Access your blog from any device with our mobile-friendly responsive design.",
    },
    {
      icon: "🔒",
      title: "Secure Authentication",
      description:
        "Your data is safe with JWT-based authentication and secure user management.",
    },
    {
      icon: "⚡",
      title: "Fast Performance",
      description:
        "Built with modern technologies for lightning-fast loading and smooth user experience.",
    },
  ];

  return (
    <div className="min-h-screen  ">
       
      <section className="relative overflow-hidden" style={slideRight}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{" "}
              <span className="text-transparent  bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-400">
                Voxa Blog
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The ultimate blogging platform where creativity meets community.
              Share your thoughts, connect with like-minded individuals, and
              build your online presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-purple-200 border-2 border-purple-500 shadow-lg text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 hover:text-white transition duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Start Blogging Today
              </Link>
              <Link
                to="/login"
                className="border-2 border-purple-500 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-600 hover:text-white transition duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-50 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20  " style={slideLeft}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Voxa Blog?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make Voxa Blog the perfect platform for
              your blogging journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard
                key={index}
                className="p-8 rounded-xl hover:shadow-lg transition duration-300 hover:bg-white border border-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20  " style={slideRight}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl text-black font-bold mb-2">10K+</div>
              <div className="text-purple-900">Active Bloggers</div>
            </div>
            <div className="text-white">
              <div className="text-4xl text-black font-bold mb-2">50K+</div>
              <div className="text-purple-900">Blog Posts</div>
            </div>
            <div className="text-white">
              <div className="text-4xl text-black font-bold mb-2">100K+</div>
              <div className="text-purple-900">Monthly Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-300" style={slideLeft}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold  mb-6 text-transparent  bg-clip-text bg-gradient-to-r from-pink-600 via-purple-2400 to-purple-700 animate-pulse delay-2000">
            Ready to Start Your Blogging Journey?
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            Join thousands of bloggers who trust Voxa Blog to share their
            stories with the world.
          </p>
          <Link
            to="/register"
            className="bg-purple-800 border border-purpule-300 text-white px-8 py-4 rounded-full opacity-80 text-lg font-semibold hover:bg-purple-500 hover:text-black transition duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
