"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

async function getCourseData(slug) {
  try {
    const response = await axios.get(
      `http://localhost:1337/api/courses?filters[slug][$eq]=${slug}&populate=deep,3`
    );
    return response.data.data[0];
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const courseData = await getCourseData(params.slug);
      setCourse(courseData);

      // Fetch the logged-in user
      try {
        const userResponse = await axios.get(
          "http://localhost:1337/api/users",
          {
            withCredentials: true, // Ensures cookies are sent
          }
        );
        const isLoggedInUserArray = userResponse.data.filter((user) => {
          return user.type === "instructor";
        });
        console.log(isLoggedInUserArray);
        setUser(isLoggedInUserArray[0]);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    }
    fetchData();
  }, [params.slug]);

  if (!course) {
    return <p>Loading...</p>;
  }

  const {
    title,
    description,
    instructor,
    duration,
    difficulty,
    lessons,
    lessonsNum,
  } = course.attributes;

  const isLoggedIn = !!user;
  const isInstructor = user?.type === "instructor";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {difficulty}
                  </span>
                  <span className="text-gray-500">
                    <span className="font-medium">Duration:</span> {duration}
                  </span>
                </div>
              </div>

              {/* Enroll Button */}
              {isLoggedIn ? (
                isInstructor ? (
                  <button
                    className="w-full md:w-auto bg-gray-400 text-white font-medium py-3 px-8 rounded-lg shadow-md cursor-not-allowed"
                    disabled
                  >
                    Instructors cannot enroll
                  </button>
                ) : (
                  <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    Enroll Now
                  </button>
                )
              ) : (
                <button
                  className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => router.push("/login")}
                >
                  Login to Enroll
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Course Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Course
                </h2>
                <div className="prose max-w-none text-gray-600">
                  {description}
                </div>
              </div>
            </div>

            {/* Lessons Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Course Curriculum
                </h2>
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <Link
                      href={`/lesson/${lesson.videoURL}`}
                      key={lesson.courseId}
                      className="border-b border-gray-200 pb-4 last:border-0"
                    >
                      <div className="flex items-start">
                        <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-medium mr-4">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {lesson.title}
                          </h3>
                          <p className="text-gray-500 mt-1">{lesson.content}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Course Details
                </h3>

                {instructor?.data && (
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={
                          instructor.data.attributes.avatar?.data?.attributes
                            ?.url || "/default-avatar.jpg"
                        }
                        alt={instructor.data.attributes.name}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Instructor
                      </h4>
                      <p className="text-sm text-gray-500">
                        {instructor.data.attributes.name}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Difficulty Level
                    </h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {difficulty}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Duration
                    </h4>
                    <p className="text-sm text-gray-500">{duration}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Lessons
                    </h4>
                    <p className="text-sm text-gray-500">{lessonsNum || 0}</p>
                  </div>
                </div>

                {/* Enroll Button (Duplicate for Sidebar) */}
                {!isInstructor && isLoggedIn && (
                  <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
