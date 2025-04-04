import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const CourseCurriculum = () => {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  // Fetching the lessons data
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Example URL for fetching lessons, replace with actual API or JSON file URL
        const response = await fetch("/path/to/your/api/or/json");
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, []);

  // Handle lesson click and navigate to the LessonView page
  const handleLessonClick = (lessonId) => {
    navigate(`/lesson/${lessonId}`); // Navigate to LessonView page with lesson ID
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Course Curriculum
        </h2>
        <div className="space-y-4">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <div
                key={lesson.order}
                className="border-b border-gray-200 pb-4 last:border-0 cursor-pointer"
                onClick={() => handleLessonClick(lesson.courseId)} // Pass lesson ID to navigate
              >
                <div className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-medium mr-4">
                    {lesson.order}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {lesson.title}
                    </h3>
                    <p className="text-gray-500 mt-1">{lesson.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading lessons...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCurriculum;
