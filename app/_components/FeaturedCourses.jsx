import axios from "axios";

async function getFeaturedCourses() {
  try {
    const response = await axios.get("http://localhost:1337/api/courses");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export default async function FeaturedCourses() {
  const courses = await getFeaturedCourses();
  console.log(courses);
  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Featured Courses
      </h2>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Placeholder for future thumbnail */}
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <img src={course.attributes.logoURL} alt="courseCover" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {course.attributes.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.attributes.description}
                </p>

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {course.attributes.duration} weeks
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {course.attributes.difficulty}
                  </span>
                </div>

                <a
                  href={`/courses/${course.attributes.slug}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                >
                  View Course
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">
          No featured courses available at the moment
        </p>
      )}
    </main>
  );
}
