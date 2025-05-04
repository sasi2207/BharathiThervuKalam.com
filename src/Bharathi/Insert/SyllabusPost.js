import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://www.bharathithervukalam.com/syllabus/all');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Handle error state
        }
    };

    const handleDownload = async (id) => {
        try {
            const response = await axios.get(`http://localhost:2020/syllabus/download/${id}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'syllabus.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file.');
        }
    };

    const handleUpdate = async (id, formData) => {
        try {
            const updatedPost = await axios.put(`http://localhost:2020/syllabus/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Update successful:', updatedPost.data);
            // Optionally update local state or fetch fresh data after successful update
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Error updating post.');
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:2020/syllabus/delete/${postId}`);
            console.log('Post deleted successfully.');

            const updatedPosts = posts.filter(post => post.id !== postId);
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error deleting post.');
        }
    };

    return (
        <div>
            <table className="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>Name of the Post</th>
                        <th>Department/Organization</th>
                        <th>Paper</th>
                        <th>Standard</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>{post.namepost}</td>
                            <td>{post.department}</td>
                            <td>{post.paper}</td>
                            <td>{post.standard}</td>
                            <td>
                                <button className="btn btn-primary mr-2" onClick={() => handleDownload(post.id)}>Download</button>
                                <button className="btn btn-success mr-2" onClick={() => handleUpdate(post.id, { namepost: 'Updated Name' })}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Posts;



















