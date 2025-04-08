"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [userCourses, setUserCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setLoading(false);

      // If student, fetch enrolled courses
      if (userData.type === "student") {
        fetchEnrolledCourses(userData.id);
      } else if (userData.type === "instructor") {
        fetchUserCourses(userData.username);
      }
    }
  }, [router]);

  const fetchUserCourses = async (username) => {
    try {
      setCoursesLoading(true);
      const response = await axios.get(
        "http://localhost:1337/api/courses?populate=*"
      );
      const courses = response.data.data.filter(
        (course) => course.attributes.instructor === username
      );
      setUserCourses(courses);
    } catch (error) {
      console.error("Error fetching user courses:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchEnrolledCourses = async (userId) => {
    try {
      setCoursesLoading(true);
      const response = await axios.get(
        `http://localhost:1337/api/users/${userId}?populate=enrolledCourses`
      );
      if (response.data.enrolledCourses) {
        setEnrolledCourses(response.data.enrolledCourses);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome {user.type === "instructor" ? "Instructor" : ""},{" "}
            {user.username}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {user.type === "instructor"
              ? "Manage your courses and track performance"
              : "Continue your learning journey"}
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Courses Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Courses Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {user.type === "instructor" ? "Your Courses" : "My Learning"}
              </h2>
              {user.type === "instructor" && (
                <Link
                  href="/addcourse"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Course
                </Link>
              )}
            </div>

            {/* Courses List */}
            <div className="bg-white shadow rounded-lg p-6">
              {coursesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.type === "instructor" ? (
                    userCourses.length > 0 ? (
                      userCourses.map((course) => (
                        <div
                          key={course.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {course.attributes.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {course.attributes.lessonsNum || 0} lessons •{" "}
                                {course.attributes.duration} hours •{" "}
                                {course.attributes.difficulty}
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {course.attributes.isFeatured
                                ? "Featured"
                                : "Active"}
                            </span>
                          </div>
                          <div className="mt-4 flex space-x-3">
                            <Link
                              href={`/courses/${course.attributes.slug}`}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              View Course
                            </Link>
                            <button className="text-sm text-gray-600 hover:text-gray-800">
                              Analytics
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        You haven't created any courses yet.
                        <Link
                          href="/addcourse"
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          Create your first course
                        </Link>
                      </div>
                    )
                  ) : enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course) => (
                      <div
                        key={course.slug}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium">{course.title}</h3>
                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {course.progress || 0}% complete
                        </p>
                        <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          Continue
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      You haven't enrolled in any courses yet.
                      <Link
                        href="/courses"
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        Browse courses
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Sections based on user type */}
            {user.type === "student" && enrolledCourses.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Continue Learning
                </h2>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800">
                    {enrolledCourses[0].title}
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Last watched:{" "}
                    {enrolledCourses[0].lastWatched || "Start learning"}
                  </p>
                  <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Resume
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions/Stats Section */}
          <div className="space-y-6">
            {/* User Type Specific Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {user.type === "instructor" ? "Performance" : "Progress"}
              </h2>
              {user.type === "instructor" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Course Engagement</h3>
                    <div className="mt-2 h-4 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-4 bg-blue-600 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      78% average completion rate
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Student Satisfaction</h3>
                    <div className="mt-2 flex items-center">
                      {[1, 2, 3, 4].map((star) => (
                        <svg
                          key={star}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg
                        className="h-5 w-5 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">
                        4.2 average rating
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Weekly Goal</h3>
                    <div className="mt-2 h-4 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-4 bg-green-500 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      3 of 7 hours completed
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Learning Streak</h3>
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        5
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        days in a row
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Feedback Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {user.type === "instructor"
                  ? "Student Feedback"
                  : "Your Feedback"}
              </h2>
              <div className="space-y-4">
                {user.type === "instructor" ? (
                  <>
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-1">
                        {[1, 2, 3, 4].map((star) => (
                          <svg
                            key={star}
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-800">
                        "Great course! The explanations were very clear."
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        - From JavaScript Fundamentals
                      </p>
                    </div>
                    <button className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                      View All Feedback
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/feedback/course-reviews"
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium">Course Reviews</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Rate and review completed courses
                      </p>
                    </Link>
                    <Link
                      href="/feedback/surveys"
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium">Surveys & Feedback</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Share your learning experience
                      </p>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {user.type === "instructor" ? (
                  <>
                    <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      View Analytics
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      Manage Students
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      Continue Learning
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      Browse New Courses
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
