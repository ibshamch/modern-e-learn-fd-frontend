import axios from "axios";
import FeaturedCourses from "./_components/FeaturedCourses";
import Link from "next/link";

async function getHomepageData() {
  try {
    const response = await axios.get(
      "http://localhost:1337/api/homepage?populate=*"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return null;
  }
}

export default async function Home() {
  const homepageData = await getHomepageData();

  if (!homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading homepage content
      </div>
    );
  }

  const { title, subtitle } = homepageData.data.attributes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32 -mb-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            {title.replace(/"/g, "")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            {subtitle.replace(/"/g, "")}
          </p>
          <div className="pt-6">
            <Link
              href="courses"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="max-w-7xl mx-auto px-4 pb-32">
        <FeaturedCourses />
      </section>

      {/* Footer/Copyright */}
      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            Last updated:{" "}
            {new Date(
              homepageData.data.attributes.updatedAt
            ).toLocaleDateString()}
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Your Learning Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
