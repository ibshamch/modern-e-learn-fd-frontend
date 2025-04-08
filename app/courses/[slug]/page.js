"use client";

import { useEffect, useState } from "react";
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

async function getLoggedInUser() {
  try {
    // Fetch all users and find the one with isLogged: true
    const response = await axios.get("http://localhost:1337/api/users");
    const users = response.data;
    return users.find((user) => user.isLogged === true) || null;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const courseData = await getCourseData(params.slug);
      setCourse(courseData);

      try {
        const loggedInUser = await getLoggedInUser();
        setUser(loggedInUser);

        // Check if user is already enrolled in this course
        if (
          loggedInUser?.enrolledCourses?.some((c) => c.slug === params.slug)
        ) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.slug]);

  const handleEnroll = async () => {
    console.log("handle enroll function");
    console.log(user.type);

    try {
      setEnrolling(true);

      // 1. Get current user data again to ensure we have latest
      const currentUser = await getLoggedInUser();
      if (!currentUser) {
        throw new Error("User not found");
      }

      const currentEnrolledCourses = currentUser.enrolledCourses || [];

      // 2. Check if already enrolled
      if (currentEnrolledCourses.some((c) => c.slug === params.slug)) {
        setIsEnrolled(true);
        return;
      }

      // 3. Prepare updated enrolled courses array
      const updatedEnrolledCourses = [
        ...currentEnrolledCourses,
        {
          slug: params.slug,
          title: course.attributes.title,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          lastAccessed: new Date().toISOString(),
        },
      ];

      console.log(updatedEnrolledCourses);
      // 4. Update user's enrolledCourses
      await axios.put(`http://localhost:1337/api/users/${user.id}`, {
        enrolledCourses: updatedEnrolledCourses,
      });

      // 5. Update local state
      setIsEnrolled(true);
      setUser({
        ...user,
        enrolledCourses: updatedEnrolledCourses,
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Failed to enroll in course. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Course not found</p>
      </div>
    );
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
  const isStudent = user?.type === "student" || "student ";

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
              {!isLoggedIn ? (
                <button
                  className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => router.push("/auth/login")}
                >
                  Login to Enroll
                </button>
              ) : isEnrolled ? (
                <button className="w-full md:w-auto bg-green-600 text-white font-medium py-3 px-8 rounded-lg shadow-md cursor-default">
                  Enrolled
                </button>
              ) : isStudent ? (
                <button
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enrolling...
                    </>
                  ) : (
                    "Enroll Now"
                  )}
                </button>
              ) : (
                <button
                  className="w-full md:w-auto bg-gray-400 text-white font-medium py-3 px-8 rounded-lg shadow-md cursor-not-allowed"
                  disabled
                >
                  Only students can enroll
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

            {/* Lessons Section - Only show if enrolled */}
            {isEnrolled ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Course Curriculum
                  </h2>
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <Link
                        href={`/lesson/${lesson.videoURL}`}
                        key={lesson.id || index}
                        className="border-b border-gray-200 pb-4 last:border-0 hover:bg-gray-50 transition-colors duration-200 block p-3 rounded-lg"
                      >
                        <div className="flex items-start">
                          <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-medium mr-4">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {lesson.title}
                            </h3>
                            <p className="text-gray-500 mt-1">
                              {lesson.content}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isLoggedIn
                    ? isStudent
                      ? "Enroll in this course to access the lessons"
                      : "Only students can enroll in courses"
                    : "Please login as a student to enroll in this course"}
                </h3>
                {isLoggedIn && !isStudent && (
                  <p className="text-gray-600">
                    Your account type is "{user.type}". Switch to a student
                    account to enroll.
                  </p>
                )}
              </div>
            )}
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

                {/* Sidebar Enroll Button */}
                {!isEnrolled && isStudent && (
                  <button
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enrolling...
                      </>
                    ) : (
                      "Enroll Now"
                    )}
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
