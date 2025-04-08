export default function About() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          About Our Platform
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering learners worldwide with high-quality education
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-10 sm:p-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We're committed to making high-quality education accessible to
                everyone, everywhere. Our platform breaks down barriers to
                learning by providing affordable, flexible online courses from
                world-class instructors.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What We Offer
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>500+ courses across various disciplines</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Interactive learning experiences</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Certificates of completion</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Expert instructors with real-world experience</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-3">
                Join Our Community
              </h3>
              <p className="text-blue-700">
                Over 1 million learners have transformed their skills and
                careers with our platform.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-10 sm:p-12 flex items-center justify-center">
            <div className="relative w-full h-64 md:h-full rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-75"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Learn Without Limits
                  </h3>
                  <p className="text-blue-100">
                    Our platform adapts to your learning style and schedule,
                    helping you achieve your goals at your own pace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Alex Johnson",
              role: "Founder & CEO",
              bio: "Education technology expert with 10+ years experience",
            },
            {
              name: "Maria Garcia",
              role: "Head of Instruction",
              bio: "Curriculum designer and former university professor",
            },
            {
              name: "Sam Wilson",
              role: "Lead Developer",
              bio: "Passionate about creating seamless learning experiences",
            },
            {
              name: "Taylor Chen",
              role: "Community Manager",
              bio: "Dedicated to supporting our learners",
            },
          ].map((person, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-32 w-32 mx-auto rounded-full bg-blue-100 mb-4 flex items-center justify-center text-blue-600 text-4xl font-bold">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {person.name}
              </h3>
              <p className="text-blue-600 mb-3">{person.role}</p>
              <p className="text-gray-600">{person.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
