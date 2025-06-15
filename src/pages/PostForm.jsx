import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

export default function PostForm() {
  const location = useLocation();
  const { mood } = useParams(); // "add" or "edit"
  const postData = location.state?.post;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (mood === "edit" && postData) {
      reset({
        title: postData.title,
        description: postData.description,
      });
    }
  }, [mood, postData, reset]);

  const onSubmit = (data) => {
    const imageFile = data.image?.[0];

    // In "add" mode, image is required
    if (mood === "add" && !imageFile) {
      return alert("Please select an image.");
    }

    const handleUploadAndSubmit = async (imageUrl) => {
      try {
        const payload = {
          title: data.title,
          description: data.description,
          imageUrl: imageUrl || postData?.imageUrl, // fallback to old image in edit mode
        };

        let response;

        if (mood === "edit") {
          response = await axios.put(
            `http://localhost:5000/api/posts/${postData._id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        } else {
          response = await axios.post(
            "http://localhost:5000/api/posts",
            payload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        }

        console.log(response.data);
        navigate("/");
      } catch (error) {
        console.error("Submission error:", error);
      }
    };

    if (imageFile) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];
        const formData = new FormData();
        formData.append("image", base64Image);

        try {
          const uploadRes = await axios.post(
            `https://api.imgbb.com/1/upload?key=${
              import.meta.env.VITE_IMGBB_KEY
            }`,
            formData
          );
          const imageUrl = uploadRes.data.data.url;
          await handleUploadAndSubmit(imageUrl);
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
        }
      };

      reader.readAsDataURL(imageFile);
    } else {
      // No new image selected in edit mode
      handleUploadAndSubmit(); // pass undefined — it will use existing image
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="w-[60%] mt-4 mx-auto">
        <p className="font-black text-center">You Must Login First</p>
      </div>
    );
  }

  return (
    <div className="w-[60%] mt-4 mx-auto">
      <form
        className="flex flex-col gap-4 p-6 rounded-lg shadow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-1 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter Title"
            className="input input-bordered w-full"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1 font-medium">
            Post
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
            placeholder="Enter Post Description"
            className="textarea textarea-bordered w-full h-32 resize-none"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="image" className="mb-1 font-medium">
            Image
          </label>
          <input
            type="file"
            id="image"
            {...register("image", {
              validate: {
                required: (files) =>
                  mood === "edit" ||
                  (files && files.length > 0) ||
                  "Image is required",
                lessThan2MB: (files) =>
                  !files?.[0] ||
                  files?.[0].size < 2 * 1024 * 1024 ||
                  "Image must be < 2MB",
                acceptedFormats: (files) =>
                  !files?.[0] ||
                  ["image/jpeg", "image/png", "image/webp"].includes(
                    files?.[0].type
                  ) ||
                  "Only JPEG/PNG/WEBP images are allowed",
              },
            })}
            className="input input-bordered w-full"
            accept="image/*"
          />
          {errors.image && (
            <p className="text-red-500">{errors.image.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-fit">
          Submit
        </button>
      </form>
    </div>
  );
}
