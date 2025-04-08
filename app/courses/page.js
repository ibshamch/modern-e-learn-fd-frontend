"use client"; // Required for client-side interactivity

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1337/api/courses?populate=thumbnail,instructor"
        );
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            response.data.data.map((course) => course.attributes.category)
          ),
        ];
        setCategories(["All Categories", ...uniqueCategories]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let results = courses;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.attributes.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.attributes.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (category !== "All Categories") {
      results = results.filter(
        (course) => course.attributes.category === category
      );
    }

    setFilteredCourses(results);
  }, [searchTerm, category, courses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Course Catalog
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse our collection of high-quality courses
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.slug}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {course.attributes.thumbnail?.data && (
                  <img
                    src={`http://localhost:1337${course.attributes.thumbnail.data.attributes.url}`}
                    alt={course.attributes.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {course.attributes.title}
                    </h2>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {course.attributes.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.attributes.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {course.attributes.duration}
                    </span>
                    <Link
                      href={`/courses/${course.attributes.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              No courses found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
