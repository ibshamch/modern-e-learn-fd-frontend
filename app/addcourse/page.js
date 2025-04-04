"use client";
import axios from "axios";
import { useState, useEffect } from "react";

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    difficulty: "",
    slug: "",
    isFeatured: false,
    lessonsNum: 0,
    instructor: "",
    studentsEnrolled: 0,
    lessons: [],
  });

  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    videoURL: "",
    order: 1,
  });

  // Assuming the user data is available in localStorage or context
  const getLoggedInUser = async () => {
    try {
      const userData = await axios.get("http://localhost:1337/api/users");
      const data = await userData.data;
      const loggedInUserArray = await data.filter((user) => {
        return user.isLogged === true;
      });
      return await loggedInUserArray[0].username;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };
  // Set instructor name automatically when user is logged in and is an instructor
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getLoggedInUser();
        console.log("Logged in user:", loggedInUser); // This will now log properly

        if (loggedInUser) {
          setCourseData((prevData) => ({
            ...prevData,
            instructor: loggedInUser || "Unknown Instructor",
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLesson({
      ...lesson,
      [name]: value,
    });
  };

  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, lesson],
      lessonsNum: courseData.lessonsNum + 1,
    });
    setLesson({
      title: "",
      content: "",
      videoURL: "",
      order: courseData.lessonsNum + 2,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data according to Strapi format
    const submissionData = {
      title: courseData.title,
      description: courseData.description,
      price: Number(courseData.price),
      duration: Number(courseData.duration),
      difficulty: courseData.difficulty,
      slug: courseData.slug,
      isFeatured: courseData.isFeatured,
      lessonsNum: courseData.lessons.length,
      instructor: courseData.instructor, // Include instructor name
      lessons: courseData.lessons,
    };

    try {
      const response = await axios.post(
        "http://localhost:1337/api/courses",
        { data: submissionData }, // Note the nested data object
        {
          headers: {
            "Content-Type": "application/json",
            // Add authorization if needed:
            // "Authorization": `Bearer ${yourAuthToken}`
          },
        }
      );
      console.log("Course added successfully", response.data);
    } catch (error) {
      console.error("Full error:", error);
      console.error("Response data:", error.response?.data);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Details */}
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            placeholder="Course Description"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            name="duration"
            value={courseData.duration}
            onChange={handleChange}
            placeholder="Duration (in hours)"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="difficulty"
            value={courseData.difficulty}
            onChange={handleChange}
            placeholder="Difficulty"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="slug"
            value={courseData.slug}
            onChange={handleChange}
            placeholder="Course Slug"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="checkbox"
            name="isFeatured"
            checked={courseData.isFeatured}
            onChange={(e) =>
              setCourseData({ ...courseData, isFeatured: e.target.checked })
            }
          />
          <label>Featured Course</label>
          <input
            type="number"
            name="studentsEnrolled"
            value={courseData.studentsEnrolled}
            onChange={handleChange}
            placeholder="Number of Students Enrolled"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Add Lessons */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Add Lessons</h3>
          <input
            type="text"
            name="title"
            value={lesson.title}
            onChange={handleLessonChange}
            placeholder="Lesson Title"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            name="content"
            value={lesson.content}
            onChange={handleLessonChange}
            placeholder="Lesson Content"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="videoURL"
            value={lesson.videoURL}
            onChange={handleLessonChange}
            placeholder="Video URL (e.g., YouTube ID)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={addLesson}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Lesson
          </button>
        </div>

        {/* Display added lessons */}
        {courseData.lessons.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Added Lessons</h4>
            {courseData.lessons.map((lesson, index) => (
              <div key={index} className="border-b py-2">
                <p className="font-medium">{lesson.title}</p>
                <p>{lesson.content}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${lesson.videoURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Watch Video
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded"
        >
          Submit Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
