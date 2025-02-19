"use client";

import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import ConfirmDialog from "./ConfirmDialog";
import EditPostModal from "./EditPostModal";

export default function PostsTable({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    postId: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    post: null,
  });

  const handlePostCreated = (newPost) => {
    setPosts([...posts, newPost]);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (postId) => {
    setConfirmDialog({
      isOpen: true,
      postId,
    });
  };

  const handlePostDeleted = async () => {
    const postId = confirmDialog.postId;
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Post with id ${postId} deleted successfully`);
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setConfirmDialog({ isOpen: false, postId: null });
    }
  };

  const handleEditClick = (post) => {
    setEditModal({
      isOpen: true,
      post,
    });
  };

  const handlePostEdited = (updatedPost) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          Create Post
        </button>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Body
                </th>
                <th scope="col" className="px-6 py-3">
                  User ID
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                  key={post.id}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {post.id}
                  </th>
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4">{post.body}</td>
                  <td className="px-6 py-4">{post.userId}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleEditClick(post)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      onClick={() => handleDeleteClick(post.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
        posts={posts}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, postId: null })}
        onConfirm={handlePostDeleted}
        message="Are you sure you want to delete this post?"
      />

      <EditPostModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, post: null })}
        onPostEdited={handlePostEdited}
        post={editModal.post}
      />
    </div>
  );
}
